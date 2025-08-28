// src/components/NEODetail.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Spinner,
  Alert,
  ListGroup,
  Badge,
  Button,
} from "react-bootstrap";

const API_KEY = "nQJMZwZ9XZYM9MHpL2bwtGb4lpHEmSWICf29wj8p";

export function NEODetail({ neoId }) {
  const [neo, setNeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const URL = `https://api.nasa.gov/neo/rest/v1/neo/${neoId}?api_key=${API_KEY}`;

    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo encontrar el objeto con ID: ${neoId}.`);
        }
        return response.json();
      })
      .then((data) => {
        setNeo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [neoId]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="light" />
        <p className="text-light mt-2">Cargando detalles...</p>
      </Container>
    );
  }

  if (error || !neo) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          Error al cargar: {error || "Objeto no encontrado."}
        </Alert>
      </Container>
    );
  }

  const approachData = neo.close_approach_data[0];

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-light" href="/" className="d-none d-md-block">
          ← Volver a la Lista
        </Button>
        <h1 className="text-warning fs-2 text-center m-0">
          {neo.name} ({neo.designation})
        </h1>
        <div style={{ width: "100px" }} className="d-none d-md-block"></div>
      </div>

      <Card bg="dark" text="light" className="shadow border-warning">
        <Card.Header className="bg-warning text-dark h3 fw-bold">
          Detalles Orbitales y Físicos
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush" className="mt-3">
            <ListGroup.Item className="bg-dark text-light border-secondary">
              **ID NASA JPL:** <span className="ms-2 text-muted">{neo.id}</span>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-light border-secondary">
              **Potencialmente Peligroso:**{" "}
              <Badge
                bg={
                  neo.is_potentially_hazardous_asteroid ? "danger" : "success"
                }
                className="ms-2 p-2"
              >
                {neo.is_potentially_hazardous_asteroid ? "SÍ" : "NO"}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-light border-secondary">
              **Diámetro Máx. (metros):**{" "}
              <span className="ms-2 text-info">
                {neo.estimated_diameter.meters.estimated_diameter_max
                  .toFixed(2)
                  .toLocaleString()}{" "}
                m
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-light border-secondary">
              **Última Aproximación:**{" "}
              <span className="ms-2 text-info">
                {approachData.close_approach_date_full}
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-light border-secondary">
              **Velocidad Relativa (km/s):**{" "}
              <span className="ms-2 text-info">
                {parseFloat(
                  approachData.relative_velocity.kilometers_per_second
                ).toFixed(3)}{" "}
                km/s
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-light border-secondary">
              **Distancia (Km desde la Tierra):**{" "}
              <span className="ms-2 text-info">
                {parseInt(
                  approachData.miss_distance.kilometers
                ).toLocaleString()}{" "}
                km
              </span>
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-light border-secondary">
              **Cuerpo Orbital:**{" "}
              <span className="ms-2 text-info">
                {approachData.orbiting_body}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        <Card.Footer className="text-end">
          <a
            href={neo.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-warning"
          >
            Ver Órbita Completa en NASA JPL
          </a>
        </Card.Footer>
      </Card>

      {/* --- BLOQUE DE EXPLICACIÓN PARA ASTEROIDES PELIGROSOS --- */}
      {neo.is_potentially_hazardous_asteroid && (
        <Card
          bg="dark"
          text="light"
          className="my-5 shadow-sm border border-danger"
        >
          <Card.Header className="bg-danger text-light fw-bold">
            ⚠️ ¿Por qué este asteroide es considerado "Peligroso"?
          </Card.Header>
          <Card.Body>
            <p>
              Este asteroide ha sido clasificado como **Potencialmente Peligroso
              (PHA)** porque cumple con una combinación de criterios de **tamaño
              y distancia** establecidos por la NASA.
            </p>
            <ul className="list-unstyled">
              <li>
                <strong className="text-danger">1. Tamaño:</strong> Se estima
                que su diámetro es superior a los <strong>150 metros</strong>.
              </li>
              <li>
                <strong className="text-danger">2. Distancia:</strong> Su órbita
                se acerca a menos de <strong>7.5 millones de kilómetros</strong>{" "}
                de la órbita de la Tierra, lo que se considera un acercamiento
                significativo.
              </li>
            </ul>
            <p className="mb-0">
              Esta clasificación no implica un riesgo inminente, sino que es una
              designación para objetos que requieren un monitoreo continuo.
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
