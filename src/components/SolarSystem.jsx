// src/components/SolarSystem.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Badge,
  ListGroup,
  ButtonGroup,
  Button,
  Form,
} from "react-bootstrap";
import solarData from "../data/solar-system.json";

// --- COMPONENTE INTERNO: SIMULADOR DE GRAVEDAD ---
const GravitySim = ({ gravity, color }) => {
  const [position, setPosition] = useState(0);
  const [isFalling, setIsFalling] = useState(false);
  const requestRef = useRef();

  const startSim = () => {
    setPosition(0);
    setIsFalling(true);
  };

  useEffect(() => {
    if (isFalling) {
      let startTime = null;
      const animate = (time) => {
        if (!startTime) startTime = time;
        const elapsed = (time - startTime) / 1000;
        // Física: y = 0.5 * g * t^2 (ajustado para escala visual)
        const newPos = 0.5 * gravity * Math.pow(elapsed * 2.5, 2) * 20;

        if (newPos < 150) {
          setPosition(newPos);
          requestRef.current = requestAnimationFrame(animate);
        } else {
          setPosition(150);
          setIsFalling(false);
        }
      };
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isFalling, gravity]);

  return (
    <div
      className="bg-black rounded border border-secondary p-2 mt-3 text-center shadow-inner"
      style={{ height: "210px", position: "relative", overflow: "hidden" }}
    >
      <small
        className="text-info opacity-50 d-block"
        style={{ fontSize: "0.6rem" }}
      >
        SIMULADOR DE GRAVEDAD
      </small>
      <div
        className="position-absolute bottom-0 start-0 w-100 bg-secondary"
        style={{ height: "2px", opacity: 0.3 }}
      />

      {/* Pelota / Objeto */}
      <div
        className="rounded-circle position-absolute start-50 translate-middle-x"
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: color,
          top: `${20 + position}px`,
          boxShadow: `0 0 15px ${color}`,
          transition: isFalling ? "none" : "top 0.5s ease-in",
        }}
      />

      <Button
        variant="outline-info"
        size="sm"
        className="position-absolute bottom-0 start-50 translate-middle-x mb-3"
        style={{ fontSize: "0.7rem" }}
        onClick={startSim}
        disabled={isFalling}
      >
        {isFalling ? "Cayendo..." : "Soltar Objeto"}
      </Button>
    </div>
  );
};

// --- COMPONENTE INTERNO: RADAR DE DISTANCIA ---
const DistanceRadar = ({ data, onSelect }) => {
  return (
    <div className="distance-radar-container my-5 p-4 bg-dark rounded border border-secondary shadow">
      <h5 className="text-warning text-center mb-4">
        📍 Radar de Distancia (Escala Relativa)
      </h5>
      <div
        className="position-relative w-100"
        style={{
          height: "70px",
          background: "linear-gradient(90deg, #ffcc00 0%, #000 15%)",
          borderRadius: "35px",
          border: "1px solid #333",
        }}
      >
        {/* El Sol */}
        <div
          className="position-absolute start-0 top-50 translate-middle-y bg-warning rounded-circle"
          style={{
            width: "45px",
            height: "45px",
            left: "-5px",
            zIndex: 2,
            boxShadow: "0 0 25px #ffcc00",
          }}
        />

        {data.map((item, index) => {
          const position = (index / (data.length - 1)) * 88 + 8;
          return (
            <div
              key={item.id}
              className="position-absolute top-50 translate-middle"
              style={{ left: `${position}%`, cursor: "pointer", zIndex: 3 }}
              onClick={() => onSelect(item)}
            >
              <div
                className="rounded-circle border border-light"
                style={{
                  width: "14px",
                  height: "14px",
                  backgroundColor: item.color,
                  boxShadow: `0 0 12px ${item.color}`,
                }}
              />
              <span
                className="position-absolute top-100 start-50 translate-middle-x mt-2 text-light fw-lighter d-none d-md-block"
                style={{ fontSize: "0.65rem", whiteSpace: "nowrap" }}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-muted text-center mt-4 mb-0 small italic">
        * Haz clic en un punto del radar para saltar a los detalles.
      </p>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export function SolarSystem() {
  const [selectedBody, setSelectedBody] = useState(null);
  const [filter, setFilter] = useState("todos");
  const [userWeight, setUserWeight] = useState(70);

  const filteredData = solarData.filter((item) => {
    if (filter === "todos") return true;
    return item.category === filter;
  });

  const calculateWeight = (planetGravity) => {
    return ((userWeight / 9.81) * planetGravity).toFixed(1);
  };

  return (
    <Container className="my-5 pt-5">
      <header className="text-center mb-5">
        <h1 className="display-4 text-warning fw-bold mb-3">
          Explorador del Sistema Solar
        </h1>

        <div className="bg-dark border border-warning rounded p-3 d-inline-block shadow-sm">
          <Form.Label className="text-warning small mb-1 d-block">
            Tu peso en la Tierra (kg):
          </Form.Label>
          <Form.Control
            type="number"
            value={userWeight}
            onChange={(e) => setUserWeight(e.target.value)}
            className="bg-black text-warning border-warning text-center fw-bold mx-auto"
            style={{ width: "100px" }}
          />
        </div>

        <DistanceRadar data={solarData} onSelect={setSelectedBody} />

        <div className="mt-2">
          <ButtonGroup className="shadow-sm">
            <Button
              variant={filter === "todos" ? "warning" : "outline-warning"}
              onClick={() => setFilter("todos")}
            >
              Todos
            </Button>
            <Button
              variant={filter === "planeta" ? "warning" : "outline-warning"}
              onClick={() => setFilter("planeta")}
            >
              Planetas
            </Button>
            <Button
              variant={filter === "planetoide" ? "warning" : "outline-warning"}
              onClick={() => setFilter("planetoide")}
            >
              Planetas Enanos
            </Button>
          </ButtonGroup>
        </div>
      </header>

      <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
        {filteredData.map((item) => (
          <Col key={item.id}>
            <Card
              bg="dark"
              text="light"
              className="h-100 border-secondary hover-scale shadow-lg"
              onClick={() => setSelectedBody(item)}
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
            >
              <Card.Body className="d-flex flex-column align-items-center">
                <div
                  className="mb-3 rounded-circle"
                  style={{
                    width: "90px",
                    height: "90px",
                    background: `radial-gradient(circle at 30% 30%, ${item.color}, #000)`,
                    boxShadow: `0 0 20px ${item.color}44`,
                  }}
                />
                <Card.Title className="fs-4 fw-bold">{item.name}</Card.Title>
                <div className="text-info fw-bold mb-2">
                  ⚖️ {calculateWeight(item.gravity)} kg
                </div>
                <Badge
                  bg={item.category === "planeta" ? "info" : "warning"}
                  className="text-dark mb-2"
                >
                  {item.type}
                </Badge>
                <Card.Text className="text-center small opacity-75">
                  {item.description.substring(0, 70)}...
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        show={!!selectedBody}
        onHide={() => setSelectedBody(null)}
        centered
        size="lg"
      >
        {selectedBody && (
          <>
            <Modal.Header
              closeButton
              className="bg-dark text-light border-warning"
            >
              <Modal.Title className="text-warning">
                🔎 {selectedBody.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark text-light p-4">
              <Row>
                <Col md={5} className="text-center mb-4">
                  <div
                    className="mx-auto rounded-circle mb-3 shadow-lg"
                    style={{
                      width: "200px",
                      height: "200px",
                      background: `radial-gradient(circle at 30% 30%, ${selectedBody.color}, #000)`,
                      boxShadow: `0 0 50px ${selectedBody.color}55`,
                    }}
                  />

                  {/* SIMULADOR DE GRAVEDAD INTEGRADO AQUÍ */}
                  <GravitySim
                    gravity={selectedBody.gravity}
                    color={selectedBody.color}
                  />

                  <div className="p-2 border border-info rounded mt-3 bg-info bg-opacity-10">
                    <small
                      className="text-info d-block fw-bold text-uppercase"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Misión Principal
                    </small>
                    <span className="small fw-bold">
                      {selectedBody.main_mission}
                    </span>
                  </div>
                </Col>
                <Col md={7}>
                  <p className="lead border-start border-warning ps-3">
                    {selectedBody.description}
                  </p>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="bg-transparent text-light border-secondary py-1 ps-0">
                      🚀 <strong>Distancia al Sol:</strong>{" "}
                      {selectedBody.distance_sun}
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary py-1 ps-0">
                      🌡️ <strong>Temperatura:</strong>{" "}
                      {selectedBody.temperature}
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary py-1 ps-0">
                      ✈️ <strong>Vuelo en Avión:</strong>{" "}
                      {selectedBody.travel_time}
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary py-1 ps-0">
                      📏 <strong>Escala:</strong> {selectedBody.scale_info}
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent text-light border-secondary py-1 ps-0">
                      🦘 <strong>Tu salto sería:</strong>{" "}
                      {(1 / (selectedBody.gravity / 9.81)).toFixed(2)} metros
                    </ListGroup.Item>
                  </ListGroup>

                  {/* GUÍA DE AVISTAMIENTO (STARGAZING) */}
                  <div
                    className="mt-4 p-3 rounded"
                    style={{
                      backgroundColor: "#1a1a2e",
                      border: "1px solid #2271B3",
                    }}
                  >
                    <h6
                      className="text-primary fw-bold mb-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      🔭 GUÍA DE AVISTAMIENTO
                    </h6>
                    <p className="small mb-0 opacity-75 italic">
                      {selectedBody.category === "planeta" &&
                      !["uranus", "neptune"].includes(selectedBody.id)
                        ? `Visible a simple vista desde la Tierra. Busca un punto ${
                            selectedBody.id === "mars"
                              ? "rojizo"
                              : "muy brillante"
                          } que no titila.`
                        : "Solo visible a través de telescopios debido a su magnitud o distancia."}
                    </p>
                  </div>

                  <div className="mt-3 p-3 border border-warning rounded bg-warning bg-opacity-10">
                    <h6 className="text-warning fw-bold mb-1">
                      ✨ SABÍAS QUE...
                    </h6>
                    <p className="mb-0 text-light small">
                      {selectedBody.curiosity}
                    </p>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
}
