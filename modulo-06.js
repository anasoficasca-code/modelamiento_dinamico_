/* ==========================================================
   RED POT ↔ ODS — diagrama estático (posiciones fijas)
   Réplica del mapa de relaciones entre los 16 ODS mostrados,
   con bordes de neón del color oficial de cada ODS, y un panel
   de convenciones que solo muestra/oculta líneas (nada se mueve).
   ========================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

/* -------- Nodos: posición fija, tal como en el diagrama de referencia -------- */
const ODS_NODES = [
  { id: "ods5",  num: 5,  name: "Igualdad de género",                         icon: "fa-venus-mars",     color: "#FF3A21", x: 183,  y: 64,  r: 42 },
  { id: "ods1",  num: 1,  name: "Fin de la pobreza",                          icon: "fa-people-group",   color: "#E5243B", x: 610,  y: 78,  r: 58 },
  { id: "ods12", num: 12, name: "Producción y consumo responsables",          icon: "fa-recycle",        color: "#BF8B2E", x: 886,  y: 76,  r: 36 },
  { id: "ods2",  num: 2,  name: "Hambre cero",                                icon: "fa-bowl-food",      color: "#DDA63A", x: 313,  y: 215, r: 50 },
  { id: "ods8",  num: 8,  name: "Trabajo decente y crecimiento económico",    icon: "fa-chart-line",     color: "#A21942", x: 562,  y: 242, r: 50 },
  { id: "ods3",  num: 3,  name: "Salud y bienestar",                         icon: "fa-heart-pulse",    color: "#4C9F38", x: 836,  y: 270, r: 36 },
  { id: "ods10", num: 10, name: "Reducción de las desigualdades",             icon: "fa-scale-balanced", color: "#DD1367", x: 1049, y: 185, r: 40 },
  { id: "ods6",  num: 6,  name: "Agua limpia y saneamiento",                  icon: "fa-droplet",        color: "#26BDE2", x: 72,   y: 342, r: 40 },
  { id: "ods15", num: 15, name: "Vida de ecosistemas terrestres",             icon: "fa-tree",           color: "#56C02B", x: 284,  y: 424, r: 36 },
  { id: "ods13", num: 13, name: "Acción por el clima",                       icon: "fa-globe",          color: "#3F7E44", x: 706,  y: 406, r: 62 },
  { id: "ods7",  num: 7,  name: "Energía asequible y no contaminante",       icon: "fa-bolt",           color: "#FCC30B", x: 930,  y: 434, r: 40 },
  { id: "ods16", num: 16, name: "Paz, justicia e instituciones sólidas",      icon: "fa-gavel",          color: "#00689D", x: 994,  y: 354, r: 36 },
  { id: "ods4",  num: 4,  name: "Educación de calidad",                      icon: "fa-book",           color: "#C5192D", x: 183,  y: 654, r: 50 },
  { id: "ods9",  num: 9,  name: "Industria, innovación e infraestructura",    icon: "fa-industry",       color: "#FD6925", x: 447,  y: 657, r: 50 },
  { id: "ods11", num: 11, name: "Ciudades y comunidades sostenibles",        icon: "fa-city",           color: "#FD9D24", x: 639,  y: 692, r: 36 },
  { id: "ods14", num: 14, name: "Vida submarina",                            icon: "fa-fish",           color: "#0A97D9", x: 789,  y: 689, r: 36 },
];

/* -------- Aristas: tipo define color / grosor / punteado -------- */
const ODS_EDGES = [
  // complementaridas — verde, sólida
  { source: "ods1",  target: "ods5",  type: "comp" },
  { source: "ods1",  target: "ods10", type: "comp" },
  { source: "ods4",  target: "ods6",  type: "comp" },

  // funcional — azul, sólida
  { source: "ods1",  target: "ods3",  type: "func" },
  { source: "ods13", target: "ods7",  type: "func" },
  { source: "ods13", target: "ods14", type: "func" },

  // causal — magenta, fina
  { source: "ods1",  target: "ods9",  type: "causal" },
  { source: "ods1",  target: "ods11", type: "causal" },
  { source: "ods1",  target: "ods14", type: "causal" },
  { source: "ods1",  target: "ods7",  type: "causal" },
  { source: "ods1",  target: "ods4",  type: "causal" },
  { source: "ods1",  target: "ods2",  type: "causal" },
  { source: "ods1",  target: "ods15", type: "causal" },
  { source: "ods13", target: "ods9",  type: "causal" },
  { source: "ods13", target: "ods11", type: "causal" },
  { source: "ods13", target: "ods16", type: "causal" },
  { source: "ods13", target: "ods3",  type: "causal" },
  { source: "ods13", target: "ods8",  type: "causal" },
  { source: "ods13", target: "ods2",  type: "causal" },
  { source: "ods2",  target: "ods4",  type: "causal" },

  // condicionamiento — naranja, punteada
  { source: "ods1", target: "ods8",  type: "cond" },
  { source: "ods2", target: "ods15", type: "cond" },
  { source: "ods8", target: "ods2",  type: "cond" },
];

const TYPE_STYLE = {
  comp:   { color: "#4ade80", width: 2,   dashed: false },
  func:   { color: "#5b8def", width: 2,   dashed: false },
  causal: { color: "#f76fb0", width: 1.1, dashed: false },
  cond:   { color: "#ef9552", width: 1.6, dashed: true  },
};

function nodeById(id) {
  return ODS_NODES.find(n => n.id === id);
}

function buildDefs(svg) {
  const defs = document.createElementNS(SVG_NS, "defs");

  // glow filter por cada color único de nodo
  const uniqueColors = [...new Set(ODS_NODES.map(n => n.color))];
  uniqueColors.forEach(color => {
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", "glow-" + color.replace("#", ""));
    filter.setAttribute("x", "-60%");
    filter.setAttribute("y", "-60%");
    filter.setAttribute("width", "220%");
    filter.setAttribute("height", "220%");

    const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "3.2");
    blur.setAttribute("result", "blur");

    const merge = document.createElementNS(SVG_NS, "feMerge");
    const m1 = document.createElementNS(SVG_NS, "feMergeNode");
    m1.setAttribute("in", "blur");
    const m2 = document.createElementNS(SVG_NS, "feMergeNode");
    m2.setAttribute("in", "blur");
    const m3 = document.createElementNS(SVG_NS, "feMergeNode");
    m3.setAttribute("in", "SourceGraphic");
    merge.appendChild(m1);
    merge.appendChild(m2);
    merge.appendChild(m3);

    filter.appendChild(blur);
    filter.appendChild(merge);
    defs.appendChild(filter);
  });

  // arrow markers por tipo de arista
  Object.entries(TYPE_STYLE).forEach(([type, style]) => {
    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "arrow-" + type);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "7");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("orient", "auto-start-reverse");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M0,0 L10,5 L0,10 z");
    path.setAttribute("fill", style.color);
    marker.appendChild(path);
    defs.appendChild(marker);
  });

  svg.appendChild(defs);
}

function drawEdges(svg) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "edges-layer");

  ODS_EDGES.forEach(edge => {
    const s = nodeById(edge.source);
    const t = nodeById(edge.target);
    if (!s || !t) return;

    const style = TYPE_STYLE[edge.type];
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;

    // recorta el trazo al borde de cada círculo (y deja espacio para la flecha)
    const startPad = s.r + 2;
    const endPad = t.r + 8;
    const x1 = s.x + ux * startPad;
    const y1 = s.y + uy * startPad;
    const x2 = t.x - ux * endPad;
    const y2 = t.y - uy * endPad;

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `M${x1},${y1} L${x2},${y2}`);
    path.setAttribute("class", "ods-edge");
    path.setAttribute("data-type", edge.type);
    path.setAttribute("stroke", style.color);
    path.setAttribute("stroke-width", style.width);
    if (style.dashed) path.setAttribute("stroke-dasharray", "6,5");
    path.setAttribute("marker-end", `url(#arrow-${edge.type})`);
    path.setAttribute("opacity", "0.85");

    g.appendChild(path);
  });

  svg.appendChild(g);
}

function drawNodes(svg) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "nodes-layer");

  ODS_NODES.forEach(node => {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "ods-node");
    group.setAttribute("data-id", node.id);

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("class", "node-ring");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", node.r);
    circle.setAttribute("stroke", node.color);
    circle.setAttribute("stroke-width", 2.5);
    circle.setAttribute("filter", "url(#glow-" + node.color.replace("#", "") + ")");

    const fo = document.createElementNS(SVG_NS, "foreignObject");
    const size = node.r * 1.8;
    fo.setAttribute("x", node.x - size / 2);
    fo.setAttribute("y", node.y - size / 2);
    fo.setAttribute("width", size);
    fo.setAttribute("height", size);

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
    iconEl.setAttribute("style", `color:${node.color}; font-size:${node.r * 0.46}px; margin:1px 0;`);

    const nameEl = document.createElementNS(XHTML_NS, "div");
    nameEl.setAttribute("class", "node-name");
    nameEl.setAttribute("style", `font-size:${Math.max(node.r * 0.155, 6.2)}px; padding:0 3px;`);
    nameEl.textContent = node.name;

    wrapper.appendChild(numEl);
    wrapper.appendChild(iconEl);
    wrapper.appendChild(nameEl);
    fo.appendChild(wrapper);

    group.appendChild(circle);
    group.appendChild(fo);
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

/* -------- Panel de convenciones: solo enciende/apaga, no mueve nada -------- */
function setupLegendToggle() {
  document.querySelectorAll(".legend-item input").forEach(input => {
    input.addEventListener("change", (e) => {
      const item = e.target.closest(".legend-item");
      const type = item.dataset.type;
      const visible = e.target.checked;
      document.querySelectorAll(`.ods-edge[data-type="${type}"]`).forEach(edge => {
        edge.classList.toggle("hidden-edge", !visible);
      });
      item.classList.toggle("off", !visible);
    });
  });
}

/* -------- Controles Todos / Alineados / Conflictos (encienden/apagan tipos de línea) -------- */
function filterNetwork(mode) {
  document.querySelectorAll(".network-controls .control-btn").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");

  const groups = {
    all:       ["comp", "func", "causal", "cond"],
    aligned:   ["comp", "func"],
    conflicts: ["causal", "cond"],
  };
  const activeTypes = groups[mode] || groups.all;

  document.querySelectorAll(".legend-item").forEach(item => {
    const type = item.dataset.type;
    const input = item.querySelector("input");
    const show = activeTypes.includes(type);
    input.checked = show;
    item.classList.toggle("off", !show);
    document.querySelectorAll(`.ods-edge[data-type="${type}"]`).forEach(edge => {
      edge.classList.toggle("hidden-edge", !show);
    });
  });
}

/* -------- Botones de acción (placeholders existentes) -------- */
function generateODSReport() { console.log("Generando reporte POT-ODS..."); }
function downloadAlignment() { console.log("Descargando matriz de alineación..."); }
function shareAnalysis() { console.log("Compartiendo análisis..."); }

document.addEventListener("DOMContentLoaded", () => {
  renderNetwork();
  setupLegendToggle();
});
