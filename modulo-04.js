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

/* -------- Nodos: macromodelos (bolas grandes) y evidencias estructurales (bolas pequeñas) -------- */
const ODS_NODES = [
  /* macromodelos operativos — izquierda */
  { id: "desarrollista", num: "", name: "DESARROLLISTA",                    icon: "fa-city",                color: "#ef4444", x: 160,  y: 200, r: 62 },
  { id: "mercantilista", num: "", name: "MERCANTILISTA",                    icon: "fa-coins",               color: "#f97316", x: 140,  y: 400, r: 62 },
  { id: "empresarial",   num: "", name: "EMPRESARIAL\nNEOLIBERAL",          icon: "fa-briefcase",           color: "#dc2626", x: 170,  y: 600, r: 60 },
  /* macromodelos declarados — centro */
  { id: "ambientalista", num: "", name: "AMBIENTALISTA",                    icon: "fa-leaf",                color: "#2fd4c8", x: 700,  y: 560, r: 62 },
  { id: "cuidado",       num: "", name: "DEL CUIDADO\nCOMUNITARIO",         icon: "fa-heart",               color: "#2fd4c8", x: 920,  y: 640, r: 60 },
  { id: "patrimonial",   num: "", name: "PATRIMONIAL\nSAGRADO",             icon: "fa-landmark",            color: "#2fd4c8", x: 470,  y: 640, r: 58 },
  /* macromodelos operativos — derecha */
  { id: "tecnocratico",  num: "", name: "TECNOCRÁTICO",                     icon: "fa-gears",               color: "#b91c1c", x: 1120, y: 160, r: 62 },
  { id: "productivista", num: "", name: "PRODUCTIVISTA",                    icon: "fa-train-subway",        color: "#ef4444", x: 1290, y: 380, r: 60 },
  { id: "estatista",     num: "", name: "ESTATISTA\nJURÍDICO",              icon: "fa-scale-balanced",      color: "#ea580c", x: 1240, y: 600, r: 58 },
  /* macromodelos periféricos — extremos */
  { id: "religioso",     num: "", name: "RELIGIOSO\nSIMBÓLICO",             icon: "fa-place-of-worship",    color: "#f5c945", x: 270,  y: 120, r: 46 },
  { id: "tecnoing",      num: "", name: "TECNO-INGENIERIL\n(LE CORBUSIER)",  icon: "fa-ruler-combined",      color: "#f5c945", x: 420,  y: 300, r: 46 },
  { id: "colectivista",  num: "", name: "COLECTIVISTA",                     icon: "fa-hand-holding-heart",  color: "#f5c945", x: 1340, y: 150, r: 46 },
  /* evidencias estructurales — centro-superior */
  { id: "ev_actuaciones", num: "", name: "ACTUACIONES\nESTRATÉGICAS",       icon: "fa-map",                 color: "#8de8c4", x: 560,  y: 180, r: 44 },
  { id: "ev_competitividad", num: "", name: "CIUDAD\nCOMPETITIVA",          icon: "fa-chart-line",          color: "#8de8c4", x: 760,  y: 300, r: 46 },
  { id: "ev_vivienda",   num: "", name: "VIVIENDA\nVIS MERCANCÍA",          icon: "fa-house-circle-xmark",  color: "#8de8c4", x: 400,  y: 460, r: 44 },
  { id: "ev_estructuras", num: "", name: "EEP / EFC / EIP\nESTRUCTURAS",    icon: "fa-layer-group",         color: "#8de8c4", x: 680,  y: 420, r: 44 },
  { id: "ev_metro",      num: "", name: "METRO /\nINFRAESTRUCTURA",         icon: "fa-road",                color: "#8de8c4", x: 1020, y: 400, r: 44 },
  { id: "ev_ley388",     num: "", name: "LEY 388\nPOT INSTRUMENTO",         icon: "fa-file-contract",       color: "#8de8c4", x: 1080, y: 260, r: 42 },
  { id: "ev_manzanas",   num: "", name: "MANZANAS\nDEL CUIDADO",            icon: "fa-people-roof",         color: "#8de8c4", x: 790,  y: 140, r: 42 },
  { id: "ev_patrimonio", num: "", name: "PATRIMONIO\nSITIOS SAGRADOS",      icon: "fa-monument",            color: "#8de8c4", x: 250,  y: 280, r: 42 },
  { id: "ev_sagrados",   num: "", name: "SISTEMA\nSITIOS SAGRADOS",         icon: "fa-spa",                 color: "#fde68a", x: 120,  y: 120, r: 38 },
  { id: "ev_lecorbusier", num: "", name: "PLAN PIL\'OTO\n1947",             icon: "fa-drafting-compass",    color: "#fde68a", x: 520,  y: 120, r: 38 },
  { id: "ev_sserv",      num: "", name: "SERVICIOS\nSOCIALES",              icon: "fa-hands-holding-circle", color: "#fde68a", x: 1340, y: 480, r: 38 },
];

/* -------- física: cada nodo guarda su posición "casa" (ancla) y velocidad -------- */
ODS_NODES.forEach(n => {
  n.homeX = n.x; n.homeY = n.y;
  n.vx = 0; n.vy = 0;
  n.fixed = false;
});

/* Tipos de influencia del macromodelo (módulo 04) */
const TYPE_STYLE = {
  operativo: { color: "#ef4444", width: 2.6, label: "Macromodelo operativo" },
  declarado: { color: "#2fd4c8", width: 2.6, label: "Macromodelo declarado" },
  periferico: { color: "#f5c945", width: 2.4, label: "Influencia periférica" },
  tension:   { color: "#f76fb0", width: 2.6, label: "Tensión declarado vs. operativo" },
};

/* -------- Aristas: macromodelos → evidencias estructurales, 1 a 1 con la tabla -------- */
const RAW_EDGES = [
  { s: "desarrollista", t: "ev_actuaciones", type: "operativo", directa: true,  pagina: null, sustento: "Las Actuaciones Estratégicas “bloquean 6.000 hectáreas de suelo desarrollable en Bogotá, hasta que sean reglamentadas por el Distrito y dentro de un plazo máximo de 6 años, que se vence en el 2027.” (Decreto 555 de 2021, rev. POT) La lógica del suelo como mercancía que se libera progresivamente al mercado estructura el modelo de ocupación del territorio.", paginaTexto: "Fuente: Decreto 555 de 2021; ProBogotá" },
  { s: "empresarial",   t: "ev_competitividad", type: "operativo", directa: true,  pagina: null, sustento: "“Nuestro Acuerdo para la Equidad y la Inversión propone un sistema tributario más progresivo... y propone un amplio paquete de incentivos para atraer más inversión que genere empleos.” $77 billones de inversión proyectada 2025–2035, Bogotá como “principal centro de inversión de América Latina”. (Secretaría de Hacienda, ago. 2025) La ciudad se administra como plataforma de atracción de capital.", paginaTexto: "Fuente: Acuerdo Equidad e Inversión, 2025" },
  { s: "mercantilista", t: "ev_vivienda", type: "operativo", directa: true,  pagina: null, sustento: "“La VIS pasó de ser una responsabilidad del Estado colombiano... a ser una mercancía que responde a los intereses operativos del mercado con la entrada en vigor del modelo neoliberal en la planificación de las ciudades en el país.” (Caicedo, Murcia y Parada, 2022) El POT “no contrarresta fenómenos asociados a la concepción de la vivienda únicamente como una solución funcional o económica”.", paginaTexto: "Fuente: Caicedo et al., 2022" },
  { s: "tecnocratico",  t: "ev_estructuras", type: "operativo", directa: true,  pagina: null, sustento: "Lefebvre: el “espacio concebido” por las autoridades y los tecnócratas es “un espacio cuantificable, formal, que negaría las diferencias y que tiende a la homogeneización”. (Beuf, 2016, Cuadernos de Geografía UNAL) Las estructuras del POT (EEP, EFC, EIP) son precisamente ese espacio concebido por equipos técnicos.", paginaTexto: "Fuente: Beuf, 2016" },
  { s: "productivista", t: "ev_metro", type: "operativo", directa: true,  pagina: 43,   sustento: "“Además del Metro, Bogotá necesita con urgencia ampliar sus entradas y salidas, tapar más huecos, hacer más vías, ciclorrutas, cables y corredores verdes con buses eléctricos para que el transporte público de calidad llegue a todas partes...” La obra de infraestructura es el sujeto gramatical del documento: la ciudad se define por lo que construye.", paginaTexto: "p. 43" },
  { s: "estatista",     t: "ev_ley388", type: "operativo", directa: true,  pagina: null, sustento: "La Ley 388 de 1997 “marcó un hito en el ordenamiento territorial del país, incorporando la ruta para la planeación del territorio a partir de los POT”, que contienen “los objetivos, directrices, políticas, estrategias, metas, programas, actuaciones y normas para orientar el desarrollo físico del territorio, así como los instrumentos para la gestión y financiación del mismo.” (ProBogotá) El POT es ante todo producto del marco jurídico.", paginaTexto: "Fuente: Ley 388 de 1997; ProBogotá" },
  { s: "ambientalista", t: "ev_estructuras", type: "declarado", directa: true,  pagina: 30,   sustento: "“Que, en todo caso, las diversas zonas de la ciudad estén conectadas por un sistema multimodal de transporte público, colectivo, de energías limpias y renovables basadas en la red Metro y alimentadas por los demás modos y medios de transporte público como los corredores verdes, los cables y las ciclorrutas.” El discurso ambiental articula el relato, pero en la red operativa la movilidad y la economía concentran las conexiones.", paginaTexto: "p. 30" },
  { s: "cuidado",       t: "ev_manzanas", type: "declarado", directa: true,  pagina: 122,  sustento: "p. 122: “Las Manzanas del Cuidado son áreas acotadas que agrupan diversas infraestructuras para brindar servicios de manera simultánea y articulada a las personas cuidadoras, a quienes ellas cuidan y a sus familias.” p. 125: aprovechar los equipamientos como anclas “fue el cuello de botella que se resolvió con el pot.” El cuidado entra al modelo como problema logístico a resolver, no como paradigma rector.", paginaTexto: "p. 122 / p. 125" },
  { s: "patrimonial",   t: "ev_patrimonio", type: "declarado", directa: true,  pagina: 186,  sustento: "p. 186: “son el testimonio de complejas estrategias de cómo interpretamos y valoramos las huellas del territorio que habitamos.” p. 196: “la EIP inscribe y precisa un sistema de relaciones del patrimonio cultural material, inmaterial y natural en el territorio.” El patrimonio es central en el relato, pero estructuralmente queda “inscrito” dentro de otra estructura: subordinado.", paginaTexto: "p. 186 / p. 196" },
  { s: "religioso",     t: "ev_sagrados", type: "periferico", directa: false, pagina: 186,  sustento: "El Sistema de Sitios Sagrados y los patrimonios de comunidades son reconocidos como huellas del territorio, pero no tienen conexiones operativas con vivienda, movilidad o economía: son nodos-hoja del modelo, presentes en el discurso, ausentes de la estructura.", paginaTexto: "p. 186" },
  { s: "tecnoing",      t: "ev_lecorbusier", type: "periferico", directa: false, pagina: null, sustento: "El Acuerdo 21 de 1944 nació con “un criterio de ingeniería y desarrollo de infraestructura”; Le Corbusier (1947) legó la zonificación por actividades y el sistema vial norte–sur; el Plan Piloto (1957) las operó. Es el substrato histórico del modelo, ya no nombrado pero operante en sus formas. (ProBogotá)", paginaTexto: "Fuente: ProBogotá" },
  { s: "colectivista",  t: "ev_sserv", type: "periferico", directa: false, pagina: 126,  sustento: "“...cualifica los servicios sociales del Distrito y hace efectiva la articulación interinstitucional.” El registro colectivista del Estado social aparece, pero solo como anexo funcional de los equipamientos: sin vínculo con la red que determina el acceso físico a esos servicios.", paginaTexto: "p. 126" },
  { s: "ambientalista", t: "empresarial", type: "tension", directa: false, pagina: null, sustento: "La red declara ambientalismo, cuidado y patrimonio como paradigmas rectores, pero su arquitectura relacional muestra que esos nodos tienen grado de centralidad muy inferior al de Metro, equipamientos y suelo. La ingeniería inversa revela el modelo operativo: desarrollista, mercantilista y tecnocrático. Lo que el modelo dice que es y lo que parece ser no coinciden.", paginaTexto: "Estructura de la red" },
  { s: "ev_competitividad", t: "empresarial", type: "tension", directa: true,  pagina: null, sustento: "“La ciudad es considerada como una mercancía, en donde el mercado inmobiliario es quien coordina, financia y promociona los proyectos de urbanización, impone sus reglas e intensifica los procesos de polarización social y territorial.” (EURE, 2023) Incentivos en Fontibón y Engativá para “Bogotá Ciudad Aeropuerto”: el territorio se vende como producto a inversionistas globales, tensionando el registro de derechos del cuidado y el hábitat.", paginaTexto: "Fuente: EURE (2023); acuerdo tributario 2025" },
];

function nodeById(id) { return ODS_NODES.find(n => n.id === id); }

/* -------- física: longitud de reposo de cada resorte (arista) — macromodelos -------- */
RAW_EDGES.forEach(edge => {
  const s = nodeById(edge.s), t = nodeById(edge.t);
  if (!s || !t) return;
  const dist = Math.hypot(t.x - s.x, t.y - s.y);
  edge.restLength = dist;
  /* repulsión para desconexiones y periféricos: los nodos se mantienen visiblemente apartados */
  if (edge.type === "periferico") edge.repel = 40;
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

    let visualEl = null;
    if (edge.type === "tension" && edge.directa) {
      /* doble línea paralela para la tensión declarado vs. operativo */
      const [d1, d2] = edgePathDataDouble(edge, s, t);
      const sub = document.createElementNS(SVG_NS, "g");
      sub.setAttribute("class", "ods-edge edge-visual");
      const v1 = document.createElementNS(SVG_NS, "path");
      v1.setAttribute("d", d1);
      const v2 = document.createElementNS(SVG_NS, "path");
      v2.setAttribute("d", d2);
      [v1, v2].forEach(v => {
        v.setAttribute("stroke", style.color);
        v.setAttribute("stroke-width", style.width * 0.55);
      });
      sub.appendChild(v1); sub.appendChild(v2);
      visualEl = sub;
      edge._el = { visual: sub, d1, d2, hit };
    } else {
      const visual = document.createElementNS(SVG_NS, "path");
      visual.setAttribute("d", d);
      visual.setAttribute("class", "ods-edge edge-visual");
      visual.setAttribute("stroke", style.color);
      visual.setAttribute("stroke-width", style.width);
      if (!edge.directa) visual.setAttribute("stroke-dasharray", "6,5");
      if (edge.directa) visual.setAttribute("marker-end", `url(#arrow-${edge.type})`);
      visual.setAttribute("opacity", "0.9");
      visualEl = visual;
      edge._el = { visual, hit };
    }

    group.appendChild(visualEl);
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
  typeEl.textContent = style.label + (edge.directa ? " · Directa — continua" : " · Inferida");
  typeEl.style.color = style.color;
  typeEl.style.background = style.color + "26";

  document.getElementById("edgeInfoQuote").textContent = edge.sustento;
  document.getElementById("edgeInfoPage").textContent =
    edge.paginaTexto ? `Página / Fuente: ${edge.paginaTexto}` : (edge.pagina != null ? `Página POT: p. ${edge.pagina}` : "Página: por confirmar");

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
const NODE_INSIGHTS = {
  operativo: ["desarrollista", "mercantilista", "empresarial", "tecnocratico", "productivista", "estatista"],
  declarado: ["ambientalista", "cuidado", "patrimonial"],
  periferico: ["religioso", "tecnoing", "colectivista"],
  tension: ["ambientalista", "empresarial", "ev_competitividad"],
};

const TYPE_KEY = {
  operativo: "operativo",
  declarado: "declarado",
  periferico: "periferico",
  tension: "tension",
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
    all: ["operativo", "declarado", "periferico", "tension"],
    operativo: ["operativo"],
    declarado: ["declarado"],
    periferico: ["periferico"],
    tension: ["tension"],
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

document.addEventListener("DOMContentLoaded", () => {
  renderNetwork();
  setupLegendToggle();
});
