import React, { useState } from "react";
import {
  Container,
  Accordion,
  Row,
  Col,
  Card,
  Badge,
  Form,
  InputGroup,
  Alert,
} from "react-bootstrap";
import moonData from "../data/moons.json";

export function Lunas() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado lógico
  const filteredData = moonData
    .map((planetGroup) => ({
      ...planetGroup,
      moons: planetGroup.moons.filter(
        (moon) =>
          moon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          moon.type.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((group) => group.moons.length > 0);

  return (
    <Container className="my-5 pt-5 text-light">
      <style>{`
        .search-bar { background: rgba(0,0,0,0.5); border: 1px solid #00d4ff; color: white; border-radius: 20px; }
        .search-bar:focus { background: rgba(0,0,0,0.7); color: white; border-color: #ffc107; box-shadow: 0 0 15px rgba(0, 212, 255, 0.3); }
        .moon-accordion .accordion-item { background: rgba(15, 23, 42, 0.5) !important; border: 1px solid rgba(0, 212, 255, 0.2) !important; margin-bottom: 12px; border-radius: 15px !important; overflow: hidden; }
        .accordion-button { background: transparent !important; color: #00d4ff !important; font-weight: bold; font-size: 1.1rem; }
        .accordion-button:not(.collapsed) { color: #ffc107 !important; border-bottom: 1px solid rgba(255,193,7,0.1); }
        .moon-card { background: rgba(10, 15, 25, 0.8) !important; border: 1px solid rgba(0, 212, 255, 0.1); height: 100%; transition: all 0.3s ease; border-radius: 12px; }
        .moon-card:hover { border-color: #00d4ff; transform: translateY(-5px); box-shadow: 0 5px 20px rgba(0, 212, 255, 0.2); }
        .tech-label { font-size: 0.7rem; color: #00d4ff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
        .tech-value { font-family: 'Courier New', Courier, monospace; font-size: 0.9rem; font-weight: bold; color: #fff; }
        .no-moons-box { background: rgba(255, 193, 7, 0.05); border: 1px dashed #ffc107; border-radius: 15px; }
      `}</style>

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-info">Atlas de Satélites</h1>
        <p className="lead opacity-75">
          Explorando los{" "}
          {moonData.reduce((acc, curr) => acc + curr.total_count, 0)} mundos que
          orbitan nuestros planetas.
        </p>

        <Row className="justify-content-center mt-4">
          <Col md={6}>
            <Form.Control
              className="search-bar py-2 px-4"
              placeholder="Buscar luna por nombre o composición..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
      </div>

      {/* CARTEL DE PLANETAS SIN LUNAS */}
      <Alert className="no-moons-box text-light mb-5 p-4 shadow-sm">
        <Row className="align-items-center">
          <Col xs={2} md={1} className="text-center">
            <span style={{ fontSize: "2rem" }}>🚫</span>
          </Col>
          <Col xs={10} md={11}>
            <h5 className="text-warning mb-1">Planetas sin Satélites</h5>
            <p className="small mb-0 opacity-75">
              <strong>Mercurio</strong> y <strong>Venus</strong> son los únicos
              planetas del sistema solar que no poseen lunas. Esto se debe a su
              cercanía al Sol, cuya gravedad atraería y absorbería cualquier
              satélite en órbita.
            </p>
          </Col>
        </Row>
      </Alert>

      <Accordion className="moon-accordion" defaultActiveKey="0">
        {filteredData.map((data, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={idx}>
            <Accordion.Header>
              <div className="d-flex justify-content-between align-items-center w-100 me-3">
                <span>{data.planet}</span>
                <div>
                  <Badge bg="info" text="dark" pill className="me-2">
                    {data.total_count} Lunas Totales
                  </Badge>
                  {data.total_count > 5 && (
                    <Badge bg="secondary" pill style={{ fontSize: "0.7rem" }}>
                      Mostrando las más importantes
                    </Badge>
                  )}
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <p className="text-muted fst-italic mb-4 border-bottom border-secondary pb-3">
                {data.description}
              </p>
              <Row className="g-4">
                {data.moons.map((moon, mIdx) => (
                  <Col lg={6} key={mIdx}>
                    <Card className="moon-card shadow">
                      <Card.Body>
                        <Card.Title className="text-warning fw-bold mb-3">
                          {moon.name}
                        </Card.Title>
                        <Row className="mb-3 g-2">
                          <Col xs={4} className="border-end border-secondary">
                            <div className="tech-label">Diámetro</div>
                            <div className="tech-value">{moon.diameter}</div>
                          </Col>
                          <Col
                            xs={4}
                            className="border-end border-secondary ps-3"
                          >
                            <div className="tech-label">Gravedad</div>
                            <div className="tech-value">{moon.gravity}</div>
                          </Col>
                          <Col xs={4} className="ps-3">
                            <div className="tech-label">Distancia</div>
                            <div className="tech-value">{moon.distance}</div>
                          </Col>
                        </Row>
                        <div className="p-3 rounded bg-black bg-opacity-50 border-start border-info">
                          <div
                            className="text-info x-small fw-bold mb-1 text-uppercase"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Tipo: {moon.type}
                          </div>
                          <p
                            className="small mb-0 text-light opacity-75"
                            style={{ textAlign: "justify" }}
                          >
                            {moon.detail}
                          </p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
