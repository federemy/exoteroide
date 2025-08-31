import React, { useEffect, useRef } from "react";
import "./hero.css";

export function HeroAnimationExoplanet() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = 300);

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = 300;
    });

    const exoplanet = { x: w / 2, y: h / 2, r: 40 };
    const moons = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: Math.random() * 0.5 + 0.2,
    }));

    function animate() {
      ctx.clearRect(0, 0, w, h);

      // Fondo espacial
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      // Estrellas
      moons.forEach((m) => {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ccc";
        ctx.fill();
        m.x -= m.dx;
        if (m.x < -5) m.x = w + 5;
      });

      // Planeta
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        exoplanet.x - 10,
        exoplanet.y - 10,
        10,
        exoplanet.x,
        exoplanet.y,
        exoplanet.r
      );
      gradient.addColorStop(0, "#2dd4bf");
      gradient.addColorStop(1, "#0f172a");
      ctx.fillStyle = gradient;
      ctx.arc(exoplanet.x, exoplanet.y, exoplanet.r, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />;
}
