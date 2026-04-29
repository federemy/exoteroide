export const prerender = true;

const BLACKCAT_URL = "https://www.astro.puc.cl/BlackCAT/transients.php";
const SIMBAD_TAP_URL = "https://simbad.cds.unistra.fr/simbad/sim-tap/sync";

const curatedObjects = [
  { id: "sgr-a-star", name: "Sagittarius A*", type: "Supermasivo", location: "Centro de la Vía Láctea", distanceLy: 27000, massSolar: 4300000, notes: "Agujero negro supermasivo del centro de nuestra galaxia.", source: "Destacado curado" },
  { id: "m87-star", name: "M87*", type: "Supermasivo", location: "Galaxia Messier 87", distanceLy: 53500000, massSolar: 6500000000, notes: "Primer agujero negro fotografiado directamente por el Event Horizon Telescope.", source: "Destacado curado" },
  { id: "ton-618", name: "TON 618", type: "Ultramasivo / cuásar", location: "Cuásar lejano", distanceLy: 10400000000, massSolar: 66000000000, notes: "Uno de los candidatos ultramasivos más famosos.", source: "Destacado curado" },
  { id: "cygnus-x-1", name: "Cygnus X-1", type: "Estelar / binario de rayos X", location: "Constelación Cygnus", distanceLy: 7200, massSolar: 21, orbitalPeriodHours: "134,4", notes: "Uno de los primeros candidatos fuertes a agujero negro estelar.", source: "Destacado curado" },
  { id: "gaia-bh3", name: "Gaia BH3", type: "Estelar inactivo", location: "Vía Láctea", distanceLy: 1926, massSolar: 33, notes: "Agujero negro estelar masivo detectado por el movimiento de su estrella compañera.", source: "Destacado curado" },
  { id: "gaia-bh2", name: "Gaia BH2", type: "Estelar inactivo", location: "Vía Láctea", distanceLy: 3800, massSolar: 9, notes: "Candidato inactivo detectado por astrometría de Gaia.", source: "Destacado curado" },
  { id: "gaia-bh1", name: "Gaia BH1", type: "Estelar inactivo", location: "Vía Láctea", distanceLy: 1560, massSolar: 10, notes: "Uno de los agujeros negros estelares inactivos cercanos mejor conocidos.", source: "Destacado curado" },
  { id: "v404-cygni", name: "V404 Cygni", type: "Estelar / binario de rayos X", location: "Vía Láctea", distanceLy: 7800, massSolar: 9, orbitalPeriodHours: "155,3", notes: "Sistema binario famoso por estallidos de rayos X.", source: "Destacado curado" },
  { id: "gro-j1655-40", name: "GRO J1655-40", type: "Estelar / binario de rayos X", location: "Vía Láctea", distanceLy: 10400, massSolar: 6.3, orbitalPeriodHours: "62,9", notes: "Microcuásar galáctico con chorros relativistas.", source: "Destacado curado" },
  { id: "a0620-00", name: "A0620-00", type: "Estelar / binario de rayos X", location: "Vía Láctea", distanceLy: 3300, massSolar: 6.6, orbitalPeriodHours: "7,75", notes: "Sistema binario cercano usado como referencia para agujeros negros estelares.", source: "Destacado curado" },
  { id: "lmc-x-1", name: "LMC X-1", type: "Estelar / binario de rayos X", location: "Gran Nube de Magallanes", distanceLy: 163000, massSolar: 10.9, notes: "Agujero negro estelar extragaláctico en una galaxia satélite.", source: "Destacado curado" },
  { id: "lmc-x-3", name: "LMC X-3", type: "Estelar / binario de rayos X", location: "Gran Nube de Magallanes", distanceLy: 163000, massSolar: 6.9, notes: "Binario de rayos X persistente en la Gran Nube de Magallanes.", source: "Destacado curado" },
  { id: "ngc-1277", name: "NGC 1277", type: "Supermasivo", location: "Galaxia NGC 1277", distanceLy: 220000000, massSolar: 17000000000, notes: "Agujero negro central extremadamente masivo para su galaxia anfitriona.", source: "Destacado curado" },
  { id: "holmberg-15a", name: "Holmberg 15A*", type: "Ultramasivo", location: "Cúmulo Abell 85", distanceLy: 700000000, massSolar: 40000000000, notes: "Candidato ultramasivo en una galaxia elíptica gigante.", source: "Destacado curado" },
  { id: "phoenix-a", name: "Phoenix A*", type: "Ultramasivo", location: "Cúmulo Phoenix", distanceLy: 5700000000, massSolar: 100000000000, notes: "Candidato ultramasivo asociado a una galaxia central de cúmulo.", source: "Destacado curado" },
  { id: "oj-287", name: "OJ 287", type: "Blazar / binario supermasivo", location: "Blazar lejano", distanceLy: 3500000000, massSolar: 18000000000, notes: "Sistema candidato a binario de agujeros negros supermasivos.", source: "Destacado curado" },
  { id: "ngc-4889", name: "NGC 4889", type: "Supermasivo", location: "Cúmulo de Coma", distanceLy: 308000000, massSolar: 21000000000, notes: "Galaxia elíptica gigante con agujero negro central enorme.", source: "Destacado curado" },
  { id: "andromeda-p2", name: "M31*", type: "Supermasivo", location: "Galaxia de Andrómeda", distanceLy: 2537000, massSolar: 140000000, notes: "Agujero negro supermasivo del centro de Andrómeda.", source: "Destacado curado" },
  { id: "ngc-3115", name: "NGC 3115", type: "Supermasivo", location: "Galaxia del Huso", distanceLy: 32000000, massSolar: 2000000000, notes: "Agujero negro central en una galaxia lenticular cercana.", source: "Destacado curado" },
  { id: "ngc-1365", name: "NGC 1365", type: "Supermasivo activo", location: "Galaxia espiral barrada", distanceLy: 56000000, massSolar: 2000000, notes: "Núcleo activo con variabilidad y absorción intensa.", source: "Destacado curado" },
  { id: "ngc-4151", name: "NGC 4151", type: "Supermasivo activo", location: "Galaxia Seyfert", distanceLy: 52000000, massSolar: 40000000, notes: "Una de las galaxias Seyfert más estudiadas.", source: "Destacado curado" },
  { id: "centaurus-a", name: "Centaurus A", type: "Supermasivo activo", location: "NGC 5128", distanceLy: 12000000, massSolar: 55000000, notes: "Núcleo activo cercano con chorros visibles en radio y rayos X.", source: "Destacado curado" }
];

const decodeHtmlEntities = (value = "") => {
  const named = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", plusmn: "±", mnplus: "∓", sim: "∼", asymp: "≈", le: "≤", ge: "≥", minus: "−", times: "×", deg: "°", micro: "µ", mu: "μ" };
  return String(value).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity) => {
    const key = entity.toLowerCase();
    if (key.startsWith("#x")) return String.fromCodePoint(parseInt(key.slice(2), 16));
    if (key.startsWith("#")) return String.fromCodePoint(parseInt(key.slice(1), 10));
    return named[key] ?? "";
  });
};

const stripTags = (value = "") => decodeHtmlEntities(value).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const getCells = (rowHtml = "") => [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match) => stripTags(match[1]));
const parseNumber = (value = "") => {
  const match = String(value).replace(/,/g, ".").match(/[<>~∼≤≥]?[ ]?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0].replace(/[<>~∼≤≥ ]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const parseBlackCat = (html = "") => {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((match) => getCells(match[1])).filter((cells) => cells.length >= 6);
  const dataRows = rows.filter((cells) => /^\d+$/.test(cells[0] || ""));
  return dataRows.map((cells) => {
    const id = `blackcat-${cells[0]}`;
    const name = cells[1] || `BlackCAT ${cells[0]}`;
    const distanceKpcText = cells[8] || "";
    const distanceKpc = parseNumber(distanceKpcText);
    return { id, name, type: "Binario de rayos X / candidato estelar", ra: cells[2] || "", dec: cells[3] || "", galacticLongitude: cells[4] || "", galacticLatitude: cells[5] || "", outburstMagnitude: cells[6] || "", quiescentMagnitude: cells[7] || "", distanceKpcText, distanceKpc, distanceLy: distanceKpc ? Math.round(distanceKpc * 3261.56) : null, peakFlux: cells[9] || "", orbitalPeriodHours: cells[10] || "", source: "BlackCAT", sourceUrl: BLACKCAT_URL };
  });
};

const parseCsv = (csv = "") => {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  const header = lines.shift()?.split(",").map((h) => h.trim()) || [];
  return lines.map((line) => {
    const values = [];
    let current = "";
    let quoted = false;
    for (const char of line) {
      if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) { values.push(current); current = ""; }
      else current += char;
    }
    values.push(current);
    return Object.fromEntries(header.map((h, i) => [h, values[i]?.replace(/^"|"$/g, "") || ""]));
  });
};

const fetchBlackCat = async () => {
  const response = await fetch(BLACKCAT_URL, { headers: { "user-agent": "Exoteroide educational site" } });
  if (!response.ok) throw new Error(`BlackCAT respondió ${response.status}`);
  return parseBlackCat(await response.text());
};

const fetchSimbadCandidates = async () => {
  const query = `SELECT TOP 80 main_id, otype, ra, dec FROM basic WHERE otype LIKE '%BH%' OR main_id LIKE '%black hole%'`;
  const params = new URLSearchParams({ request: "doQuery", lang: "adql", format: "csv", query });
  const response = await fetch(`${SIMBAD_TAP_URL}?${params.toString()}`, { headers: { "user-agent": "Exoteroide educational site" } });
  if (!response.ok) throw new Error(`SIMBAD respondió ${response.status}`);
  return parseCsv(await response.text()).map((row, index) => ({ id: `simbad-${index}-${row.main_id}`, name: row.main_id || `SIMBAD ${index + 1}`, type: row.otype || "Objeto relacionado con agujero negro", ra: row.ra || "", dec: row.dec || "", source: "SIMBAD", sourceUrl: "https://simbad.cds.unistra.fr/simbad/", notes: "Objeto obtenido desde SIMBAD. La base puede aportar identificación y coordenadas, pero no siempre masa o distancia normalizada." }));
};

const dedupe = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item.name || item.id).toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export async function GET() {
  const errors = [];
  let blackcat = [];
  let simbad = [];

  try { blackcat = await fetchBlackCat(); } catch (error) { errors.push(error?.message || "No se pudo consultar BlackCAT"); }
  try { simbad = await fetchSimbadCandidates(); } catch (error) { errors.push(error?.message || "No se pudo consultar SIMBAD"); }

  const items = dedupe([...curatedObjects, ...blackcat, ...simbad]);

  return new Response(JSON.stringify({
    updatedAt: new Date().toISOString(),
    sources: [
      { name: "Destacados curados", count: curatedObjects.length },
      { name: "BlackCAT", url: BLACKCAT_URL, count: blackcat.length },
      { name: "SIMBAD", url: "https://simbad.cds.unistra.fr/simbad/", count: simbad.length },
    ],
    errors,
    count: items.length,
    items,
  }), { headers: { "content-type": "application/json", "cache-control": "public, max-age=21600" } });
}
