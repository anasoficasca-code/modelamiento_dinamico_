/* ==========================================================
   MÓDULO 05 — LO QUE NO ESTÁ — POT Bogotá
   Red de ausencias: qué queda por fuera del POT y qué está
   subrepresentado.

   Capas de la red:
   - nodos DECLARADOS (verde): componentes que el POT sí nombra
   - nodos AUSENTES (rojo): lo que no aparece o aparece trivialmente
   - nodos SUBREPRESENTADOS (amarillo): aparecen con un solo
     rol administrativo, pese a sus múltiples roles reales

   Tipos de arista:
   - ausente_absoluto   → línea ROJA punteada, sin flecha
   - subrepresentado    → línea AMARILLA punteada, con flecha
   - declarado_conectado→ línea VERDE continua, con flecha
   - rol_multiple       → línea MORADA doble, sin flecha

   Interacción:
   - Clic en línea → panel con la relación, tipo y sustento
   - Doble clic en nodo → apagarlo
   - Triple clic en nodo → aislar su flujo
   - Tarjetas de insight: filtros por capa
   ========================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";

/* -------- Nodos: declarados, ausentes y subrepresentados -------- */
const ODS_NODES = [
  /* declarados (el POT sí los nombra) */
  { id: "metro",      cat: "declarado",     name: "METRO",                             icon: "fa-train-subway",    color: "#f5c945", x: 470,  y: 130, r: 52 },
  { id: "corredores", cat: "declarado",     name: "CORREDORES\nVERDES",                icon: "fa-tree",            color: "#4ade80", x: 880,  y: 120, r: 54 },
  { id: "manzanas",   cat: "declarado",     name: "MANZANAS\nDEL CUIDADO",             icon: "fa-people-roof",     color: "#f76fb0", x: 700,  y: 400, r: 54 },
  { id: "eep",        cat: "declarado",     name: "EEP / ESTRUCTURA\nECOLÓGICA",       icon: "fa-leaf",            color: "#4ade80", x: 1180, y: 300, r: 56 },
  /* ausentes (no aparecen o aparecen trivialmente) */
  { id: "lotevacio",  cat: "ausente",       name: "LOTE\nVACÍO",                       icon: "fa-warehouse",       color: "#ef4444", x: 140,  y: 480, r: 58 },
  { id: "informales", cat: "ausente",       name: "ECONOMÍA\nINFORMAL",                icon: "fa-cart-shopping",   color: "#ef4444", x: 300,  y: 300, r: 54 },
  { id: "fauna",      cat: "ausente",       name: "FAUNA\nURBANA",                     icon: "fa-dove",            color: "#ef4444", x: 600,  y: 660, r: 52 },
  { id: "riobogota",  cat: "ausente",       name: "RÍO BOGOTÁ\nFUERA DE PERÍMETRO",    icon: "fa-water",           color: "#ef4444", x: 1330, y: 600, r: 56 },
  { id: "muisca",     cat: "ausente",       name: "TIERRAS\nMUISCA",                   icon: "fa-mountain-sun",    color: "#ef4444", x: 110,  y: 160, r: 52 },
  { id: "biodiv",     cat: "ausente",       name: "BIODIVERSIDAD\nESPONTÁNEA",         icon: "fa-seedling",        color: "#ef4444", x: 280,  y: 640, r: 52 },
  /* subrepresentados (un solo rol administrativo) */
  { id: "lluvia",     cat: "subrep",        name: "AGUA\nLLUVIA",                      icon: "fa-cloud-rain",      color: "#f5c945", x: 1050, y: 130, r: 52 },
  { id: "suelo",      cat: "subrep",        name: "SUELO COMO\nM2 EDIFICABLES",        icon: "fa-ruler-combined",  color: "#f5c945", x: 950,  y: 640, r: 54 },
  { id: "humedales",  cat: "subrep",        name: "HUMEDALES\nINVENTARIO ESTÁTICO",    icon: "fa-droplet",         color: "#f5c945", x: 1400, y: 440, r: 52 },
  { id: "ladera",     cat: "subrep",        name: "SUELO EN\nLADERA INFORMAL",         icon: "fa-house-crack",     color: "#f5c945", x: 460,  y: 490, r: 52 },
];

ODS_NODES.forEach(n => {
  n.homeX = n.x; n.homeY = n.y;
  n.vx = 0; n.vy = 0;
  n.fixed = false;
});

/* -------- Tipos de arista -------- */
const TYPE_STYLE = {
  ausente_absoluto:    { color: "#ef4444", width: 2.2, label: "Ausente — no aparece en el POT", arrow: false, dash: "6 5" },
  subrepresentado:     { color: "#f5c945", width: 2.2, label: "Subrepresentado — un solo rol administrativo", arrow: true,  dash: "4 4" },
  declarado_conectado: { color: "#4ade80", width: 2.6, label: "Relación declarada en el POT", arrow: true,  dash: null },
  rol_multiple:        { color: "#a276f2", width: 3.0, label: "Rol múltiple — desempeña varios roles simultáneos", arrow: false, dash: null, doble: true },
};

/* -------- Aristas -------- */
const RAW_EDGES = [
  /* --- ausentes absolutos: no aparecen (o aparecen trivialmente) --- */
  { s: "lotevacio",  t: "suelo",      type: "ausente_absoluto", directa: true, paginaTexto: "El POT lo nombra solo como 'suelo sin desarrollar' o 'lote', nunca como sistema", sustento: "El POT clasifica el lote vacío administrativamente (usos, edificabilidad, impuestos) pero no lo reconoce como hábitat temporal, refugio de especies, espacio de infiltración, corredor ecológico, reservorio de biodiversidad espontánea, lugar de apropiación comunitaria ni reserva de oportunidad inmobiliaria. Ninguno de esos roles aparece en la estructura del plan." },
  { s: "fauna",      t: "eep",        type: "ausente_absoluto", directa: true, paginaTexto: "Estructura ecológica principal", sustento: "La EEP nombra cobertura vegetal, suelo de protección y humedales, pero la fauna urbana (murciélagos, aves insectívoras, polinizadores) no tiene nodos propios: sus roles de polinización, control de plagas y bioindicación son invisibles para el plan." },
  { s: "riobogota",  t: "eep",        type: "ausente_absoluto", directa: true, paginaTexto: "Fuente: Observaciones CCB al POT", sustento: "La Cámara de Comercio de Bogotá señala que el POT omite el Plan de Ordenación y Manejo de la Cuenca del Río Bogotá en su jerarquía de instrumentos, pese a que la estructura ecológica depende directamente de la cuenca. Lo que está fuera del perímetro sigue causando lo que está adentro." },
  { s: "muisca",     t: "metro",      type: "ausente_absoluto", directa: true, paginaTexto: "Trazado de la Primera Línea del Metro", sustento: "Los hallazgos arqueológicos del resguardo indígena Muisca en el trazado de la Primera Línea del Metro visibilizan una tensión que el POT no resuelve: la infraestructura mayor avanza sin declarar mecanismos sistemáticos de protección del patrimonio territorial indígena." },
  { s: "biodiv",     t: "lotevacio",  type: "ausente_absoluto", directa: true, paginaTexto: "Inferencia a partir de la clasificación de usos", sustento: "La biodiversidad espontánea de lotes y predios abandonados no tiene categoría en el POT: es 'no uso'. Y sin embargo desempeña el rol de reservorio de conectividad ecológica entre los fragmentos verdes declarados." },

  /* --- subrepresentados: aparecen con un solo rol administrativo --- */
  { s: "lluvia",     t: "eep",        type: "subrepresentado", directa: true, pagina: 30, paginaTexto: "p. 30 y estructura ecológica", sustento: "El agua lluvia aparece como problema de drenaje a canalizar y como riesgo a mitigar. No aparece como recurso: recarga de acuíferos, base del sistema de humedales y oportunidad para infraestructura verde y cosecha urbana." },
  { s: "suelo",      t: "metro",      type: "subrepresentado", directa: true, pagina: 43, paginaTexto: "p. 43", sustento: "El suelo aparece principalmente como metros cuadrados edificables o como soporte de la infraestructura. Su rol como patrimonio común, filtro térmico, superficie de infiltración y lugar de memoria queda fuera de la categoría 'suelo de expansión' o 'consolidación'." },
  { s: "humedales",  t: "eep",        type: "subrepresentado", directa: true, paginaTexto: "Estructura ecológica", sustento: "Los humedales aparecen como inventario estático de un listado. La red dinámica que los conecta con la cuenca, los acuíferos y las lluvias — su rol hidrológico sistémico — no está representada." },
  { s: "ladera",     t: "suelo",      type: "subrepresentado", directa: true, paginaTexto: "Riesgo y amenaza", sustento: "El suelo en ladera informal aparece como amenaza y riesgo a mitigar. El rol de 'ciudad ya construida con comunidad establecida, redes sociales y economía propia' queda subordinado a la categoría de riesgo." },

  /* --- declarados conectados: la red del POT que ya conocemos --- */
  { s: "metro",      t: "corredores", type: "declarado_conectado", directa: true, pagina: 239, paginaTexto: "pp. 239–241", sustento: "“...además del Metro, y para alimentarlo y complementarlo, están los corredores verdes...” — relación declarada en el POT (ver Módulo 03)." },
  { s: "manzanas",   t: "eep",        type: "declarado_conectado", directa: true, pagina: 126, paginaTexto: "p. 126", sustento: "“...cualifica los servicios sociales del Distrito y hace efectiva la articulación interinstitucional.” — la relación entre cuidado y estructura social está declarada." },

  /* --- rol múltiple: un mismo elemento desempeña varios roles --- */
  { s: "lotevacio",  t: "fauna",      type: "rol_multiple", directa: true, paginaTexto: "Rol múltiple: hábitat temporal + refugio de especies", sustento: "El lote vacío es simultáneamente hábitat temporal de fauna urbana y reservorio de biodiversidad espontánea: un mismo predio sostiene dos sistemas vivos que el plan lee como 'no uso'." },
  { s: "lotevacio",  t: "biodiv",     type: "rol_multiple", directa: true, paginaTexto: "Rol múltiple: infiltración + reservorio", sustento: "El lote vacío es a la vez espacio de infiltración del agua lluvia y corredor ecológico entre fragmentos verdes: roles ecológicos que no se suman en el POT porque no están reconocidos." },
  { s: "informales", t: "manzanas",   type: "rol_multiple", directa: true, paginaTexto: "Rol múltiple: economía de proximidad + red de cuidado", sustento: "La economía informal es motor económico de proximidad, red social de barrio y, de hecho, proveedor de servicios de cuidado y alimentación accesible: roles que la categoría 'reubicación de vendedores' no captura." },
  { s: "humedales",  t: "riobogota",  type: "rol_multiple", directa: true, paginaTexto: "Rol múltiple: filtro + eslabón de cuenca", sustento: "Los humedales son a la vez filtro de calidad de agua, hábitat de aves y eslabón de la cuenca del río Bogotá: su funcionamiento real es de red, no de inventario." },
];

RAW_EDGES.forEach(edge => {
  const s = nodeById(edge.s), t = nodeById(edge.t);
  if (!s || !t) return;
  edge.restLength = Math.hypot(t.x - s.x, t.y - s.y);
});

function nodeById(id) { return ODS_NODES.find(n => n.id === id); }

/* -------- defs -------- */
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

    if (style.doble) {
      const marker2 = document.createElementNS(SVG_NS, "marker");
      marker2.setAttribute("id", "arrow-" + type + "-rev");
      marker2.setAttribute("viewBox", "0 0 10 10");
      marker2.setAttribute("refX", "2"); marker2.setAttribute("refY", "5");
      marker2.setAttribute("markerWidth", "7"); marker2.setAttribute("markerHeight", "7");
      marker2.setAttribute("orient", "auto-start-reverse");
      const path2 = document.createElementNS(SVG_NS, "path");
      path2.setAttribute("d", "M10,0 L0,5 L10,10 z");
      path2.setAttribute("fill", style.color);
      marker2.appendChild(path2);
      defs.appendChild(marker2);
    }
  });

  svg.appendChild(defs);
}

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

/* -------- física -------- */
let rafId = null;
let dragging = null;
let dragOffsetX = 0, dragOffsetY = 0;
let moved = false;

function wakePhysics() {
  if (rafId) return;
  rafId = requestAnimationFrame(tick);
}

function tick() {
  rafId = null;
  let active = false;
  const k = 0.012;          /* resorte */
  const homeK = 0.006;      /* ancla */
  const damp = 0.82;

  RAW_EDGES.forEach(edge => {
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const dx = t.x - s.x, dy = t.y - s.y;
    const dist = Math.hypot(dx, dy) || 1;
    const force = (dist - edge.restLength) * k;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    s.vx += fx; s.vy += fy;
    t.vx -= fx; t.vy -= fy;
  });

  ODS_NODES.forEach(n => {
    if (n.fixed) return;
    n.vx += (n.homeX - n.x) * homeK;
    n.vy += (n.homeY - n.y) * homeK;
    n.vx *= damp; n.vy *= damp;
    n.x += n.vx; n.y += n.vy;
    if (Math.abs(n.vx) > 0.02 || Math.abs(n.vy) > 0.02) active = true;
  });

  updatePositions();

  if (active) wakePhysics();
}

function updatePositions() {
  ODS_NODES.forEach(n => {
    const group = document.querySelector(`.ods-node[data-id="${n.id}"]`);
    if (group) group.setAttribute("transform", `translate(${n.x},${n.y})`);
  });
  RAW_EDGES.forEach((edge, i) => {
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const line = document.querySelector(`.edge-hit[data-index="${i}"]`);
    const vis = document.querySelector(`.edge-vis[data-index="${i}"]`);
    if (!line) return;
    const d = edgePathData(edge, s, t);
    line.setAttribute("d", d);
    if (vis) vis.setAttribute("d", d);
    const rev = document.querySelector(`.edge-vis[data-index="${i}"].rev`);
    if (rev) rev.setAttribute("d", d);
  });
}

/* -------- dibujar -------- */
function renderNetwork() {
  const svg = document.getElementById("networkViz");
  if (!svg) return;
  svg.innerHTML = "";
  buildDefs(svg);
  drawEdges(svg);
  drawNodes(svg);
}

function drawEdges(svg) {
  RAW_EDGES.forEach((edge, i) => {
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const style = TYPE_STYLE[edge.type];

    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "edge-group");
    group.setAttribute("data-index", i);
    group.setAttribute("data-type", edge.type);
    group.setAttribute("data-source", edge.s);
    group.setAttribute("data-target", edge.t);

    const hit = document.createElementNS(SVG_NS, "path");
    hit.setAttribute("class", "edge-hit");
    hit.setAttribute("data-index", i);
    hit.setAttribute("fill", "none");
    hit.setAttribute("stroke", "transparent");
    hit.setAttribute("stroke-width", "14");
    hit.style.cursor = "pointer";

    const vis = document.createElementNS(SVG_NS, "path");
    vis.setAttribute("class", "edge-vis");
    vis.setAttribute("data-index", i);
    vis.setAttribute("fill", "none");
    vis.setAttribute("stroke", style.color);
    vis.setAttribute("stroke-width", style.width);
    vis.setAttribute("opacity", "0.75");
    if (style.dash) vis.setAttribute("stroke-dasharray", style.dash);
    if (style.doble) {
      vis.setAttribute("marker-start", `url(#arrow-${edge.type}-rev)`);
      vis.setAttribute("marker-end", `url(#arrow-${edge.type})`);
      vis.setAttribute("opacity", "0.9");
      const rev = vis.cloneNode(true);
      rev.setAttribute("class", "edge-vis rev");
      rev.setAttribute("transform", "translate(0, 4)");
      group.appendChild(rev);
    } else if (style.arrow) {
      vis.setAttribute("marker-end", `url(#arrow-${edge.type})`);
    }

    group.appendChild(hit);
    group.appendChild(vis);
    svg.appendChild(group);

    hit.addEventListener("click", () => showEdgeInfo(i));
  });
  updatePositions();
}

function drawNodes(svg) {
  const catLabel = { declarado: "DECLARADO", ausente: "AUSENTE", subrep: "SUBREPRESENTADO" };
  ODS_NODES.forEach(n => {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "ods-node ods-node-" + n.cat);
    group.setAttribute("data-id", n.id);
    group.setAttribute("data-cat", n.cat);
    group.setAttribute("transform", `translate(${n.x},${n.y})`);

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("r", n.r);
    circle.setAttribute("fill", "#141b2d");
    circle.setAttribute("stroke", n.color);
    circle.setAttribute("stroke-width", "3");
    circle.setAttribute("filter", `url(#glow-${n.color.replace("#", "")})`);
    group.appendChild(circle);

    /* anillo punteado para ausentes y subrepresentados */
    if (n.cat !== "declarado") {
      const ring = document.createElementNS(SVG_NS, "circle");
      ring.setAttribute("r", n.r + 6);
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", n.color);
      ring.setAttribute("stroke-width", "1.5");
      ring.setAttribute("stroke-dasharray", "4 4");
      ring.setAttribute("opacity", "0.6");
      group.appendChild(ring);
    }

    const iconG = document.createElementNS(SVG_NS, "g");
    iconG.setAttribute("transform", "translate(-14,-30)");
    const icon = document.createElementNS(SVG_NS, "text");
    icon.setAttribute("class", "fa " + n.icon);
    icon.setAttribute("fill", n.color);
    icon.setAttribute("font-size", "24");
    icon.setAttribute("text-anchor", "middle");
    iconG.appendChild(icon);
    group.appendChild(iconG);

    const nameLines = n.name.split("\n");
    nameLines.forEach((line, li) => {
      const text = document.createElementNS(SVG_NS, "text");
      text.setAttribute("y", 8 + li * 16);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#e8ecf4");
      text.setAttribute("font-size", "11");
      text.setAttribute("font-weight", "700");
      text.setAttribute("font-family", "Space Grotesk, sans-serif");
      text.textContent = line;
      group.appendChild(text);
    });

    const catTag = document.createElementNS(SVG_NS, "text");
    catTag.setAttribute("y", 8 + nameLines.length * 16);
    catTag.setAttribute("text-anchor", "middle");
    catTag.setAttribute("fill", n.color);
    catTag.setAttribute("font-size", "9");
    catTag.setAttribute("font-weight", "600");
    catTag.textContent = catLabel[n.cat];
    group.appendChild(catTag);

    attachDragHandlers(group, n);
    attachNodeClickHandler(group, n.id);
    svg.appendChild(group);
  });
}

/* -------- arrastre -------- */
function attachDragHandlers(group, node) {
  group.style.cursor = "grab";

  function startDrag(e) {
    if (e.button && e.button !== 0) return;
    e.preventDefault();
    const pt = svgPoint(e);
    dragging = node;
    dragOffsetX = pt.x - node.x;
    dragOffsetY = pt.y - node.y;
    node.fixed = true;
    moved = false;
    group.classList.add("dragging");
    group.setPointerCapture(e.pointerId);
  }

  function onDrag(e) {
    if (dragging !== node) return;
    const pt = svgPoint(e);
    const newX = pt.x - dragOffsetX;
    const newY = pt.y - dragOffsetY;
    if (Math.hypot(newX - node.x, newY - node.y) > 2) moved = true;
    node.x = newX; node.y = newY;
    updatePositions();
  }

  function endDrag(e) {
    if (dragging !== node) return;
    dragging = null;
    node.fixed = false;
    group.classList.remove("dragging");
    try { group.releasePointerCapture(e.pointerId); } catch (err) {}
    wakePhysics();
    if (moved) {
      group.dataset.suppressClick = "1";
      setTimeout(() => { delete group.dataset.suppressClick; }, 0);
    }
  }

  group.addEventListener("pointerdown", startDrag);
  group.addEventListener("pointermove", onDrag);
  group.addEventListener("pointerup", endDrag);
  group.addEventListener("pointercancel", endDrag);
}

function svgPoint(e) {
  const svg = document.getElementById("networkViz");
  const pt = svg.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

/* -------- panel de sustento -------- */
function showEdgeInfo(index) {
  const edge = RAW_EDGES[index];
  const s = nodeById(edge.s), t = nodeById(edge.t);
  const style = TYPE_STYLE[edge.type];

  document.querySelectorAll(".edge-group").forEach(el => el.classList.remove("edge-selected"));
  document.querySelector(`.edge-group[data-index="${index}"]`)?.classList.add("edge-selected");

  const label = (n) => n.name.replace(/\n/g, " ");
  document.getElementById("edgeInfoTitle").textContent = `${label(s)} → ${label(t)}`;

  const typeEl = document.getElementById("edgeInfoType");
  typeEl.textContent = style.label + (edge.directa ? " · Directa" : " · Inferida");
  typeEl.style.color = style.color;
  typeEl.style.background = style.color + "26";

  document.getElementById("edgeInfoQuote").textContent = edge.sustento;
  document.getElementById("edgeInfoPage").textContent =
    edge.paginaTexto ? `Referencia: ${edge.paginaTexto}` : (edge.pagina != null ? `Página POT: p. ${edge.pagina}` : "Referencia: por confirmar");

  document.getElementById("edgeInfoPanel").classList.add("visible");

  document.querySelectorAll(".matrix-row[data-edge]").forEach(row => {
    row.classList.toggle("row-highlight", Number(row.dataset.edge) === index);
  });
}

function hideEdgeInfo() {
  document.getElementById("edgeInfoPanel").classList.remove("visible");
  document.querySelectorAll(".edge-group").forEach(el => el.classList.remove("edge-selected"));
  document.querySelectorAll(".matrix-row[data-edge]").forEach(row => row.classList.remove("row-highlight"));
}

/* -------- visibilidad -------- */
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

/* -------- insights -------- */
const NODE_INSIGHTS = {
  ausentes:       ["lotevacio", "informales", "fauna", "riobogota", "muisca", "biodiv"],
  subrepresentados:["lluvia", "suelo", "humedales", "ladera"],
  declarados:     ["metro", "corredores", "manzanas", "eep"],
  multirrol:      ["lotevacio", "fauna", "biodiv", "informales", "humedales", "riobogota"],
};

const TYPE_KEY = {
  ausente_absoluto: "ausente_absoluto",
  subrepresentado: "subrepresentado",
  declarado_conectado: "declarado_conectado",
  rol_multiple: "rol_multiple",
};

function toggleInsight(key) {
  const card = document.querySelector(`.insight-card[data-insight="${key}"]`);
  if (!card) return;

  if (card.classList.contains("active")) {
    clearSpotlight();
    return;
  }

  if (TYPE_KEY[key]) {
    setSpotlightTypes([TYPE_KEY[key]]);
  } else if (key === "todos") {
    setSpotlightNodes(ODS_NODES.map(n => n.id), false);
  } else if (NODE_INSIGHTS[key] && NODE_INSIGHTS[key].length) {
    setSpotlightNodes(NODE_INSIGHTS[key], true);
  } else {
    setSpotlightNodes(ODS_NODES.map(n => n.id), false);
  }

  card.classList.add("active");
}

/* -------- leyenda -------- */
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

/* -------- filtros -------- */
function filterNetwork(mode) {
  document.querySelectorAll(".network-controls .control-btn").forEach(btn => btn.classList.remove("active"));
  const btn = [...document.querySelectorAll(".network-controls .control-btn")].find(b => b.textContent.trim().toLowerCase().startsWith(mode === "all" ? "todos" : TYPE_STYLE[mode].label.slice(0, 7).toLowerCase()));
  (btn || document.querySelector(`.network-controls .control-btn`)).classList.add("active");

  const groups = {
    all: ["ausente_absoluto", "subrepresentado", "declarado_conectado", "rol_multiple"],
    ausente_absoluto: ["ausente_absoluto"],
    subrepresentado: ["subrepresentado"],
    declarado_conectado: ["declarado_conectado"],
    rol_multiple: ["rol_multiple"],
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

/* -------- multirrol del lote vacío -------- */
const LOTE_ROLES = [
  { titulo: "Hábitat temporal", texto: "El lote vacío aloja especies que han perdido su hábitat original: aves, reptiles, insectos y flora ruderal encuentran refugio entre escombros y vegetación espontánea.", icon: "fa-egg" },
  { titulo: "Refugio de especies", texto: "Funciona como refugio de polinizadores, aves insectívoras y murciélagos urbanos que prestan servicios ecosistémicos gratuitos a la ciudad: polinización y control de plagas.", icon: "fa-dove" },
  { titulo: "Espacio de infiltración", texto: "La superficie permeable del lote permite que el agua lluvia se infiltre y recargue los acuíferos, reduciendo la carga de las alcantarillas y el riesgo de inundación.", icon: "fa-droplet" },
  { titulo: "Corredor ecológico", texto: "Cuando se encadena con otros lotes y franjas verdes, el lote vacío conecta fragmentos de la estructura ecológica y permite el movimiento de especies por la ciudad.", icon: "fa-route" },
  { titulo: "Reservorio de biodiversidad espontánea", texto: "Es un banco vivo de biodiversidad ruderal: plantas pioneras que colonizan, estabilizan el suelo y preparan la sucesión ecológica sin intervención humana.", icon: "fa-seedling" },
  { titulo: "Apropiación comunitaria", texto: "Vecinos lo ocupan como cancha, huerta, parqueadero comunitario o lugar de encuentro: una infraestructura social informal que el plan no registra.", icon: "fa-people-group" },
  { titulo: "Oportunidad inmobiliaria", texto: "El mercado lo lee como reserva especulativa de suelo: su 'vacancia' es a menudo una decisión financiera, no un abandono, y tensiona el acceso a la vivienda.", icon: "fa-chart-line" },
  { titulo: "Amortiguador térmico", texto: "La vegetación espontánea y el suelo desnudo reducen el efecto de isla de calor frente al concreto, regulando la temperatura del barrio.", icon: "fa-temperature-low" },
];

function renderLoteRoles() {
  const wrap = document.getElementById("loteRoles");
  if (!wrap) return;
  wrap.innerHTML = "";
  LOTE_ROLES.forEach((role, i) => {
    const card = document.createElement("div");
    card.className = "multirrol-card";
    card.dataset.index = i;
    card.innerHTML = `<div class="multirrol-icon"><i class="fa-solid ${role.icon}"></i></div><h5>${role.titulo}</h5><p>${role.texto}</p>`;
    card.addEventListener("mouseenter", () => highlightRole(i));
    card.addEventListener("mouseleave", () => unhighlightRole());
    card.addEventListener("click", () => toggleRoleCard(card, i));
    wrap.appendChild(card);
  });
}

function highlightRole(i) {
  document.querySelectorAll(".multirrol-card").forEach((card, ci) => {
    card.classList.toggle("role-focus", ci === i);
  });
  const node = document.querySelector(`.ods-node[data-id="lotevacio"]`);
  if (node) node.classList.add("node-focus-active");
}

function unhighlightRole() {
  document.querySelectorAll(".multirrol-card").forEach(card => card.classList.remove("role-focus"));
  document.querySelectorAll(".ods-node").forEach(node => node.classList.remove("node-focus-active"));
}

function toggleRoleCard(card, i) {
  if (card.classList.contains("active")) {
    card.classList.remove("active");
  } else {
    document.querySelectorAll(".multirrol-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    highlightRole(i);
  }
}

/* -------- acciones -------- */
function generateODSReport() { console.log("Generando reporte de ausencias..."); }
function downloadAlignment() { console.log("Descargando tabla de invisibilizados..."); }
function shareAnalysis() { console.log("Compartiendo análisis..."); }

document.addEventListener("DOMContentLoaded", () => {
  renderNetwork();
  setupLegendToggle();
  renderLoteRoles();
});
