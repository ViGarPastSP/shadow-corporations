export interface Region {
  id: string;
  name: string;
  countryId: string;
}

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2
  continent: string;
  color: string;
  regions: string[]; // region ids
}

export const CONTINENTS = [
  "Europa",
  "Asia",
  "África",
  "América del Norte",
  "América del Sur",
  "Oceanía",
] as const;

export const COUNTRIES: Country[] = [
  // Europa
  { id: "es", name: "España", code: "ES", continent: "Europa", color: "#dc2626", regions: ["es-norte", "es-centro", "es-sur", "es-este"] },
  { id: "fr", name: "Francia", code: "FR", continent: "Europa", color: "#2563eb", regions: ["fr-norte", "fr-sur", "fr-este", "fr-oeste"] },
  { id: "de", name: "Alemania", code: "DE", continent: "Europa", color: "#ca8a04", regions: ["de-norte", "de-sur", "de-este", "de-oeste"] },
  { id: "it", name: "Italia", code: "IT", continent: "Europa", color: "#16a34a", regions: ["it-norte", "it-centro", "it-sur"] },
  { id: "gb", name: "Reino Unido", code: "GB", continent: "Europa", color: "#7c3aed", regions: ["gb-england", "gb-scotland", "gb-wales"] },
  { id: "pl", name: "Polonia", code: "PL", continent: "Europa", color: "#db2777", regions: ["pl-norte", "pl-sur"] },
  { id: "ua", name: "Ucrania", code: "UA", continent: "Europa", color: "#0891b2", regions: ["ua-oeste", "ua-este", "ua-sur"] },
  { id: "ru", name: "Rusia", code: "RU", continent: "Europa", color: "#b91c1c", regions: ["ru-oeste", "ru-centro", "ru-siberia", "ru-lejos"] },

  // Asia
  { id: "cn", name: "China", code: "CN", continent: "Asia", color: "#dc2626", regions: ["cn-norte", "cn-sur", "cn-este", "cn-oeste"] },
  { id: "jp", name: "Japón", code: "JP", continent: "Asia", color: "#e11d48", regions: ["jp-hokkaido", "jp-honshu", "jp-kyushu"] },
  { id: "in", name: "India", code: "IN", continent: "Asia", color: "#ea580c", regions: ["in-norte", "in-sur", "in-este", "in-oeste"] },
  { id: "kr", name: "Corea del Sur", code: "KR", continent: "Asia", color: "#2563eb", regions: ["kr-norte", "kr-sur"] },
  { id: "sa", name: "Arabia Saudí", code: "SA", continent: "Asia", color: "#15803d", regions: ["sa-este", "sa-oeste", "sa-centro"] },
  { id: "tr", name: "Turquía", code: "TR", continent: "Asia", color: "#b91c1c", regions: ["tr-oeste", "tr-este", "tr-sur"] },

  // África
  { id: "eg", name: "Egipto", code: "EG", continent: "África", color: "#ca8a04", regions: ["eg-norte", "eg-sur"] },
  { id: "za", name: "Sudáfrica", code: "ZA", continent: "África", color: "#16a34a", regions: ["za-norte", "za-sur", "za-este"] },
  { id: "ng", name: "Nigeria", code: "NG", continent: "África", color: "#15803d", regions: ["ng-norte", "ng-sur"] },
  { id: "ma", name: "Marruecos", code: "MA", continent: "África", color: "#b91c1c", regions: ["ma-norte", "ma-sur"] },

  // América del Norte
  { id: "us", name: "Estados Unidos", code: "US", continent: "América del Norte", color: "#1d4ed8", regions: ["us-este", "us-oeste", "us-sur", "us-midwest"] },
  { id: "mx", name: "México", code: "MX", continent: "América del Norte", color: "#15803d", regions: ["mx-norte", "mx-centro", "mx-sur"] },
  { id: "ca", name: "Canadá", code: "CA", continent: "América del Norte", color: "#dc2626", regions: ["ca-este", "ca-oeste", "ca-norte"] },

  // América del Sur
  { id: "br", name: "Brasil", code: "BR", continent: "América del Sur", color: "#16a34a", regions: ["br-norte", "br-sur", "br-este", "br-oeste"] },
  { id: "ar", name: "Argentina", code: "AR", continent: "América del Sur", color: "#2563eb", regions: ["ar-norte", "ar-sur", "ar-centro"] },
  { id: "co", name: "Colombia", code: "CO", continent: "América del Sur", color: "#ca8a04", regions: ["co-norte", "co-sur"] },

  // Oceanía
  { id: "au", name: "Australia", code: "AU", continent: "Oceanía", color: "#0891b2", regions: ["au-este", "au-oeste", "au-norte"] },
];

export const REGIONS: Region[] = [
  // España
  { id: "es-norte", name: "Norte de España", countryId: "es" },
  { id: "es-centro", name: "Centro de España", countryId: "es" },
  { id: "es-sur", name: "Sur de España", countryId: "es" },
  { id: "es-este", name: "Este de España", countryId: "es" },

  // Francia
  { id: "fr-norte", name: "Norte de Francia", countryId: "fr" },
  { id: "fr-sur", name: "Sur de Francia", countryId: "fr" },
  { id: "fr-este", name: "Este de Francia", countryId: "fr" },
  { id: "fr-oeste", name: "Oeste de Francia", countryId: "fr" },

  // Alemania
  { id: "de-norte", name: "Norte de Alemania", countryId: "de" },
  { id: "de-sur", name: "Sur de Alemania", countryId: "de" },
  { id: "de-este", name: "Este de Alemania", countryId: "de" },
  { id: "de-oeste", name: "Oeste de Alemania", countryId: "de" },

  // Italia
  { id: "it-norte", name: "Norte de Italia", countryId: "it" },
  { id: "it-centro", name: "Centro de Italia", countryId: "it" },
  { id: "it-sur", name: "Sur de Italia", countryId: "it" },

  // UK
  { id: "gb-england", name: "Inglaterra", countryId: "gb" },
  { id: "gb-scotland", name: "Escocia", countryId: "gb" },
  { id: "gb-wales", name: "Gales", countryId: "gb" },

  // Polonia
  { id: "pl-norte", name: "Norte de Polonia", countryId: "pl" },
  { id: "pl-sur", name: "Sur de Polonia", countryId: "pl" },

  // Ucrania
  { id: "ua-oeste", name: "Oeste de Ucrania", countryId: "ua" },
  { id: "ua-este", name: "Este de Ucrania", countryId: "ua" },
  { id: "ua-sur", name: "Sur de Ucrania", countryId: "ua" },

  // Rusia
  { id: "ru-oeste", name: "Rusia Occidental", countryId: "ru" },
  { id: "ru-centro", name: "Rusia Central", countryId: "ru" },
  { id: "ru-siberia", name: "Siberia", countryId: "ru" },
  { id: "ru-lejos", name: "Lejano Oriente", countryId: "ru" },

  // China
  { id: "cn-norte", name: "Norte de China", countryId: "cn" },
  { id: "cn-sur", name: "Sur de China", countryId: "cn" },
  { id: "cn-este", name: "Este de China", countryId: "cn" },
  { id: "cn-oeste", name: "Oeste de China", countryId: "cn" },

  // Japón
  { id: "jp-hokkaido", name: "Hokkaido", countryId: "jp" },
  { id: "jp-honshu", name: "Honshu", countryId: "jp" },
  { id: "jp-kyushu", name: "Kyushu", countryId: "jp" },

  // India
  { id: "in-norte", name: "Norte de India", countryId: "in" },
  { id: "in-sur", name: "Sur de India", countryId: "in" },
  { id: "in-este", name: "Este de India", countryId: "in" },
  { id: "in-oeste", name: "Oeste de India", countryId: "in" },

  // Corea
  { id: "kr-norte", name: "Norte de Corea del Sur", countryId: "kr" },
  { id: "kr-sur", name: "Sur de Corea del Sur", countryId: "kr" },

  // Arabia
  { id: "sa-este", name: "Este de Arabia Saudí", countryId: "sa" },
  { id: "sa-oeste", name: "Oeste de Arabia Saudí", countryId: "sa" },
  { id: "sa-centro", name: "Centro de Arabia Saudí", countryId: "sa" },

  // Turquía
  { id: "tr-oeste", name: "Oeste de Turquía", countryId: "tr" },
  { id: "tr-este", name: "Este de Turquía", countryId: "tr" },
  { id: "tr-sur", name: "Sur de Turquía", countryId: "tr" },

  // Egipto
  { id: "eg-norte", name: "Norte de Egipto", countryId: "eg" },
  { id: "eg-sur", name: "Sur de Egipto", countryId: "eg" },

  // Sudáfrica
  { id: "za-norte", name: "Norte de Sudáfrica", countryId: "za" },
  { id: "za-sur", name: "Sur de Sudáfrica", countryId: "za" },
  { id: "za-este", name: "Este de Sudáfrica", countryId: "za" },

  // Nigeria
  { id: "ng-norte", name: "Norte de Nigeria", countryId: "ng" },
  { id: "ng-sur", name: "Sur de Nigeria", countryId: "ng" },

  // Marruecos
  { id: "ma-norte", name: "Norte de Marruecos", countryId: "ma" },
  { id: "ma-sur", name: "Sur de Marruecos", countryId: "ma" },

  // USA
  { id: "us-este", name: "Costa Este", countryId: "us" },
  { id: "us-oeste", name: "Costa Oeste", countryId: "us" },
  { id: "us-sur", name: "Sur de EE.UU.", countryId: "us" },
  { id: "us-midwest", name: "Midwest", countryId: "us" },

  // México
  { id: "mx-norte", name: "Norte de México", countryId: "mx" },
  { id: "mx-centro", name: "Centro de México", countryId: "mx" },
  { id: "mx-sur", name: "Sur de México", countryId: "mx" },

  // Canadá
  { id: "ca-este", name: "Este de Canadá", countryId: "ca" },
  { id: "ca-oeste", name: "Oeste de Canadá", countryId: "ca" },
  { id: "ca-norte", name: "Norte de Canadá", countryId: "ca" },

  // Brasil
  { id: "br-norte", name: "Norte de Brasil", countryId: "br" },
  { id: "br-sur", name: "Sur de Brasil", countryId: "br" },
  { id: "br-este", name: "Este de Brasil", countryId: "br" },
  { id: "br-oeste", name: "Oeste de Brasil", countryId: "br" },

  // Argentina
  { id: "ar-norte", name: "Norte de Argentina", countryId: "ar" },
  { id: "ar-sur", name: "Sur de Argentina", countryId: "ar" },
  { id: "ar-centro", name: "Centro de Argentina", countryId: "ar" },

  // Colombia
  { id: "co-norte", name: "Norte de Colombia", countryId: "co" },
  { id: "co-sur", name: "Sur de Colombia", countryId: "co" },

  // Australia
  { id: "au-este", name: "Este de Australia", countryId: "au" },
  { id: "au-oeste", name: "Oeste de Australia", countryId: "au" },
  { id: "au-norte", name: "Norte de Australia", countryId: "au" },
];

export function getCountry(id: string) {
  return COUNTRIES.find((c) => c.id === id);
}

export function getRegionsByCountry(countryId: string) {
  return REGIONS.filter((r) => r.countryId === countryId);
}

export function getCountriesByContinent(continent: string) {
  return COUNTRIES.filter((c) => c.continent === continent);
}