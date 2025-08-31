import React, { useEffect, useRef } from "react";
import "./hero.css";

export function HeroAnimationAsteroid() {
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

    const asteroid = { x: -50, y: h / 2, r: 30, dx: 2 };
    const particles = [];

    function animate() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      // Cola
      particles.push({ x: asteroid.x, y: asteroid.y, alpha: 1 });
      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,100,${p.alpha})`;
        ctx.fill();
        p.alpha -= 0.02;
        if (p.alpha <= 0) particles.splice(i, 1);
      });

      // Asteroide
      ctx.beginPath();
      ctx.fillStyle = "#aaa";
      ctx.arc(asteroid.x, asteroid.y, asteroid.r, 0, Math.PI * 2);
      ctx.fill();

      asteroid.x += asteroid.dx;
      if (asteroid.x - asteroid.r > w) asteroid.x = -50;

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />;
}
