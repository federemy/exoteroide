// src/components/Gallery.jsx
import React, { useState, useEffect } from "react";
import { Container, Card, Badge, Spinner, Button } from "react-bootstrap";

export function Gallery() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos 'DEMO_KEY' que es gratuita, pero luego puedes sacar la tuya en api.nasa.gov
    fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="grow" variant="warning" />
        <p className="text-warning mt-3">
          Recibiendo transmisión de la NASA...
        </p>
      </Container>
    );
  }

  return (
    <Container className="my-5 pt-5">
      <div className="text-center mb-5">
        <Badge bg="warning" text="dark" className="mb-2 px-3">
          IMAGEN DEL DÍA
        </Badge>
        <h1 className="display-4 fw-bold text-light">Galería del Cosmos</h1>
        <p className="text-info opacity-75">Actualizado: {data.date}</p>
      </div>

      <Card
        className="bg-dark text-light border-secondary shadow-lg overflow-hidden"
        style={{ borderRadius: "20px" }}
      >
        <div className="row g-0">
          <div className="col-lg-7">
            {data.media_type === "image" ? (
              <img
                src={data.url}
                alt={data.title}
                className="img-fluid h-100 w-100"
                style={{ objectFit: "cover", minHeight: "400px" }}
              />
            ) : (
              <div className="ratio ratio-16x9 h-100">
                <iframe
                  src={data.url}
                  title={data.title}
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
          <div
            className="col-lg-5 p-4 d-flex flex-column justify-content-center"
            style={{ background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)" }}
          >
            <h2 className="text-warning mb-3 fw-bold">{data.title}</h2>
            <p
              className="opacity-75 leading-relaxed mb-4"
              style={{ fontSize: "0.95rem", textAlign: "justify" }}
            >
              {data.explanation}
            </p>
            <div className="mt-auto pt-3 border-top border-secondary">
              <p className="small text-muted mb-2">
                © {data.copyright || "Public Domain"}
              </p>
              <Button
                variant="outline-warning"
                size="sm"
                href={data.hdurl || data.url}
                target="_blank"
              >
                Ver en Alta Resolución 🔭
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5 p-4 text-center">
        <p className="text-muted small">
          Cada día la NASA selecciona una imagen diferente del universo junto
          con una breve explicación escrita por un astrónomo profesional.
        </p>
      </div>
    </Container>
  );
}
