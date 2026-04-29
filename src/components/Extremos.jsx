import React, { useState } from "react";
import { Card, Col, Container, Row, Badge, Modal } from "react-bootstrap";

const extremos = [
  {
    name: "TON 618",
    category: "Más masivo",
    description: "Uno de los agujeros negros más masivos conocidos.",
    value: "66.000 millones de masas solares",
    detail:
      "Su tamaño es tan grande que su horizonte de eventos supera el tamaño de nuestro sistema solar completo.",
  },
  {
    name: "GRB 080916C",
    category: "Más energético",
    description: "Explosión de rayos gamma extremadamente energética.",
    value: "Equivalente a miles de millones de supernovas",
    detail: "En segundos liberó más energía que el Sol en toda su vida.",
  },
  {
    name: "Phoenix A",
    category: "Más grande",
    description: "Agujero negro ultramasivo en un cúmulo de galaxias.",
    value: "~100.000 millones de masas solares",
    detail: "Probablemente uno de los más grandes jamás detectados.",
  },
  {
    name: "Nebulosa Boomerang",
    category: "Más frío",
    description: "El objeto natural más frío conocido.",
    value: "-272 °C",
    detail:
      "Más frío que el fondo cósmico de microondas debido a su rápida expansión.",
  },
  {
    name: "Magnetar SGR 1806-20",
    category: "Campo magnético más fuerte",
    description: "Estrella de neutrones con campo magnético extremo.",
    value: "10¹⁵ veces el de la Tierra",
    detail:
      "Su campo podría borrar tarjetas de crédito desde la mitad del sistema solar.",
  },
  {
    name: "Vacío de Bootes",
    category: "Más vacío",
    description: "Una de las regiones más vacías del universo.",
    value: "~330 millones de años luz",
    detail: "Contiene muy pocas galaxias en comparación con su tamaño.",
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
