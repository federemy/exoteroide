import { c as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C3MGFADD.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BB-rTqyQ.mjs';
import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';
export { renderers } from '../renderers.mjs';

function DiameterChart({ data }) {
  if (data.length === 0) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "bg-secondary bg-opacity-10 p-3 rounded mb-4 shadow border border-secondary" }, /* @__PURE__ */ React.createElement("h5", { className: "text-center text-info mb-3" }, "Diámetros Promedio de Asteroides Visibles (km)"), /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 300 }, /* @__PURE__ */ React.createElement(
    BarChart,
    {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    },
    /* @__PURE__ */ React.createElement(XAxis, { dataKey: "name", stroke: "#FFC107", hide: true }),
    /* @__PURE__ */ React.createElement(
      YAxis,
      {
        stroke: "#FFFFFF",
        label: {
          value: "Diámetro (km)",
          angle: -90,
          position: "insideLeft",
          fill: "#FFFFFF"
        }
      }
    ),
    /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        contentStyle: {
          backgroundColor: "#1c1e21",
          border: "1px solid #FFC107"
        },
        formatter: (value, name, props) => [
          `${value.toFixed(3)} km`,
          props.payload.name
        ]
      }
    ),
    /* @__PURE__ */ React.createElement(Bar, { dataKey: "diameter", fill: "#17A2B8", name: "Diámetro Promedio" })
  )));
}

const EARTH_MOON_DISTANCE_KM = 384400;
const API_KEY = "nQJMZwZ9XZYM9MHpL2bwtGb4lpHEmSWICf29wj8p";
const formatDate = (date) => date.toISOString().split("T")[0];
const today = /* @__PURE__ */ new Date();
const futureDate = /* @__PURE__ */ new Date();
futureDate.setDate(today.getDate() + 7);
const START_DATE = formatDate(today);
const END_DATE = formatDate(futureDate);
function NEOList() {
  const [allNeos, setAllNeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHazardousOnly, setShowHazardousOnly] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  useEffect(() => {
    const URL = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${START_DATE}&end_date=${END_DATE}&api_key=${API_KEY}`;
    fetch(URL).then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar datos de la NASA.");
      }
      return response.json();
    }).then((data) => {
      const flattenedNeos = Object.values(data.near_earth_objects).flat();
      setAllNeos(flattenedNeos);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);
  let processedNeos = allNeos.filter((neo) => {
    const matchesHazard = showHazardousOnly ? neo.is_potentially_hazardous_asteroid : true;
    const matchesSearch = neo.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesHazard && matchesSearch;
  });
  processedNeos.sort((a, b) => {
    if (sortBy === "distance") {
      const distA = parseFloat(
        a.close_approach_data[0].miss_distance.kilometers
      );
      const distB = parseFloat(
        b.close_approach_data[0].miss_distance.kilometers
      );
      return distA - distB;
    } else if (sortBy === "size") {
      const sizeA = a.estimated_diameter.kilometers.estimated_diameter_max;
      const sizeB = b.estimated_diameter.kilometers.estimated_diameter_max;
      return sizeB - sizeA;
    }
    return 0;
  });
  const neosToDisplay = processedNeos.slice(0, itemsPerPage);
  const chartData = neosToDisplay.map((neo) => ({
    name: neo.name,
    diameter: (neo.estimated_diameter.kilometers.estimated_diameter_max + neo.estimated_diameter.kilometers.estimated_diameter_min) / 2
  }));
  if (loading) {
    return /* @__PURE__ */ React.createElement(Container, { className: "text-center my-5" }, /* @__PURE__ */ React.createElement(Spinner, { animation: "border", role: "status", variant: "light" }), /* @__PURE__ */ React.createElement("p", { className: "mt-2 text-light" }, "Buscando asteroides..."));
  }
  if (error) {
    return /* @__PURE__ */ React.createElement(Container, { className: "my-5" }, /* @__PURE__ */ React.createElement(Alert, { variant: "danger" }, "¡Error! ", error));
  }
  const formatDiameter = (min, max) => {
    const avg = ((min + max) / 2).toFixed(3);
    return `${avg} km (aprox.)`;
  };
  return /* @__PURE__ */ React.createElement(Container, { className: "my-5" }, /* @__PURE__ */ React.createElement("h1", { className: "text-center mb-4 text-warning" }, "Objetos Cercanos a la Tierra"), /* @__PURE__ */ React.createElement("p", { className: "text-center text-muted" }, "Datos para el rango: ", START_DATE, " a ", END_DATE, ". Total de asteroides:", " ", allNeos.length, "."), /* @__PURE__ */ React.createElement("div", { className: "mb-4 p-3 bg-secondary bg-opacity-10 rounded shadow-sm border border-secondary" }, /* @__PURE__ */ React.createElement(
    Form.Control,
    {
      type: "text",
      placeholder: "Buscar asteroide por nombre...",
      value: searchTerm,
      onChange: (e) => {
        setSearchTerm(e.target.value);
        setItemsPerPage(12);
      },
      className: "mb-3"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "d-flex flex-column flex-md-row justify-content-between align-items-center" }, /* @__PURE__ */ React.createElement("div", { className: "btn-group mb-3 mb-md-0", role: "group" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: sortBy === "distance" ? "info" : "outline-info",
      onClick: () => setSortBy("distance")
    },
    "Ordenar por Distancia"
  ), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: sortBy === "size" ? "info" : "outline-info",
      onClick: () => setSortBy("size")
    },
    "Ordenar por Tamaño"
  )), /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: showHazardousOnly ? "danger" : "outline-danger",
      onClick: () => setShowHazardousOnly(!showHazardousOnly),
      className: "py-2 px-3 fw-bold"
    },
    showHazardousOnly ? "Mostrar Todos" : "Ver Solo Peligrosos",
    " (",
    processedNeos.length,
    " visibles)"
  ))), /* @__PURE__ */ React.createElement(DiameterChart, { data: chartData }), /* @__PURE__ */ React.createElement(Row, { xs: 1, md: 2, lg: 3, className: "g-4" }, neosToDisplay.map((neo) => /* @__PURE__ */ React.createElement(Col, { key: neo.id }, /* @__PURE__ */ React.createElement("a", { href: `/neo/${neo.id}`, className: "text-decoration-none" }, /* @__PURE__ */ React.createElement(
    Card,
    {
      bg: "dark",
      text: "light",
      className: `h-100 shadow hover-scale border ${neo.is_potentially_hazardous_asteroid ? "border-danger" : "border-warning"}`,
      style: { cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement(
      Card.Header,
      {
        className: neo.is_potentially_hazardous_asteroid ? "bg-danger text-light fw-bold" : "bg-warning text-dark fw-bold"
      },
      neo.name
    ),
    /* @__PURE__ */ React.createElement(Card.Body, null, /* @__PURE__ */ React.createElement("ul", { className: "list-unstyled small mt-2" }, /* @__PURE__ */ React.createElement("li", null, "**ID:** ", /* @__PURE__ */ React.createElement("span", { className: "text-muted" }, neo.id)), /* @__PURE__ */ React.createElement("li", null, "**Peligro:**", " ", /* @__PURE__ */ React.createElement(
      "span",
      {
        className: neo.is_potentially_hazardous_asteroid ? "text-danger fw-bold" : "text-success"
      },
      neo.is_potentially_hazardous_asteroid ? "SÍ" : "No"
    )), /* @__PURE__ */ React.createElement("li", null, "**Diámetro:**", " ", /* @__PURE__ */ React.createElement("span", { className: "text-primary" }, formatDiameter(
      neo.estimated_diameter.kilometers.estimated_diameter_min,
      neo.estimated_diameter.kilometers.estimated_diameter_max
    ))), /* @__PURE__ */ React.createElement("li", null, "**Aprox. Más Cercana:**", " ", /* @__PURE__ */ React.createElement("span", { className: "text-light" }, neo.close_approach_data[0].close_approach_date)), /* @__PURE__ */ React.createElement("li", null, "**Distancia (km):**", " ", /* @__PURE__ */ React.createElement("span", { className: "text-light" }, parseInt(
      neo.close_approach_data[0].miss_distance.kilometers
    ).toLocaleString(), " ", "km")), /* @__PURE__ */ React.createElement("li", { className: "mt-3" }, "**Referencia:**", " ", /* @__PURE__ */ React.createElement("span", { className: "text-warning fw-bold" }, (parseFloat(
      neo.close_approach_data[0].miss_distance.kilometers
    ) / EARTH_MOON_DISTANCE_KM).toFixed(2), " ", "distancias lunares")))),
    /* @__PURE__ */ React.createElement(Card.Footer, { className: "text-muted small text-center" }, "Click para ver más detalles")
  ))))), neosToDisplay.length < processedNeos.length && /* @__PURE__ */ React.createElement("div", { className: "text-center mt-5" }, /* @__PURE__ */ React.createElement(
    Button,
    {
      variant: "warning",
      size: "lg",
      onClick: () => setItemsPerPage((prev) => prev + 12),
      className: "shadow-lg"
    },
    "Cargar 12 Asteroides Más (",
    processedNeos.length - neosToDisplay.length,
    " restantes)"
  )));
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Asteroides Cercanos a la Tierra" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "NEOList", NEOList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/asus1/Desktop/web/objeto-cercano/src/components/NEOList.jsx", "client:component-export": "NEOList" })} </main> ` })}`;
}, "C:/Users/asus1/Desktop/web/objeto-cercano/src/pages/index.astro", void 0);

const $$file = "C:/Users/asus1/Desktop/web/objeto-cercano/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
