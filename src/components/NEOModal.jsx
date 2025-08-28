// src/components/NEOModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { NEODetail } from "./NEODetail.jsx";

export function NEOModal({ show, onHide, neoId }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>Detalle NEO {neoId}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark">
        {neoId ? (
          <NEODetail neoId={neoId} />
        ) : (
          <p className="text-light m-0">Sin ID</p>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
