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

const featuredBlackHoles = [
  {
    id: "sagittarius-a-star",
    name: "Sagittarius A*",
    type: "Supermasivo",
    location: "Centro de la Vía Láctea",
    distanceLy: 27000,
    massSolar: 4300000,
    notes: "Agujero negro supermasivo del centro de nuestra galaxia.",
    source: "Ficha destacada",
  },
  {
    id: "m87-star",
    name: "M87*",
    type: "Supermasivo",
    location: "Galaxia Messier 87",
    distanceLy: 53500000,
    massSolar: 6500000000,
    notes: "Primer agujero negro fotografiado directamente por el Event Horizon Telescope.",
    source: "Ficha destacada",
  },
  {
    id: "ton-618",
    name: "TON 618",
    type: "Ultramasivo / cuásar",
    location: "Cuásar lejano",
    distanceLy: 10400000000,
    massSolar: 66000000000,
    notes: "Uno de los candidatos ultramasivos más famosos.",
    source: "Ficha destacada",
  },
  {
    id: "gaia-bh3",
    name: "Gaia BH3",
    type: "Estelar inactivo",
    location: "Vía Láctea",
    distanceLy: 1926,
    massSolar: 33,
    notes: "Agujero negro estelar masivo detectado por el movimiento de su estrella compañera.",
    source: "Ficha destacada",
  },
];

const fallbackCatalog = [
  { id: "71", name: "Swift J1727.8-1613", type: "Binario de rayos X / candidato estelar", distanceKpcText: "3.4±0.3", distanceKpc: 3.4, distanceLy: 11089, orbitalPeriodHours: "10.804±0.001", peakFlux: "1.65E-07", source: "Fallback local" },
  { id: "63", name: "MAXI J1820+070 / ASASSN-18ey", type: "Binario de rayos X / candidato estelar", distanceKpcText: "2.96±0.33", distanceKpc: 2.96, distanceLy: 9654, orbitalPeriodHours: "16.4518±0.0002", peakFlux: "2.26E-07", source: "Fallback local" },
  { id: "53", name: "MAXI J1305-704", type: "Binario de rayos X / candidato estelar", distanceKpcText: "7.5+1.8-1.4", distanceKpc: 7.5, distanceLy: 24462, orbitalPeriodHours: "9.5±0.1", peakFlux: "1.03E-09", source: "Fallback local" },
  { id: "32", name: "XTE J1118+480 / KV UMa", type: "Binario de rayos X / candidato estelar", distanceKpcText: "1.72±0.1", distanceKpc: 1.72, distanceLy: 5610, orbitalPeriodHours: "4.0784088", peakFlux: "4.99E-10", source: "Fallback local" },
  { id: "21", name: "GRO J1655-40", type: "Binario de rayos X / candidato estelar", distanceKpcText: "3.2±0.2", distanceKpc: 3.2, distanceLy: 10437, orbitalPeriodHours: "62.926272", peakFlux: "1.15E-07", source: "Fallback local" },
  { id: "18", name: "GRS 1915+105", type: "Binario de rayos X / candidato estelar", distanceKpcText: "9.4±0.8", distanceKpc: 9.4, distanceLy: 30659, orbitalPeriodHours: "812±4", peakFlux: "9.29E-08", source: "Fallback local" },
  { id: "15", name: "GS 2023+338 / V404 Cyg", type: "Binario de rayos X / candidato estelar", distanceKpcText: "2.39±0.14", distanceKpc: 2.39, distanceLy: 7795, orbitalPeriodHours: "155.30803", peakFlux: "2.59E-07", source: "Fallback local" },
  { id: "7", name: "3A 0620-003 / V616 Mon", type: "Binario de rayos X / candidato estelar", distanceKpcText: "1.06±0.1", distanceKpc: 1.06, distanceLy: 3457, orbitalPeriodHours: "7.752340", peakFlux: "2.65E-06", source: "Fallback local" },
  { id: "5", name: "GX 339-4", type: "Binario de rayos X / candidato estelar", distanceKpcText: ">5", distanceKpc: 5, distanceLy: 16308, orbitalPeriodHours: "42.21±0.01", peakFlux: "2.56E-08", source: "Fallback local" },
];

const compactNumber = (value) => {
  if (value === null || value === undefined || value === "") return "No disponible";
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(value);
};

const formatLy = (value) => value ? `${compactNumber(value)} años luz` : "No disponible";
const formatMass = (value) => value ? `${compactNumber(value)} masas solares` : "No disponible";

const cleanText = (value = "") => String(value)
  .replace(/&plusmn;/g, "±")
  .replace(/&mnplus;/g, "∓")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&amp;/g, "&")
  .replace(/&sim;/g, "∼")
  .replace(/&asymp;/g, "≈")
  .replace(/&le;/g, "≤")
  .replace(/&ge;/g, "≥");

const distanceInsight = (distanceLy) => {
  if (!distanceLy) return "No hay distancia confiable publicada para este objeto, así que conviene compararlo por nombre, coordenadas y fuente antes de sacar conclusiones.";
  if (distanceLy <= 5000) return "Está relativamente cerca en escala galáctica. Es más fácil estudiarlo con detalle porque su luz llega con menos debilitamiento y menor confusión con objetos de fondo.";
  if (distanceLy <= 25000) return "Está dentro de nuestra galaxia. A esa distancia todavía puede estudiarse bien, pero las mediciones dependen más de modelos y del comportamiento de su estrella compañera.";
  if (distanceLy <= 100000) return "Está en escala de Vía Láctea o alrededores. La distancia ya vuelve más inciertas algunas propiedades observadas, sobre todo brillo real y energía emitida.";
  return "Está a escala extragaláctica. Lo vemos como era hace muchísimo tiempo, porque su luz tardó millones o miles de millones de años en llegar.";
};

const massInsight = (massSolar) => {
  if (!massSolar) return "La masa no está disponible en este registro. En muchos candidatos se infiere de forma indirecta observando el movimiento de una estrella compañera o la emisión de rayos X.";
  if (massSolar < 100) return "Su masa encaja con un agujero negro estelar: probablemente nació del colapso de una estrella masiva. Su tamaño físico puede ser pequeño, pero su gravedad cercana es extrema.";
  if (massSolar < 1000000) return "Está en un rango intermedio poco común. Estos objetos son importantes porque podrían conectar agujeros negros estelares con supermasivos.";
  if (massSolar < 1000000000) return "Es supermasivo. Normalmente vive en el centro de una galaxia y puede influir en la dinámica de millones de estrellas.";
  return "Es ultramasivo. Su gravedad domina regiones enormes y suele estar asociado a galaxias activas o cuásares muy luminosos.";
};

const orbitalInsight = (period) => {
  const text = cleanText(period || "");
  if (!text) return "Sin periodo orbital publicado. Eso puede significar que todavía no se midió bien el sistema compañero.";
  const value = Number(text.replace(",", ".").match(/\d+(?:\.\d+)?/)?.[0]);
  if (!Number.isFinite(value)) return "El periodo está publicado con formato astronómico, pero requiere interpretación manual por la fuente original.";
  if (value < 24) return "Periodo corto: el objeto compañero está muy cerca del agujero negro, por eso puede transferir material y generar rayos X intensos.";
  if (value < 240) return "Periodo medio: el sistema binario es más amplio, pero todavía puede haber intercambio de material hacia el agujero negro.";
  return "Periodo largo: la estrella compañera orbita más lejos, lo que suele hacer que los eventos brillantes sean menos frecuentes o más episódicos.";
};

const objectExplanation = (item) => [
  distanceInsight(item?.distanceLy),
  massInsight(item?.massSolar),
  orbitalInsight(item?.orbitalPeriodHours),
].filter(Boolean);

const cleanDescription = (text = "") => {
  const trimmed = text.replace(/\s+/g, " ").trim();
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
    title: data.title || "Agujero negro sin título",
    description: cleanDescription(data.description),
    date: formatDate(data.date_created),
    imageUrl: getImageUrl(item),
    nasaId: data.nasa_id,
    center: data.center || "NASA",
  };
};

const sortByDistance = (a, b) => {
  const ad = a.distanceLy ?? Number.POSITIVE_INFINITY;
  const bd = b.distanceLy ?? Number.POSITIVE_INFINITY;
  return ad - bd;
};

export function BlackHoles() {
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
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
    const loadCatalog = async () => {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const response = await fetch("/api/black-holes.json");
        if (!response.ok) throw new Error("No se pudo consultar el catálogo");
        const data = await response.json();
        if (!Array.isArray(data.items) || data.items.length === 0) throw new Error("El catálogo no devolvió objetos");
        setCatalog(data.items);
      } catch (error) {
        console.error(error);
        setCatalogError("No se pudo traer el catálogo vivo. Estoy mostrando una base local reducida.");
        setCatalog([...featuredBlackHoles, ...fallbackCatalog]);
      } finally {
        setCatalogLoading(false);
      }
    };
    loadCatalog();
  }, []);

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

  const typeOptions = useMemo(() => ["Todos", ...new Set(catalog.map((item) => item.type).filter(Boolean))], [catalog]);

  const filteredCatalog = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return catalog
      .filter((item) => {
        const matchesSearch = !normalizedSearch || [item.name, item.location, item.ra, item.dec, item.notes, item.source]
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
        <Badge bg="dark" className="mb-3 px-3 py-2 border border-info">CATÁLOGO + NASA</Badge>
        <h1 className="display-4 fw-bold text-white">Agujeros negros</h1>
        <p className="lead text-white-50 mx-auto" style={{ maxWidth: 820 }}>
          Catálogo ampliado combinando destacados curados, BlackCAT y SIMBAD, más imágenes actualizadas desde NASA Image and Video Library.
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
                  </Form.Select>
                </Col>
                <Col md={1} className="text-md-end">
                  <Badge bg="info" text="dark" className="px-3 py-2">{filteredCatalog.length}</Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Alert variant="dark" className="border border-info text-white bg-black mb-4">
            <strong>Lectura rápida:</strong> cuanto más lejos está un agujero negro, más antigua es la luz que vemos y más difícil es medir sus propiedades. La masa indica la familia del objeto: estelar si tiene decenas de masas solares, supermasivo si tiene millones o miles de millones. En binarias de rayos X, un periodo orbital corto suele indicar una estrella compañera muy cercana que puede alimentar al agujero negro.
          </Alert>

          {catalogError && <Alert variant="warning">{catalogError}</Alert>}

          {catalogLoading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="info" /><p className="text-info mt-3">Cargando catálogo...</p></div>
          ) : (
            <Table responsive hover className="bh-table align-middle">
              <thead>
                <tr>
                  <th>Objeto</th>
                  <th>Tipo</th>
                  <th>Distancia</th>
                  <th>Masa</th>
                  <th>Periodo orbital</th>
                  <th>Fuente</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCatalog.map((item) => (
                  <tr key={`${item.source}-${item.id}-${item.name}`}>
                    <td className="fw-bold text-white">{item.name}</td>
                    <td><Badge bg="secondary">{item.type}</Badge></td>
                    <td>{formatLy(item.distanceLy)}{item.distanceKpcText ? <div className="text-white-50 small">{cleanText(item.distanceKpcText)} kpc</div> : null}</td>
                    <td>{formatMass(item.massSolar)}</td>
                    <td>{cleanText(item.orbitalPeriodHours) || "No disponible"}</td>
                    <td className="text-white-50 small">{item.source}</td>
                    <td className="text-end"><Button size="sm" variant="outline-info" onClick={() => setSelected(item)}>Ver</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="imagenes" title="Imágenes NASA">
          <Card className="black-card mb-4">
            <Card.Body>
              <Form onSubmit={(e) => { e.preventDefault(); setActiveImageQuery(imageQuery.trim() || "black hole"); }}>
                <InputGroup>
                  <Form.Control value={imageQuery} onChange={(e) => setImageQuery(e.target.value)} placeholder="black hole, M87, Sagittarius A..." />
                  <Button type="submit" variant="info">Buscar en NASA</Button>
                </InputGroup>
              </Form>
            </Card.Body>
          </Card>

          {imagesLoading ? (
            <div className="text-center py-5"><Spinner animation="grow" variant="info" /><p className="text-info mt-3">Buscando imágenes NASA...</p></div>
          ) : (
            <Row className="g-4">
              {images.map((item) => (
                <Col key={item.id} md={6} lg={4} xl={3}>
                  <Card className="black-card h-100" onClick={() => setSelectedImage(item)} style={{ cursor: "pointer" }}>
                    <Card.Img src={item.imageUrl} className="bh-img" />
                    <Card.Body>
                      <small className="text-violet fw-bold">{item.date}</small>
                      <Card.Title className="h6 text-white mt-2">{item.title}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="text-violet">{selected?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}><strong>Tipo:</strong><br />{selected?.type}</Col>
            <Col md={6}><strong>Distancia:</strong><br />{formatLy(selected?.distanceLy)}</Col>
            <Col md={6}><strong>Masa:</strong><br />{formatMass(selected?.massSolar)}</Col>
            <Col md={6}><strong>Periodo orbital:</strong><br />{cleanText(selected?.orbitalPeriodHours) || "No disponible"}</Col>
            <Col md={6}><strong>RA / DEC:</strong><br />{selected?.ra || "No disponible"} {selected?.dec || ""}</Col>
            <Col md={6}><strong>Flujo pico:</strong><br />{cleanText(selected?.peakFlux) || "No disponible"}</Col>
            <Col xs={12}>
              <Card className="bg-dark border-secondary mt-2">
                <Card.Body>
                  <strong className="text-info">Cómo interpretar estos datos</strong>
                  <ul className="text-white-50 mt-3 mb-0">
                    {selected && objectExplanation(selected).map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}><strong>Notas:</strong><p className="text-white-50 mt-2">{selected?.notes || "Objeto importado desde catálogo astronómico. Algunas propiedades pueden estar vacías si la fuente no las publica para ese objeto."}</p></Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal show={!!selectedImage} onHide={() => setSelectedImage(null)} centered size="xl">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="text-violet">{selectedImage?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedImage?.imageUrl && <img src={selectedImage.imageUrl} className="img-fluid w-100" alt={selectedImage.title} />}
          <div className="p-4 bg-dark">
            <p>{selectedImage?.description}</p>
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <span className="text-white-50 small">{selectedImage?.center} · {selectedImage?.date}</span>
              <Button variant="info" onClick={() => window.open(selectedImage?.imageUrl, "_blank")}>Abrir imagen</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
