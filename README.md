<h1 align="center">Z-Accounts</h1>

<p align="center"><strong>简体中文</strong> | <a href="README.en.md">English</a></p>

<p align="center"><img src="public/brand-icon.png" alt="Z-Accounts 图标" width="160" /></p>

<p align="center"><strong>非官方 ZCode 多账号管理桌面工具</strong></p>

<p align="center">本地账号库 · 额度仪表盘 · 自动切号 · 中英双语 · 加密备份</p>

<p align="center"><a href="https://github.com/Kang-code-sudo/Z-Accounts/releases/latest">下载最新 EXE</a> · <a href="LICENSE">许可证</a> · <a href="SECURITY.md">安全说明</a></p>

Z-Accounts 是一款面向 Windows 的非官方 ZCode 多账号管理工具，使用 Tauri 2、Rust 和原生 WebView 构建。它在本机保存账号快照、显示可查询的额度，并帮助你切换 ZCode 的当前登录。

> 本项目与 Z.ai、智谱或 ZCode 官方无隶属关系。它依赖 ZCode 的本地数据格式及部分未公开接口；官方更新、服务端限制或凭据过期都可能影响功能。请仅管理你有权使用的账号。

## 功能

- **仪表盘**：查看账号状态、已查询到的 Token 余额汇总、近 7 天本机用量趋势，以及最近的 ZCode 模型请求状态。
- **账号库**：保存当前 ZCode 登录、通过 OAuth 添加账号、编辑名称、切换账号、导入与导出备份。切换时可按设置重启 ZCode。
- **额度查询**：识别套餐与多项余额；一个接口只返回套餐或空结果时继续尝试其他渠道。查询失败会标记旧数据，不把未知额度当作零。
- **自动切号**：可在仪表盘开启。只对已确认的额度耗尽采取动作；`405/3012` 网关拦截、`429` 并发/限流不等同于额度耗尽，也不会借此绕过服务端限制。
- **活动额度**：查看并领取可用活动，自动领取默认关闭。
- **外观与隐私**：中英双语、亮暗主题、邮箱一键隐藏、托盘与开机自启。
- **CLI**：提供账号、额度、切换和备份等命令，便于本机自动化。

“当日 Token”是**已成功查询账号的当前可用 Token 余额之和**，不是官方每日配额。历史“已用 Token”来自两次额度快照之间观测到的余额下降，是估算值；未运行本工具时的消耗、额度重置和活动赠额可能使其与官方账单不同。

## 使用前须知

1. 先安装并登录官方 ZCode。首次使用建议点“保存登录”留存当前账号。
2. 添加账号可使用工具内 OAuth；若官方流程不可用，也可在 ZCode 登录后返回本工具点“保存登录”。
3. 账号切换会改写 ZCode 的本地登录状态；若凭据失效或官方要求验证，仍需在 ZCode 完成登录。它不能解除账号或模型网关的限制。
4. 账号快照和 `.zsb` 导出文件都应视为敏感数据。

**跨设备导入限制：**`.zsb` 的导入成功只表示备份文件已解密并写入账号库，不代表目标电脑已获得有效登录。当前导出会保留 ZCode 原始凭据，其中部分字段可能使用原电脑的用户环境加密。换电脑后请通过官方 ZCode 为每个有权使用的账号重新登录并在本机“保存登录”；服务端也可能要求验证码或再次授权。

本地账号库沿用历史路径 `%USERPROFILE%\.zcode-switch`，升级和改名不会迁移该目录。ZCode 数据目录可由 `ZCODE_DATA_BASE_DIR` 或 `HOME` 等环境变量改变；具体探测逻辑见 [`src-tauri/src/store.rs`](src-tauri/src/store.rs)。仪表盘用量快照保存在本机 WebView 存储中。项目本身不提供云端账号同步；OAuth、额度和领取请求仍会访问相应的 ZCode / Z.ai / BigModel 服务。

## 从源码构建 Windows EXE

按 [Tauri Windows 前置要求](https://v2.tauri.app/start/prerequisites/)准备 Node.js、Rust MSVC 工具链、Microsoft C++ Build Tools（含 Windows SDK）及 WebView2。然后在项目根目录运行：

```powershell
npm ci
npm run check:i18n
npm run dist
```

输出为 `release/Z-Accounts-<版本>.exe` 和 `release/SHA256SUMS.txt`。开发模式使用 `npm run tauri dev`。直接用 Cargo 编译正式版时需启用 `custom-protocol`，否则无法嵌入前端资源。

## CLI 示例

```powershell
.\release\Z-Accounts-1.8.3.exe --cli list
.\release\Z-Accounts-1.8.3.exe --cli quota
.\release\Z-Accounts-1.8.3.exe --cli quota --id <账号ID>
.\release\Z-Accounts-1.8.3.exe --cli model-status
.\release\Z-Accounts-1.8.3.exe --cli switch --id <账号ID> --restart
```

CLI 的 `list`、`quota` 等输出可能包含账号信息，不要直接粘贴到公开 Issue。导入/导出密码优先通过 `ZSW_PASSWORD` 环境变量传入，避免把密码放在命令历史里。

## 参与和发布

贡献前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。仓库介绍文案、首版发布说明与上传检查表见 [docs/GITHUB_PUBLISH.md](docs/GITHUB_PUBLISH.md)。GitHub Actions 只构建 Windows EXE；推送 `v<版本>` 标签后会创建待审核的 Release 草稿，不会自动公开发布。

## 许可证

[MIT](LICENSE)。
