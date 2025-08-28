import { c as createComponent, d as createAstro, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_C3MGFADD.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BB-rTqyQ.mjs';
import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Button, Card, ListGroup, Badge } from 'react-bootstrap';
export { renderers } from '../../renderers.mjs';

const API_KEY = "nQJMZwZ9XZYM9MHpL2bwtGb4lpHEmSWICf29wj8p";
function NEODetail({ neoId }) {
  const [neo, setNeo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const URL = `https://api.nasa.gov/neo/rest/v1/neo/${neoId}?api_key=${API_KEY}`;
    fetch(URL).then((response) => {
      if (!response.ok) {
        throw new Error(`No se pudo encontrar el objeto con ID: ${neoId}.`);
      }
      return response.json();
    }).then((data) => {
      setNeo(data);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, [neoId]);
  if (loading) {
    return /* @__PURE__ */ React.createElement(Container, { className: "text-center my-5" }, /* @__PURE__ */ React.createElement(Spinner, { animation: "border", variant: "light" }), /* @__PURE__ */ React.createElement("p", { className: "text-light mt-2" }, "Cargando detalles..."));
  }
  if (error || !neo) {
    return /* @__PURE__ */ React.createElement(Container, { className: "my-5" }, /* @__PURE__ */ React.createElement(Alert, { variant: "danger" }, "Error al cargar: ", error || "Objeto no encontrado."));
  }
  const approachData = neo.close_approach_data[0];
  return /* @__PURE__ */ React.createElement(Container, { className: "my-5" }, /* @__PURE__ */ React.createElement("div", { className: "d-flex justify-content-between align-items-center mb-4" }, /* @__PURE__ */ React.createElement(Button, { variant: "outline-light", href: "/", className: "d-none d-md-block" }, "← Volver a la Lista"), /* @__PURE__ */ React.createElement("h1", { className: "text-warning fs-2 text-center m-0" }, neo.name, " (", neo.designation, ")"), /* @__PURE__ */ React.createElement("div", { style: { width: "100px" }, className: "d-none d-md-block" })), /* @__PURE__ */ React.createElement(Card, { bg: "dark", text: "light", className: "shadow border-warning" }, /* @__PURE__ */ React.createElement(Card.Header, { className: "bg-warning text-dark h3 fw-bold" }, "Detalles Orbitales y Físicos"), /* @__PURE__ */ React.createElement(Card.Body, null, /* @__PURE__ */ React.createElement(ListGroup, { variant: "flush", className: "mt-3" }, /* @__PURE__ */ React.createElement(ListGroup.Item, { className: "bg-dark text-light border-secondary" }, "**ID NASA JPL:** ", /* @__PURE__ */ React.createElement("span", { className: "ms-2 text-muted" }, neo.id)), /* @__PURE__ */ React.createElement(ListGroup.Item, { className: "bg-dark text-light border-secondary" }, "**Potencialmente Peligroso:**", " ", /* @__PURE__ */ React.createElement(
    Badge,
    {
      bg: neo.is_potentially_hazardous_asteroid ? "danger" : "success",
      className: "ms-2 p-2"
    },
    neo.is_potentially_hazardous_asteroid ? "SÍ" : "NO"
  )), /* @__PURE__ */ React.createElement(ListGroup.Item, { className: "bg-dark text-light border-secondary" }, "**Diámetro Máx. (metros):**", " ", /* @__PURE__ */ React.createElement("span", { className: "ms-2 text-info" }, neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2).toLocaleString(), " ", "m")), /* @__PURE__ */ React.createElement(ListGroup.Item, { className: "bg-dark text-light border-secondary" }, "**Última Aproximación:**", " ", /* @__PURE__ */ React.createElement("span", { className: "ms-2 text-info" }, approachData.close_approach_date_full)), /* @__PURE__ */ React.createElement(ListGroup.Item, { className: "bg-dark text-light border-secondary" }, "**Velocidad Relativa (km/s):**", " ", /* @__PURE__ */ React.createElement("span", { className: "ms-2 text-info" }, parseFloat(
    approachData.relative_velocity.kilometers_per_second
  ).toFixed(3), " ", "km/s")), /* @__PURE__ */ React.createElement(ListGroup.Item, { className: "bg-dark text-light border-secondary" }, "**Distancia (Km desde la Tierra):**", " ", /* @__PURE__ */ React.createElement("span", { className: "ms-2 text-info" }, parseInt(
    approachData.miss_distance.kilometers
  ).toLocaleString(), " ", "km")), /* @__PURE__ */ React.createElement(ListGroup.Item, { className: "bg-dark text-light border-secondary" }, "**Cuerpo Orbital:**", " ", /* @__PURE__ */ React.createElement("span", { className: "ms-2 text-info" }, approachData.orbiting_body)))), /* @__PURE__ */ React.createElement(Card.Footer, { className: "text-end" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: neo.nasa_jpl_url,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "btn btn-outline-warning"
    },
    "Ver Órbita Completa en NASA JPL"
  ))), neo.is_potentially_hazardous_asteroid && /* @__PURE__ */ React.createElement(
    Card,
    {
      bg: "dark",
      text: "light",
      className: "my-5 shadow-sm border border-danger"
    },
    /* @__PURE__ */ React.createElement(Card.Header, { className: "bg-danger text-light fw-bold" }, '⚠️ ¿Por qué este asteroide es considerado "Peligroso"?'),
    /* @__PURE__ */ React.createElement(Card.Body, null, /* @__PURE__ */ React.createElement("p", null, "Este asteroide ha sido clasificado como **Potencialmente Peligroso (PHA)** porque cumple con una combinación de criterios de **tamaño y distancia** establecidos por la NASA."), /* @__PURE__ */ React.createElement("ul", { className: "list-unstyled" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", { className: "text-danger" }, "1. Tamaño:"), " Se estima que su diámetro es superior a los ", /* @__PURE__ */ React.createElement("strong", null, "150 metros"), "."), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", { className: "text-danger" }, "2. Distancia:"), " Su órbita se acerca a menos de ", /* @__PURE__ */ React.createElement("strong", null, "7.5 millones de kilómetros"), " ", "de la órbita de la Tierra, lo que se considera un acercamiento significativo.")), /* @__PURE__ */ React.createElement("p", { className: "mb-0" }, "Esta clasificación no implica un riesgo inminente, sino que es una designación para objetos que requieren un monitoreo continuo."))
  ));
}

const $$Astro = createAstro();
const prerender = false;
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/");
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Detalle del NEO ${id}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "NEODetail", NEODetail, { "neoId": id, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/asus1/Desktop/web/objeto-cercano/src/components/NEODetail.jsx", "client:component-export": "NEODetail" })} </main> ` })}`;
}, "C:/Users/asus1/Desktop/web/objeto-cercano/src/pages/neo/[id].astro", void 0);

const $$file = "C:/Users/asus1/Desktop/web/objeto-cercano/src/pages/neo/[id].astro";
const $$url = "/neo/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
