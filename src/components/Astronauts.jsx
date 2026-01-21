import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Modal,
  Button,
  ListGroup,
} from "react-bootstrap";

export function Astronauts() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAstro, setSelectedAstro] = useState(null);

  useEffect(() => {
    // API Profesional con certificado SSL (Segura para Netlify)
    fetch("https://ll.thespacedevs.com/2.2.0/astronaut/?in_space=true")
      .then((res) => {
        if (!res.ok) throw new Error("Error de conexión");
        return res.json();
      })
      .then((data) => {
        setPeople(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fallo de telemetría:", err);
        setLoading(false);
      });
  }, []);

  // Cálculos dinámicos para el bloque de resumen
  const stats = {
    total: people.length,
    iss: people.filter((a) =>
      a.flights?.[a.flights.length - 1]?.spacestation?.name?.includes(
        "International Space Station",
      ),
    ).length,
    tiangong: people.filter((a) =>
      a.flights?.[a.flights.length - 1]?.spacestation?.name?.includes(
        "Tiangong",
      ),
    ).length,
    agencies: [...new Set(people.map((a) => a.agency?.abbrev))].filter(Boolean),
  };

  return (
    <Container className="my-5 pt-5 text-light">
      <style>{`
        .astro-card {
          background: rgba(15, 23, 42, 0.7) !important;
          border: 1px solid rgba(0, 212, 255, 0.2) !important;
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border-radius: 15px;
          overflow: hidden;
        }
        .astro-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: #00d4ff !important;
          box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
        }
        .img-container { height: 260px; overflow: hidden; position: relative; }
        .astro-img { width: 100%; height: 100%; object-fit: cover; }
        .summary-card {
          background: linear-gradient(145deg, #0f172a, #1e293b) !important;
          border: 1px solid #00d4ff !important;
          border-radius: 20px;
        }
        .stat-number { font-size: 3rem; font-weight: bold; color: #00d4ff; line-height: 1; }
        .modal-content { 
          background: #0b0e14 !important; 
          color: white !important; 
          border: 1px solid #00d4ff !important;
          box-shadow: 0 0 50px rgba(0, 212, 255, 0.2);
        }
        .modal-header { border-bottom: 1px solid rgba(0, 212, 255, 0.1); }
        .modal-footer { border-top: 1px solid rgba(0, 212, 255, 0.1); }
        .text-cyan { color: #00d4ff; }
      `}</style>

      <div className="text-center mb-5">
        <Badge bg="danger" className="mb-2 px-3 py-2">
          SISTEMA DE RASTREO EN VIVO
        </Badge>
        <h1 className="display-4 fw-bold">Humanos en Órbita</h1>
        <p className="lead opacity-75">
          Haz clic en cualquier perfil para ver el expediente detallado del
          astronauta.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="info" />
          <p className="text-info mt-3 font-monospace">
            CONECTANDO CON LA RED DEEP SPACE...
          </p>
        </div>
      ) : (
        <>
          <Row className="g-4 mb-5">
            {people.map((astro) => {
              const lastFlight = astro.flights?.[astro.flights.length - 1];
              return (
                <Col key={astro.id} md={6} lg={4} xl={3}>
                  <Card
                    className="astro-card h-100 shadow"
                    onClick={() => setSelectedAstro(astro)}
                  >
                    <div className="img-container">
                      <Card.Img
                        src={astro.profile_image}
                        className="astro-img"
                        alt={astro.name}
                      />
                    </div>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{astro.name}</h6>
                        <Badge bg="info" text="dark">
                          {astro.agency?.abbrev}
                        </Badge>
                      </div>
                      <div className="small text-cyan mb-2">
                        {lastFlight?.spacestation?.name || "Nave en tránsito"}
                      </div>
                      <div className="d-flex justify-content-between small opacity-50">
                        <span>{astro.nationality}</span>
                        <span>{astro.status?.name}</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* SECCIÓN DE RESUMEN TÉCNICO */}
          <Card className="summary-card p-4 mb-5 shadow-lg">
            <Row className="align-items-center text-center">
              <Col md={12} className="mb-4">
                <h3 className="text-info text-uppercase fw-bold letter-spacing-2">
                  Resumen de Población Orbital
                </h3>
                <hr className="border-secondary mx-auto w-25" />
              </Col>
              <Col md={4} className="mb-3">
                <div className="stat-number">{stats.total}</div>
                <div className="text-uppercase small opacity-75 mt-2">
                  Seres Humanos en el Espacio
                </div>
              </Col>
              <Col
                md={4}
                className="mb-3 border-start border-end border-secondary"
              >
                <div className="h5 text-white mb-3">
                  Distribución por Estación
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <div>
                    <div className="h4 mb-0 text-primary">{stats.iss}</div>
                    <small className="opacity-50">ISS</small>
                  </div>
                  <div className="border-start border-secondary ps-3">
                    <div className="h4 mb-0 text-danger">{stats.tiangong}</div>
                    <small className="opacity-50">Tiangong</small>
                  </div>
                </div>
              </Col>
              <Col md={4} className="mb-3">
                <div className="text-uppercase small opacity-75 mb-2">
                  Agencias en Órbita
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {stats.agencies.map((agency) => (
                    <Badge
                      key={agency}
                      pill
                      bg="dark"
                      className="border border-info text-info"
                    >
                      {agency}
                    </Badge>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </>
      )}

      {/* MODAL DE INFORMACIÓN 100% COMPLETO */}
      <Modal
        show={!!selectedAstro}
        onHide={() => setSelectedAstro(null)}
        size="lg"
        centered
        contentClassName="modal-content"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-info fw-bold">
            {selectedAstro?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row>
            <Col md={5} className="text-center mb-4 mb-md-0">
              <img
                src={selectedAstro?.profile_image}
                className="img-fluid rounded border border-info shadow-lg"
                style={{ maxHeight: "400px", objectFit: "cover" }}
                alt="Profile"
              />
              <div className="mt-3 p-3 rounded bg-dark border border-secondary text-start">
                <div className="mb-2">
                  <strong>Nacionalidad:</strong> {selectedAstro?.nationality}
                </div>
                <div className="mb-2">
                  <strong>Agencia:</strong> {selectedAstro?.agency?.name}
                </div>
                <div className="mb-2">
                  <strong>Estado:</strong>{" "}
                  <Badge bg="success">{selectedAstro?.status?.name}</Badge>
                </div>
                <div>
                  <strong>Fecha Nac.:</strong>{" "}
                  {selectedAstro?.date_of_birth || "No disponible"}
                </div>
              </div>
            </Col>
            <Col md={7}>
              <h5 className="text-info mb-3">Biografía del Tripulante</h5>
              <div
                className="small opacity-75 mb-4"
                style={{ textAlign: "justify", lineHeight: "1.6" }}
              >
                {selectedAstro?.bio ||
                  "No hay biografía disponible en los registros actuales."}
              </div>

              <h5 className="text-info mb-3">Detalles de Misión</h5>
              <ListGroup variant="flush" className="bg-transparent">
                <ListGroup.Item className="bg-transparent text-white border-secondary ps-0">
                  <span className="text-muted">Nave actual:</span>
                  <br />
                  {selectedAstro?.flights?.[selectedAstro?.flights?.length - 1]
                    ?.name || "Desconocida"}
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent text-white border-secondary ps-0">
                  <span className="text-muted">Destino orbital:</span>
                  <br />
                  {selectedAstro?.flights?.[selectedAstro?.flights?.length - 1]
                    ?.spacestation?.name || "Órbita Baja Terrestre"}
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent text-white border-secondary ps-0">
                  <span className="text-muted">Tipo de Agencia:</span>
                  <br />
                  {selectedAstro?.agency?.type || "Gubernamental"}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-info" onClick={() => setSelectedAstro(null)}>
            Cerrar Expediente
          </Button>
          {selectedAstro?.wiki && (
            <Button
              variant="info"
              onClick={() => window.open(selectedAstro.wiki, "_blank")}
            >
              Ver en Wikipedia
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
