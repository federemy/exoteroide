// src/components/NEOList.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";
import { DiameterChart } from "./DiameterChart.jsx";
import { NEOModal } from "./NEOModal.jsx";

// Distancia media de la Tierra a la Luna en kilómetros
const EARTH_MOON_DISTANCE_KM = 384400;

// Usa tu clave real de la NASA, la DEMO_KEY tiene límites muy estrictos
const API_KEY = "nQJMZwZ9XZYM9MHpL2bwtGb4lpHEmSWICf29wj8p";

// --- Funciones de Utilidad ---
const formatDate = (date) => date.toISOString().split("T")[0];

// Define un rango de 7 días comenzando HOY
const today = new Date();
const futureDate = new Date();
futureDate.setDate(today.getDate() + 7);
const START_DATE = formatDate(today);
const END_DATE = formatDate(futureDate);

// --- Componente Principal ---
export function NEOList() {
  const [allNeos, setAllNeos] = useState([]); // Lista completa sin filtrar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Interacción
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${START_DATE}&end_date=${END_DATE}&api_key=${API_KEY}`;

    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar datos de la NASA.");
        }
        return response.json();
      })
      .then((data) => {
        const flattenedNeos = Object.values(data.near_earth_objects).flat();
        setAllNeos(flattenedNeos);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- Lógica de Filtrado y Ordenamiento ---
  let processedNeos = allNeos.filter((neo) => {
    const matchesHazard = showHazardousOnly
      ? neo.is_potentially_hazardous_asteroid
      : true;
    const matchesSearch = neo.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesHazard && matchesSearch;
  });

  processedNeos.sort((a, b) => {
    if (sortBy === "distance") {
      const distA = parseFloat(
        a.close_approach_data[0].miss_distance.kilometers
      );
      const distB = parseFloat(
        b.close_approach_data[0].miss_distance.kilometers
      );
      return distA - distB; // Más cercano primero
    } else if (sortBy === "size") {
      const sizeA = a.estimated_diameter.kilometers.estimated_diameter_max;
      const sizeB = b.estimated_diameter.kilometers.estimated_diameter_max;
      return sizeB - sizeA; // Más grande primero
    }
    return 0;
  });

  const neosToDisplay = processedNeos.slice(0, itemsPerPage);

  const chartData = neosToDisplay.map((neo) => ({
    name: neo.name,
    diameter:
      (neo.estimated_diameter.kilometers.estimated_diameter_max +
        neo.estimated_diameter.kilometers.estimated_diameter_min) /
      2,
  }));

  // --- Renderizado de Estado ---
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="light" />
        <p className="mt-2 text-light">Buscando asteroides...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">¡Error! {error}</Alert>
      </Container>
    );
  }

  // --- Función de formato ---
  const formatDiameter = (min, max) => {
    const avg = ((min + max) / 2).toFixed(3);
    return `${avg} km (aprox.)`;
  };

  // --- Abrir modal ---
  const openDetail = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 text-warning">
        Objetos Cercanos a la Tierra
      </h1>
      <p className="text-center text-muted">
        Datos para el rango: {START_DATE} a {END_DATE}. Total de asteroides:{" "}
        {allNeos.length}.
      </p>

      {/* Controles de Interacción */}
      <div className="mb-4 p-3 bg-secondary bg-opacity-10 rounded shadow-sm border border-secondary">
        <Form.Control
          type="text"
          placeholder="Buscar asteroide por nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setItemsPerPage(12); // Resetear paginación al buscar
          }}
          className="mb-3"
        />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          {/* Ordenamiento */}
          <div className="btn-group mb-3 mb-md-0" role="group">
            <Button
              variant={sortBy === "distance" ? "info" : "outline-info"}
              onClick={() => setSortBy("distance")}
            >
              Ordenar por Distancia
            </Button>
            <Button
              variant={sortBy === "size" ? "info" : "outline-info"}
              onClick={() => setSortBy("size")}
            >
              Ordenar por Tamaño
            </Button>
          </div>

          {/* Filtro de Peligrosidad */}
          <Button
            variant={showHazardousOnly ? "danger" : "outline-danger"}
            onClick={() => setShowHazardousOnly(!showHazardousOnly)}
            className="py-2 px-3 fw-bold"
          >
            {showHazardousOnly ? "Mostrar Todos" : "Ver Solo Peligrosos"} (
            {processedNeos.length} visibles)
          </Button>
        </div>
      </div>

      {/* Gráfico de Visualización */}
      <DiameterChart data={chartData} />

      {/* Lista de Tarjetas */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {neosToDisplay.map((neo) => (
          <Col key={neo.id}>
            <Card
              bg="dark"
              text="light"
              className={`h-100 shadow hover-scale border ${
                neo.is_potentially_hazardous_asteroid
                  ? "border-danger"
                  : "border-warning"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => openDetail(neo.id)}
            >
              <Card.Header
                className={
                  neo.is_potentially_hazardous_asteroid
                    ? "bg-danger text-light fw-bold"
                    : "bg-warning text-dark fw-bold"
                }
              >
                {neo.name}
              </Card.Header>
              <Card.Body>
                <ul className="list-unstyled small mt-2">
                  <li>
                    <strong>ID:</strong>{" "}
                    <span className="text-muted">{neo.id}</span>
                  </li>
                  <li>
                    <strong>Peligro:</strong>{" "}
                    <span
                      className={
                        neo.is_potentially_hazardous_asteroid
                          ? "text-danger fw-bold"
                          : "text-success"
                      }
                    >
                      {neo.is_potentially_hazardous_asteroid ? "SÍ" : "No"}
                    </span>
                  </li>
                  <li>
                    <strong>Diámetro:</strong>{" "}
                    <span className="text-primary">
                      {formatDiameter(
                        neo.estimated_diameter.kilometers
                          .estimated_diameter_min,
                        neo.estimated_diameter.kilometers.estimated_diameter_max
                      )}
                    </span>
                  </li>
                  <li>
                    <strong>Aprox. Más Cercana:</strong>{" "}
                    <span className="text-light">
                      {neo.close_approach_data[0].close_approach_date}
                    </span>
                  </li>
                  <li>
                    <strong>Distancia (km):</strong>{" "}
                    <span className="text-light">
                      {parseInt(
                        neo.close_approach_data[0].miss_distance.kilometers
                      ).toLocaleString()}{" "}
                      km
                    </span>
                  </li>
                  <li className="mt-3">
                    <strong>Referencia:</strong>{" "}
                    <span className="text-warning fw-bold">
                      {(
                        parseFloat(
                          neo.close_approach_data[0].miss_distance.kilometers
                        ) / EARTH_MOON_DISTANCE_KM
                      ).toFixed(2)}{" "}
                      distancias lunares
                    </span>
                  </li>
                </ul>
              </Card.Body>
              <Card.Footer className="text-muted small text-center">
                Click para ver más detalles
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Botón de Paginación */}
      {neosToDisplay.length < processedNeos.length && (
        <div className="text-center mt-5">
          <Button
            variant="warning"
            size="lg"
            onClick={() => setItemsPerPage((prev) => prev + 12)}
            className="shadow-lg"
          >
            Cargar 12 Asteroides Más (
            {processedNeos.length - neosToDisplay.length} restantes)
          </Button>
        </div>
      )}

      {/* Modal con detalles */}
      <NEOModal
        show={showModal}
        onHide={() => setShowModal(false)}
        neoId={selectedId}
      />
    </Container>
  );
}
