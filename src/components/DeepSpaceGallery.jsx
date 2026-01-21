import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Modal,
  Button,
  Badge,
} from "react-bootstrap";

export function DeepSpaceGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const API_KEY = "nQJMZwZ9XZYM9MHpL2bwtGb4lpHEmSWICf29wj8p";

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        // Calculamos la fecha de hace 30 días para no irnos muy atrás
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const formatDate = (date) => date.toISOString().split("T")[0];

        // Pedimos el rango desde hace un mes hasta hoy
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${formatDate(
            thirtyDaysAgo
          )}&end_date=${formatDate(today)}`
        );

        const data = await response.json();

        // 1. Filtramos para que solo sean imágenes
        // 2. Las ordenamos: la fecha más reciente (descendente) arriba
        const sortedData = data
          .filter((item) => item.media_type === "image")
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setItems(sortedData);
      } catch (err) {
        console.error("Error en galería:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <Container className="my-5 pt-5">
      <style>{`
        .space-card {
          background: #05070a !important;
          border: 1px solid rgba(0, 212, 255, 0.2) !important;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .space-card:hover {
          transform: translateY(-10px);
          border-color: #00d4ff !important;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }
        .img-gallery { height: 280px; object-fit: cover; border-radius: 12px 12px 0 0; }
        .text-cyan { color: #00d4ff; text-shadow: 0 0 5px rgba(0,212,255,0.5); }
        .modal-content { background: #05070a; border: 1px solid #00d4ff; color: white; }
      `}</style>

      <div className="text-center mb-5">
        <Badge bg="info" className="mb-2 text-dark px-3">
          EN VIVO DESDE EL ESPACIO
        </Badge>
        <h1 className="display-4 fw-bold text-white">
          Últimos Descubrimientos
        </h1>
        <p className="lead text-white-50">
          Explorando las capturas más recientes de los telescopios de la NASA.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="info" />
          <p className="text-info mt-3 fw-bold">SINCRONIZANDO CON ÓRBITA...</p>
        </div>
      ) : (
        <Row className="g-4">
          {items.map((item, index) => (
            <Col key={index} md={6} lg={4} xl={3}>
              <Card
                className="space-card h-100 shadow-lg"
                onClick={() => {
                  setSelected(item);
                  setShowModal(true);
                }}
              >
                <Card.Img src={item.url} className="img-gallery" />
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-cyan fw-bold">{item.date}</small>
                    {index === 0 && <Badge bg="danger">¡NUEVO!</Badge>}
                  </div>
                  <Card.Title className="h6 text-white mb-0">
                    {item.title}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* MODAL CON ZOOM Y DESCARGA */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-secondary"
        >
          <Modal.Title className="text-cyan">{selected?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <img
            src={selected?.hdurl || selected?.url}
            className="img-fluid w-100"
            alt="Space Zoom"
          />
          <div className="p-4 bg-dark">
            <p className="mb-4" style={{ lineHeight: "1.6", opacity: 0.9 }}>
              {selected?.explanation}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">Fecha: {selected?.date}</span>
              <Button
                variant="info"
                onClick={() =>
                  window.open(selected?.hdurl || selected?.url, "_blank")
                }
              >
                Descargar Imagen HD 🚀
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
