import { zh } from "./locales/zh.js";
import { en } from "./locales/en.js";

const TABLES = { zh, en };
let LANG = "zh";

export function init(lang) {
  LANG = lang === "en" ? "en" : "zh";
  document.documentElement.lang = localeTag();
}

export function lang() { return LANG; }
export function localeTag() { return LANG === "en" ? "en-US" : "zh-CN"; }

export function t(key, params) {
  const table = TABLES[LANG] || zh;
  let s = table[key] ?? zh[key];
  if (s == null) {
    console.warn("[i18n] missing key:", key);
    s = key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}

export function has(key) {
  return (TABLES[LANG] || zh)[key] != null || zh[key] != null;
}

export function tn(count, oneKey, otherKey, params) {
  return t(count === 1 ? oneKey : otherKey, { ...params, count });
}

export function errCode(e) {
  const s = typeof e === "string" ? e : String(e);
  const m = s.match(/^([a-z_]+):/);
  return m ? m[1] : null;
}

export function stripErr(e) {
  const s = typeof e === "string" ? e : String(e);
  return errCode(e) ? s.replace(/^[a-z_]+:/, "") : s;
}
