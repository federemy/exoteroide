// src/components/ExoplanetList.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Card,
  Table,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

// Importa el archivo de datos local
import staticExoplanets from "../data/exoplanet-data.json";

// Función para convertir Kelvin a Celsius
const convertKelvinToCelsius = (kelvin) => {
  if (kelvin === null || isNaN(kelvin)) {
    return "N/A";
  }
  return (parseFloat(kelvin) - 273.15).toFixed(2);
};

// Función que evalúa la habitabilidad y devuelve una razón
const getHabitabilityReason = (planet) => {
  const radius = parseFloat(planet.pl_rade);
  const temp = parseFloat(planet.pl_eqt);

  const hasData = !isNaN(radius) && !isNaN(temp);
  const isEarthSized = hasData && radius >= 0.5 && radius <= 2;
  // Criterio de temperatura en Kelvin (270 K a 320 K)
  const isTemperate = hasData && temp >= 270 && temp <= 320;

  if (!hasData) {
    return "Datos faltantes";
  }
  if (isEarthSized && isTemperate) {
    return "Cumple criterios de tamaño y temperatura";
  }
  if (!isEarthSized && isTemperate) {
    return "Radio inadecuado";
  }
  if (isEarthSized && !isTemperate) {
    return "Temperatura inadecuada";
  }
  return "No cumple ningún criterio";
};

export function ExoplanetList() {
  const [exoplanets, setExoplanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controlar el ordenamiento
  const [sortColumn, setSortColumn] = useState("pl_name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Estado para el filtro de habitabilidad
  const [showHabitableOnly, setShowHabitableOnly] = useState(false);

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Nuevos estados para el modal de detalles
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  useEffect(() => {
    if (staticExoplanets && staticExoplanets.length > 0) {
      setExoplanets(staticExoplanets);
      setError(null);
    } else {
      setError(
        "No se pudieron cargar los datos de exoplanetas del archivo local. Revisa que el archivo no esté vacío."
      );
    }
    setLoading(false);
  }, []);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Función para abrir el modal
  const handleShowDetails = (planet) => {
    setSelectedPlanet(planet);
    setShowModal(true);
  };

  // Aplica la búsqueda, el filtro y el ordenamiento
  const filteredAndSortedExoplanets = [...exoplanets]
    .filter((planet) => {
      return planet.pl_name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((planet) => {
      if (!showHabitableOnly) {
        return true;
      }
      const radius = parseFloat(planet.pl_rade);
      const temp = parseFloat(planet.pl_eqt);
      return radius >= 0.5 && radius <= 2 && temp >= 270 && temp <= 320;
    })
    .sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined || aValue === "")
        return sortDirection === "asc" ? 1 : -1;
      if (bValue === null || bValue === undefined || bValue === "")
        return sortDirection === "asc" ? -1 : 1;

      if (
        sortColumn === "pl_name" ||
        sortColumn === "hostname" ||
        sortColumn === "discoverymethod"
      ) {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc"
          ? parseFloat(aValue) - parseFloat(bValue)
          : parseFloat(bValue) - parseFloat(aValue);
      }
    });

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="light" />
        <p className="mt-2 text-light">Cargando catálogo de exoplanetas...</p>
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

  if (exoplanets.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info">
          No se encontraron exoplanetas. El archivo de datos está vacío.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5" fluid>
      <h1 className="text-center mb-4 text-warning">Catálogo de Exoplanetas</h1>
      <p className="text-center text-muted">
        Haz clic en el nombre de un planeta para ver más detalles.
      </p>

      <div className="text-center my-3 d-flex justify-content-center align-items-center">
        <Button
          onClick={() => setShowHabitableOnly(!showHabitableOnly)}
          variant={showHabitableOnly ? "success" : "secondary"}
        >
          {showHabitableOnly
            ? "Mostrando Planetas Habitables 🌍"
            : "Mostrar solo Planetas Potencialmente Habitables"}
        </Button>
        <Form.Control
          type="text"
          placeholder="Buscar por nombre de planeta..."
          className="w-50 ms-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card bg="dark" text="light" className="shadow border-secondary mt-4">
        <Card.Body>
          <div style={{ maxHeight: "800px", overflowY: "auto" }}>
            <Table
              responsive
              striped
              bordered
              hover
              variant="dark"
              className="text-center"
            >
              <thead>
                <tr>
                  <th onClick={() => handleSort("pl_name")}>
                    Nombre del Planeta{" "}
                    {sortColumn === "pl_name" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("hostname")}>
                    Estrella Anfitriona{" "}
                    {sortColumn === "hostname" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("discoverymethod")}>
                    Método{" "}
                    {sortColumn === "discoverymethod" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  {showHabitableOnly && <th>Razón de Habitabilidad</th>}
                  <th onClick={() => handleSort("disc_year")}>
                    Año{" "}
                    {sortColumn === "disc_year" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pl_orbper")}>
                    Periodo (días){" "}
                    {sortColumn === "pl_orbper" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pl_rade")}>
                    Radio (Tierra){" "}
                    {sortColumn === "pl_rade" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pl_bmasse")}>
                    Masa (Tierra){" "}
                    {sortColumn === "pl_bmasse" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("pl_eqt")}>
                    Temp. (°C){" "}
                    {sortColumn === "pl_eqt" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("sy_dist")}>
                    Distancia (al){" "}
                    {sortColumn === "sy_dist" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("st_teff")}>
                    Temp. Estrella (°C){" "}
                    {sortColumn === "st_teff" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("st_mass")}>
                    Masa Estrella (Sol){" "}
                    {sortColumn === "st_mass" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th onClick={() => handleSort("st_rad")}>
                    Radio Estrella (Sol){" "}
                    {sortColumn === "st_rad" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedExoplanets.map((planet, index) => (
                  <tr key={index}>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShowDetails(planet)}
                    >
                      <Button variant="link" className="text-warning p-0">
                        {planet.pl_name}
                      </Button>
                    </td>
                    <td>{planet.hostname}</td>
                    <td>{planet.discoverymethod}</td>
                    {showHabitableOnly && (
                      <td>{getHabitabilityReason(planet)}</td>
                    )}
                    <td>{planet.disc_year}</td>
                    <td>
                      {planet.pl_orbper
                        ? parseFloat(planet.pl_orbper).toFixed(2)
                        : "N/A"}
                    </td>
                    <td>
                      {planet.pl_rade
                        ? parseFloat(planet.pl_rade).toFixed(2)
                        : "N/A"}
                    </td>
                    <td>
                      {planet.pl_bmasse
                        ? parseFloat(planet.pl_bmasse).toFixed(2)
                        : "N/A"}
                    </td>
                    <td>{convertKelvinToCelsius(planet.pl_eqt)}</td>
                    <td>
                      {planet.sy_dist
                        ? (parseFloat(planet.sy_dist) * 3.26).toFixed(2)
                        : "N/A"}
                    </td>
                    <td>{convertKelvinToCelsius(planet.st_teff)}</td>
                    <td>
                      {planet.st_mass
                        ? parseFloat(planet.st_mass).toFixed(2)
                        : "N/A"}
                    </td>
                    <td>
                      {planet.st_rad
                        ? parseFloat(planet.st_rad).toFixed(2)
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal para mostrar los detalles del planeta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          className="bg-dark text-light border-secondary"
        >
          <Modal.Title>{selectedPlanet?.pl_name} - Detalles</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light border-secondary">
          {selectedPlanet ? (
            <>
              <p>
                <strong>Estrella:</strong> {selectedPlanet.hostname}
              </p>
              <p>
                <strong>Método de Descubrimiento:</strong>{" "}
                {selectedPlanet.discoverymethod}
              </p>
              <p>
                <strong>Año de Descubrimiento:</strong>{" "}
                {selectedPlanet.disc_year}
              </p>
              <p>
                <strong>Periodo Orbital:</strong>{" "}
                {selectedPlanet.pl_orbper
                  ? `${parseFloat(selectedPlanet.pl_orbper).toFixed(2)} días`
                  : "N/A"}
              </p>
              <p>
                <strong>Radio del Planeta:</strong>{" "}
                {selectedPlanet.pl_rade
                  ? `${parseFloat(selectedPlanet.pl_rade).toFixed(
                      2
                    )} Radios Terrestres`
                  : "N/A"}
              </p>
              <p>
                <strong>Masa del Planeta:</strong>{" "}
                {selectedPlanet.pl_bmasse
                  ? `${parseFloat(selectedPlanet.pl_bmasse).toFixed(
                      2
                    )} Masas Terrestres`
                  : "N/A"}
              </p>
              <p>
                <strong>Temperatura de Equilibrio:</strong>{" "}
                {convertKelvinToCelsius(selectedPlanet.pl_eqt)} °C
              </p>
              <p>
                <strong>Distancia:</strong>{" "}
                {selectedPlanet.sy_dist
                  ? `${(parseFloat(selectedPlanet.sy_dist) * 3.26).toFixed(
                      2
                    )} años luz`
                  : "N/A"}
              </p>
              <p>
                <strong>Radio de la Estrella:</strong>{" "}
                {selectedPlanet.st_rad
                  ? `${parseFloat(selectedPlanet.st_rad).toFixed(
                      2
                    )} Radios Solares`
                  : "N/A"}
              </p>
              <p>
                <strong>Masa de la Estrella:</strong>{" "}
                {selectedPlanet.st_mass
                  ? `${parseFloat(selectedPlanet.st_mass).toFixed(
                      2
                    )} Masas Solares`
                  : "N/A"}
              </p>
              <p>
                <strong>Temperatura de la Estrella:</strong>{" "}
                {convertKelvinToCelsius(selectedPlanet.st_teff)} °C
              </p>
            </>
          ) : (
            <p>Cargando detalles...</p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark text-light border-secondary">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
