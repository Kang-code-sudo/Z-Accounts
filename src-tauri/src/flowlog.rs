
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};

static LOG_PATH: OnceLock<PathBuf> = OnceLock::new();
static WRITE_LOCK: Mutex<()> = Mutex::new(());

const MAX_BYTES: u64 = 256 * 1024;

pub fn init(base: &Path) {
    let dir = base.join("logs");
    if std::fs::create_dir_all(&dir).is_ok() {
        let _ = LOG_PATH.set(dir.join("oauth.log"));
    }
}

pub fn log(flow: &str, event: &str, detail: &str) {
    let Some(path) = LOG_PATH.get() else { return };
    append(path, &format_line(flow, event, detail));
}

fn format_line(flow: &str, event: &str, detail: &str) -> String {
    let ts = chrono::Local::now().format("%Y-%m-%d %H:%M:%S");
    let tag: String = flow.chars().take(8).collect();
    let clean: String = detail.split_whitespace().collect::<Vec<_>>().join(" ");
    if clean.is_empty() {
        format!("{ts} [{tag}] {event}\n")
    } else {
        format!("{ts} [{tag}] {event} {clean}\n")
    }
}

fn append(path: &Path, line: &str) {
    let _guard = match WRITE_LOCK.lock() {
        Ok(g) => g,
        Err(poisoned) => poisoned.into_inner(),
    };
    if std::fs::metadata(path).map(|m| m.len() > MAX_BYTES).unwrap_or(false) {
        let old = path.with_extension("log.old");
        let _ = std::fs::remove_file(&old);
        let _ = std::fs::rename(path, &old);
    }
    let Ok(mut f) = std::fs::OpenOptions::new().create(true).append(true).open(path) else {
        return;
    };
    let _ = f.write_all(line.as_bytes());
}
