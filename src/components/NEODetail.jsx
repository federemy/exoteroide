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

// Helper: obtiene el ID desde la URL si no viene por prop
function getIdFromLocation() {
  if (typeof window === "undefined") return null;
  // Soporta /neo/123 y también /neo/lo/que/sea/123 (catch-all)
  const parts = window.location.pathname.split("/").filter(Boolean);
  // Busca el último segmento numérico razonable
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^\d+$/.test(parts[i])) return parts[i];
  }
  // fallback: último segmento
  return parts[parts.length - 1] || null;
}

export function NEODetail({ neoId: neoIdProp }) {
  const [neo, setNeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Permite usar prop o URL
  const neoId = neoIdProp || getIdFromLocation();

  useEffect(() => {
    if (!neoId) {
      setError("No se pudo determinar el ID del objeto.");
      setLoading(false);
      return;
    }

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
        setError(err.message || "Error desconocido");
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

  const approachData =
    Array.isArray(neo.close_approach_data) && neo.close_approach_data.length > 0
      ? neo.close_approach_data[0]
      : null;

  const diameterMax =
    neo?.estimated_diameter?.meters?.estimated_diameter_max ?? null;

  const diameterMaxPretty =
    typeof diameterMax === "number"
      ? diameterMax.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : "—";

  const relVelKms = approachData
    ? Number(approachData.relative_velocity?.kilometers_per_second || 0)
    : null;

  const relVelPretty =
    typeof relVelKms === "number"
      ? relVelKms.toLocaleString(undefined, { maximumFractionDigits: 3 })
      : "—";

  const missKm = approachData
    ? Number(approachData.miss_distance?.kilometers || 0)
    : null;

  const missKmPretty =
    typeof missKm === "number" ? Math.round(missKm).toLocaleString() : "—";

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-light" href="/" className="d-none d-md-block">
          ← Volver a la Lista
        </Button>
        <h1 className="text-warning fs-2 text-center m-0">{neo.name}</h1>
        <div style={{ width: "100px" }} className="d-none d-md-block" />
      </div>

      <Card bg="dark" text="light" className="shadow border-warning">
        <Card.Header className="bg-warning text-dark h3 fw-bold">
          Detalles Orbitales y Físicos
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush" className="mt-3">
            <ListGroup.Item className="bg-dark text-light border-secondary">
              <strong>ID NASA JPL:</strong>
              <span className="ms-2 text-muted">{neo.id}</span>
            </ListGroup.Item>

            <ListGroup.Item className="bg-dark text-light border-secondary">
              <strong>Potencialmente Peligroso:</strong>
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
              <strong>Diámetro Máx. (m):</strong>
              <span className="ms-2 text-info">{diameterMaxPretty} m</span>
            </ListGroup.Item>

            <ListGroup.Item className="bg-dark text-light border-secondary">
              <strong>Última Aproximación:</strong>
              <span className="ms-2 text-info">
                {approachData?.close_approach_date_full || "—"}
              </span>
            </ListGroup.Item>

            <ListGroup.Item className="bg-dark text-light border-secondary">
              <strong>Velocidad Relativa (km/s):</strong>
              <span className="ms-2 text-info">{relVelPretty} km/s</span>
            </ListGroup.Item>

            <ListGroup.Item className="bg-dark text-light border-secondary">
              <strong>Distancia (km desde la Tierra):</strong>
              <span className="ms-2 text-info">{missKmPretty} km</span>
            </ListGroup.Item>

            <ListGroup.Item className="bg-dark text-light border-secondary">
              <strong>Cuerpo Orbital:</strong>
              <span className="ms-2 text-info">
                {approachData?.orbiting_body || "—"}
              </span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>

        <Card.Footer className="text-end">
          {neo.nasa_jpl_url && (
            <a
              href={neo.nasa_jpl_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-warning"
            >
              Ver Órbita Completa en NASA JPL
            </a>
          )}
        </Card.Footer>
      </Card>

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
              Este asteroide ha sido clasificado como{" "}
              <strong>Potencialmente Peligroso (PHA)</strong> porque cumple con
              una combinación de criterios de <strong>tamaño</strong> y{" "}
              <strong>distancia</strong> establecidos por la NASA.
            </p>
            <ul className="list-unstyled">
              <li>
                <strong className="text-danger">1. Tamaño:</strong> Se estima
                que su diámetro es superior a los <strong>150 metros</strong>.
              </li>
              <li>
                <strong className="text-danger">2. Distancia:</strong> Su órbita
                se acerca a menos de <strong>7.5 millones de kilómetros</strong>
                de la órbita de la Tierra.
              </li>
            </ul>
            <p className="mb-0">
              Esta clasificación no implica un riesgo inminente; es una
              designación para seguimiento continuo.
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
