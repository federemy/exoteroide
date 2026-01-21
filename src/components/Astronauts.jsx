// src/components/Astronauts.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  ListGroup,
} from "react-bootstrap";

export function Astronauts() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mantenemos tu base de datos de nacionalidades y roles
  const extraInfo = {
    "Chris Williams": {
      flag: "🇺🇸",
      country: "EE.UU.",
      role: "Ingeniero de Vuelo (NASA)",
    },
    "Sergey Kud-Sverchkov": {
      flag: "🇷🇺",
      country: "Rusia",
      role: "Comandante (Roscosmos)",
    },
    "Sergei Mikaev": {
      flag: "🇷🇺",
      country: "Rusia",
      role: "Ingeniero de Vuelo (Roscosmos)",
    },
    "Zhang Lu": { flag: "🇨🇳", country: "China", role: "Comandante (CNSA)" },
    "Wu Fei": { flag: "🇨🇳", country: "China", role: "Operador (CNSA)" },
    "Zhang Hongzhang": {
      flag: "🇨🇳",
      country: "China",
      role: "Especialista (CNSA)",
    },
    "Oleg Kononenko": {
      flag: "🇷🇺",
      country: "Rusia",
      role: "Cosmonauta (Récord de permanencia)",
    },
    "Sunita Williams": {
      flag: "🇺🇸",
      country: "EE.UU.",
      role: "Astronauta NASA",
    },
    "Butch Wilmore": { flag: "🇺🇸", country: "EE.UU.", role: "Astronauta NASA" },
    "Nick Hague": { flag: "🇺🇸", country: "EE.UU.", role: "Especialista NASA" },
    "Aleksandr Gorbunov": {
      flag: "🇷🇺",
      country: "Rusia",
      role: "Ingeniero Roscosmos",
    },
  };

  // Datos de misiones futuras para la nueva sección
  const futureMissions = [
    {
      mission: "SpaceX Crew-12",
      date: "Marzo 2026",
      goal: "Relevo ISS",
      crew: "4 personas",
    },
    {
      mission: "Artemis III",
      date: "Septiembre 2026",
      goal: "Alunizaje (Polo Sur)",
      crew: "4 personas",
    },
    {
      mission: "Shenzhou 22",
      date: "Junio 2026",
      goal: "Rotación Tiangong",
      crew: "3 personas",
    },
  ];

  useEffect(() => {
    fetch("http://api.open-notify.org/astros.json")
      .then((res) => res.json())
      .then((data) => {
        setPeople(data.people);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <Container className="my-5 pt-5 text-light">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03) !important;
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          transition: transform 0.3s ease;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 193, 7, 0.5) !important;
        }
        .astro-icon {
          font-size: 2.5rem;
          background: rgba(255, 193, 7, 0.1);
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .future-card {
          border-left: 4px solid #ffc107 !important;
          background: rgba(255, 193, 7, 0.05) !important;
        }
      `}</style>

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-warning mb-2">
          Humanos en Órbita
        </h1>
        <p className="lead opacity-75">
          Actualmente hay{" "}
          <span className="text-info fw-bold">{people.length}</span> embajadores
          de la Tierra en gravedad cero.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <>
          {/* SECCIÓN 1: TARJETAS DE ASTRONAUTAS (LO QUE YA TENÍAS) */}
          <Row xs={1} md={2} lg={3} className="g-4 mb-5">
            {people.map((person, index) => {
              const info = extraInfo[person.name] || {
                flag: "🏳️‍🚀",
                country: "Internacional",
                role: "Especialista de Misión",
              };
              return (
                <Col key={index}>
                  <Card className="h-100 glass-card text-light">
                    <Card.Body className="d-flex align-items-center">
                      <div className="astro-icon me-3">👨‍🚀</div>
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <h5
                            className="mb-0 fw-bold"
                            style={{ fontSize: "1.1rem" }}
                          >
                            {person.name}
                          </h5>
                          <span
                            style={{ fontSize: "1.5rem" }}
                            title={info.country}
                          >
                            {info.flag}
                          </span>
                        </div>
                        <div className="small text-info mb-1">
                          {person.craft} Station
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                          }}
                        >
                          {info.role}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <hr className="border-secondary my-5 opacity-25" />

          {/* SECCIÓN 2: INFORMACIÓN ADICIONAL Y FUTURO (LO NUEVO) */}
          <Row className="g-4">
            {/* ESTADÍSTICAS */}
            <Col lg={6}>
              <h3 className="text-warning mb-4 fw-bold d-flex align-items-center">
                <span className="me-2">📊</span> Estadísticas de Misión
              </h3>
              <Card bg="dark" className="border-secondary glass-card h-100">
                <ListGroup variant="flush">
                  <ListGroup.Item className="bg-transparent text-light border-secondary p-3">
                    <strong className="text-info">Rotación actual:</strong>{" "}
                    Expedición 74 (ISS) y Shenzhou 21 (Tiangong).
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent text-light border-secondary p-3">
                    <strong className="text-info">Permanencia habitual:</strong>{" "}
                    182 días en promedio por tripulante.
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent text-light border-secondary p-3">
                    <strong className="text-info">Récord histórico:</strong>{" "}
                    Valeri Polyakov (437 días seguidos) y Oleg Kononenko (+1000
                    días totales).
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-transparent text-light border-secondary p-3 small opacity-75">
                    * Los astronautas experimentan 16 amaneceres y atardeceres
                    cada 24 horas.
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            {/* FUTURO */}
            <Col lg={6}>
              <h3 className="text-warning mb-4 fw-bold d-flex align-items-center">
                <span className="me-2">🚀</span> Próximos Humanos al Espacio
              </h3>
              {futureMissions.map((m, i) => (
                <Card
                  key={i}
                  className="mb-3 glass-card future-card text-light border-0"
                >
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold text-warning">{m.mission}</div>
                      <small className="opacity-75">{m.goal}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg="warning" text="dark">
                        {m.date}
                      </Badge>
                      <div
                        className="mt-1 fw-light"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {m.crew}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
