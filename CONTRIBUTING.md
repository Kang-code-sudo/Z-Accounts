# Contributing / 参与贡献

本项目目前以 Windows 为主要运行平台。请先阅读 [README.md](README.md) 和 [SECURITY.md](SECURITY.md)。

1. 用模拟数据或专用测试账号复现问题；不要提交真实快照、令牌、导出文件或未经脱敏的日志。
2. 修改前端时运行 `npm ci`、`npm run check:i18n`、`npm run build`。
3. 修改 Rust 时运行 `cargo test --lib --features custom-protocol`（工作目录 `src-tauri`）。涉及 OAuth、额度与切换时，请补上不依赖真实账号的测试。
4. 保持中英双语文案同步，并在 PR 中说明用户可见的行为和验证结果。
5. 不要随意改动历史账号库路径、Tauri 标识符或 ZCode 本地文件写入流程；这些需要明确的迁移方案。

The primary supported target is Windows. Use mock data or dedicated test accounts, never commit real credentials or unredacted logs, run the relevant frontend and Rust checks, and document user-visible behavior in your pull request.
