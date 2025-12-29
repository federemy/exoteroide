// src/components/LiveSpace.jsx
import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

export function LiveSpace() {
  return (
    <Container className="my-5 pt-5 text-light">
      <style>{`
        .pulse {
          animation: pulse-red 2s infinite;
          box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
        }
        .glass-card {
          background: rgba(15, 15, 15, 0.85) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .iss-container {
            filter: invert(0.9) hue-rotate(180deg) brightness(0.8);
            border-radius: 8px;
        }
      `}</style>

      <div className="text-center mb-5">
        <Badge bg="danger" className="mb-3 px-3 py-2 pulse">
          🔴 SEÑAL EN VIVO
        </Badge>
        <h1 className="display-4 fw-bold text-warning">Centro de Vigilancia</h1>
        <p className="lead opacity-75">
          Monitoreo de telemetría y misiones en tiempo real.
        </p>
      </div>

      <Row className="g-4">
        {/* PANEL IZQUIERDO: RASTREADOR DE LA ISS */}
        <Col lg={8}>
          <Card
            bg="dark"
            className="border-secondary h-100 shadow-lg glass-card"
          >
            <Card.Header className="bg-dark border-secondary d-flex justify-content-between align-items-center">
              <span className="fw-bold text-info">
                🛰️ Posición de la ISS (Real-Time)
              </span>
              <Badge bg="info">Vía Satélite</Badge>
            </Card.Header>
            <Card.Body
              className="p-0 overflow-hidden"
              style={{ minHeight: "500px" }}
            >
              {/* Usamos una fuente de tracking más estable para evitar el 404 */}
              <iframe
                src="https://isstracker.pl/en/embed"
                width="100%"
                height="500px"
                style={{ border: 0 }}
                className="iss-container"
                title="ISS Tracker"
              />
            </Card.Body>
            <Card.Footer className="bg-dark border-top border-secondary small text-muted">
              La Estación Espacial Internacional orbita a unos 400km de altura.
            </Card.Footer>
          </Card>
        </Col>

        {/* PANEL DERECHO: NASA TV Y EVENTOS */}
        <Col lg={4}>
          <Row className="g-4">
            {/* NASA TV STREAM CORREGIDO */}
            <Col xs={12}>
              <Card bg="dark" className="border-danger shadow-lg glass-card">
                <Card.Header className="text-danger fw-bold d-flex align-items-center">
                  <div
                    className="spinner-grow spinner-grow-sm me-2 text-danger"
                    role="status"
                  ></div>
                  NASA TV Live
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="ratio ratio-16x9">
                    {/* URL robusta usando el ID del canal oficial de NASA */}
                    <iframe
                      src="https://www.youtube.com/embed/live_stream?channel=UCCYq-WbcT8nO-X0Ems3_v8g&autoplay=1&mute=1&rel=0"
                      title="NASA Live Stream"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* PRÓXIMOS LANZAMIENTOS */}
            <Col xs={12}>
              <Card bg="dark" className="border-warning glass-card">
                <Card.Body>
                  <h6
                    className="text-warning fw-bold mb-3 border-bottom border-warning pb-2 text-uppercase"
                    style={{ fontSize: "0.8rem" }}
                  >
                    🚀 Próximas Ventanas
                  </h6>
                  <div className="small">
                    <div className="mb-3">
                      <span className="text-info d-block fw-bold">
                        SpaceX Starlink
                      </span>
                      <small className="text-muted d-block mt-n1">
                        Cabo Cañaveral, FL
                      </small>
                    </div>
                    <div className="mb-3">
                      <span className="text-info d-block fw-bold">
                        NASA Crew-10
                      </span>
                      <small className="text-muted d-block mt-n1">
                        Kennedy Space Center
                      </small>
                    </div>
                    <div>
                      <span className="text-info d-block fw-bold">
                        Rocket Lab
                      </span>
                      <small className="text-muted d-block mt-n1">
                        Electron Launch
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* CURIOSIDAD EN VIVO */}
            <Col xs={12}>
              <div className="p-3 rounded border border-info bg-info bg-opacity-10 text-center">
                <h6 className="text-info small fw-bold mb-1">DATO ACTUAL</h6>
                <p className="small mb-0 opacity-75">
                  Hay 7 astronautas a bordo de la ISS en este momento.
                </p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="mt-5 p-3 bg-black rounded border border-secondary text-center">
        <p className="x-small text-muted mb-0" style={{ fontSize: "0.7rem" }}>
          Sistemas de telemetría global. Los datos pueden tener un retraso de 3
          a 5 segundos según la conexión orbital.
        </p>
      </div>
    </Container>
  );
}
