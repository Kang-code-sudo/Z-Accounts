use crate::store::Paths;
use chrono::{DateTime, Duration, Local, Utc};
use serde::Serialize;
use serde_json::Value;
use std::fs::File;
use std::io::{BufRead, BufReader};

#[derive(Clone, Debug, Serialize)]
pub struct ModelActivity {
    pub kind: String,
    pub at: String,
    pub model: String,
    pub provider: String,
    pub status_code: Option<i64>,
    pub provider_code: Option<i64>,
    pub request_id: Option<String>,
}

fn numeric_code(value: &Value, key: &str) -> Option<i64> {
    value.get(key).and_then(|code| {
        code.as_i64().or_else(|| code.as_str().and_then(|text| text.parse().ok()))
    })
}

fn parse_event(line: &str) -> Option<ModelActivity> {
    if !line.contains("turn.failed") && !line.contains("model.request.completed") {
        return None;
    }
    let value: Value = serde_json::from_str(line).ok()?;
    let event = value.get("event")?.as_str()?;
    let at = value.get("timestamp")?.as_str()?;
    DateTime::parse_from_rfc3339(at).ok()?;
    let context = if event == "turn.failed" {
        value.get("error")?.get("cause")?.get("context")?
    } else if event == "model.request.completed" {
        value.get("context")?
    } else {
        return None;
    };
    let provider = context.get("providerId")?.as_str()?;
    if !provider.starts_with("account:") {
        return None;
    }
    let model = context.get("modelId").and_then(Value::as_str).unwrap_or("");
    let status_code = numeric_code(context, "responseStatus")
        .or_else(|| numeric_code(context, "statusCode"));
    let provider_code = numeric_code(context, "providerCode");
    let request_id = context.get("requestId").and_then(Value::as_str).map(str::to_owned);
    let message = value.get("error").and_then(|e| e.get("cause"))
        .and_then(|c| c.get("message")).and_then(Value::as_str).unwrap_or("");
    let kind = if event == "model.request.completed" {
        "ok"
    } else if status_code == Some(405)
        && (provider_code == Some(3012) || message.to_ascii_lowercase().contains("unusual activity"))
    {
        "gateway_blocked"
    } else if status_code == Some(429) {
        "rate_limited"
    } else {
        "failed"
    };
    Some(ModelActivity {
        kind: kind.into(), at: at.into(), model: model.into(), provider: provider.into(),
        status_code, provider_code, request_id,
    })
}

/// Reports the latest finalized ZCode model request, not account quota. Log text,
/// prompts, and credentials are never returned to the webview.
pub fn recent(paths: &Paths) -> Option<ModelActivity> {
    let now = Utc::now();
    let mut latest: Option<(DateTime<Utc>, ModelActivity)> = None;
    // ZCode can keep credentials under a relocated HOME while writing CLI logs
    // under the Windows user profile. Check both without changing account paths.
    for root in [paths.zcode_root(), paths.home.join(".zcode")] {
        for days_ago in 0..=1 {
            let date = Local::now().date_naive() - Duration::days(days_ago);
            let file = root.join("cli").join("log")
                .join(format!("zcode-{}.jsonl", date.format("%Y-%m-%d")));
            let Ok(file) = File::open(file) else { continue };
            for line in BufReader::new(file).lines().map_while(Result::ok) {
                let Some(activity) = parse_event(&line) else { continue };
                let Ok(at) = DateTime::parse_from_rfc3339(&activity.at) else { continue };
                let at = at.with_timezone(&Utc);
                if at > now + Duration::minutes(5) || now - at > Duration::hours(2) { continue; }
                if latest.as_ref().is_none_or(|(time, _)| at >= *time) {
                    latest = Some((at, activity));
                }
            }
        }
    }
    latest.map(|(_, activity)| activity)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn identifies_gateway_block_without_exposing_log_message() {
        let line = r#"{"timestamp":"2026-09-23T08:03:16.381Z","event":"turn.failed","error":{"cause":{"message":"request has been blocked due to unusual activity.","context":{"providerId":"account:zai-start-plan","modelId":"GLM-5.3","responseStatus":405,"providerCode":"3012","requestId":"9b67f374-21a0-4dd1-b682-a5246c8af4a1"}}}}"#;
        let status = parse_event(line).unwrap();
        assert_eq!(status.kind, "gateway_blocked");
        assert_eq!(status.provider_code, Some(3012));
        assert_eq!(status.status_code, Some(405));
        assert_eq!(status.request_id.as_deref(), Some("9b67f374-21a0-4dd1-b682-a5246c8af4a1"));
    }

    #[test]
    fn completed_request_supersedes_prior_failure() {
        let line = r#"{"timestamp":"2026-09-23T08:04:16.381Z","event":"model.request.completed","context":{"providerId":"account:zai-start-plan","modelId":"GLM-5.3"}}"#;
        assert_eq!(parse_event(line).unwrap().kind, "ok");
    }
}
