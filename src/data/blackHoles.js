export async function getBlackHoles() {
  try {
    // Fuente principal (podés cambiarla después)
    const res = await fetch("https://raw.githubusercontent.com/OpenExoplanetCatalogue/oec_gzip/master/systems.json");

    const data = await res.json();

    // Transformación simple a tu formato
    return (data.systems || []).slice(0, 50).map((s, i) => ({
      name: s.name || `Objeto ${i}`,
      distance: s.distance || null,
      mass: null,
      type: "Desconocido",
      source: "Dataset externo"
    }));

  } catch (e) {
    console.error("Error cargando datos", e);

    // fallback con importantes
    return [
      {
        name: "TON 618",
        distance: 10400000000,
        mass: 66000000000,
        type: "Supermasivo",
        source: "Curado"
      },
      {
        name: "Sagittarius A*",
        distance: 26000,
        mass: 4300000,
        type: "Supermasivo",
        source: "Curado"
      },
      {
        name: "M87*",
        distance: 53000000,
        mass: 6500000000,
        type: "Supermasivo",
        source: "Curado"
      }
    ];
  }
}
