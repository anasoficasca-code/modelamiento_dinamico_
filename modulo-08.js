/* ==========================================================
   RED — TENSIONES DEL POT — MEDIR LA RED (Módulo 02)
   diagrama con física de nodos
   - Los nodos parten de una posición fija, pero se pueden ARRASTRAR:
     al mover una bola, las conectadas la "siguen" (fuerza de resorte),
     y el conjunto tiende a volver a su posición original.
   - Cada línea es una tensión medida contra el texto del POT:
     incoherencia, contradicción, desconexión, jerarquía implícita,
     o elemento periférico discursivo.
   - Clic en una línea -> panel con la tensión, el tipo y la frase exacta del POT.
   - Doble clic en una bola -> la apaga (opacidad) y oculta sus líneas.
   - Triple clic en una bola -> aísla su flujo (solo se ven los nodos
     y líneas con los que se conecta directamente).
   - Convenciones:
       Incoherencia:          rojo      #ef4444  continua con flecha
       Contradicción:         rosa      #f76fb0  continua con flecha
       Desconexión:           azul      #5b8def  punteada, sin flecha
       Jerarquía implícita:   morado    #a276f2  doble línea
       Periférico discursivo: amarillo  #f5c945  punteada, sin flecha
   ========================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

/* -------- Nodos: componentes del modelo de ciudad propio, organizados por categoría -------- */
const ODS_NODES = [
  /* infraestructura — izquierda */
  { id: "movilidad",  num: "", name: "MOVILIDAD\n(METRO / VIAS)",  icon: "fa-road",                color: "#2fd4c8", x: 160,  y: 250, r: 60 },
  { id: "vivienda",   num: "", name: "VIVIENDA\nHABITAR",          icon: "fa-house",               color: "#2fd4c8", x: 150,  y: 500, r: 60 },
  { id: "corredores", num: "", name: "CORREDORES\nVERDES",         icon: "fa-seedling",            color: "#2fd4c8", x: 220,  y: 690, r: 54 },
  /* ecologico — centro */
  { id: "cuenca",     num: "", name: "CUENCA DEL\nRIO BOGOTA",     icon: "fa-water",               color: "#4ade80", x: 620,  y: 600, r: 58 },
  { id: "suelos",     num: "", name: "SUELO\nECOLOGICO",           icon: "fa-tree",                color: "#4ade80", x: 500,  y: 400, r: 58 },
  /* social-cuidado — centro-derecha */
  { id: "manzanas",   num: "", name: "MANZANAS\nDEL CUIDADO",      icon: "fa-people-roof",         color: "#5b8def", x: 860,  y: 240, r: 58 },
  { id: "sservicios", num: "", name: "SERVICIOS\nSOCIALES",        icon: "fa-hands-holding-circle", color: "#5b8def", x: 1100, y: 400, r: 56 },
  { id: "patrimonio", num: "", name: "PATRIMONIO\nCULTURAL",       icon: "fa-landmark",            color: "#5b8def", x: 760,  y: 480, r: 54 },
  /* economico — derecha */
  { id: "suelomerc",  num: "", name: "SUELO\nMERCANCIA",           icon: "fa-coins",               color: "#ef9552", x: 1250, y: 220, r: 60 },
  { id: "competitividad", num: "", name: "CIUDAD\nCOMPETITIVA",    icon: "fa-chart-line",          color: "#ef9552", x: 1330, y: 520, r: 56 },
  { id: "inversion",  num: "", name: "INVERSION\nPUBLICA",         icon: "fa-money-bill-trend-up", color: "#ef9552", x: 1080, y: 640, r: 54 },
  /* fenómenos emergentes — los emergentes no son componentes, son lo que la red produce */
  { id: "segregacion", num: "", name: "SEGREGACIÓN\n(EMERGENTE)",  icon: "fa-right-left",          color: "#ef4444", x: 1350, y: 110, r: 46 },
  { id: "trancon",    num: "", name: "TRANCÓN\n(EMERGENTE)",       icon: "fa-traffic-light",       color: "#ef9552", x: 740,  y: 130, r: 46 },
  { id: "salud_urbana", num: "", name: "SALUD URBANA\n(EMERGENTE)", icon: "fa-heart-pulse",         color: "#4ade80", x: 380,  y: 130, r: 46 },
];

/* -------- física: cada nodo guarda su posición "casa" (ancla) y velocidad -------- */
ODS_NODES.forEach(n => {
  n.homeX = n.x; n.homeY = n.y;
  n.vx = 0; n.vy = 0;
  n.fixed = false;
});

/* Tipos de relación del modelo propio */
const TYPE_STYLE = {
  soporte:      { color: "#4ade80", width: 2.6, label: "Relación de soporte" },
  tension:      { color: "#f76fb0", width: 2.6, label: "Relación de tensión" },
  dependencia:  { color: "#5b8def", width: 2.6, label: "Relación de dependencia" },
  emergencia:   { color: "#f5c945", width: 2.4, label: "Relación de emergencia" },
};

/* -------- Aristas semilla del modelo propio: componentes → componentes, 1 a 1 con la tabla -------- */
let RAW_EDGES = [
  { s: "movilidad",   t: "vivienda",   type: "soporte",     directa: true,  sustento: "Supuesto: sin movilidad de calidad, la vivienda queda desconectada del trabajo, la educación y el cuidado; el acceso físico a la ciudad condiciona el derecho a habitarla.", paginaTexto: "Infraestructura → Social" },
  { s: "corredores",  t: "suelos",     type: "soporte",     directa: true,  sustento: "Supuesto: los corredores verdes mantienen la función ecológica del suelo urbano (infiltración, sombra, biodiversidad); son la condición material de que el suelo siga siendo suelo vivo.", paginaTexto: "Infraestructura → Ecológico" },
  { s: "sservicios",  t: "manzanas",   type: "soporte",     directa: true,  sustento: "Supuesto: los servicios sociales (salud, educación, cuidado) son la razón de ser de las Manzanas del Cuidado; sin ellos, las manzanas son solo equipamientos vacíos.", paginaTexto: "Social → Social" },
  { s: "suelomerc",   t: "suelos",     type: "tension",     directa: true,  sustento: "Supuesto crítico: cuando el suelo se trata como mercancía, su valor de cambio subordina su valor ecológico; la urbanización especulativa tensiona el suelo vivo (EURE, 2023).", paginaTexto: "Económico → Ecológico" },
  { s: "competitividad", t: "vivienda", type: "tension",    directa: true,  sustento: "Supuesto crítico: el paradigma de la ciudad competitiva prioriza el territorio rentable sobre el hábitat: la vivienda deja de ser un derecho y se convierte en producto de mercado (Caicedo et al., 2022).", paginaTexto: "Económico → Social" },
  { s: "vivienda",    t: "suelomerc",  type: "dependencia", directa: true,  sustento: "Supuesto: en el modelo actual, la producción de vivienda depende estructuralmente del mercado de suelo y del subsidio; el acceso a habitar queda condicionado por la lógica inmobiliaria.", paginaTexto: "Social → Económico" },
  { s: "movilidad",   t: "inversion",  type: "dependencia", directa: true,  sustento: "Supuesto: las obras de movilidad dependen de la inversión pública y de la capacidad fiscal del Distrito; sin financiación, la red física prometida no existe.", paginaTexto: "Infraestructura → Económico" },
  { s: "cuenca",      t: "sservicios", type: "dependencia", directa: true,  sustento: "Supuesto: la salud pública de la ciudad depende de la cuenca del río Bogotá (agua, inundaciones, enfermedad); si la cuenca enferma, los servicios sociales se colapsan.", paginaTexto: "Ecológico → Social" },
  { s: "suelos",      t: "patrimonio", type: "dependencia", directa: true,  sustento: "Supuesto: el patrimonio cultural material (arqueológico, sitos sagrados) está inscrito en el suelo urbano; su existencia depende de que el suelo lo proteja.", paginaTexto: "Ecológico → Social" },
  { s: "suelomerc",   t: "segregacion", type: "emergencia", directa: true, sustento: "Emergencia: la segregación no está en ningún nodo; surge de la combinación de suelo-mercancía, movilidad desigual y vivienda como producto. Es el fenómeno urbano que produce la configuración.", paginaTexto: "Emergencia estructural" },
  { s: "inversion",   t: "trancon",    type: "emergencia",  directa: true, sustento: "Emergencia: el trancón emerge cuando la inversión en infraestructura crece más rápido que la cobertura del transporte público: no es un defecto de un nodo, sino de su articulación.", paginaTexto: "Emergencia estructural" },
  { s: "corredores",  t: "salud_urbana", type: "emergencia", directa: true, sustento: "Emergencia positiva: la salud urbana (aire, calor, bien­estar) surge de la red de corredores verdes, cuenca y movilidad limpia — el modelo debe explicar cómo se produce.", paginaTexto: "Emergencia estructural" },
];

function nodeById(id) { return ODS_NODES.find(n => n.id === id); }

/* -------- física: longitud de reposo de cada resorte (arista) — macromodelos -------- */
RAW_EDGES.forEach(edge => {
  const s = nodeById(edge.s), t = nodeById(edge.t);
  if (!s || !t) return;
  const dist = Math.hypot(t.x - s.x, t.y - s.y);
  edge.restLength = dist;
  /* repulsión para tensiones: los extremos se mantienen visiblemente apartados */
  if (edge.type === "tension") edge.repel = 40;
});

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
function edgePathData(edge, s, t) {
  const dx = t.x - s.x, dy = t.y - s.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const startPad = s.r + 2;
  const endPad = t.r + 8;
  const x1 = s.x + ux * startPad, y1 = s.y + uy * startPad;
  const x2 = t.x - ux * endPad,   y2 = t.y - uy * endPad;

  if (edge.curve) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const px = -uy, py = ux;
    const cx = mx + px * edge.curve, cy = my + py * edge.curve;
    return `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;
  }
  return `M${x1},${y1} L${x2},${y2}`;
}

/* doble línea paralela para jerarquías implícitas */
function edgePathDataDouble(edge, s, t) {
  const dx = t.x - s.x, dy = t.y - s.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const px = -uy, py = ux;
  const off = 3;
  const startPad = s.r + 2;
  const endPad = t.r + 2;
  const x1 = s.x + ux * startPad, y1 = s.y + uy * startPad;
  const x2 = t.x - ux * endPad,   y2 = t.y - uy * endPad;
  return [
    `M${x1 + px * off},${y1 + py * off} L${x2 + px * off},${y2 + py * off}`,
    `M${x1 - px * off},${y1 - py * off} L${x2 - px * off},${y2 - py * off}`,
  ];
}

function drawEdges(svg) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "edges-layer");

  RAW_EDGES.forEach((edge, i) => {
    const s = nodeById(edge.s);
    const t = nodeById(edge.t);
    if (!s || !t) return;
    const style = TYPE_STYLE[edge.type];
    const d = edgePathData(edge, s, t);

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
    visual.setAttribute("stroke-width", style.width);
    /* emergencia: punteada y sin flecha — es un fenómeno que surge, no una relación directa */
    if (edge.type === "emergencia" || !edge.directa) visual.setAttribute("stroke-dasharray", "6,5");
    if (edge.directa && edge.type !== "emergencia") visual.setAttribute("marker-end", `url(#arrow-${edge.type})`);
    visual.setAttribute("opacity", "0.9");
    edge._el = { visual, hit };

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
    const size = node.r * 2.2;
    fo.setAttribute("x", node.x - size / 2); fo.setAttribute("y", node.y - size / 2);
    fo.setAttribute("width", size); fo.setAttribute("height", size);

    const wrapper = document.createElementNS(XHTML_NS, "div");
    wrapper.setAttribute("class", "node-inner");
    wrapper.setAttribute("style",
      "width:100%;height:100%;display:flex;flex-direction:column;" +
      "align-items:center;justify-content:center;gap:1px;pointer-events:none;"
    );

    const iconEl = document.createElementNS(XHTML_NS, "i");
    iconEl.setAttribute("class", "fa-solid " + node.icon + " node-icon");
    iconEl.setAttribute("style", `color:${node.color}; font-size:${node.r * 0.42}px; margin:1px 0;`);

    const nameEl = document.createElementNS(XHTML_NS, "div");
    nameEl.setAttribute("class", "node-name");
    nameEl.setAttribute("style", `font-size:${Math.max(node.r * 0.155, 7.5)}px; padding:0 3px; font-weight:700; color:#e7eaf2; line-height:1.15; white-space:pre-line;`);
    nameEl.textContent = node.name;

    wrapper.appendChild(iconEl); wrapper.appendChild(nameEl);
    fo.appendChild(wrapper);

    group.appendChild(circle);
    group.appendChild(fo);
    attachNodeClickHandler(group, node.id);
    attachNodeDragHandler(group, node);
    g.appendChild(group);

    node._el = { group, circle, fo };
  });

  svg.appendChild(g);
}

/* -------- física: mover nodos y recalcular líneas cada frame -------- */
const PHYSICS = {
  spring: 0.045,
  anchor: 0.02,
  damping: 0.82,
  minVel: 0.02,
};

function updatePositions() {
  ODS_NODES.forEach(n => {
    if (!n._el) return;
    n._el.circle.setAttribute("cx", n.x);
    n._el.circle.setAttribute("cy", n.y);
    const size = n.r * 2.2;
    n._el.fo.setAttribute("x", n.x - size / 2);
    n._el.fo.setAttribute("y", n.y - size / 2);
  });
  RAW_EDGES.forEach(edge => {
    if (!edge._el) return;
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const d = edgePathData(edge, s, t);
    if (edge.type === "jerarquia" && edge._el.d1) {
      const [d1, d2] = edgePathDataDouble(edge, s, t);
      edge._el.visual.childNodes[0].setAttribute("d", d1);
      edge._el.visual.childNodes[1].setAttribute("d", d2);
    } else {
      edge._el.visual.setAttribute("d", d);
    }
    edge._el.hit.setAttribute("d", d);
  });
}

let physicsRunning = false;
function physicsStep() {
  let moving = false;

  RAW_EDGES.forEach(edge => {
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const dx = t.x - s.x, dy = t.y - s.y;
    const dist = Math.hypot(dx, dy) || 1;
    const diff = (dist - edge.restLength) * PHYSICS.spring;
    const fx = (dx / dist) * diff, fy = (dy / dist) * diff;
    if (edge.repel) {
      /* repulsión: las tensiones implícitas empujan los nodos apartados */
      if (!s.fixed) { s.vx -= fx * 2.2; s.vy -= fy * 2.2; }
      if (!t.fixed) { t.vx += fx * 2.2; t.vy += fy * 2.2; }
    } else {
      if (!s.fixed) { s.vx += fx; s.vy += fy; }
      if (!t.fixed) { t.vx -= fx; t.vy -= fy; }
    }
  });

  ODS_NODES.forEach(n => {
    if (n.fixed) { n.vx = 0; n.vy = 0; return; }
    n.vx += (n.homeX - n.x) * PHYSICS.anchor;
    n.vy += (n.homeY - n.y) * PHYSICS.anchor;
    n.vx *= PHYSICS.damping;
    n.vy *= PHYSICS.damping;
    n.x += n.vx;
    n.y += n.vy;
    if (Math.abs(n.vx) > PHYSICS.minVel || Math.abs(n.vy) > PHYSICS.minVel) moving = true;
  });

  updatePositions();

  if (moving || ODS_NODES.some(n => n.fixed)) {
    requestAnimationFrame(physicsStep);
  } else {
    physicsRunning = false;
  }
}

function wakePhysics() {
  if (!physicsRunning) {
    physicsRunning = true;
    requestAnimationFrame(physicsStep);
  }
}

/* -------- arrastrar una bola -------- */
function attachNodeDragHandler(group, node) {
  const svg = document.getElementById("networkViz");
  let dragging = false;
  let moved = false;
  let startClientX = 0, startClientY = 0;

  function toSvgPoint(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const m = svg.getScreenCTM().inverse();
    return pt.matrixTransform(m);
  }

  group.addEventListener("pointerdown", (e) => {
    dragging = true;
    moved = false;
    startClientX = e.clientX; startClientY = e.clientY;
    node.fixed = true;
    group.classList.add("dragging");
    group.setPointerCapture(e.pointerId);
    wakePhysics();
  });

  group.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (Math.hypot(e.clientX - startClientX, e.clientY - startClientY) > 4) moved = true;
    const p = toSvgPoint(e.clientX, e.clientY);
    node.x = p.x; node.y = p.y;
    node.vx = 0; node.vy = 0;
    updatePositions();
    wakePhysics();
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    node.fixed = false;
    group.classList.remove("dragging");
    try { group.releasePointerCapture(e.pointerId); } catch (err) {}
    wakePhysics();
    if (moved) {
      group.dataset.suppressClick = "1";
      setTimeout(() => { delete group.dataset.suppressClick; }, 0);
    }
  }

  group.addEventListener("pointerup", endDrag);
  group.addEventListener("pointercancel", endDrag);
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

  const title = `${s.name} → ${t.name}`.replace(/\n/g, " ");
  document.getElementById("edgeInfoTitle").textContent = title;

  const typeEl = document.getElementById("edgeInfoType");
  typeEl.textContent = style.label;
  typeEl.style.color = style.color;
  typeEl.style.background = style.color + "26";

  document.getElementById("edgeInfoQuote").textContent = edge.sustento;
  document.getElementById("edgeInfoPage").textContent =
    edge.paginaTexto ? `Categorías: ${edge.paginaTexto}` : "Supuesto por definir: escribe la justificación de esta relación.";

  document.getElementById("edgeInfoPanel").classList.add("visible");

  /* resaltar la fila correspondiente de la tabla */
  document.querySelectorAll(".matrix-row[data-edge]").forEach(row => {
    row.classList.toggle("row-highlight", Number(row.dataset.edge) === index);
  });
}

function hideEdgeInfo() {
  document.getElementById("edgeInfoPanel").classList.remove("visible");
  document.querySelectorAll(".edge-group").forEach(el => el.classList.remove("edge-selected"));
  document.querySelectorAll(".matrix-row[data-edge]").forEach(row => row.classList.remove("row-highlight"));
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

/* -------- clic simple / doble / triple sobre una bola -------- */
function attachNodeClickHandler(group, id) {
  let count = 0;
  let timer = null;
  group.addEventListener("click", () => {
    if (group.dataset.suppressClick) return;
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

/* -------- spotlight -------- */
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
  let visibleNodes = null;
  let visibleEdges = null;

  if (spotlight && spotlight.mode === "nodes") {
    visibleNodes = new Set(spotlight.nodes);
    visibleEdges = new Set();
    RAW_EDGES.forEach((edge, i) => {
      const sIn = spotlight.nodes.has(edge.s);
      const tIn = spotlight.nodes.has(edge.t);
      if (spotlight.expand) {
        if (sIn || tIn) {
          visibleEdges.add(i);
          visibleNodes.add(edge.s);
          visibleNodes.add(edge.t);
        }
      } else {
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

/* -------- tarjetas de insights -------- */
/* categoría de cada nodo */
const NODE_CATEGORY = {
  movilidad: "infra", vivienda: "infra", corredores: "infra",
  cuenca: "eco", suelos: "eco",
  manzanas: "soc", sservicios: "soc", patrimonio: "soc",
  suelomerc: "econ", competitividad: "econ", inversion: "econ",
  segregacion: "econ", trancon: "infra", salud_urbana: "eco",
};
const CATEGORY_LABEL = {
  infra: "Infraestructura", eco: "Ecológico", soc: "Social / Cuidado", econ: "Económico",
};
const CATEGORY_COLOR = {
  infra: "#2fd4c8", eco: "#4ade80", soc: "#5b8def", econ: "#ef9552",
};

const NODE_INSIGHTS = {
  infra: ODS_NODES.filter(n => NODE_CATEGORY[n.id] === "infra").map(n => n.id),
  eco:   ODS_NODES.filter(n => NODE_CATEGORY[n.id] === "eco").map(n => n.id),
  soc:   ODS_NODES.filter(n => NODE_CATEGORY[n.id] === "soc").map(n => n.id),
  econ:  ODS_NODES.filter(n => NODE_CATEGORY[n.id] === "econ").map(n => n.id),
};

function categoryOf(id) { return NODE_CATEGORY[id] || "infra"; }
function assignCategory(node, cat) { NODE_CATEGORY[node.id] = cat; }

function toggleInsight(key) {
  const card = document.querySelector(`.insight-card[data-insight="${key}"]`);
  if (!card) return;

  if (card.classList.contains("active")) {
    clearSpotlight();
    return;
  }

  if (key === "todos") {
    const allIds = ODS_NODES.map(n => n.id);
    setSpotlightNodes(allIds, false);
  } else if (NODE_INSIGHTS[key] && NODE_INSIGHTS[key].length) {
    setSpotlightNodes(NODE_INSIGHTS[key], true);
  } else {
    setSpotlightNodes(ODS_NODES.map(n => n.id), false);
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

/* -------- controles Todos / por tipo de tensión -------- */
function filterNetwork(mode) {
  document.querySelectorAll(".network-controls .control-btn").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");

  const groups = {
    all: ["soporte", "tension", "dependencia", "emergencia"],
    soporte: ["soporte"],
    tension: ["tension"],
    dependencia: ["dependencia"],
    emergencia: ["emergencia"],
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

/* -------- botones de acción (placeholders) -------- */
function generateODSReport() { console.log("Generando reporte de red..."); }
function downloadAlignment() { console.log("Descargando tabla de relaciones..."); }
function shareAnalysis() { console.log("Compartiendo análisis..."); }

/* -------- CONSTRUCTOR: añadir componentes y relaciones -------- */
const ICON_BY_CATEGORY = {
  infra: "fa-road",
  eco: "fa-tree",
  soc: "fa-people-roof",
  econ: "fa-coins",
};

function populateEdgeSelects() {
  const fromSel = document.getElementById("edgeFrom");
  const toSel = document.getElementById("edgeTo");
  if (!fromSel || !toSel) return;
  const currentFrom = fromSel.value;
  const currentTo = toSel.value;
  const buildOptions = (current) => {
    let html = `<option value="">${current ? current : "…"}</option>`;
    ODS_NODES.forEach(n => {
      const label = n.name.replace(/\n/g, " ");
      html += `<option value="${n.id}"${n.id === current ? " selected" : ""}>${label}</option>`;
    });
    return html;
  };
  fromSel.innerHTML = "<option value=\"\">De…</option>" + ODS_NODES.map(n =>
    `<option value="${n.id}"${n.id === currentFrom ? " selected" : ""}>${n.name.replace(/\n/g, " ")}</option>`).join("");
  toSel.innerHTML = "<option value=\"\">Hacia…</option>" + ODS_NODES.map(n =>
    `<option value="${n.id}"${n.id === currentTo ? " selected" : ""}>${n.name.replace(/\n/g, " ")}</option>`).join("");
}

function addNode() {
  const input = document.getElementById("nodeName");
  const sel = document.getElementById("nodeCat");
  const name = (input.value || "").trim().toUpperCase();
  const cat = sel.value;
  if (!name) { flashButton(input.closest(".builder-form").querySelector(".btn-builder")); return; }
  if (ODS_NODES.some(n => n.id === slugify(name))) {
    alert("Ya existe un componente con ese nombre.");
    return;
  }
  const node = {
    id: slugify(name),
    num: "",
    name: name,
    icon: ICON_BY_CATEGORY[cat],
    color: CATEGORY_COLOR[cat],
    x: 500 + Math.random() * 300,
    y: 120 + Math.random() * 300,
    r: 54,
  };
  node.homeX = node.x; node.homeY = node.y;
  node.vx = 0; node.vy = 0; node.fixed = false;
  ODS_NODES.push(node);
  assignCategory(node, cat);
  input.value = "";
  refreshAfterBuilder();
}

function addEdge() {
  const from = document.getElementById("edgeFrom").value;
  const to = document.getElementById("edgeTo").value;
  const type = document.getElementById("edgeType").value;
  const just = document.getElementById("edgeJust").value.trim();
  const btn = document.getElementById("edgeJust").closest(".builder-form").querySelector(".btn-builder");
  if (!from || !to || from === to) { flashButton(btn); return; }
  const s = nodeById(from), t = nodeById(to);
  if (!s || !t) return;
  RAW_EDGES.push({
    s: from,
    t: to,
    type,
    directa: true,
    sustento: just ? `Supuesto: ${just}` : "Supuesto por definir.",
    paginaTexto: `${CATEGORY_LABEL[categoryOf(from)]} → ${CATEGORY_LABEL[categoryOf(to)]}`,
  });
  const last = RAW_EDGES[RAW_EDGES.length - 1];
  last.restLength = Math.hypot(t.x - s.x, t.y - s.y) || 300;
  if (type === "tension") last.repel = 40;
  document.getElementById("edgeJust").value = "";
  flashButton(btn);
  refreshAfterBuilder();
}

function refreshAfterBuilder() {
  populateEdgeSelects();
  renderTable();
  renderNetwork();
}

function flashButton(btn) {
  if (!btn) return;
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 700);
}

function slugify(str) {
  return str.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

const TYPE_TAG_CLASS = {
  soporte: "sop", tension: "tens", dependencia: "dep", emergencia: "emer",
};
const TYPE_LINE_DESC = {
  soporte: "Continua",
  tension: "Continua",
  dependencia: "Continua",
  emergencia: "Punteada",
};

/* -------- tabla del modelo: generada dinámicamente -------- */
function renderTable() {
  const container = document.getElementById("modelTable");
  if (!container) return;
  const header = container.querySelector(".matrix-row.header");
  container.innerHTML = "";
  container.appendChild(header);

  RAW_EDGES.forEach((edge, i) => {
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const style = TYPE_STYLE[edge.type];
    const row = document.createElement("div");
    row.className = "matrix-row";
    row.dataset.edge = i;
    row.innerHTML = `
      <div class="matrix-cell">${i + 1}</div>
      <div class="matrix-cell">${s.name.replace(/\n/g, " ")} → ${t.name.replace(/\n/g, " ")}</div>
      <div class="matrix-cell">${TYPE_LINE_DESC[edge.type]}</div>
      <div class="matrix-cell"><span class="legend-swatch legend-swatch-line" style="border-color:${style.color};${edge.type === "emergencia" ? "border-top-style:dashed;" : ""}"></span><span style="color:${style.color};font-weight:700;">${style.color === "#4ade80" ? "Verde" : style.color === "#f76fb0" ? "Rosa" : style.color === "#5b8def" ? "Azul" : "Amarillo"}</span></div>
      <div class="matrix-cell"><span class="alignment-tag ${TYPE_TAG_CLASS[edge.type]}">${style.label.replace("Relación de ", "").replace(/^./, c => c.toUpperCase())}</span></div>
      <div class="matrix-cell quote-cell">“${edge.sustento}”</div>
    `;
    row.addEventListener("click", () => showEdgeInfo(i));
    container.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNetwork();
  setupLegendToggle();
  populateEdgeSelects();
  renderTable();
});

/* acceso público para extensiones y pruebas */
if (typeof window !== "undefined") {
  window.__odsNodes = ODS_NODES;
  window.__odsEdges = RAW_EDGES;
}
