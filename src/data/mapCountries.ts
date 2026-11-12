// ISO 3166-1 numeric (world-atlas) → game id (2-letter)
export const ISO_NUM_TO_GAME: Record<string, string> = {
  "724": "es", "250": "fr", "276": "de", "380": "it", "826": "gb",
  "616": "pl", "804": "ua", "643": "ru", "792": "tr", "818": "eg",
  "682": "sa", "356": "in", "156": "cn", "392": "jp", "410": "kr",
  "840": "us", "124": "ca", "484": "mx", "076": "br", "032": "ar",
  "170": "co", "566": "ng", "710": "za", "504": "ma", "036": "au",
  "040": "at", "056": "be", "100": "bg", "191": "hr", "196": "cy",
  "203": "cz", "208": "dk", "233": "ee", "246": "fi", "300": "gr",
  "348": "hu", "352": "is", "372": "ie", "428": "lv", "440": "lt",
  "442": "lu", "470": "mt", "528": "nl", "578": "no", "620": "pt",
  "642": "ro", "703": "sk", "705": "si", "752": "se", "756": "ch",
  "012": "dz", "360": "id", "458": "my", "608": "ph", "704": "vn",
  "764": "th", "586": "pk", "050": "bd", "364": "ir", "368": "iq",
  "376": "il", "784": "ae", "414": "kw", "862": "ve", "604": "pe",
  "152": "cl", "218": "ec", "858": "uy", "068": "bo", "600": "py",
  "320": "gt", "340": "hn", "558": "ni", "188": "cr", "591": "pa",
  "214": "do", "192": "cu", "388": "jm",
  "288": "gh", "404": "ke", "834": "tz", "800": "ug", "231": "et",
  "180": "cd", "024": "ao", "508": "mz", "686": "sn", "384": "ci",
  "120": "cm", "562": "ne", "466": "ml", "788": "tn",
  "434": "ly", "706": "so", "072": "bw", "516": "na",
  "554": "nz",
};

const PALETTE = [
  "#dc2626", "#2563eb", "#16a34a", "#ca8a04", "#7c3aed",
  "#db2777", "#0891b2", "#ea580c", "#4f46e5", "#059669",
  "#b91c1c", "#1d4ed8", "#15803d", "#a16207", "#6d28d9",
];

export function colorForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export const DEFAULT_LAND = "#1e293b";
export const DEFAULT_STROKE = "#0f172a";
export const OCEAN = "#0b1220";

/** Approximate region anchors inside a country bbox (fractions 0-1) */
export const REGION_LAYOUT: Record<string, { id: string; fx: number; fy: number }[]> = {
  es: [
    { id: "es-norte", fx: 0.45, fy: 0.22 },
    { id: "es-centro", fx: 0.45, fy: 0.48 },
    { id: "es-sur", fx: 0.42, fy: 0.78 },
    { id: "es-este", fx: 0.72, fy: 0.45 },
  ],
  fr: [
    { id: "fr-norte", fx: 0.5, fy: 0.22 },
    { id: "fr-sur", fx: 0.5, fy: 0.78 },
    { id: "fr-este", fx: 0.75, fy: 0.45 },
    { id: "fr-oeste", fx: 0.25, fy: 0.45 },
  ],
  de: [
    { id: "de-norte", fx: 0.5, fy: 0.25 },
    { id: "de-sur", fx: 0.5, fy: 0.75 },
    { id: "de-este", fx: 0.75, fy: 0.45 },
    { id: "de-oeste", fx: 0.25, fy: 0.45 },
  ],
  it: [
    { id: "it-norte", fx: 0.5, fy: 0.2 },
    { id: "it-centro", fx: 0.5, fy: 0.5 },
    { id: "it-sur", fx: 0.55, fy: 0.8 },
  ],
  gb: [
    { id: "gb-england", fx: 0.55, fy: 0.55 },
    { id: "gb-scotland", fx: 0.45, fy: 0.2 },
    { id: "gb-wales", fx: 0.3, fy: 0.55 },
  ],
  us: [
    { id: "us-este", fx: 0.78, fy: 0.45 },
    { id: "us-oeste", fx: 0.18, fy: 0.45 },
    { id: "us-sur", fx: 0.55, fy: 0.7 },
    { id: "us-midwest", fx: 0.5, fy: 0.4 },
  ],
  cn: [
    { id: "cn-norte", fx: 0.55, fy: 0.28 },
    { id: "cn-sur", fx: 0.5, fy: 0.75 },
    { id: "cn-este", fx: 0.75, fy: 0.5 },
    { id: "cn-oeste", fx: 0.25, fy: 0.5 },
  ],
  br: [
    { id: "br-norte", fx: 0.5, fy: 0.2 },
    { id: "br-sur", fx: 0.45, fy: 0.85 },
    { id: "br-este", fx: 0.75, fy: 0.5 },
    { id: "br-oeste", fx: 0.25, fy: 0.45 },
  ],
  ru: [
    { id: "ru-oeste", fx: 0.15, fy: 0.45 },
    { id: "ru-centro", fx: 0.4, fy: 0.4 },
    { id: "ru-siberia", fx: 0.65, fy: 0.4 },
    { id: "ru-lejos", fx: 0.9, fy: 0.45 },
  ],
};
