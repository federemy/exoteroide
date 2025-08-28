import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  output: "static",       // 👈 solo estático
  outDir: "dist",         // 👈 carpeta de salida
  integrations: [react()] // 👈 soporte para React
});
