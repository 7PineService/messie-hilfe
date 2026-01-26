import {b as renderers,l as createExports}from'./chunks/vendor_Bxy5riAS.mjs';import {s as serverEntrypointModule}from'./chunks/_@astrojs-ssr-adapter_DbbrVUai.mjs';import {manifest}from'./manifest_9d1K7Vb8.mjs';const serverIslandMap = new Map();;const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/agb.astro.mjs');
const _page3 = () => import('./pages/anfrage/danke.astro.mjs');
const _page4 = () => import('./pages/anfrage.astro.mjs');
const _page5 = () => import('./pages/api/contact.astro.mjs');
const _page6 = () => import('./pages/berlin.astro.mjs');
const _page7 = () => import('./pages/brand-guide.astro.mjs');
const _page8 = () => import('./pages/danke-anfrage.astro.mjs');
const _page9 = () => import('./pages/danke-anonym.astro.mjs');
const _page10 = () => import('./pages/datenschutz.astro.mjs');
const _page11 = () => import('./pages/desinfektion.astro.mjs');
const _page12 = () => import('./pages/duesseldorf.astro.mjs');
const _page13 = () => import('./pages/entruempelung.astro.mjs');
const _page14 = () => import('./pages/entsorgung.astro.mjs');
const _page15 = () => import('./pages/essen.astro.mjs');
const _page16 = () => import('./pages/frankfurt.astro.mjs');
const _page17 = () => import('./pages/geruchsneutralisation.astro.mjs');
const _page18 = () => import('./pages/hamburg.astro.mjs');
const _page19 = () => import('./pages/impressum.astro.mjs');
const _page20 = () => import('./pages/kein-datenhandel.astro.mjs');
const _page21 = () => import('./pages/koeln.astro.mjs');
const _page22 = () => import('./pages/kontakt.astro.mjs');
const _page23 = () => import('./pages/malerarbeiten.astro.mjs');
const _page24 = () => import('./pages/messie-reinigung.astro.mjs');
const _page25 = () => import('./pages/muenchen.astro.mjs');
const _page26 = () => import('./pages/renovierung.astro.mjs');
const _page27 = () => import('./pages/standorte.astro.mjs');
const _page28 = () => import('./pages/ueber-uns.astro.mjs');
const _page29 = () => import('./pages/widerruf.astro.mjs');
const _page30 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/agb/index.astro", _page2],
    ["src/pages/anfrage/danke/index.astro", _page3],
    ["src/pages/anfrage/index.astro", _page4],
    ["src/pages/api/contact.ts", _page5],
    ["src/pages/berlin/index.astro", _page6],
    ["src/pages/brand-guide/index.astro", _page7],
    ["src/pages/danke-anfrage/index.astro", _page8],
    ["src/pages/danke-anonym/index.astro", _page9],
    ["src/pages/datenschutz/index.astro", _page10],
    ["src/pages/desinfektion/index.astro", _page11],
    ["src/pages/duesseldorf/index.astro", _page12],
    ["src/pages/entruempelung/index.astro", _page13],
    ["src/pages/entsorgung/index.astro", _page14],
    ["src/pages/essen/index.astro", _page15],
    ["src/pages/frankfurt/index.astro", _page16],
    ["src/pages/geruchsneutralisation/index.astro", _page17],
    ["src/pages/hamburg/index.astro", _page18],
    ["src/pages/impressum/index.astro", _page19],
    ["src/pages/kein-datenhandel/index.astro", _page20],
    ["src/pages/koeln/index.astro", _page21],
    ["src/pages/kontakt/index.astro", _page22],
    ["src/pages/malerarbeiten/index.astro", _page23],
    ["src/pages/messie-reinigung/index.astro", _page24],
    ["src/pages/muenchen/index.astro", _page25],
    ["src/pages/renovierung/index.astro", _page26],
    ["src/pages/standorte/index.astro", _page27],
    ["src/pages/ueber-uns/index.astro", _page28],
    ["src/pages/widerruf/index.astro", _page29],
    ["src/pages/index.astro", _page30]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2e8bca53-9590-4f23-9b6f-4f5bb2466d41",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;export{__astrojsSsrVirtualEntry as default,pageMap};