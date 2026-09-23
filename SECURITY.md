# 安全说明 / Security

Z-Accounts 会读取并切换 ZCode 的本地登录资料。账号快照、ZCode 数据目录、`.zsb` 备份、CLI 输出和原始日志都可能包含敏感信息；即使导出文件经过口令加密，也不应上传到公开仓库或 Issue。

如果发现安全问题，请优先使用仓库的 GitHub Private Vulnerability Reporting（若维护者已开启）。不要在公开 Issue 中提交可用凭据、完整请求头、真实账号邮箱或复现所需的私密数据。普通缺陷报告请先脱敏，并说明应用版本、Windows/ZCode 版本和可重复的步骤。

本项目不是 ZCode 官方客户端，不能解除其服务端封禁、风控或验证要求。请遵守服务条款，仅使用有权管理的账号。

---

Z-Accounts reads and switches local ZCode login data. Account snapshots, ZCode data directories, `.zsb` backups, CLI output, and raw logs may contain sensitive information. Do not upload them to public repositories or issues, even when an export is password-encrypted.

For security reports, prefer GitHub Private Vulnerability Reporting if the repository owner has enabled it. Never post working credentials, full request headers, real account emails, or private reproduction data in a public issue. Redact ordinary bug reports and include the app, Windows, and ZCode versions plus reproducible steps.

This is not an official ZCode client and cannot remove server-side blocks, risk controls, or verification requirements. Use only accounts you are authorized to manage.
