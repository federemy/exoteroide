// src/components/Header.jsx
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

export function Header({ className = "" }) {
  return (
    <Navbar
      variant="dark"
      expand="lg"
      sticky="top"
      className={`shadow-lg border-bottom border-warning transparent-bg ${className}`}
    >
      <Container>
        <Navbar.Brand
          href="/"
          className="fw-bold fs-4 text-warning d-flex align-items-center"
        >
          <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>🚀</span>
          Exoteroide
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/" className="text-light mx-2">
              Inicio
            </Nav.Link>
            <Nav.Link href="/exoplanetas" className="text-light mx-2">
              Exoplanetas
            </Nav.Link>
            <Nav.Link href="/astronautas" className="text-light mx-2">
              Tripulación
            </Nav.Link>
            <Nav.Link href="/galeria-espacial" className="text-light mx-2">
              📸 Galería Espacial
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
