
const P = (d) => `<path d="${d}"/>`;

const ICONS = {
  grid: `<rect x="2.5" y="2.5" width="4" height="4" rx="1"/><rect x="9.5" y="2.5" width="4" height="4" rx="1"/><rect x="2.5" y="9.5" width="4" height="4" rx="1"/><rect x="9.5" y="9.5" width="4" height="4" rx="1"/>`,
  list: P("M6 4h8M6 8h8M6 12h8M2 4h.1M2 8h.1M2 12h.1"),
  search: `<circle cx="7" cy="7" r="4.5"/>` + P("M10.4 10.4 14 14"),
  eye: P("M1.3 8s2.4-4.2 6.7-4.2 6.7 4.2 6.7 4.2-2.4 4.2-6.7 4.2S1.3 8 1.3 8z") + `<circle cx="8" cy="8" r="2"/>`,
  eyeOff: P("M1.5 1.5 14.5 14.5") + P("M6.1 3.9A7.3 7.3 0 0 1 8 3.7c4.3 0 6.7 4.3 6.7 4.3a10 10 0 0 1-2 2.5") + P("M9.9 12.1A7.3 7.3 0 0 1 8 12.3C3.7 12.3 1.3 8 1.3 8a10 10 0 0 1 2-2.5"),
  chevron: P("m6 4 4 4-4 4"),
  plus: P("M8 3v10M3 8h10"),
  trash: P("M2.5 4.5h11M6 2.5h4M4 4.5l.6 9h6.8l.6-9M6.5 7v4M9.5 7v4"),
  gauge: P("M2.5 12.5h11") + P("M3.6 12.5a4.4 4.4 0 0 1 8.8 0") + P("M8 12.5 10.8 8.2"),
  token: `<circle cx="8" cy="8" r="5.5"/><path d="M5.2 6.2h5.6M5.2 9.8h5.6M8 3.7v8.6"/>`,
  activity: P("M2 8h2.3l1.3-3.2 2.4 6.4 1.5-3.2H14"),

  pen: P("M2.5 13.5l.9-3.3 7.6-7.6 2.4 2.4-7.6 7.6z") + P("M9.9 4.9l2.4 2.4"),

  export: P("M8 9V2") + P("M5.2 4.8 8 2l2.8 2.8") + P("M2.5 10.5v1.5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-1.5"),

  import: P("M8 2v7") + P("M5.2 6.2 8 9l2.8-2.8") + P("M2.5 10.5v1.5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-1.5"),

  exportAll: P("M2.5 13.5h11") + P("M4.5 11h7") + P("M8 2v6") + P("M5.5 5.5 8 8l2.5-2.5"),

  x: P("M3.5 3.5l9 9") + P("M12.5 3.5l-9 9"),

  swap: P("M2.5 5.5h9.5") + P("M9.5 3 12 5.5 9.5 8") + P("M13.5 10.5H4") + P("M6.5 8 4 10.5 6.5 13"),

  capture: P("M3 2.5h10") + P("M8 5.2v5.8") + P("M5.5 8.5 8 11l2.5-2.5") + P("M3 13.5h10"),

  gift: P("M2.5 6.5h11") + `<rect x="3.5" y="8" width="9" height="5.5"/>` + P("M8 6.5v7") + P("M8 6.5 6 4.6") + P("M8 6.5 10 4.6"),

  refresh: P("M13.5 8a5.5 5.5 0 1 1-1.6-3.9") + P("M13.5 2.5V6.5h-4"),
  sun: `<circle cx="8" cy="8" r="2.6"/>` + P("M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1.1 1.1M11.9 11.9 13 13M13 3l-1.1 1.1M4.1 11.9 3 13"),
  moon: P("M12.9 10.8A5.6 5.6 0 0 1 5.2 3.1 5.6 5.6 0 1 0 12.9 10.8z"),

  userPlus: P("M6 6.8a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6") + P("M2 13.5v-.9a4 4 0 0 1 8 0v.9") + P("M12 5.5v4") + P("M10 7.5h4"),

  play: `<path d="M5 3.2v9.6l8.2-4.8z" fill="currentColor" stroke="none"/>`,

  power: P("M8 2v5.5") + P("M4.6 4.3a5 5 0 1 0 6.8 0"),

  sliders: P("M2 4.5h12") + P("M2 11.5h12") + `<rect x="8.5" y="2.5" width="4" height="4"/>` + `<rect x="3.5" y="9.5" width="4" height="4"/>`,

  lock: `<rect x="3.5" y="7.2" width="9" height="6.3"/>` + P("M5.5 7.2V5a2.5 2.5 0 0 1 5 0v2.2") + P("M8 9.7v1.8"),

  lockOpen: `<rect x="3.5" y="7.2" width="9" height="6.3"/>` + P("M5.5 7.2V5a2.5 2.5 0 0 1 4.9-.6") + P("M8 9.7v1.8"),

  check: P("M3 8.6l3.3 3.2L13 4.6"),
  alert: P("M8 2.2 14.8 13.8H1.2z") + P("M8 6.4v3.2") + P("M8 11.6v.2"),

  empty: P("M3 3h10") + P("M3 13h10") + `<path d="M8 6.2v3.6M6.2 8h3.6" stroke-dasharray="2 1.6"/>`,
};

export function ic(name, size = 16, cls = "") {
  const body = ICONS[name];
  if (!body) return "";
  return `<svg class="ic${cls ? " " + cls : ""}" width="${size}" height="${size}" viewBox="0 0 16 16"
    fill="none" stroke="currentColor" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
