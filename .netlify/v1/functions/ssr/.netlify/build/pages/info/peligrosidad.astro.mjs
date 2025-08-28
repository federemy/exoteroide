import { c as createComponent, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_C3MGFADD.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_BB-rTqyQ.mjs';
import { Card } from 'react-bootstrap';
export { renderers } from '../../renderers.mjs';

const $$Peligrosidad = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "\xBFPor qu\xE9 son peligrosos?" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container my-5"> <h1 class="text-center mb-4 text-warning">¿Por qué son "Peligrosos" algunos asteroides?</h1> <p class="text-center text-muted">Aprende sobre los criterios que usa la NASA para su clasificación.</p> ${renderComponent($$result2, "Card", Card, { "bg": "dark", "text": "light", "class": "my-4 shadow-sm border border-warning" }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Card.Header", Card.Header, { "class": "bg-warning text-dark fw-bold" }, { "default": ($$result4) => renderTemplate`
Clasificación de Objetos Potencialmente Peligrosos (PHAs)
` })} ${renderComponent($$result3, "Card.Body", Card.Body, {}, { "default": ($$result4) => renderTemplate` <p>
Un asteroide es considerado **Potencialmente Peligroso (PHA)** no solo por su cercanía, sino por una combinación de **tamaño y distancia**. Para ser clasificado como tal, debe cumplir con dos criterios:
</p> <ul class="list-unstyled"> <li> <strong class="text-warning">1. Tamaño:</strong> Su diámetro debe ser superior a <strong>150 metros</strong>. Los objetos más pequeños generalmente se desintegran en la atmósfera terrestre antes de causar un impacto significativo.
</li> <li> <strong class="text-warning">2. Distancia:</strong> Su órbita debe pasar a menos de <strong>7.5 millones de kilómetros</strong> (aproximadamente 19.5 distancias lunares) de la órbita de la Tierra. Esto indica que hay una posibilidad de colisión futura.
</li> </ul> <p class="mb-0">
Por lo tanto, un asteroide pequeño que pase muy cerca puede no ser considerado peligroso, mientras que uno más grande que pase un poco más lejos sí lo es. Esta clasificación es una herramienta de monitoreo y alerta para científicos de todo el mundo.
</p> ` })} ` })} </main> ` })}`;
}, "C:/Users/asus1/Desktop/web/objeto-cercano/src/pages/info/peligrosidad.astro", void 0);

const $$file = "C:/Users/asus1/Desktop/web/objeto-cercano/src/pages/info/peligrosidad.astro";
const $$url = "/info/peligrosidad";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Peligrosidad,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
