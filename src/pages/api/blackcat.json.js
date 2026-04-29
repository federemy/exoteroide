export const prerender = false;

const BLACKCAT_URL = "https://www.astro.puc.cl/BlackCAT/transients.php";

const decodeHtmlEntities = (value = "") => {
  const named = {
    nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
    plusmn: "±", mnplus: "∓", sim: "∼", asymp: "≈", le: "≤", ge: "≥",
    minus: "−", times: "×", deg: "°", micro: "µ", mu: "μ"
  };

  return String(value).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity) => {
    const key = entity.toLowerCase();
    if (key.startsWith("#x")) return String.fromCodePoint(parseInt(key.slice(2), 16));
    if (key.startsWith("#")) return String.fromCodePoint(parseInt(key.slice(1), 10));
    return named[key] ?? "";
  });
};

const stripTags = (value = "") =>
  decodeHtmlEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getCells = (rowHtml = "") => {
  const matches = [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)];
  return matches.map((match) => stripTags(match[1]));
};

const parseNumber = (value = "") => {
  const match = String(value).replace(/,/g, ".").match(/[<>~∼≤≥]?[ ]?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0].replace(/[<>~∼≤≥ ]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const parseBlackCat = (html = "") => {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((match) => getCells(match[1]))
    .filter((cells) => cells.length >= 6);

  const dataRows = rows.filter((cells) => /^\d+$/.test(cells[0] || ""));

  return dataRows.map((cells) => {
    const id = cells[0];
    const name = cells[1] || `BlackCAT ${id}`;
    const distanceKpcText = cells[8] || "";
    const distanceKpc = parseNumber(distanceKpcText);

    return {
      id,
      name,
      type: "Binario de rayos X / candidato estelar",
      ra: cells[2] || "",
      dec: cells[3] || "",
      galacticLongitude: cells[4] || "",
      galacticLatitude: cells[5] || "",
      outburstMagnitude: cells[6] || "",
      quiescentMagnitude: cells[7] || "",
      distanceKpcText,
      distanceKpc,
      distanceLy: distanceKpc ? Math.round(distanceKpc * 3261.56) : null,
      peakFlux: cells[9] || "",
      orbitalPeriodHours: cells[10] || "",
      source: "BlackCAT",
      sourceUrl: BLACKCAT_URL,
    };
  });
};

export async function GET() {
  try {
    const response = await fetch(BLACKCAT_URL, {
      headers: { "user-agent": "Exoteroide educational site" },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `BlackCAT respondió ${response.status}`, items: [] }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const html = await response.text();
    const items = parseBlackCat(html);

    return new Response(
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        source: "BlackCAT - A Catalog of Stellar-Mass Black Holes in X-ray Binaries",
        sourceUrl: BLACKCAT_URL,
        count: items.length,
        items,
      }),
      {
        headers: {
          "content-type": "application/json",
          "cache-control": "public, max-age=21600",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error?.message || "No se pudo consultar BlackCAT", items: [] }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
