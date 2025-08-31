import React from "react";
import { Modal, Button } from "react-bootstrap";

// Convierte km a string con separador de miles
const formatKm = (num) =>
  parseFloat(num).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

export function NEOModal({ show, onHide, neo, size = "lg" }) {
  if (!neo) return null;

  const approach = neo.close_approach_data?.[0];
  const diameter = neo.estimated_diameter?.meters;

  return (
    <Modal show={show} onHide={onHide} centered size={size}>
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>🛰️ {neo.name} — Detalles del Asteroide</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark text-light border-secondary">
        <p>
          🆔 <strong>ID oficial de la NASA:</strong> {neo.id}
        </p>

        <p>
          ⚠️ <strong>Peligrosidad:</strong>{" "}
          {neo.is_potentially_hazardous_asteroid
            ? "Sí, es considerado potencialmente peligroso. 🚨"
            : "No, no representa un peligro inmediato. 🟢"}
        </p>

        <p>
          💡 <strong>Magnitud absoluta:</strong> {neo.absolute_magnitude_h} —
          Esto mide qué tan brillante sería el asteroide si estuviera a 150
          millones de kilómetros (como el Sol). Cuanto más bajo el número, más
          brillante es. 🔭
        </p>

        {diameter && (
          <p>
            📏 <strong>Tamaño estimado:</strong> entre{" "}
            {diameter.estimated_diameter_min.toFixed(2)} y{" "}
            {diameter.estimated_diameter_max.toFixed(2)} metros. ¡Eso es
            comparable al tamaño de un edificio de 20 pisos! 🏢☄️
          </p>
        )}

        {approach ? (
          <>
            <hr />
            <p className="mb-2 fw-bold">📍 Último acercamiento a la Tierra:</p>

            <p>
              📅 <strong>Fecha:</strong> {approach.close_approach_date_full}
            </p>

            <p>
              🚀 <strong>Velocidad relativa:</strong>{" "}
              {parseFloat(
                approach.relative_velocity.kilometers_per_hour
              ).toLocaleString()}{" "}
              km/h — ¡más rápido que cualquier cohete terrestre! 🔥
            </p>

            <p>
              🌍 <strong>Distancia mínima a la Tierra:</strong>{" "}
              {formatKm(approach.miss_distance.kilometers)} km — para comparar,
              la Luna está a unos 384,000 km. Así que este asteroide pasó a una
              distancia de{" "}
              <strong>
                {(
                  parseFloat(approach.miss_distance.kilometers) / 384400
                ).toFixed(2)}
              </strong>{" "}
              veces la distancia Tierra–Luna. 🌕
            </p>

            <p>
              🪐 <strong>Órbita alrededor de:</strong> {approach.orbiting_body}{" "}
              — Esto indica el cuerpo celeste que domina su trayectoria en ese
              momento. Generalmente, es el Sol ☀️.
            </p>
          </>
        ) : (
          <p>🤷‍♂️ No hay información de acercamientos recientes disponible.</p>
        )}

        {neo.nasa_jpl_url && (
          <>
            <hr />
            <p>
              🔗{" "}
              <a
                href={neo.nasa_jpl_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-warning"
              >
                Ver más en la web oficial de la NASA →
              </a>
            </p>
          </>
        )}
        {neo.is_potentially_hazardous_asteroid && (
          <div className="bg-danger bg-opacity-25 border border-danger rounded p-3 my-4">
            <h5 className="text-danger fw-bold">
              ⚠️ ¿Por qué es potencialmente peligroso?
            </h5>
            <p>
              Este asteroide ha sido clasificado como{" "}
              <strong>potencialmente peligroso</strong> por la NASA debido a dos
              factores clave:
            </p>
            <ul className="mb-2">
              <li>
                📏 <strong>Tamaño:</strong> Tiene un diámetro superior a 140 m,
                suficiente para causar daños significativos si impactara la
                Tierra.
              </li>
              <li>
                🌍 <strong>Cercanía:</strong> Su órbita lo acerca a menos de{" "}
                <strong>7.5 millones de km</strong> (0.05 unidades astronómicas)
                de nuestro planeta.
              </li>
            </ul>
            <p>
              Aunque <strong>no representa una amenaza inminente</strong>, los
              objetos con estas características son monitoreados de forma
              constante por agencias espaciales como la NASA, debido a la
              posibilidad (aunque baja) de que su órbita se modifique en el
              futuro.
            </p>
            <p className="mb-0">
              🛰️ Misiones como <strong>DART</strong> y programas como{" "}
              <strong>Sentry</strong> se encargan de vigilar y, si fuera
              necesario, desviar este tipo de objetos.
            </p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-dark text-light border-secondary">
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
