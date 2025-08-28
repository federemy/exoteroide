// src/components/Header.jsx
import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

export function Header() {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-lg border-bottom border-warning"
    >
      <Container>
        <Navbar.Brand
          href="/"
          className="fw-bold fs-4 text-warning d-flex align-items-center"
        >
          <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>🚀</span>
          Vigilancia NEOs
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/info/peligrosidad" className="text-light">
              ¿Por qué son peligrosos?
            </Nav.Link>
            <Nav.Link href="/exoplanetas" className="text-light">
              Exoplanetas
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
