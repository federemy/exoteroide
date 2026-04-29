import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  ProgressBar,
  Row,
} from "react-bootstrap";

const anomalies = [
  {
    id: "great-attractor",
    name: "Gran Atractor",
    category: "Estructura cósmica",
    status: "Observado indirectamente",
    weirdness: 92,
    distance: "~150-250 millones de años luz",
    summary:
      "Una región de enorme concentración de masa que influye en el movimiento de miles de galaxias, incluida la Vía Láctea.",
    whyStrange:
      "No se ve como un objeto simple. Parte queda escondida detrás del plano de nuestra galaxia, una zona difícil de observar por el polvo y las estrellas de la Vía Láctea.",
    explanation:
      "Cuando muchas galaxias parecen moverse hacia una misma región, los astrónomos infieren que allí hay una concentración gravitacional enorme. No significa que todo vaya a caer en un punto, sino que la distribución de masa del universo cercano tiene zonas que tiran más fuerte que otras.",
    searchQuery: "Great Attractor galaxy cluster",
  },
  {
    id: "bootes-void",
    name: "Vacío de Boötes",
    category: "Vacío cósmico",
    status: "Observado",
    weirdness: 88,
    distance: "~700 millones de años luz",
    summary:
      "Una región inmensa del universo con muchas menos galaxias de las esperadas.",
    whyStrange:
      "Lo raro no es que haya vacío, sino el tamaño: parece una burbuja gigante con muy poca estructura visible en comparación con regiones normales.",
    explanation:
      "El universo tiene una red cósmica: filamentos, cúmulos y vacíos. El Vacío de Boötes es interesante porque ayuda a entender cómo creció esa red a partir de pequeñas diferencias de densidad en el universo temprano.",
    searchQuery: "Boötes Void",
  },
  {
    id: "dark-matter",
    name: "Materia oscura",
    category: "Componente desconocido",
    status: "Inferido por gravedad",
    weirdness: 96,
    distance: "Presente a escala galáctica y cosmológica",
    summary:
      "Materia que no emite luz, pero cuya gravedad parece ser necesaria para explicar galaxias, cúmulos y lentes gravitacionales.",
    whyStrange:
      "No la vemos directamente. Sabemos que algo gravitacional falta porque las galaxias rotan y se agrupan como si tuvieran mucha más masa que la visible.",
    explanation:
      "La idea más aceptada es que existe una forma de materia que interactúa muy poco con la luz. No es una explicación mágica: es una hipótesis física que encaja con varias observaciones independientes, aunque todavía no se detectó la partícula responsable.",
    searchQuery: "dark matter gravitational lensing",
  },
  {
    id: "dark-energy",
    name: "Energía oscura",
    category: "Componente desconocido",
    status: "Inferido por expansión cósmica",
    weirdness: 98,
    distance: "Escala de todo el universo",
    summary:
      "El nombre que le damos a la causa aparente de la expansión acelerada del universo.",
    whyStrange:
      "No se comporta como materia común: parece asociada al espacio mismo y domina la evolución del universo a gran escala.",
    explanation:
      "Al medir supernovas lejanas y la estructura a gran escala, se observa que la expansión cósmica se acelera. Energía oscura es el modelo que resume ese efecto, aunque su naturaleza física sigue abierta.",
    searchQuery: "dark energy universe expansion",
  },
  {
    id: "fast-radio-bursts",
    name: "Ráfagas rápidas de radio",
    category: "Señal extrema",
    status: "Observado",
    weirdness: 90,
    distance: "Galácticas y extragalácticas",
    summary:
      "Destellos de radio muy breves y energéticos que pueden durar milisegundos.",
    whyStrange:
      "Algunas se repiten y otras no. Su origen no es único: ciertos casos apuntan a magnetares, pero el panorama completo sigue en estudio.",
    explanation:
      "Una señal tan corta exige un objeto compacto y extremo. Por eso se estudian magnetares, estrellas de neutrones y entornos muy energéticos como posibles fuentes.",
    searchQuery: "fast radio burst magnetar",
  },
  {
    id: "gamma-ray-bursts",
    name: "Explosiones de rayos gamma",
    category: "Evento extremo",
    status: "Observado",
    weirdness: 86,
    distance: "Miles de millones de años luz",
    summary:
      "Entre los eventos electromagnéticos más energéticos conocidos.",
    whyStrange:
      "Pueden liberar en segundos una cantidad de energía enorme, detectable desde distancias cosmológicas.",
    explanation:
      "Suelen asociarse a colapsos de estrellas masivas o fusiones de objetos compactos. Son laboratorios naturales para estudiar física extrema, relatividad y formación de agujeros negros.",
    searchQuery: "gamma ray burst space",
  },
  {
    id: "lyman-alpha-blobs",
    name: "Blobs Lyman-alpha",
    category: "Nube gigante",
    status: "Observado",
    weirdness: 82,
    distance: "Universo lejano",
    summary:
      "Nubes gigantes de gas que brillan intensamente en emisión Lyman-alpha.",
    whyStrange:
      "Pueden ser enormes y no siempre queda claro qué fuente energética las ilumina.",
    explanation:
      "Podrían estar relacionadas con galaxias jóvenes, formación estelar intensa, gas cayendo hacia estructuras masivas o agujeros negros activos ocultos.",
    searchQuery: "Lyman alpha blob",
  },
  {
    id: "magnetars",
    name: "Magnetares",
    category: "Objeto compacto",
    status: "Observado",
    weirdness: 84,
    distance: "Principalmente en la Vía Láctea y alrededores",
    summary:
      "Estrellas de neutrones con campos magnéticos extremadamente intensos.",
    whyStrange:
      "Su magnetismo puede deformar átomos y liberar llamaradas violentas de rayos X y gamma.",
    explanation:
      "Son restos compactos de estrellas masivas. Su energía no viene solo de rotación o acreción, sino del decaimiento y reordenamiento de campos magnéticos enormes.",
    searchQuery: "magnetar neutron star",
  },
  {
    id: "rogue-planets",
    name: "Planetas errantes",
    category: "Objeto libre",
    status: "Observado / candidato",
    weirdness: 74,
    distance: "Vía Láctea",
    summary:
      "Planetas que no orbitan una estrella, sino que vagan por la galaxia.",
    whyStrange:
      "Rompen la intuición de que todo planeta pertenece a un sistema solar estable.",
    explanation:
      "Pueden formarse solos o ser expulsados de sus sistemas por interacciones gravitacionales. Se detectan con técnicas como microlente gravitacional o emisión térmica si son jóvenes.",
    searchQuery: "rogue planet",
  },
  {
    id: "tabbys-star",
    name: "Estrella de Tabby",
    category: "Curva de luz anómala",
    status: "Observado",
    weirdness: 78,
    distance: "~1.470 años luz",
    summary:
      "Una estrella famosa por bajadas de brillo irregulares y profundas.",
    whyStrange:
      "Su comportamiento fue tan raro que disparó muchas hipótesis, desde polvo irregular hasta ideas mucho más especulativas.",
    explanation:
      "La explicación más prudente apunta a material circumestelar o polvo no uniforme. Es un buen ejemplo de cómo una observación rara puede generar hipótesis fuertes, pero la evidencia manda.",
    searchQuery: "Tabby's Star KIC 8462852",
  },
  {
    id: "white-holes",
    name: "Agujeros blancos",
    category: "Objeto hipotético",
    status: "Teórico",
    weirdness: 99,
    distance: "No detectados",
    summary:
      "Soluciones teóricas parecidas a un agujero negro invertido: expulsarían materia en vez de absorberla.",
    whyStrange:
      "Matemáticamente aparecen en ciertas soluciones, pero no hay evidencia observacional directa.",
    explanation:
      "Son útiles como idea teórica para explorar relatividad general, causalidad y cosmología, pero no conviene presentarlos como objetos confirmados.",
    searchQuery: "white hole theoretical physics",
  },
  {
    id: "quark-stars",
    name: "Estrellas de quarks",
    category: "Objeto hipotético",
    status: "Candidato / teórico",
    weirdness: 91,
    distance: "No confirmado",
    summary:
      "Objetos hipotéticos más densos que estrellas de neutrones, donde la materia podría estar en forma de quarks libres.",
    whyStrange:
      "Serían una fase extrema de la materia, cerca del límite entre estrella de neutrones y agujero negro.",
    explanation:
      "Si la presión dentro de una estrella compacta supera ciertos umbrales, la materia nuclear podría transformarse. El problema es distinguir observacionalmente una estrella de quarks de una estrella de neutrones común.",
    searchQuery: "quark star",
  },
];

const categories = ["Todas", ...new Set(anomalies.map((item) => item.category))];
const statuses = ["Todos", ...new Set(anomalies.map((item) => item.status))];

const getScoreVariant = (score) => {
  if (score >= 95) return "danger";
  if (score >= 85) return "warning";
  return "info";
};

export default function Anomalias() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return anomalies
      .filter((item) => {
        const matchesSearch =
          !q ||
          [
            item.name,
            item.category,
            item.status,
            item.summary,
            item.whyStrange,
            item.explanation,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q);
        const matchesCategory = category === "Todas" || item.category === category;
        const matchesStatus = status === "Todos" || item.status === status;
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => b.weirdness - a.weirdness);
  }, [search, category, status]);

  return (
    <Container className="my-5 pt-5">
      <style>{`
        .anom-card { background: #06070d !important; border: 1px solid rgba(255, 193, 7, .35) !important; border-radius: 18px; transition: all .25s ease; overflow: hidden; }
        .anom-card:hover { transform: translateY(-6px); border-color: #ffc107 !important; box-shadow: 0 0 28px rgba(255, 193, 7, .22); }
        .anom-glow { color: #ffc107; text-shadow: 0 0 12px rgba(255,193,7,.45); }
        .anom-muted { color: rgba(255,255,255,.68); }
        .modal-content { background: #05070a; border: 1px solid #ffc107; color: white; }
      `}</style>

      <div className="text-center mb-5">
        <Badge bg="dark" className="mb-3 px-3 py-2 border border-warning">
          COSAS EXTRAÑAS DEL UNIVERSO
        </Badge>
        <h1 className="display-4 fw-bold text-white">Anomalías cósmicas</h1>
        <p className="lead anom-muted mx-auto" style={{ maxWidth: 860 }}>
          Fenómenos raros, estructuras extremas, objetos hipotéticos y misterios
          que todavía empujan los límites de lo que entendemos del universo.
        </p>
      </div>

      <Card className="anom-card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col lg={5}>
              <Form.Label className="anom-muted">Buscar</Form.Label>
              <InputGroup>
                <InputGroup.Text>🔎</InputGroup.Text>
                <Form.Control
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="materia oscura, vacío, rayos gamma..."
                />
              </InputGroup>
            </Col>
            <Col lg={3}>
              <Form.Label className="anom-muted">Categoría</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3}>
              <Form.Label className="anom-muted">Estado</Form.Label>
              <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={1} className="text-lg-end">
              <Badge bg="warning" text="dark" className="px-3 py-2">
                {filtered.length}
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-4">
        {filtered.map((item) => (
          <Col md={6} xl={4} key={item.id}>
            <Card className="anom-card h-100 text-white">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                  <Badge bg="warning" text="dark">
                    {item.category}
                  </Badge>
                  <Badge bg="dark" className="border border-secondary">
                    {item.status}
                  </Badge>
                </div>
                <Card.Title className="h4 anom-glow">{item.name}</Card.Title>
                <Card.Text className="anom-muted flex-grow-1">{item.summary}</Card.Text>
                <div className="mb-3">
                  <div className="d-flex justify-content-between small anom-muted mb-1">
                    <span>Nivel de rareza</span>
                    <strong>{item.weirdness}/100</strong>
                  </div>
                  <ProgressBar
                    now={item.weirdness}
                    variant={getScoreVariant(item.weirdness)}
                  />
                </div>
                <div className="small anom-muted mb-3">
                  <strong>Escala/distancia:</strong> {item.distance}
                </div>
                <Button variant="outline-warning" onClick={() => setSelected(item)}>
                  Ver explicación
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg">
        <Modal.Header closeButton closeVariant="white" className="border-secondary">
          <Modal.Title className="anom-glow">{selected?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex gap-2 flex-wrap mb-4">
            <Badge bg="warning" text="dark">{selected?.category}</Badge>
            <Badge bg="dark" className="border border-secondary">{selected?.status}</Badge>
            <Badge bg={getScoreVariant(selected?.weirdness || 0)}>
              Rareza {selected?.weirdness}/100
            </Badge>
          </div>

          <h5 className="text-warning">Por qué es raro</h5>
          <p className="text-white-50">{selected?.whyStrange}</p>

          <h5 className="text-warning mt-4">Cómo interpretarlo</h5>
          <p className="text-white-50">{selected?.explanation}</p>

          <div className="bg-dark border border-secondary rounded p-3 mt-4">
            <strong>Escala/distancia:</strong>
            <div className="text-white-50">{selected?.distance}</div>
          </div>

          {selected?.searchQuery && (
            <div className="mt-4">
              <Button
                variant="warning"
                onClick={() => {
                  const q = encodeURIComponent(selected.searchQuery);
                  window.open(`https://images-api.nasa.gov/search?q=${q}&media_type=image`, "_blank");
                }}
              >
                Buscar imágenes NASA
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
