import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fail = (msg) => {
  console.error(`[dist] ✗ ${msg}`);
  process.exit(1);
};
const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2);

if (process.platform !== "win32") {
  fail("目前只提供 Windows EXE 构建；请在 Windows 上运行 npm run dist");
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const conf = JSON.parse(readFileSync(join(root, "src-tauri/tauri.conf.json"), "utf8"));
const cargoToml = readFileSync(join(root, "src-tauri/Cargo.toml"), "utf8");
const cargoVer = cargoToml.slice(0, cargoToml.indexOf("[lib]")).match(/^\s*version\s*=\s*"([^"]+)"/m)?.[1];
const versions = { "package.json": pkg.version, "tauri.conf.json": conf.version, "Cargo.toml": cargoVer };
const uniq = [...new Set(Object.values(versions))];
if (uniq.length !== 1) {
  fail(`版本号不一致：${Object.entries(versions).map(([k, v]) => `${k}=${v}`).join("  ")}`);
}
const ver = uniq[0];
console.log(`[dist] ✓ 版本一致：v${ver}`);

console.log("[dist] 构建 Windows EXE（不生成安装包）…");
try {
  execSync("npm run tauri -- build --no-bundle --target x86_64-pc-windows-msvc --features custom-protocol", { cwd: root, stdio: "inherit" });
} catch {
  fail("构建失败（若是 os error 32：旧实例还在托盘驻留锁住了 exe，退出后重试）");
}

const rawExe = join(root, "src-tauri/target/x86_64-pc-windows-msvc/release/z-accounts.exe");
if (!existsSync(rawExe)) fail(`找不到裸 exe：${rawExe}`);

const outDir = join(root, "release");
mkdirSync(outDir, { recursive: true });
const portableDst = join(outDir, `Z-Accounts-${ver}.exe`);
copyFileSync(rawExe, portableDst);
const sha256 = createHash("sha256").update(readFileSync(portableDst)).digest("hex");
writeFileSync(join(outDir, "SHA256SUMS.txt"), `${sha256}  ${basename(portableDst)}\n`, "utf8");

console.log(`[dist] ✓ EXE  ${basename(portableDst)}  (${mb(portableDst)} MB)`);
console.log(`[dist] ✓ SHA-256  ${sha256}`);
console.log(`[dist] 完成 → ${outDir}`);
