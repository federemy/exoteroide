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

function getIdFromLocation() {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^\d+$/.test(parts[i])) return parts[i];
  }
  return parts[parts.length - 1] || null;
}

export function NEODetail({ neoId: neoIdProp }) {
  const [neo, setNeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const neoId = neoIdProp || getIdFromLocation();

  useEffect(() => {
    if (!neoId) {
      setError("No se pudo determinar el ID del objeto.");
      setLoading(false);
      return;
    }

    const URL = `https://api.nasa.gov/neo/rest/v1/neo/${neoId}?api_key=${API_KEY}`;

    fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al buscar el asteroide.");
        return res.json();
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

  const approach = neo.close_approach_data?.[0];
  const diameter = neo.estimated_diameter?.meters;
  const orbit = neo.orbital_data;

  return (
    <Container className="my-5">
      <h1 className="text-warning text-center mb-4">{neo.name}</h1>

      <Card bg="dark" text="light" className="mb-4 border-warning">
        <Card.Header className="bg-warning text-dark fw-bold">
          🪐 Información general
        </Card.Header>
        <Card.Body>
          <p>
            <strong>ID NASA JPL:</strong> {neo.id}
          </p>
          <p>
            <strong>¿Es potencialmente peligroso?</strong>{" "}
            {neo.is_potentially_hazardous_asteroid ? (
              <Badge bg="danger">Sí ⚠️</Badge>
            ) : (
              <Badge bg="success">No 🟢</Badge>
            )}
          </p>
          <p>
            <strong>Magnitud absoluta (H):</strong> {neo.absolute_magnitude_h}{" "}
            🔭 — Indica qué tan brillante sería el objeto si estuviera a una
            distancia estándar. Cuanto menor el número, más brillante.
          </p>
          <p>
            <strong>Diámetro estimado:</strong>{" "}
            {diameter?.estimated_diameter_min.toFixed(2)}–
            {diameter?.estimated_diameter_max.toFixed(2)} m 📏
          </p>
        </Card.Body>
      </Card>

      <Card bg="dark" text="light" className="mb-4 border-secondary">
        <Card.Header className="bg-secondary text-light fw-bold">
          📍 Datos del último acercamiento
        </Card.Header>
        <Card.Body>
          {approach ? (
            <>
              <p>
                <strong>Fecha:</strong> {approach.close_approach_date_full}
              </p>
              <p>
                <strong>Distancia a la Tierra:</strong>{" "}
                {parseFloat(approach.miss_distance.kilometers).toLocaleString()}{" "}
                km 🌍
              </p>
              <p>
                <strong>Velocidad relativa:</strong>{" "}
                {parseFloat(
                  approach.relative_velocity.kilometers_per_hour
                ).toFixed(0)}{" "}
                km/h 🚀
              </p>
              <p>
                <strong>Cuerpo que orbita:</strong> {approach.orbiting_body}
              </p>
            </>
          ) : (
            <p>No hay datos de acercamiento disponibles.</p>
          )}
        </Card.Body>
      </Card>

      <Card bg="dark" text="light" className="mb-4 border-info">
        <Card.Header className="bg-info text-dark fw-bold">
          🧭 Datos orbitales (NASA)
        </Card.Header>
        <Card.Body>
          {orbit ? (
            <>
              <p>
                <strong>Tipo de órbita:</strong>{" "}
                {orbit.orbit_class?.orbit_class_type} 🌀
              </p>
              <p>
                <strong>Nombre de la clase:</strong>{" "}
                {orbit.orbit_class?.orbit_class_description}
              </p>
              <p>
                <strong>Perihelio (mínima distancia al Sol):</strong>{" "}
                {orbit.perihelion_distance} AU ☀️
              </p>
              <p>
                <strong>Afelio (máxima distancia al Sol):</strong>{" "}
                {orbit.aphelion_distance} AU
              </p>
              <p>
                <strong>Excentricidad orbital:</strong> {orbit.eccentricity}—
                Describe qué tan elíptica es la órbita. Cero es circular.
              </p>
              <p>
                <strong>Inclinación orbital:</strong> {orbit.inclination}° — El
                ángulo respecto al plano de la órbita terrestre.
              </p>
            </>
          ) : (
            <p>No hay datos orbitales disponibles.</p>
          )}
        </Card.Body>
      </Card>

      {neo.nasa_jpl_url && (
        <div className="text-end">
          <a
            href={neo.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-warning"
          >
            🌐 Ver en el sitio de la NASA
          </a>
        </div>
      )}
    </Container>
  );
}
