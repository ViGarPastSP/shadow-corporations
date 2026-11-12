// Map ISO 3166-1 numeric (used by world-atlas) → our game country id
export const ISO_NUM_TO_GAME: Record<string, string> = {
  "724": "es", // Spain
  "250": "fr", // France
  "276": "de", // Germany
  "380": "it", // Italy
  "826": "gb", // UK
  "616": "pl", // Poland
  "804": "ua", // Ukraine
  "643": "ru", // Russia
  "792": "tr", // Turkey
  "818": "eg", // Egypt
  "682": "sa", // Saudi Arabia
  "356": "in", // India
  "156": "cn", // China
  "392": "jp", // Japan
  "410": "kr", // South Korea
  "840": "us", // USA
  "124": "ca", // Canada
  "484": "mx", // Mexico
  "076": "br", // Brazil
  "032": "ar", // Argentina
  "170": "co", // Colombia
  "566": "ng", // Nigeria
  "710": "za", // South Africa
  "504": "ma", // Morocco
  "036": "au", // Australia
};

export const GAME_COLORS: Record<string, string> = {
  es: "#dc2626",
  fr: "#2563eb",
  de: "#ca8a04",
  it: "#16a34a",
  gb: "#7c3aed",
  pl: "#db2777",
  ua: "#0891b2",
  ru: "#b91c1c",
  tr: "#e11d48",
  eg: "#ca8a04",
  sa: "#15803d",
  in: "#ea580c",
  cn: "#dc2626",
  jp: "#e11d48",
  kr: "#2563eb",
  us: "#1d4ed8",
  ca: "#dc2626",
  mx: "#15803d",
  br: "#16a34a",
  ar: "#2563eb",
  co: "#ca8a04",
  ng: "#15803d",
  za: "#16a34a",
  ma: "#b91c1c",
  au: "#0891b2",
};

export const DEFAULT_LAND = "#1e293b";
export const DEFAULT_STROKE = "#0f172a";
export const OCEAN = "#0b1220";