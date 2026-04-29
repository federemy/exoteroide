import React, { useState } from "react";
import { Card, Col, Container, Row, Badge, Modal } from "react-bootstrap";

const extremos = [
  {
    name: "TON 618",
    category: "Agujero negro ultramasivo",
    description: "Uno de los agujeros negros más masivos conocidos.",
    value: "~66.000 millones de masas solares",
    detail:
      "Es un cuásar extremadamente lejano y uno de los candidatos más famosos a agujero negro ultramasivo.",
  },
  {
    name: "Phoenix A",
    category: "Agujero negro extremo",
    description: "Candidato a uno de los agujeros negros más masivos.",
    value: "~100.000 millones de masas solares",
    detail:
      "Se ubica en el cúmulo Phoenix y suele citarse entre los objetos más extremos.",
  },
  {
    name: "Sagittarius A*",
    category: "Centro galáctico",
    description: "El agujero negro supermasivo del centro de la Vía Láctea.",
    value: "~4,3 millones de masas solares",
    detail:
      "Está relativamente cerca en términos astronómicos y es clave para estudiar el centro de nuestra galaxia.",
  },
  {
    name: "M87*",
    category: "Primera imagen",
    description: "Primer agujero negro fotografiado directamente.",
    value: "~6.500 millones de masas solares",
    detail: "Su imagen fue obtenida por el Event Horizon Telescope.",
  },
  {
    name: "GRB 221009A",
    category: "Explosión más brillante",
    description:
      "Uno de los estallidos de rayos gamma más brillantes registrados.",
    value: "BOAT: Brightest Of All Time",
    detail:
      "Fue tan intenso que saturó detectores y permitió estudiar explosiones cósmicas extremas.",
  },
  {
    name: "GRB 080916C",
    category: "Explosión energética",
    description:
      "Uno de los estallidos de rayos gamma más extremos observados por Fermi.",
    value: "Energía enorme en minutos",
    detail:
      "NASA lo presentó como una de las explosiones gamma más extremas registradas por Fermi.",
  },
  {
    name: "SGR 1806-20",
    category: "Magnetar extremo",
    description: "Uno de los objetos con campo magnético más intenso.",
    value: "~10¹⁵ gauss",
    detail:
      "Es un magnetar: una estrella de neutrones con un campo magnético brutal.",
  },
  {
    name: "Nebulosa Boomerang",
    category: "Objeto más frío",
    description: "Uno de los lugares naturales más fríos conocidos.",
    value: "~1 K",
    detail: "Está incluso más fría que el fondo cósmico de microondas.",
  },
  {
    name: "Vacío de Bootes",
    category: "Gran vacío cósmico",
    description: "Una región gigantesca con muy pocas galaxias.",
    value: "~330 millones de años luz",
    detail: "Es uno de los vacíos más famosos del universo observable.",
  },
  {
    name: "Gran Atractor",
    category: "Anomalía gravitacional",
    description: "Región que atrae galaxias, incluida la Vía Láctea.",
    value: "~220 millones de años luz",
    detail:
      "NASA describe esta región como dominante gravitacionalmente en nuestro vecindario cósmico.",
  },
  {
    name: "OJ 287",
    category: "Sistema binario extremo",
    description: "Candidato a sistema con dos agujeros negros supermasivos.",
    value: "~18.000 millones de masas solares",
    detail:
      "Es famoso por sus explosiones periódicas y por ser un laboratorio natural de relatividad.",
  },
  {
    name: "Hoag's Object",
    category: "Galaxia extraña",
    description: "Galaxia anular casi perfecta.",
    value: "~100.000 años luz de diámetro",
    detail:
      "Tiene un núcleo central y un anillo de estrellas jóvenes, con una estructura muy poco común.",
  },
  {
    name: "Tabby's Star",
    category: "Estrella anómala",
    description: "Estrella con caídas de brillo extrañas.",
    value: "Oscurecimientos irregulares",
    detail:
      "Se volvió famosa porque su patrón de luz no encajaba fácil con explicaciones simples.",
  },
  {
    name: "WR 102",
    category: "Estrella muy caliente",
    description: "Una estrella Wolf-Rayet extremadamente caliente.",
    value: "~210.000 K",
    detail: "Está entre las estrellas más calientes conocidas.",
  },
  {
    name: "UY Scuti",
    category: "Estrella gigante",
    description: "Una de las estrellas más grandes conocidas por radio.",
    value: ">1.000 radios solares",
    detail:
      "Si estuviera en el lugar del Sol, su borde se extendería más allá de la órbita de Júpiter, según estimaciones.",
  },
  {
    name: "R136a1",
    category: "Estrella masiva",
    description: "Una de las estrellas más masivas conocidas.",
    value: ">200 masas solares",
    detail:
      "Está en la Nebulosa de la Tarántula, en la Gran Nube de Magallanes.",
  },
  {
    name: "PSR J1748-2446ad",
    category: "Púlsar rápido",
    description: "Uno de los púlsares de rotación más rápida conocidos.",
    value: "~716 giros por segundo",
    detail:
      "Gira cientos de veces por segundo, una velocidad difícil de imaginar.",
  },
  {
    name: "HD 189733b",
    category: "Exoplaneta extremo",
    description: "Planeta con clima infernal y lluvia de vidrio.",
    value: "Vientos de miles de km/h",
    detail:
      "Su atmósfera caliente y vientos extremos lo convierten en uno de los exoplanetas más violentos.",
  },
  {
    name: "55 Cancri e",
    category: "Super-Tierra extrema",
    description: "Planeta rocoso muy caliente y cercano a su estrella.",
    value: "Año de ~18 horas",
    detail:
      "Orbita tan cerca de su estrella que su superficie podría estar fundida.",
  },
  {
    name: "TrES-2b",
    category: "Planeta oscuro",
    description: "Uno de los exoplanetas más oscuros detectados.",
    value: "Refleja muy poca luz",
    detail:
      "Absorbe casi toda la luz que recibe, por eso se lo compara con un planeta negro.",
  },
  {
    name: "MACS J0717.5+3745",
    category: "Cúmulo extremo",
    description: "Uno de los cúmulos de galaxias más complejos y masivos.",
    value: "Múltiples cúmulos en colisión",
    detail:
      "Es una región caótica donde enormes estructuras galácticas interactúan.",
  },
  {
    name: "El Gordo",
    category: "Cúmulo masivo",
    description: "Cúmulo de galaxias extremadamente masivo y lejano.",
    value: "ACT-CL J0102-4915",
    detail:
      "Es uno de los cúmulos más masivos observados en el universo distante.",
  },
  {
    name: "GN-z11",
    category: "Galaxia lejana",
    description: "Una de las galaxias más lejanas observadas.",
    value: "Universo muy temprano",
    detail: "Nos muestra cómo eran las galaxias cuando el universo era joven.",
  },
  {
    name: "Fondo Cósmico de Microondas",
    category: "Luz más antigua",
    description: "Radiación fósil del universo temprano.",
    value: "~13.800 millones de años",
    detail: "Es una de las pruebas más importantes del Big Bang.",
  },
];

export default function Extremos() {
  const [selected, setSelected] = useState(null);

  return (
    <Container className="my-5 pt-5">
      <div className="text-center mb-5">
        <Badge bg="dark" className="mb-3 px-3 py-2 border border-danger">
          EXTREMOS DEL UNIVERSO
        </Badge>
        <h1 className="display-4 fw-bold text-white">
          Los límites del universo
        </h1>
        <p className="text-white-50">
          Los objetos y fenómenos más extremos conocidos.
        </p>
      </div>

      <Row className="g-4">
        {extremos.map((e) => (
          <Col md={6} lg={4} key={e.name}>
            <Card
              className="h-100 bg-dark text-white border border-danger"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(e)}
            >
              <Card.Body>
                <Badge bg="danger" className="mb-2">
                  {e.category}
                </Badge>
                <Card.Title>{e.name}</Card.Title>
                <Card.Text className="text-white-50">{e.description}</Card.Text>
                <div className="mt-3 fw-bold text-danger">{e.value}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={!!selected} onHide={() => setSelected(null)} centered>
        <Modal.Header
          closeButton
          closeVariant="white"
          className="bg-dark text-white"
        >
          <Modal.Title>{selected?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p>
            <strong>{selected?.category}</strong>
          </p>
          <p>{selected?.detail}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
