# GitHub 发布准备 / Publishing notes

## 仓库介绍文案

**Repository description（可复制到 GitHub About）：**

> Unofficial Windows ZCode account manager with local snapshots, quota dashboard, optional auto-switch, bilingual UI, and encrypted backups.

**Topics：** `zcode` `z-ai` `account-manager` `tauri` `rust` `windows` `oauth` `dashboard`

**中文介绍：**

> Z-Accounts 是一款非官方 Windows 桌面账号管理工具：集中保存并切换 ZCode 登录、查询各账号套餐与 Token 余额、查看本机估算用量趋势，并提供可选自动切号、隐私隐藏和加密备份。软件不绕过官方验证或服务端限制。

## Release 文案（v1.8.3）

> Z-Accounts v1.8.3：Windows 便携 EXE，提供账号库、额度仪表盘、OAuth 添加账号、中英双语、亮暗主题、隐私隐藏、可选自动切号和 `.zsb` 加密备份。本版为应用使用独立的 Tauri 标识，避免与旧版 zcode-switch 的单实例互相接管。历史 Token 用量是本机余额快照的估算，不等同于官方账单。自动切号仅处理已确认额度耗尽，不处理 `405/3012` 网关拦截或 `429` 限流。

下载项只需 `Z-Accounts-1.8.3.exe` 和 `SHA256SUMS.txt`；不上传安装包、账号数据或本机日志。未签名 EXE 在 Windows 上可能显示下载/运行警告，用户应核对来源与 SHA-256。

## 上传前检查

- 确认 `README.md`、`README.en.md`、`LICENSE` 与版本号一致。
- 确认没有 `.zcode`、`.zcode-switch`、`accounts`、`.zsb`、`credentials.json`、日志、真实邮箱或密钥进入仓库。
- 不上传旧版截图；若添加新截图，先使用演示账号并检查每个可见字段。
- 不要把 `.zsb` 导入成功描述为跨设备免登录；接收方仍可能需要在本机通过官方 ZCode 重新登录和验证。
- 先在 Windows 本地运行 `npm ci`、`npm run check:i18n` 和 `npm run dist`。
- 将本源码包**解压后**提交到空仓库；不要仅把 ZIP 上传为仓库里的单个文件。GitHub 会为标签自动生成 Source code ZIP。

## 提交和发布

在新建的空 GitHub 仓库中提交解压后的源码，再推送 `main`。检查 Actions 中的 CI 通过后，推送与项目版本一致的标签 `v1.8.3`。Release 工作流只生成 Windows EXE 和校验和，并创建**草稿**；确认内容后由仓库所有者手动发布。不要把本机 `release/` 目录直接提交到源码仓库。

示例命令（把远端地址换成你自己的仓库）：

```powershell
git init -b main
git add .
git status --short
git commit -m "Release v1.8.3"
git remote add origin https://github.com/<owner>/<repository>.git
git push -u origin main
git tag v1.8.3
git push origin v1.8.3
```

推送前务必阅读 `git status --short`，确认暂存的都是可公开文件。若此前已将敏感内容推送到远端，单纯删除文件并再次提交不足以清除历史；应先撤销或轮换相关凭据，再处理仓库历史。
