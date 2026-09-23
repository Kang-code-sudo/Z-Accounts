# Z-Accounts

[简体中文](README.md) · [License](LICENSE) · [Security](SECURITY.md)

Z-Accounts is an unofficial Windows desktop manager for multiple ZCode accounts, built with Tauri 2, Rust, and the system WebView. It stores local account snapshots, displays queryable balances, and helps switch the active ZCode login.

> This project is not affiliated with Z.ai, BigModel, or ZCode. It depends on ZCode's local data format and some undocumented endpoints. Product updates, server-side restrictions, and expired credentials may affect its behavior. Use it only with accounts you are authorized to manage.

## Features

- **Dashboard:** Account status, combined measured Token balance, a seven-day local usage trend, and recent ZCode model-request status.
- **Account library:** Save the current login, add an account through OAuth, rename and switch snapshots, and import or export backups. Switching can restart ZCode according to your settings.
- **Quota lookup:** Recognizes plans and multiple balances, tries another source when an endpoint returns only plan metadata or an empty result, and labels stale results instead of treating unknown balance as zero.
- **Optional auto-switch:** Acts only on confirmed quota depletion. A `405/3012` gateway block or `429` concurrency/rate limit is not proof of depletion and is not used to bypass server restrictions.
- **Promotions:** Preview and claim eligible offers; automatic claiming is off by default.
- **Appearance and privacy:** Chinese/English, light/dark themes, one-click email hiding, system tray, and autostart.
- **CLI:** Local account, quota, switching, and backup commands.

“Today's Tokens” is the **sum of currently available Token balances successfully measured across accounts**, not an official daily allocation. Historical “tokens used” is estimated from observed drops between balance snapshots. Usage while the app is closed, quota resets, and promotional grants can make it differ from official billing.

## Before you use it

1. Install and sign in to the official ZCode app. Save the current login before adding others.
2. Add an account through the embedded OAuth flow, or sign in through ZCode and then use “Save login” if the official flow is unavailable.
3. Switching changes ZCode's local login state. Expired credentials or official verification can still require a fresh sign-in; the tool cannot lift account or model-gateway restrictions.
4. Treat account snapshots and `.zsb` exports as sensitive. Never upload them to GitHub or paste raw logs, emails, tokens, or request headers into public issues.

**Cross-device import limitation:** A successful `.zsb` import only means the backup was decrypted and added to the account library; it does not establish a valid login on the destination computer. Exports currently retain ZCode's original credentials, and some fields may be encrypted for the source user's environment. On another computer, sign in to each authorized account through official ZCode and use “Save login” locally. The service may also require a CAPTCHA or fresh authorization.

The local account library keeps its historical location, `%USERPROFILE%\.zcode-switch`, so upgrades do not migrate it. Environment variables such as `ZCODE_DATA_BASE_DIR` or `HOME` can relocate ZCode data; see [`src-tauri/src/store.rs`](src-tauri/src/store.rs). Dashboard usage snapshots live in local WebView storage. The project does not provide cloud account sync; OAuth, balance, and promotion requests still go to the relevant ZCode / Z.ai / BigModel services.

## Build a Windows EXE from source

Install the [Tauri Windows prerequisites](https://v2.tauri.app/start/prerequisites/): Node.js, the Rust MSVC toolchain, Microsoft C++ Build Tools with the Windows SDK, and WebView2. From the repository root:

```powershell
npm ci
npm run check:i18n
npm run dist
```

The result is `release/Z-Accounts-<version>.exe` plus `release/SHA256SUMS.txt`; **no setup.exe is generated**. Use `npm run tauri dev` for development. Direct Cargo release builds must enable `custom-protocol` to embed the frontend.

## CLI examples

```powershell
.\release\Z-Accounts-1.8.2.exe --cli list
.\release\Z-Accounts-1.8.2.exe --cli quota
.\release\Z-Accounts-1.8.2.exe --cli quota --id <account-id>
.\release\Z-Accounts-1.8.2.exe --cli model-status
.\release\Z-Accounts-1.8.2.exe --cli switch --id <account-id> --restart
```

CLI commands such as `list` and `quota` may print account details; do not paste their raw output into public issues. Prefer the `ZSW_PASSWORD` environment variable for import/export passwords instead of putting a password into shell history.

## Contributing and publishing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contributions and [docs/GITHUB_PUBLISH.md](docs/GITHUB_PUBLISH.md) for repository copy, first-release notes, and an upload checklist. GitHub Actions builds a Windows EXE only; pushing a `v<version>` tag creates a draft Release for review, not an automatically published release.

## License

[MIT](LICENSE).
