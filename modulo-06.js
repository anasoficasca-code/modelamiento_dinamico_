/* ==========================================================
   RED POT ↔ ODS — diagrama estático (posiciones fijas)
   - Nodos con posición fija (nada se mueve).
   - Conexiones tomadas 1 a 1 de la tabla de sustento documental.
   - Clic en una línea -> panel con Conexión / Tipo / Sustento / Página.
   - Doble clic en una bola -> la apaga (opacidad) y oculta sus líneas.
   - Triple clic en una bola -> aísla su flujo (solo se ven los nodos
     y líneas con los que se conecta directamente).
   - El punteado de una línea indica si la relación es "no directa"
     (inferida); las relaciones directas se dibujan con línea sólida.
   ========================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

/* -------- Nodos: posición fija, nombres oficiales exactos -------- */
const ODS_NODES = [
  { id: "ods5",  num: 5,  name: "IGUALDAD DE GÉNERO",                      icon: "fa-venus-mars",     color: "#FF3A21", x: 183,  y: 64,  r: 40 },
  { id: "ods1",  num: 1,  name: "FIN DE LA POBREZA",                       icon: "fa-people-group",   color: "#E5243B", x: 610,  y: 78,  r: 60 },
  { id: "ods12", num: 12, name: "PRODUCCIÓN Y CONSUMO RESPONSABLES",       icon: "fa-recycle",        color: "#BF8B2E", x: 886,  y: 76,  r: 40 },
  { id: "ods2",  num: 2,  name: "HAMBRE CERO",                             icon: "fa-bowl-food",      color: "#DDA63A", x: 313,  y: 215, r: 60 },
  { id: "ods8",  num: 8,  name: "TRABAJO DECENTE Y CRECIMIENTO ECONÓMICO", icon: "fa-chart-line",     color: "#A21942", x: 562,  y: 242, r: 40 },
  { id: "ods3",  num: 3,  name: "SALUD Y BIENESTAR",                       icon: "fa-heart-pulse",    color: "#4C9F38", x: 836,  y: 270, r: 40 },
  { id: "ods10", num: 10, name: "REDUCCIÓN DE LAS DESIGUALDADES",          icon: "fa-scale-balanced", color: "#DD1367", x: 1049, y: 185, r: 40 },
  { id: "ods6",  num: 6,  name: "AGUA LIMPIA Y SANEAMIENTO",               icon: "fa-droplet",        color: "#26BDE2", x: 72,   y: 342, r: 40 },
  { id: "ods15", num: 15, name: "VIDA DE ECOSISTEMAS TERRESTRES",          icon: "fa-tree",           color: "#56C02B", x: 284,  y: 424, r: 40 },
  { id: "ods13", num: 13, name: "ACCIÓN POR EL CLIMA",                     icon: "fa-globe",          color: "#3F7E44", x: 706,  y: 406, r: 60 },
  { id: "ods7",  num: 7,  name: "ENERGÍA ASEQUIBLE Y NO CONTAMINANTE",     icon: "fa-bolt",           color: "#FCC30B", x: 930,  y: 434, r: 40 },
  { id: "ods16", num: 16, name: "PAZ, JUSTICIA E INSTITUCIONES SÓLIDAS",   icon: "fa-gavel",          color: "#00689D", x: 994,  y: 354, r: 40 },
  { id: "ods4",  num: 4,  name: "EDUCACIÓN DE CALIDAD",                    icon: "fa-book",           color: "#C5192D", x: 183,  y: 654, r: 40 },
  { id: "ods9",  num: 9,  name: "INDUSTRIA, INNOVACIÓN E INFRAESTRUCTURA", icon: "fa-industry",       color: "#FD6925", x: 447,  y: 657, r: 40 },
  { id: "ods11", num: 11, name: "CIUDADES Y COMUNIDADES SOSTENIBLES",      icon: "fa-city",           color: "#FD9D24", x: 639,  y: 692, r: 40 },
  { id: "ods14", num: 14, name: "VIDA SUBMARINA",                         icon: "fa-fish",           color: "#0A97D9", x: 789,  y: 689, r: 40 },
  { id: "ods17", num: 17, name: "ALIANZAS PARA LOGRAR LOS OBJETIVOS",      icon: "fa-handshake",      color: "#19486A", x: 1350, y: 470, r: 40 },
];

/* ODS 1, 2 y 13 son intencionalmente un poco más grandes (r 60) que el resto (r 40, todos iguales) */

/* El punteado depende de si la relación es "no directa" (inferida): las relaciones
   directas se dibujan con línea sólida y las inferidas con línea punteada.
   El color SIEMPRE es el de su tipo (comp verde, func azul, causal rosa, cond naranja),
   verificado contra la leyenda de la imagen de referencia. */
const TYPE_STYLE = {
  comp:   { color: "#4ade80", width: 2,   label: "Complementaria" },
  func:   { color: "#5b8def", width: 2,   label: "Funcional" },
  causal: { color: "#f76fb0", width: 1.1, label: "Causal" },
  cond:   { color: "#ef9552", width: 1.6, label: "Condicionamiento" },
};

/* -------- Aristas: SOLO las conexiones indicadas -------- */
const RAW_EDGES = [
  /* ---- líneas sólidas (relación directa) ---- */
  { s: "ods6",  t: "ods4",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 6 – ODS 4 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods5",  t: "ods4",  type: "comp",   directa: true, pagina: null, sustento: "Conexión ODS 5 – ODS 4 (complementaria), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods1",  t: "ods4",  type: "cond",   directa: true, pagina: null, sustento: "Conexión ODS 1 – ODS 4 (condicionamiento), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods9",  t: "ods15", type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 9 – ODS 15 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods9",  t: "ods4",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 9 – ODS 4 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods9",  t: "ods8",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 9 – ODS 8 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods11", t: "ods13", type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 11 – ODS 13 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods9",  t: "ods13", type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 9 – ODS 13 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento.", curve: -12 },
  { s: "ods13", t: "ods14", type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 14 – ODS 13 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods7",  t: "ods8",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 7 – ODS 8 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods1",  t: "ods13", type: "cond",   directa: true, pagina: null, sustento: "Conexión ODS 1 – ODS 13 (condicionamiento), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods8",  t: "ods12", type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 8 – ODS 12 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods1",  t: "ods10", type: "comp",   directa: true, pagina: null, sustento: "Conexión ODS 1 – ODS 10 (complementaria), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods6",  t: "ods8",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 6 – ODS 8 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods6",  t: "ods2",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 6 – ODS 2 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods2",  t: "ods8",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 2 – ODS 8 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods3",  t: "ods2",  type: "causal", directa: true, pagina: null, sustento: "Conexión ODS 3 – ODS 2 (causal), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods5",  t: "ods1",  type: "comp",   directa: true, pagina: null, sustento: "Conexión ODS 1 – ODS 5 (complementaria), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },

  /* ---- líneas punteadas (relación inferida) ---- */
  { s: "ods1",  t: "ods2",  type: "causal", directa: false, pagina: null, sustento: "Conexión ODS 1 – ODS 2 (causal, inferida), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods1",  t: "ods3",  type: "func",   directa: false, pagina: null, sustento: "Conexión ODS 1 – ODS 3 (funcional, inferida), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods16", t: "ods10", type: "comp",   directa: false, pagina: null, sustento: "Conexión ODS 10 – ODS 16 (complementaria, inferida), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods7",  t: "ods3",  type: "comp",   directa: false, pagina: null, sustento: "Conexión ODS 7 – ODS 3 (complementaria, inferida), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods14", t: "ods2",  type: "comp",   directa: false, pagina: null, sustento: "Conexión ODS 2 – ODS 14 (complementaria, inferida), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods6",  t: "ods3",  type: "comp",   directa: false, pagina: null, sustento: "Conexión ODS 6 – ODS 3 (complementaria, inferida), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
  { s: "ods2",  t: "ods15", type: "cond",   directa: false, pagina: null, sustento: "Conexión ODS 2 – ODS 15 (condicionamiento, inferida), según el mapa de referencia. Pendiente de completar con la cita y página exactas del documento de sustento." },
];

/* "17 → todos": el ODS 17 se conecta con el resto de los ODS */
const TODOS_SUSTENTO = "...a fin de apoyar el logro de los Objetivos de Desarrollo Sostenible en todos los países, particularmente los países en desarrollo.";
const TODOS_PAGINA = 79;
ODS_NODES.forEach(n => {
  if (n.id === "ods17") return;
  RAW_EDGES.push({ s: "ods17", t: n.id, type: "func", directa: true, pagina: TODOS_PAGINA, sustento: TODOS_SUSTENTO, esTodos: true });
});

function nodeById(id) { return ODS_NODES.find(n => n.id === id); }

/* -------- defs: glow por color de nodo + flechas por tipo -------- */
function buildDefs(svg) {
  const defs = document.createElementNS(SVG_NS, "defs");

  const uniqueColors = [...new Set(ODS_NODES.map(n => n.color))];
  uniqueColors.forEach(color => {
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", "glow-" + color.replace("#", ""));
    filter.setAttribute("x", "-60%"); filter.setAttribute("y", "-60%");
    filter.setAttribute("width", "220%"); filter.setAttribute("height", "220%");
    const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "3.2"); blur.setAttribute("result", "blur");
    const merge = document.createElementNS(SVG_NS, "feMerge");
    ["blur", "blur", "SourceGraphic"].forEach(ref => {
      const m = document.createElementNS(SVG_NS, "feMergeNode");
      m.setAttribute("in", ref);
      merge.appendChild(m);
    });
    filter.appendChild(blur); filter.appendChild(merge);
    defs.appendChild(filter);
  });

  Object.entries(TYPE_STYLE).forEach(([type, style]) => {
    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "arrow-" + type);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8"); marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "7"); marker.setAttribute("markerHeight", "7");
    marker.setAttribute("orient", "auto-start-reverse");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M0,0 L10,5 L0,10 z");
    path.setAttribute("fill", style.color);
    marker.appendChild(path);
    defs.appendChild(marker);
  });

  svg.appendChild(defs);
}

/* -------- aristas: grupo con línea visual + línea invisible más ancha para clic -------- */
function drawEdges(svg) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "edges-layer");

  RAW_EDGES.forEach((edge, i) => {
    const s = nodeById(edge.s);
    const t = nodeById(edge.t);
    if (!s || !t) return;
    const style = TYPE_STYLE[edge.type];

    const dx = t.x - s.x, dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / dist, uy = dy / dist;
    const startPad = s.r + 2;
    const endPad = t.r + 8;
    const x1 = s.x + ux * startPad, y1 = s.y + uy * startPad;
    const x2 = t.x - ux * endPad,   y2 = t.y - uy * endPad;

    /* si la arista trae "curve", se dibuja como curva (Q) desplazada en
       perpendicular al segmento, para separarla de otra línea que quede encima */
    let d;
    if (edge.curve) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const px = -uy, py = ux; // perpendicular unitario
      const cx = mx + px * edge.curve, cy = my + py * edge.curve;
      d = `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
    } else {
      d = `M${x1},${y1} L${x2},${y2}`;
    }

    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "edge-group");
    group.setAttribute("data-index", i);
    group.setAttribute("data-type", edge.type);
    group.setAttribute("data-source", edge.s);
    group.setAttribute("data-target", edge.t);
    group.style.setProperty("--edge-color", style.color);

    const hit = document.createElementNS(SVG_NS, "path");
    hit.setAttribute("d", d);
    hit.setAttribute("class", "ods-edge edge-hit");

    const visual = document.createElementNS(SVG_NS, "path");
    visual.setAttribute("d", d);
    visual.setAttribute("class", "ods-edge edge-visual");
    visual.setAttribute("stroke", style.color);
    visual.setAttribute("stroke-width", edge.esTodos ? style.width * 0.7 : style.width);
    if (!edge.directa) visual.setAttribute("stroke-dasharray", "6,5");
    visual.setAttribute("marker-end", `url(#arrow-${edge.type})`);
    visual.setAttribute("opacity", edge.esTodos ? "0.35" : "0.85");

    group.appendChild(visual);
    group.appendChild(hit);
    group.addEventListener("click", () => showEdgeInfo(i));
    g.appendChild(group);
  });

  svg.appendChild(g);
}

/* -------- nodos -------- */
function drawNodes(svg) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "nodes-layer");

  ODS_NODES.forEach(node => {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "ods-node");
    group.setAttribute("data-id", node.id);

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("class", "node-ring");
    circle.setAttribute("cx", node.x); circle.setAttribute("cy", node.y); circle.setAttribute("r", node.r);
    circle.setAttribute("stroke", node.color);
    circle.setAttribute("stroke-width", 2.5);
    circle.setAttribute("filter", "url(#glow-" + node.color.replace("#", "") + ")");

    const fo = document.createElementNS(SVG_NS, "foreignObject");
    const size = node.r * 1.9;
    fo.setAttribute("x", node.x - size / 2); fo.setAttribute("y", node.y - size / 2);
    fo.setAttribute("width", size); fo.setAttribute("height", size);

    const wrapper = document.createElementNS(XHTML_NS, "div");
    wrapper.setAttribute("class", "node-inner");
    wrapper.setAttribute("style",
      "width:100%;height:100%;display:flex;flex-direction:column;" +
      "align-items:center;justify-content:center;gap:1px;pointer-events:none;"
    );

    const numEl = document.createElementNS(XHTML_NS, "div");
    numEl.setAttribute("class", "node-num");
    numEl.setAttribute("style", `color:${node.color}; font-size:${Math.max(node.r * 0.24, 9)}px;`);
    numEl.textContent = node.num;

    const iconEl = document.createElementNS(XHTML_NS, "i");
    iconEl.setAttribute("class", "fa-solid " + node.icon + " node-icon");
    iconEl.setAttribute("style", `color:${node.color}; font-size:${node.r * 0.44}px; margin:1px 0;`);

    const nameEl = document.createElementNS(XHTML_NS, "div");
    nameEl.setAttribute("class", "node-name");
    nameEl.setAttribute("style", `font-size:${Math.max(node.r * 0.145, 6)}px; padding:0 3px;`);
    nameEl.textContent = node.name;

    wrapper.appendChild(numEl); wrapper.appendChild(iconEl); wrapper.appendChild(nameEl);
    fo.appendChild(wrapper);

    group.appendChild(circle);
    group.appendChild(fo);
    attachNodeClickHandler(group, node.id);
    g.appendChild(group);
  });

  svg.appendChild(g);
}

function renderNetwork() {
  const svg = document.getElementById("networkViz");
  if (!svg) return;
  svg.innerHTML = "";
  buildDefs(svg);
  drawEdges(svg);
  drawNodes(svg);
}

/* -------- panel de sustento documental (clic en línea) -------- */
function showEdgeInfo(index) {
  const edge = RAW_EDGES[index];
  const s = nodeById(edge.s), t = nodeById(edge.t);
  const style = TYPE_STYLE[edge.type];

  document.querySelectorAll(".edge-group").forEach(el => el.classList.remove("edge-selected"));
  document.querySelector(`.edge-group[data-index="${index}"]`)?.classList.add("edge-selected");

  document.getElementById("edgeInfoTitle").textContent =
    `ODS ${s.num} → ODS ${t.num}  ·  ${s.name} → ${t.name}`;

  const typeEl = document.getElementById("edgeInfoType");
  typeEl.textContent = style.label + (edge.directa ? " · Directa" : " · Inferida");
  typeEl.style.color = style.color;
  typeEl.style.background = style.color + "26";

  document.getElementById("edgeInfoQuote").textContent = `"${edge.sustento}"`;
  document.getElementById("edgeInfoPage").textContent =
    edge.pagina != null ? `Página: ${edge.pagina}` : "Página: por confirmar";

  document.getElementById("edgeInfoPanel").classList.add("visible");
}

function hideEdgeInfo() {
  document.getElementById("edgeInfoPanel").classList.remove("visible");
  document.querySelectorAll(".edge-group").forEach(el => el.classList.remove("edge-selected"));
}

/* -------- estado de visibilidad: por tipo (leyenda) + por nodo (doble clic) -------- */
const typeOff = new Set();
const nodeOff = new Set();

function refreshEdgeVisibility() {
  document.querySelectorAll(".edge-group").forEach(group => {
    const type = group.dataset.type;
    const s = group.dataset.source;
    const t = group.dataset.target;
    const hidden = typeOff.has(type) || nodeOff.has(s) || nodeOff.has(t);
    group.classList.toggle("hidden-edge", hidden);
  });
}

function toggleNode(id) {
  const group = document.querySelector(`.ods-node[data-id="${id}"]`);
  if (!group) return;
  if (nodeOff.has(id)) {
    nodeOff.delete(id);
    group.classList.remove("node-off");
  } else {
    nodeOff.add(id);
    group.classList.add("node-off");
  }
  refreshEdgeVisibility();
}

/* -------- clic simple / doble / triple sobre una bola --------
   1 clic  -> no hace nada especial
   2 clics -> apaga/enciende el nodo (comportamiento existente)
   3 clics -> aísla el flujo: solo se ven los nodos y líneas que
              se tocan directamente con el nodo elegido
   Se cuentan los clics manualmente (en vez de usar "dblclick")
   para poder distinguir el triple clic de forma confiable. */
function attachNodeClickHandler(group, id) {
  let count = 0;
  let timer = null;
  group.addEventListener("click", () => {
    count++;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (count === 2) {
        toggleNode(id);
      } else if (count >= 3) {
        toggleNodeFlow(id);
      }
      count = 0;
    }, 320);
  });
}

/* -------- spotlight: aísla nodos/líneas (triple clic en una bola O clic en una tarjeta de arriba) --------
   spotlight = null                                   -> todo visible, normal
   spotlight = { mode:"nodes", nodes:Set, expand }     -> solo esos nodos (y si expand=true, también
                                                          sus vecinos directos) quedan visibles
   spotlight = { mode:"types", types:[...] }           -> solo se ven las líneas de esos tipos */
let spotlight = null;

function clearSpotlight() {
  spotlight = null;
  document.querySelectorAll(".insight-card").forEach(c => c.classList.remove("active"));
  applySpotlightState();
}

function setSpotlightNodes(nodeIds, expand) {
  spotlight = { mode: "nodes", nodes: new Set(nodeIds), expand: !!expand };
  document.querySelectorAll(".insight-card").forEach(c => c.classList.remove("active"));
  applySpotlightState();
}

function setSpotlightTypes(types) {
  spotlight = { mode: "types", types };
  document.querySelectorAll(".insight-card").forEach(c => c.classList.remove("active"));
  applySpotlightState();
}

function applySpotlightState() {
  let visibleNodes = null; // null = todos visibles
  let visibleEdges = null;

  if (spotlight && spotlight.mode === "nodes") {
    visibleNodes = new Set(spotlight.nodes);
    visibleEdges = new Set();
    RAW_EDGES.forEach((edge, i) => {
      const sIn = spotlight.nodes.has(edge.s);
      const tIn = spotlight.nodes.has(edge.t);
      if (spotlight.expand) {
        /* triple clic: además de la bola elegida, se muestran sus vecinos directos */
        if (sIn || tIn) {
          visibleEdges.add(i);
          visibleNodes.add(edge.s);
          visibleNodes.add(edge.t);
        }
      } else {
        /* tarjeta de insight: solo se muestran los ODS exactos de la lista */
        if (sIn && tIn) visibleEdges.add(i);
      }
    });
  } else if (spotlight && spotlight.mode === "types") {
    visibleEdges = new Set();
    RAW_EDGES.forEach((edge, i) => {
      if (spotlight.types.includes(edge.type)) visibleEdges.add(i);
    });
  }

  document.querySelectorAll(".ods-node").forEach(el => {
    const id = el.dataset.id;
    const dim = visibleNodes ? !visibleNodes.has(id) : false;
    el.classList.toggle("node-focus-dim", dim);
    el.classList.toggle("node-focus-active", !!(spotlight && spotlight.mode === "nodes" && spotlight.nodes.has(id)));
  });

  document.querySelectorAll(".edge-group").forEach(el => {
    const idx = Number(el.dataset.index);
    const dim = visibleEdges ? !visibleEdges.has(idx) : false;
    el.classList.toggle("edge-focus-dim", dim);
  });
}

function toggleNodeFlow(id) {
  const already = spotlight && spotlight.mode === "nodes" && spotlight.expand &&
                   spotlight.nodes.size === 1 && spotlight.nodes.has(id);
  if (already) {
    clearSpotlight();
  } else {
    setSpotlightNodes([id], true);
  }
}

/* -------- tarjetas de insights (arriba de la red) -------- */
const NODE_INSIGHTS = {
  conectados:   [1, 2, 4, 5, 8, 9, 13],
  hubs:         [1, 2, 13],
  puentes:      [9, 8],
  perifericos:  [16, 7, 10],
};

function toggleInsight(key) {
  const card = document.querySelector(`.insight-card[data-insight="${key}"]`);
  if (!card) return;

  if (card.classList.contains("active")) {
    clearSpotlight();
    return;
  }

  if (key === "predominantes") {
    setSpotlightTypes(["causal", "func"]);
  } else {
    const ids = (NODE_INSIGHTS[key] || []).map(n => "ods" + n);
    setSpotlightNodes(ids, false);
  }

  card.classList.add("active");
}

/* -------- panel de convenciones -------- */
function setupLegendToggle() {
  document.querySelectorAll(".legend-item input").forEach(input => {
    input.addEventListener("change", (e) => {
      const item = e.target.closest(".legend-item");
      const type = item.dataset.type;
      if (e.target.checked) typeOff.delete(type); else typeOff.add(type);
      item.classList.toggle("off", !e.target.checked);
      refreshEdgeVisibility();
    });
  });

  document.getElementById("edgeInfoClose")?.addEventListener("click", hideEdgeInfo);
}

/* -------- controles Todos / Alineados / Conflictos -------- */
function filterNetwork(mode) {
  document.querySelectorAll(".network-controls .control-btn").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");

  const groups = {
    all: ["comp", "func", "causal", "cond"],
    aligned: ["comp", "func"],
    conflicts: ["causal", "cond"],
  };
  const activeTypes = groups[mode] || groups.all;

  document.querySelectorAll(".legend-item[data-type]").forEach(item => {
    const type = item.dataset.type;
    const input = item.querySelector("input");
    const show = activeTypes.includes(type);
    input.checked = show;
    item.classList.toggle("off", !show);
    if (show) typeOff.delete(type); else typeOff.add(type);
  });
  refreshEdgeVisibility();
}

/* -------- botones de acción (placeholders existentes) -------- */
function generateODSReport() { console.log("Generando reporte POT-ODS..."); }
function downloadAlignment() { console.log("Descargando matriz de alineación..."); }
function shareAnalysis() { console.log("Compartiendo análisis..."); }

document.addEventListener("DOMContentLoaded", () => {
  renderNetwork();
  setupLegendToggle();
});
