import React from "react";
import "./exoplanet-hero.css";

export function ExoplanetHero() {
  return (
    <div className="exoplanet-hero">
      <div className="exoplanet-orbit">
        <div className="exoplanet" />
      </div>
      <h1 className="hero-title">🌌 Explorando Exoplanetas</h1>
      <p className="hero-subtitle">
        Descubrí mundos más allá del sistema solar
      </p>
    </div>
  );
}
