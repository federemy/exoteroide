import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Spinner,
  Tab,
  Tabs,
  Table,
} from "react-bootstrap";

const NASA_IMAGES_API = "https://images-api.nasa.gov/search";
const BLACK_HOLE_API_RAW =
  "https://raw.githubusercontent.com/DogukanUrker/BlackHoleAPI/master/data.json";
const SIMBAD_TAP_API = "https://simbad.cds.unistra.fr/simbad/sim-tap/sync";

const compactNumber = (value) => {
  if (value === null || value === undefined || value === "") return "No disponible";
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(n);
};

const normalizeNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const match = String(value).replace(/,/g, "").match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
};

const cleanText = (value = "") =>
  String(value)
    .replace(/&plusmn;/g, "±")
    .replace(/&mnplus;/g, "∓")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&sim;/g, "∼")
    .replace(/&asymp;/g, "≈")
    .replace(/&le;/g, "≤")
    .replace(/&ge;/g, "≥")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

const formatLy = (value) => (value ? `${compactNumber(value)} años luz` : "No disponible");
const formatMass = (value) => (value ? `${compactNumber(value)} masas solares` : "No disponible");

const normalizeType = (type = "", name = "") => {
  const value = `${type} ${name}`.toLowerCase();

  if (
    value.includes("ultramasivo") ||
    value.includes("quasar") ||
    value.includes("cuásar")
  ) {
    return "Ultramasivo / cuásar";
  }

  if (value.includes("supermassive") || value.includes("supermasivo")) {
    return "Supermasivo";
  }

  if (
    value.includes("x-ray") ||
    value.includes("rayos x") ||
    value.includes("binary") ||
    value.includes("binario") ||
    value.includes("xb") ||
    value.includes("hxb") ||
    value.includes("lmxb")
  ) {
    return "Binario de rayos X";
  }

  if (value.includes("stellar") || value.includes("estelar")) {
    return "Estelar";
  }

  if (value.includes("intermediate") || value.includes("intermedio")) {
    return "Intermedio";
  }

  if (value.includes("candidate") || value.includes("candidato")) {
    return "Candidato";
  }

  return "Sin clasificar";
};

const normalizeCatalogItem = (item) => ({
  ...item,
  rawType: item?.rawType || item?.type,
  type: normalizeType(item?.type, item?.name),
});

const formatMassOrNotPublished = (value) =>
  value ? formatMass(value) : <span className="text-white-50 small">No publicada por esta fuente</span>;

const formatPeriodOrNotPublished = (value) => {
  const cleaned = cleanText(value || "");
  return cleaned ? `${cleaned} h` : <span className="text-white-50 small">No publicado por esta fuente</span>;
};

const formatRaDec = (item) => {
  const ra = cleanText(item?.ra || "");
  const dec = cleanText(item?.dec || "");
  if (!ra && !dec) return <span className="text-white-50 small">No publicado</span>;
  return `${ra || "RA no publicada"}${dec ? ` / ${dec}` : ""}`;
};

const distanceInsight = (distanceLy) => {
  if (!distanceLy) return "No hay distancia confiable publicada para este objeto.";
  if (distanceLy <= 5000) return "Está relativamente cerca en escala galáctica, por eso puede estudiarse con más detalle.";
  if (distanceLy <= 25000) return "Está dentro de nuestra galaxia; sus mediciones suelen depender del movimiento de estrellas compañeras o emisiones de rayos X.";
  if (distanceLy <= 100000) return "Está en escala de Vía Láctea o alrededores; la distancia ya vuelve más inciertas algunas propiedades observadas.";
  return "Está a escala extragaláctica: lo vemos como era hace millones o miles de millones de años.";
};

const massInsight = (massSolar) => {
  if (!massSolar) return "La masa no está disponible en este registro; muchas veces se infiere indirectamente.";
  if (massSolar < 100) return "Su masa encaja con un agujero negro estelar, probablemente nacido del colapso de una estrella masiva.";
  if (massSolar < 1000000) return "Está en un rango intermedio poco común, útil para entender cómo crecen los agujeros negros.";
  if (massSolar < 1000000000) return "Es supermasivo; normalmente vive en el centro de una galaxia e influye en su dinámica.";
  return "Es ultramasivo; suele asociarse a galaxias activas o cuásares muy luminosos.";
};

const orbitalInsight = (period) => {
  const text = cleanText(period || "");
  if (!text) return "Sin periodo orbital publicado.";
  const value = normalizeNumber(text);
  if (!value) return "El periodo está publicado, pero requiere interpretación manual de la fuente original.";
  if (value < 24) return "Periodo corto: el objeto compañero está muy cerca y puede alimentar al agujero negro.";
  if (value < 240) return "Periodo medio: el sistema binario es amplio, pero todavía puede haber intercambio de material.";
  return "Periodo largo: la estrella compañera orbita más lejos; los eventos brillantes pueden ser más episódicos.";
};

const objectExplanation = (item) => [
  distanceInsight(item?.distanceLy),
  massInsight(item?.massSolar),
  orbitalInsight(item?.orbitalPeriodHours),
].filter(Boolean);

const cleanDescription = (text = "") => {
  const trimmed = cleanText(text).replace(/\s+/g, " ").trim();
  if (!trimmed) return "Sin descripción disponible por el momento.";
  return trimmed.length > 520 ? `${trimmed.slice(0, 520)}...` : trimmed;
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Fecha no disponible";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
};

const getImageUrl = (item) => {
  const links = item?.links || [];
  const preview = links.find((link) => link?.rel === "preview")?.href;
  return preview || links[0]?.href || "";
};

const normalizeNasaItem = (item) => {
  const data = item?.data?.[0] || {};
  return {
    id: data.nasa_id || item.href || `${data.title}-${data.date_created}`,
    title: cleanText(data.title || "Agujero negro sin título"),
    description: cleanDescription(data.description),
    date: formatDate(data.date_created),
    imageUrl: getImageUrl(item),
    nasaId: data.nasa_id,
    center: data.center || "NASA",
  };
};

const normalizeCommunityItem = (item, index) => {
  const names = Array.isArray(item?.name) ? item.name : [item?.name];
  const name = cleanText(names.find(Boolean) || `Objeto ${index + 1}`);
  const distanceLy = normalizeNumber(item?.distance?.ly ?? item?.distance?.lightYears ?? item?.distance?.number ?? item?.distance);
  const massSolar = normalizeNumber(item?.mass?.solarMass ?? item?.mass?.number ?? item?.mass);
  return {
    id: `bhapi-${item?.id ?? index}`,
    name,
    aliases: names.filter(Boolean).map(cleanText).join(" / "),
    type: cleanText(item?.type || item?.kind || item?.list || "Agujero negro / candidato"),
    location: cleanText(item?.constellation || item?.coordinates || item?.map || "No disponible"),
    distanceLy,
    massSolar,
    ra: cleanText(item?.rightAscension || ""),
    dec: cleanText(item?.declination || ""),
    notes: cleanDescription(item?.description || item?.detail || item?.list || "Registro importado desde BlackHoleAPI."),
    source: "BlackHoleAPI / GitHub",
  };
};

const normalizeSimbadRow = (row, index) => ({
  id: `simbad-${index}-${row?.[0]}`,
  name: cleanText(row?.[0] || `SIMBAD ${index + 1}`),
  type: cleanText(row?.[1] || "Objeto astronómico relacionado"),
  location: "SIMBAD",
  distanceLy: null,
  massSolar: null,
  ra: row?.[2] ?? "",
  dec: row?.[3] ?? "",
  notes: "Registro obtenido desde SIMBAD. Puede traer coordenadas y clasificación, pero no siempre masa o distancia.",
  source: "SIMBAD / CDS",
});

const fetchSimbadObjects = async () => {
  const query = `
    SELECT TOP 80 main_id, otype, ra, dec
    FROM basic
    WHERE otype = 'BH*' OR otype = 'XB' OR otype = 'HXB' OR otype = 'LMXB'
  `;
  const params = new URLSearchParams({
    request: "doQuery",
    lang: "adql",
    format: "json",
    query,
  });
  const response = await fetch(`${SIMBAD_TAP_API}?${params.toString()}`);
  if (!response.ok) throw new Error("SIMBAD no respondió correctamente");
  const data = await response.json();
  return (data?.data || []).map(normalizeSimbadRow);
};

const fetchLiveCatalog = async () => {
  const results = [];

  const communityResponse = await fetch(BLACK_HOLE_API_RAW, { cache: "no-store" });
  if (communityResponse.ok) {
    const communityData = await communityResponse.json();
    const communityItems = Array.isArray(communityData) ? communityData : communityData?.items || communityData?.data || [];
    results.push(...communityItems.map(normalizeCommunityItem));
  }

  try {
    const simbadItems = await fetchSimbadObjects();
    results.push(...simbadItems);
  } catch (error) {
    console.warn("SIMBAD no pudo cargarse desde el navegador", error);
  }

  const seen = new Set();
  return results.filter((item) => {
    const key = item.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sortByDistance = (a, b) => {
  const ad = a.distanceLy ?? Number.POSITIVE_INFINITY;
  const bd = b.distanceLy ?? Number.POSITIVE_INFINITY;
  return ad - bd;
};

export function BlackHoles({ data = [] }) {
  const [catalog, setCatalog] = useState(Array.isArray(data) ? data : data?.items || []);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [catalogSource, setCatalogSource] = useState("Fallback inicial");
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [maxDistance, setMaxDistance] = useState("Todos");
  const [imageQuery, setImageQuery] = useState("black hole");
  const [activeImageQuery, setActiveImageQuery] = useState("black hole");

  useEffect(() => {
    let active = true;
    const loadCatalog = async () => {
      setCatalogLoading(true);
      setCatalogError("");
      const fallback = Array.isArray(data) ? data : data?.items || [];
      try {
        const liveItems = await fetchLiveCatalog();
        if (!active) return;
        if (liveItems.length === 0) throw new Error("Las fuentes externas no devolvieron objetos");
        const merged = [...fallback, ...liveItems].map(normalizeCatalogItem);
        const seen = new Set();
        setCatalog(
          merged.filter((item) => {
            const key = String(item.name || item.id).toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }),
        );
        setCatalogSource("Catálogo vivo: BlackHoleAPI + SIMBAD + fallback curado");
      } catch (error) {
        console.error(error);
        if (!active) return;
        setCatalog(fallback.map(normalizeCatalogItem));
        setCatalogSource("Fallback curado");
        setCatalogError("No se pudieron cargar las fuentes externas en este momento. Estoy mostrando el fallback curado.");
      } finally {
        if (active) setCatalogLoading(false);
      }
    };
    loadCatalog();
    return () => {
      active = false;
    };
  }, [data]);

  useEffect(() => {
    const controller = new AbortController();
    const loadImages = async () => {
      setImagesLoading(true);
      try {
        const params = new URLSearchParams({ q: activeImageQuery, media_type: "image", page_size: "24" });
        const response = await fetch(`${NASA_IMAGES_API}?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error("NASA Images no respondió correctamente");
        const data = await response.json();
        const normalized = (data?.collection?.items || []).map(normalizeNasaItem).filter((item) => item.imageUrl);
        setImages(normalized);
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        setImagesLoading(false);
      }
    };
    loadImages();
    return () => controller.abort();
  }, [activeImageQuery]);

  const preferredTypeOrder = [
    "Todos",
    "Supermasivo",
    "Ultramasivo / cuásar",
    "Estelar",
    "Binario de rayos X",
    "Intermedio",
    "Candidato",
    "Sin clasificar",
  ];

  const typeOptions = useMemo(() => {
    const available = new Set(catalog.map((item) => item.type).filter(Boolean));
    return preferredTypeOrder.filter(
      (type) => type === "Todos" || available.has(type),
    );
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return catalog
      .filter((item) => {
        const matchesSearch =
          !normalizedSearch ||
          [item.name, item.aliases, item.location, item.ra, item.dec, item.notes, item.source]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);
        const matchesType = typeFilter === "Todos" || item.type === typeFilter;
        const matchesDistance = maxDistance === "Todos" || (item.distanceLy && item.distanceLy <= Number(maxDistance));
        return matchesSearch && matchesType && matchesDistance;
      })
      .sort(sortByDistance);
  }, [catalog, search, typeFilter, maxDistance]);

  return (
    <Container className="my-5 pt-5">
      <style>{`
        .black-card { background: #05070a !important; border: 1px solid rgba(151, 71, 255, 0.32) !important; border-radius: 16px; transition: all .25s ease; }
        .black-card:hover { transform: translateY(-6px); border-color: #b366ff !important; box-shadow: 0 0 24px rgba(151, 71, 255, .25); }
        .text-violet { color: #b366ff; text-shadow: 0 0 8px rgba(179,102,255,.45); }
        .bh-table { --bs-table-bg: #05070a; --bs-table-color: #fff; --bs-table-border-color: rgba(255,255,255,.12); }
        .bh-img { height: 250px; object-fit: cover; border-radius: 16px 16px 0 0; }
        .nav-tabs .nav-link { color: rgba(255,255,255,.72); border-color: rgba(255,255,255,.15); }
        .nav-tabs .nav-link.active { background: #12051d; color: #fff; border-color: #b366ff; }
        .modal-content { background: #05070a; border: 1px solid #b366ff; color: white; }
      `}</style>

      <div className="text-center mb-5">
        <Badge bg="dark" className="mb-3 px-3 py-2 border border-info">CATÁLOGO VIVO + NASA</Badge>
        <h1 className="display-4 fw-bold text-white">Agujeros negros</h1>
        <p className="lead text-white-50 mx-auto" style={{ maxWidth: 820 }}>
          Catálogo actualizado desde fuentes externas en el navegador, más imágenes desde NASA Image and Video Library.
        </p>
      </div>

      <Tabs defaultActiveKey="catalogo" className="mb-4" fill>
        <Tab eventKey="catalogo" title="Catálogo filtrable">
          <Card className="black-card mb-4">
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={5}>
                  <Form.Label className="text-white-50">Buscar</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>🔎</InputGroup.Text>
                    <Form.Control value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre, coordenadas, fuente..." />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Label className="text-white-50">Tipo</Form.Label>
                  <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    {typeOptions.map((option) => <option key={option}>{option}</option>)}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Label className="text-white-50">Distancia máxima</Form.Label>
                  <Form.Select value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)}>
                    <option>Todos</option>
                    <option value="5000">Hasta 5.000 años luz</option>
                    <option value="10000">Hasta 10.000 años luz</option>
                    <option value="25000">Hasta 25.000 años luz</option>
                    <option value="100000">Hasta 100.000 años luz</option>
                    <option value="100000000">Hasta 100 millones años luz</option>
                    <option value="11000000000">Hasta 11 mil millones años luz</option>
                  </Form.Select>
                </Col>
                <Col md={1} className="text-md-end">
                  <Badge bg="info" text="dark" className="px-3 py-2">{filteredCatalog.length}</Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Alert variant="dark" className="border border-info text-white bg-black mb-4">
            <strong>Fuente actual:</strong> {catalogLoading ? "cargando..." : catalogSource}. La tabla prioriza datos que sí suelen publicar las fuentes abiertas: distancia, coordenadas y origen. Masa y periodo orbital aparecen en el detalle cuando la fuente los trae.
          </Alert>
          {catalogError && <Alert variant="warning">{catalogError}</Alert>}

          {catalogLoading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="info" /><p className="text-info mt-3">Cargando catálogo vivo...</p></div>
          ) : (
            <Table responsive hover className="bh-table align-middle">
              <thead>
                <tr>
                  <th>Objeto</th>
                  <th>Tipo</th>
                  <th>Distancia</th>
                  <th>RA / DEC</th>
                  <th>Fuente</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCatalog.map((item) => (
                  <tr key={`${item.source}-${item.id}-${item.name}`}>
                    <td className="fw-bold text-white">{item.name}</td>
                    <td><Badge bg="secondary">{item.type}</Badge></td>
                    <td>{formatLy(item.distanceLy)}</td>
                    <td className="text-white-50 small">{formatRaDec(item)}</td>
                    <td className="text-white-50 small">{item.source}</td>
                    <td className="text-end"><Button size="sm" variant="outline-info" onClick={() => setSelected(item)}>Ver</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="imagenes" title="Imágenes NASA">
          <Card className="black-card mb-4"><Card.Body>
            <Form onSubmit={(e) => { e.preventDefault(); setActiveImageQuery(imageQuery.trim() || "black hole"); }}>
              <InputGroup><Form.Control value={imageQuery} onChange={(e) => setImageQuery(e.target.value)} placeholder="black hole, M87, Sagittarius A..." /><Button type="submit" variant="info">Buscar en NASA</Button></InputGroup>
            </Form>
          </Card.Body></Card>
          {imagesLoading ? <div className="text-center py-5"><Spinner animation="grow" variant="info" /><p className="text-info mt-3">Buscando imágenes NASA...</p></div> : (
            <Row className="g-4">{images.map((item) => <Col key={item.id} md={6} lg={4} xl={3}><Card className="black-card h-100" onClick={() => setSelectedImage(item)} style={{ cursor: "pointer" }}><Card.Img src={item.imageUrl} className="bh-img" /><Card.Body><small className="text-violet fw-bold">{item.date}</small><Card.Title className="h6 text-white mt-2">{item.title}</Card.Title></Card.Body></Card></Col>)}</Row>
          )}
        </Tab>
      </Tabs>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg">
        <Modal.Header closeButton closeVariant="white" className="border-secondary"><Modal.Title className="text-violet">{selected?.name}</Modal.Title></Modal.Header>
        <Modal.Body><Row className="g-3">
          <Col md={6}><strong>Tipo:</strong><br />{selected?.type}</Col>
          <Col md={6}><strong>Ubicación:</strong><br />{selected?.location || "No disponible"}</Col>
          <Col md={6}><strong>Distancia:</strong><br />{formatLy(selected?.distanceLy)}</Col>
          <Col md={6}><strong>Masa estimada:</strong><br />{formatMassOrNotPublished(selected?.massSolar)}</Col>
          <Col md={6}><strong>Periodo orbital:</strong><br />{formatPeriodOrNotPublished(selected?.orbitalPeriodHours)}</Col>
          <Col md={6}><strong>RA / DEC:</strong><br />{formatRaDec(selected)}</Col>
          <Col md={6}><strong>Fuente:</strong><br />{selected?.source}</Col>
          <Col xs={12}><Card className="bg-dark border-secondary mt-2"><Card.Body><strong className="text-info">Cómo interpretar estos datos</strong><ul className="text-white-50 mt-3 mb-0">{selected && objectExplanation(selected).map((line) => <li key={line}>{line}</li>)}</ul></Card.Body></Card></Col>
          <Col xs={12}><strong>Notas:</strong><p className="text-white-50 mt-2">{selected?.notes || "Objeto importado desde catálogo astronómico."}</p></Col>
        </Row></Modal.Body>
      </Modal>

      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="xl">
        <Modal.Header closeButton closeVariant="white" className="border-secondary"><Modal.Title className="text-violet">{selectedImage?.title}</Modal.Title></Modal.Header>
        <Modal.Body className="p-0">{selectedImage?.imageUrl && <img src={selectedImage.imageUrl} className="img-fluid w-100" alt={selectedImage.title} />}<div className="p-4 bg-dark"><p>{selectedImage?.description}</p><div className="d-flex justify-content-between align-items-center gap-3 flex-wrap"><span className="text-white-50 small">{selectedImage?.center} · {selectedImage?.date}</span><Button variant="info" onClick={() => window.open(selectedImage?.imageUrl, "_blank")}>Abrir imagen</Button></div></div></Modal.Body>
      </Modal>
    </Container>
  );
}
