import { c as createComponent, d as createAstro, j as renderHead, i as renderComponent, k as renderSlot, r as renderTemplate } from './astro/server_C3MGFADD.mjs';
import 'kleur/colors';
/* empty css                               */
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

function Header() {
  return /* @__PURE__ */ React.createElement(
    Navbar,
    {
      bg: "dark",
      variant: "dark",
      expand: "lg",
      sticky: "top",
      className: "shadow-lg border-bottom border-warning"
    },
    /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(
      Navbar.Brand,
      {
        href: "/",
        className: "fw-bold fs-4 text-warning d-flex align-items-center"
      },
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "1.5rem", marginRight: "0.5rem" } }, "🚀"),
      "Vigilancia NEOs"
    ), /* @__PURE__ */ React.createElement(Navbar.Toggle, { "aria-controls": "basic-navbar-nav" }), /* @__PURE__ */ React.createElement(Navbar.Collapse, { id: "basic-navbar-nav" }, /* @__PURE__ */ React.createElement(Nav, { className: "me-auto" }, /* @__PURE__ */ React.createElement(Nav.Link, { href: "/info/peligrosidad", className: "text-light" }, "¿Por qué son peligrosos?"), /* @__PURE__ */ React.createElement(Nav.Link, { href: "/exoplanetas", className: "text-light" }, "Exoplanetas"))))
  );
}

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es" data-bs-theme="dark" data-astro-cid-37fxchfa> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>">${renderHead()}</head> <body data-astro-cid-37fxchfa> ${renderComponent($$result, "Header", Header, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/asus1/Desktop/web/objeto-cercano/src/components/Header.jsx", "client:component-export": "Header", "data-astro-cid-37fxchfa": true })} ${renderSlot($$result, $$slots["default"])} <footer data-astro-cid-37fxchfa> <div class="text-center border-top border-secondary py-3 small" data-astro-cid-37fxchfa> <div data-astro-cid-37fxchfa>
Hecho por
<a href="https://www.blyxsolutions.com.ar/" target="_blank" rel="noopener noreferrer" style="text-decoration:none;" data-astro-cid-37fxchfa> <span style="color:#2DD4BF;" data-astro-cid-37fxchfa>Blyx</span> <span style="color:#FB7185;" data-astro-cid-37fxchfa>Solutions</span> </a>
-
<a style="color:#FB7185;text-decoration:none" href="https://cafecito.app/blyxsolutions" rel="noopener" target="_blank" data-astro-cid-37fxchfa>
☕️ Invitame un cafecito
</a> </div> </div> </footer> </body></html>`;
}, "C:/Users/asus1/Desktop/web/objeto-cercano/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
