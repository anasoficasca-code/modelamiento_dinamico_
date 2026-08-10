// MODULO 07: SIMULADOR
console.log('Módulo 07: Simulador - Inicializado');

// ---------------------------------------------------------------------------
// ESCENARIOS (apagar/encender una estructura completa)
// ---------------------------------------------------------------------------
const scenarios = {
  sin_eep:   { label: 'Escenario sin Estructura Ecológica Principal', struct: 'eco' },
  sin_efc:   { label: 'Escenario sin Estructura Funcional y del Cuidado', struct: 'func' },
  sin_eseci: { label: 'Escenario sin Estructura Socioeconómica, Creativa y de Innovación', struct: 'econ' },
  sin_eip:   { label: 'Escenario sin Estructura Integradora de Patrimonios', struct: 'patri' }
};

function loadScenario(scenarioKey, buttonEl) {
  const scenario = scenarios[scenarioKey];
  if (!scenario) return;

  const struct = scenario.struct;
  const isOff = buttonEl.classList.toggle('active');

  const icon = buttonEl.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-circle-minus', !isOff);
    icon.classList.toggle('fa-power-off', isOff);
  }

  document.querySelectorAll('.node.n-' + struct).forEach(node => {
    node.classList.toggle('node-off', isOff);
  });

  document.querySelectorAll('.links line.l-' + struct).forEach(link => {
    link.classList.toggle('link-off', isOff);
  });

  console.log((isOff ? 'Apagando' : 'Reactivando') + ' estructura:', scenario.label);
  updateStats();
}

// ---------------------------------------------------------------------------
// LEYENDA
// "Directa/Indirecta" = estilo de línea (sólida/punteada), independiente del
// color. "Soporte/Resiliencia" = tipo de relación (color naranja/azul).
// Ambas dimensiones convivenen en la misma línea, así que se filtran por
// separado.
// ---------------------------------------------------------------------------
function toggleLinkType(type, itemEl) {
  const isOff = itemEl.classList.toggle('off');
  const icon = itemEl.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-square-check', !isOff);
    icon.classList.toggle('fa-square', isOff);
  }

  let selector;
  if (type === 'directa') selector = '#staticNetwork .links line:not(.link-punteada)';
  else if (type === 'indirecta') selector = '#staticNetwork .links line.link-punteada';
  else selector = '#staticNetwork .links line.link-' + type;

  document.querySelectorAll(selector).forEach(link => {
    link.classList.toggle('type-off', isOff);
  });

  console.log((isOff ? 'Ocultando' : 'Mostrando') + ' relaciones tipo:', type);
}

// ---------------------------------------------------------------------------
// RELACIONES DOCUMENTADAS EN EL POT
// Fuente: "Red_relaciones_POT_CORREGIDA_FRASES_EXACTAS.xlsx" (hoja "Todas
// las relaciones"). Clave: "origen|destino" tal como aparece en la tabla
// (columnas Concepto origen -> Concepto destino). El sentido de la flecha se
// resuelve comparando esto contra data-s/data-t de cada línea, así que no
// importa en qué orden se dibujó la línea en el SVG.
// ---------------------------------------------------------------------------
const relationData = {
  "corredores_mont|rios": { page: '70', relation: 'soporte', description: 'Art. 7', phrase: '"corredores montañosos … ríos y humedales"' },
  "quebradas|humedales": { page: '72', relation: 'soporte', description: 'Art. 42 / 62', phrase: '"ríos y quebradas … humedales"' },
  "cerros_orientales|humedales": { page: '70', relation: 'soporte', description: 'Art. 7', phrase: '"cerros orientales … ríos y humedales"' },
  "humedales|rios": { page: '72', relation: 'soporte', description: 'Art. 42 / 62', phrase: '"ríos y quebradas … humedales"' },
  "rios|complejos_paramos": { page: '70', relation: 'soporte', description: 'Art. 7', phrase: '"complejos de páramos … ríos y humedales"' },
  "bosques_urbanos|coberturas_vegetales": { page: '73', relation: 'soporte', description: 'Art. 74', phrase: '"cobertura vegetal … flora propia"' },
  "areas_resiliencia|coberturas_vegetales": { page: '72', relation: 'resiliencia', description: 'Art. 42', phrase: '"territorio resiliente … cambio climático"' },
  "humedales|areas_resiliencia": { page: '72', relation: 'soporte', description: 'Art. 42', phrase: '"amortiguación de los impactos ambientales"' },
  "areas_protegidas|humedales": { page: '71', relation: 'soporte', punteada: true, description: 'Art. 41 / 51', phrase: '"Reservas Distritales de Humedal"' },
  "areas_protegidas|parques_eco_montana": { page: '71', relation: 'soporte', punteada: true, description: 'Art. 51 / 54', phrase: '"Parques Distritales Ecológicos de Montaña"' },
  "areas_protegidas|reservas_forestales": { page: '71', relation: 'soporte', punteada: true, description: 'Art. 41 / 45 / 48', phrase: '"Reserva Forestal Protectora … Regional"' },
  "reservas_forestales|humedales": { page: '72', relation: 'resiliencia', description: 'Art. 42', phrase: '"conectividad y complementariedad"' },
  "parques_eco_montana|coberturas_vegetales": { page: '72', relation: 'soporte', punteada: true, description: 'Art. 54', phrase: '"restaurar y preservar … especies nativas"' },
  "coberturas_vegetales|parques_borde": { page: '136', relation: 'soporte', punteada: true, description: 'Art. 121', phrase: '"coberturas vegetales … parques de borde"' },
  "coberturas_vegetales|paisajes_sostenibles": { page: '72', relation: 'soporte', punteada: true, description: 'Art. 52 / 74', phrase: '"funcionalidad ecosistémica … conectividad"' },
  "complejos_paramos|paisajes_sostenibles": { page: '70', relation: 'soporte', punteada: true, description: 'Art. 7 / 52', phrase: '"complejos de páramos … paisajes"' },
  "equipamientos|servicios_cuidado": { page: '117–118', relation: 'soporte', punteada: true, description: 'Art. 94–95', phrase: '"equipamientos y servicios de cuidado"' },
  "equipamientos|servicios_sociales": { page: '117–118', relation: 'soporte', punteada: true, description: 'Art. 94–95', phrase: '"equipamientos y servicios sociales"' },
  "equipamientos|vivienda": { page: '117', relation: 'soporte', description: 'Art. 94 / 95', phrase: '"equipamientos … soluciones habitacionales"' },
  "servicios_publicos|vivienda": { page: '179', relation: 'soporte', punteada: true, description: 'Art. 179', phrase: '"servicio público … actividades en la ciudad"' },
  "ciclorrutas|vivienda": { page: '117', relation: 'soporte', punteada: true, description: 'Art. 88', phrase: '"accesibilidad … conectividad"' },
  "ciclorrutas|transporte_publico": { page: '117 / 158–159', relation: 'resiliencia', punteada: true, noArrow: true, description: 'Art. 88 / 158–159', phrase: '"cicloinfraestructura … corredores verdes"' },
  "transporte_publico|vivienda": { page: '117', relation: 'soporte', punteada: true, description: 'Art. 88', phrase: '"accesibilidad … conectividad"' },
  "red_vial|transporte_publico": { page: '158–159', relation: 'soporte', description: 'Art. 158–159', phrase: '"malla arterial … transporte público"' },
  "red_vial|equipamientos": { page: '117', relation: 'soporte', description: 'Art. 88 / 95', phrase: '"accesibilidad … equipamientos"' },
  "corredores_verdes|ciclorrutas": { page: '117', relation: 'soporte', description: 'Política de movilidad', phrase: '"corredores verdes … cicloinfraestructura"' },
  "corredores_verdes|transporte_publico": { page: '158–159', relation: 'soporte', description: 'Art. 158–159', phrase: '"corredores verdes de transporte público"' },
  "manzanas_cuidado|servicios_sociales": { page: '117–118', relation: 'soporte', description: 'Art. 94–95', phrase: '"manzanas del cuidado … servicios sociales"' },
  "manzanas_cuidado|equipamientos": { page: '117–118', relation: 'soporte', description: 'Art. 94–95', phrase: '"manzanas del cuidado … equipamientos"' },
  "manzanas_cuidado|parques": { page: '117', relation: 'soporte', description: 'Art. 94', phrase: '"jardines infantiles, colegios, parques"' },
  "distrito_tec|servicios_empresariales": { page: '122', relation: 'soporte', description: 'Art. 101', phrase: '"Eje de servicios empresariales"' },
  "distrito_tec|sist_educacion": { page: '122', relation: 'soporte', description: 'Art. 100–101', phrase: '"formación del talento humano"' },
  "centros_abastecimiento|plazas_mercado": { page: '122', relation: 'soporte', punteada: true, description: 'Art. 100–101', phrase: '"Centros de Abasto Mayorista … Plazas de Mercado"' },
  "plazas_mercado|servicios_empresariales": { page: '122', relation: 'soporte', description: 'Art. 101', phrase: '"Plazas de Mercado … infraestructuras"' },
  "zonas_industriales|servicios_empresariales": { page: '122', relation: 'soporte', description: 'Art. 101', phrase: '"Eje de servicios empresariales … zonas industriales"' },
  "zonas_industriales|sist_educacion": { page: '122', relation: 'soporte', punteada: true, description: 'Art. 100–101', phrase: '"formación del talento humano … empresas"' },
  "zonas_industriales|produccion_artesanal": { page: '122', relation: 'soporte', description: 'Art. 100–101', phrase: '"producción tradicional … industrias creativas"' },
  "zonas_interes_turistico|plazas_mercado": { page: '122', relation: 'soporte', description: 'Art. 101', phrase: '"Zonas de Interés Turístico … Plazas de Mercado"' },
  "centros_financieros|servicios_empresariales": { page: '122', relation: 'soporte', description: 'Art. 100', phrase: '"centros financieros y de servicios empresariales"' },
  "sitios_sagrados|patrimonio_inmaterial": { page: '103–104', relation: 'resiliencia', description: 'Art. 80', phrase: '"patrimonio cultural inmaterial … comunidades"' },
  "patrimonio_arqueologico|patrimonio_natural": { page: '103–104', relation: 'soporte', description: 'Art. 80', phrase: '"Patrimonio Natural … Patrimonio Arqueológico"' },
  "patrimonio_arqueologico|patrimonio_material": { page: '103–104', relation: 'resiliencia', description: 'Art. 80', phrase: '"Patrimonio Cultural material … Patrimonio Arqueológico"' },
  "patrimonio_natural|patrimonio_inmaterial": { page: '103–104', relation: 'soporte', description: 'Art. 80', phrase: '"patrimonio cultural material, inmaterial y natural"' },
  "patrimonio_material|patrimonio_natural": { page: '103–104', relation: 'soporte', description: 'Art. 80', phrase: '"integra … material, inmaterial y natural"' },
  "patrimonio_material|patrimonio_inmaterial": { page: '103–104', relation: 'soporte', description: 'Art. 80', phrase: '"patrimonio cultural material, inmaterial y natural"' },
};

function findRelation(s, t) {
  return relationData[s + '|' + t] || relationData[t + '|' + s] || null;
}

// Marca con 'has-data' cada línea (todas, en este dataset, tienen ficha) y le
// asigna: flecha (forward/backward/both/ninguna si noArrow), y el modificador
// 'link-punteada' cuando la lectura del POT es "Indirecta" (línea punteada).
function applyArrowDirections() {
  document.querySelectorAll('#staticNetwork .links line').forEach(line => {
    const s = line.getAttribute('data-s');
    const t = line.getAttribute('data-t');
    const rel = relationData[s + '|' + t];
    const relRev = relationData[t + '|' + s];
    const isDirectional = line.classList.contains('link-soporte') || line.classList.contains('link-resiliencia');

    if (!rel && !relRev) {
      if (isDirectional) line.classList.add('arrow-forward');
      return;
    }

    line.classList.add('has-data');

    const noArrow = (rel && rel.noArrow) || (relRev && relRev.noArrow);
    if (noArrow) return; // sin flecha: el POT no permite identificar una dirección inequívoca

    let cls = 'arrow-forward';
    if ((rel && rel.bidirectional) || (relRev && relRev.bidirectional)) {
      cls = 'arrow-both';
    } else if (relRev) {
      cls = 'arrow-backward';
    }
    line.classList.add(cls);
  });
}

// Oculta por defecto las líneas Directa/Indirecta que NO tienen ficha
// (no debería quedar ninguna en este dataset, pero se conserva por si se
// agregan relaciones sin evidencia documentada más adelante).
function hideUndocumentedLines() {
  document.querySelectorAll('#staticNetwork .links line.link-directa, #staticNetwork .links line.link-indirecta').forEach(line => {
    if (!line.classList.contains('has-data')) {
      line.classList.add('type-off');
    }
  });
}

let selectedLink = null;

function openRelationPanel(line) {
  const s = line.getAttribute('data-s');
  const t = line.getAttribute('data-t');
  const sEl = document.getElementById('n_' + s);
  const tEl = document.getElementById('n_' + t);
  const sLabel = sEl ? nodeLabel(sEl) : s;
  const tLabel = tEl ? nodeLabel(tEl) : t;

  const rel = findRelation(s, t);
  const isSoporte = line.classList.contains('link-soporte');
  const relationName = rel ? rel.relation : (isSoporte ? 'soporte' : 'resiliencia');

  document.querySelectorAll('.links line.link-selected').forEach(l => l.classList.remove('link-selected'));
  line.classList.add('link-selected');
  selectedLink = line;

  const arrowSymbol = line.classList.contains('arrow-both') ? '↔' : (line.classList.contains('arrow-forward') || line.classList.contains('arrow-backward') ? '→' : '—');
  document.getElementById('relConcepts').textContent = `${sLabel} ${arrowSymbol} ${tLabel}`;

  const badge = document.getElementById('relBadge');
  const badgeNames = { soporte: 'Soporte', resiliencia: 'Resiliencia', directa: 'Directa' };
  badge.textContent = badgeNames[relationName] || 'Directa';
  badge.className = 'relation-badge badge-' + relationName;

  const descEl = document.getElementById('relDescription');
  if (rel && rel.description) {
    descEl.textContent = rel.description;
    descEl.style.display = 'block';
  } else {
    descEl.style.display = 'none';
  }

  document.getElementById('relPhrase').textContent = rel ? rel.phrase : 'Aún no hay una ficha con la frase exacta del POT para esta relación.';
  document.getElementById('relPage').textContent = rel ? ('Página ' + rel.page) : '—';

  document.getElementById('relationPanel').style.display = 'block';
  document.getElementById('relationPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeRelationPanel() {
  document.getElementById('relationPanel').style.display = 'none';
  if (selectedLink) selectedLink.classList.remove('link-selected');
  selectedLink = null;
}

// ---------------------------------------------------------------------------
// RED: adjacencia, tamaño dinámico según conectividad, selección/resaltado,
// zoom, reset, stats
// ---------------------------------------------------------------------------
let adjacency = {};       // nodeId -> Set de nodeIds vecinos
let nodeLinks = {};       // nodeId -> [line elements]
let selectedNode = null;
let justDragged = false;  // evita que el click de "soltar" dispare selección
const baseViewBox = { x: -20, y: -20, w: 1040, h: 940 };
let currentViewBox = { ...baseViewBox };
const POS_STORAGE_KEY = 'rapot_modulo07_node_positions';

function buildAdjacency() {
  adjacency = {};
  nodeLinks = {};
  document.querySelectorAll('#staticNetwork .links line').forEach(line => {
    const s = line.getAttribute('data-s');
    const t = line.getAttribute('data-t');
    if (!s || !t) return;
    (adjacency[s] = adjacency[s] || new Set()).add(t);
    (adjacency[t] = adjacency[t] || new Set()).add(s);
    (nodeLinks[s] = nodeLinks[s] || []).push(line);
    (nodeLinks[t] = nodeLinks[t] || []).push(line);
  });
}

// Tres presets de tamaño (radio del círculo, tamaño del ícono, posición del
// texto) según el número real de conexiones del nodo. Un nodo con más
// relaciones documentadas en el POT se dibuja más grande.
const SIZE_PRESETS = {
  low:  { r: 17, fo: 22, icon: 11, textY: 29 },
  mid:  { r: 24, fo: 36, icon: 13, textY: 36 },
  high: { r: 32, fo: 52, icon: 15, textY: 44 }
};

function degreeTier(degree) {
  if (degree >= 6) return 'high';
  if (degree >= 3) return 'mid';
  return 'low';
}

// Redimensiona cada nodo (círculo, ícono y posición del texto) según su
// grado real de conectividad calculado a partir de las líneas del SVG.
function applyDynamicSizing() {
  document.querySelectorAll('#staticNetwork .node').forEach(nodeEl => {
    const id = nodeEl.id.replace(/^n_/, '');
    const degree = (adjacency[id] || new Set()).size;
    const tier = degreeTier(degree);
    const preset = SIZE_PRESETS[tier];

    nodeEl.classList.remove('node-hub', 'node-main');
    if (tier === 'mid') nodeEl.classList.add('node-hub');
    if (tier === 'high') nodeEl.classList.add('node-main');

    const circle = nodeEl.querySelector('circle.node-fill');
    if (circle) circle.setAttribute('r', preset.r);

    const fo = nodeEl.querySelector('foreignObject');
    if (fo) {
      const off = -preset.fo / 2;
      fo.setAttribute('x', off);
      fo.setAttribute('y', off);
      fo.setAttribute('width', preset.fo);
      fo.setAttribute('height', preset.fo);
    }

    const icon = nodeEl.querySelector('.node-icon i');
    if (icon) icon.style.fontSize = preset.icon + 'px';

    const text = nodeEl.querySelector('text.node-label');
    if (text) {
      text.setAttribute('y', preset.textY);
      // Evita que las etiquetas largas se salgan del círculo.
      const label = text.textContent.trim();
      const estWidth = label.length * (tier === 'high' ? 4.1 : tier === 'mid' ? 3.7 : 3.4);
      const maxWidth = preset.r * 2 * 1.55;
      if (estWidth > maxWidth) {
        text.setAttribute('textLength', maxWidth.toFixed(0));
        text.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      } else {
        text.removeAttribute('textLength');
        text.removeAttribute('lengthAdjust');
      }
    }
  });
}

// Asigna deg-low / deg-mid / deg-high para el glow (mismo criterio que el
// tamaño, así el glow y el tamaño crecen juntos).
function applyConnectivityGlow() {
  document.querySelectorAll('#staticNetwork .node').forEach(nodeEl => {
    const id = nodeEl.id.replace(/^n_/, '');
    const degree = (adjacency[id] || new Set()).size;
    const tier = degreeTier(degree);
    nodeEl.classList.remove('deg-low', 'deg-mid', 'deg-high');
    nodeEl.classList.add('deg-' + tier);
  });
}

function nodeLabel(nodeEl) {
  const span = nodeEl.querySelector('.node-label');
  return span ? span.textContent.replace(/\s+/g, ' ').trim() : nodeEl.id;
}

// ---------------------------------------------------------------------------
// PANEL "¿Qué pasa si se desconecta un nodo central?"
// Encuentra el nodo con más conexiones documentadas y permite apagarlo junto
// con todas las líneas que lo tocan, para ver qué tan dependiente es la red.
// ---------------------------------------------------------------------------
let centralNodeId = null;
let centralNodeOff = false;

function findCentralNode() {
  let best = null, bestDeg = -1;
  Object.keys(adjacency).forEach(id => {
    const deg = adjacency[id].size;
    if (deg > bestDeg) { bestDeg = deg; best = id; }
  });
  return { id: best, degree: bestDeg };
}

function updateCentralNodePanel() {
  const { id, degree } = findCentralNode();
  centralNodeId = id;
  const nodeEl = id ? document.getElementById('n_' + id) : null;
  const nameEl = document.getElementById('centralNodeName');
  const degEl = document.getElementById('centralNodeDegree');
  if (nameEl) nameEl.textContent = nodeEl ? nodeLabel(nodeEl) : '—';
  if (degEl) degEl.textContent = degree >= 0 ? degree : 0;
}

function toggleCentralNode() {
  if (!centralNodeId) return;
  const nodeEl = document.getElementById('n_' + centralNodeId);
  if (!nodeEl) return;

  centralNodeOff = !centralNodeOff;

  nodeEl.classList.toggle('node-off', centralNodeOff);
  (nodeLinks[centralNodeId] || []).forEach(line => {
    line.classList.toggle('link-off', centralNodeOff);
  });

  const btn = document.getElementById('centralSimBtn');
  if (btn) {
    btn.classList.toggle('active', centralNodeOff);
    btn.innerHTML = centralNodeOff
      ? '<i class="fa-solid fa-power-off"></i>Reconectar'
      : '<i class="fa-solid fa-power-off"></i>Simular';
  }

  console.log((centralNodeOff ? 'Desconectando' : 'Reconectando') + ' nodo central:', centralNodeId);
}

// ---------------------------------------------------------------------------
// ARRASTRAR NODOS (con posición guardada en el navegador)
// ---------------------------------------------------------------------------
function loadSavedPositions() {
  try {
    const raw = localStorage.getItem(POS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function savePosition(id, x, y) {
  try {
    const data = loadSavedPositions();
    data[id] = [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
    localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* almacenamiento no disponible */ }
}

function clearSavedPositions() {
  try { localStorage.removeItem(POS_STORAGE_KEY); } catch (e) { /* no-op */ }
}

function getNodePos(nodeEl) {
  const m = /translate\(([\-\d.]+),\s*([\-\d.]+)\)/.exec(nodeEl.getAttribute('transform') || '');
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : [0, 0];
}

function setNodePos(nodeEl, x, y) {
  nodeEl.setAttribute('transform', `translate(${x},${y})`);
}

function updateLinesForNode(id, x, y) {
  document.querySelectorAll('#staticNetwork .links line[data-s="' + id + '"]').forEach(l => {
    l.setAttribute('x1', x); l.setAttribute('y1', y);
  });
  document.querySelectorAll('#staticNetwork .links line[data-t="' + id + '"]').forEach(l => {
    l.setAttribute('x2', x); l.setAttribute('y2', y);
  });
}

function svgPoint(svg, evt) {
  const ctm = svg.getScreenCTM();
  if (svg.createSVGPoint && ctm) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    return [p.x, p.y];
  }
  const rect = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  return [
    vb.x + (evt.clientX - rect.left) * (vb.width / rect.width),
    vb.y + (evt.clientY - rect.top) * (vb.height / rect.height)
  ];
}

function makeDraggable(nodeEl) {
  const svg = document.getElementById('staticNetwork');
  const id = nodeEl.id.replace(/^n_/, '');
  let dragging = false;
  let offsetX = 0, offsetY = 0;

  nodeEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
    if (nodeEl.setPointerCapture) nodeEl.setPointerCapture(e.pointerId);
    const [px, py] = svgPoint(svg, e);
    const [nx, ny] = getNodePos(nodeEl);
    offsetX = px - nx;
    offsetY = py - ny;
    nodeEl.classList.add('dragging');
  });

  nodeEl.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    justDragged = true;
    const [px, py] = svgPoint(svg, e);
    const nx = px - offsetX;
    const ny = py - offsetY;
    setNodePos(nodeEl, nx, ny);
    updateLinesForNode(id, nx, ny);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    nodeEl.classList.remove('dragging');
    const [nx, ny] = getNodePos(nodeEl);
    savePosition(id, nx, ny);
    setTimeout(() => { justDragged = false; }, 50);
  }

  nodeEl.addEventListener('pointerup', endDrag);
  nodeEl.addEventListener('pointercancel', endDrag);
}

function restoreSavedPositions() {
  const saved = loadSavedPositions();
  Object.keys(saved).forEach(id => {
    const nodeEl = document.getElementById('n_' + id);
    if (!nodeEl) return;
    const [x, y] = saved[id];
    setNodePos(nodeEl, x, y);
    updateLinesForNode(id, x, y);
  });
}

function restoreOriginalPositions() {
  document.querySelectorAll('#staticNetwork .node').forEach(nodeEl => {
    const id = nodeEl.id.replace(/^n_/, '');
    const x0 = nodeEl.getAttribute('data-x0');
    const y0 = nodeEl.getAttribute('data-y0');
    if (x0 === null || y0 === null) return;
    setNodePos(nodeEl, x0, y0);
    updateLinesForNode(id, x0, y0);
  });
  clearSavedPositions();
}

function selectNode(id) {
  const nodeEl = document.getElementById('n_' + id);
  if (!nodeEl) return;

  if (selectedNode === id) {
    clearSelection();
    return;
  }

  selectedNode = id;
  const neighbors = adjacency[id] || new Set();

  document.querySelectorAll('#staticNetwork .node').forEach(n => {
    const nid = n.id.replace(/^n_/, '');
    const keep = nid === id || neighbors.has(nid);
    n.classList.toggle('node-dim', !keep);
    n.classList.toggle('node-selected', nid === id);
  });

  document.querySelectorAll('#staticNetwork .links line').forEach(l => {
    const active = l.getAttribute('data-s') === id || l.getAttribute('data-t') === id;
    l.classList.toggle('link-dim', !active);
    l.classList.toggle('link-active', active);
  });

  const chip = document.getElementById('selectedChip');
  const label = document.getElementById('statSelected');
  if (chip && label) {
    label.textContent = nodeLabel(nodeEl) + ' · ' + neighbors.size + ' conexiones';
    chip.style.display = 'flex';
  }
}

function clearSelection() {
  selectedNode = null;
  document.querySelectorAll('#staticNetwork .node').forEach(n => {
    n.classList.remove('node-dim', 'node-selected');
  });
  document.querySelectorAll('#staticNetwork .links line').forEach(l => {
    l.classList.remove('link-dim', 'link-active');
  });
  const chip = document.getElementById('selectedChip');
  if (chip) chip.style.display = 'none';
}

function applyViewBox() {
  const svg = document.getElementById('staticNetwork');
  if (!svg) return;
  svg.setAttribute('viewBox', `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`);
}

function zoomNetwork(factor) {
  const cx = currentViewBox.x + currentViewBox.w / 2;
  const cy = currentViewBox.y + currentViewBox.h / 2;
  const newW = Math.max(300, Math.min(1400, currentViewBox.w / factor));
  const newH = Math.max(250, Math.min(1200, currentViewBox.h / factor));
  currentViewBox = { x: cx - newW / 2, y: cy - newH / 2, w: newW, h: newH };
  applyViewBox();
}

function resetNetwork() {
  document.querySelectorAll('.scenario-btn.active').forEach(btn => {
    const key = btn.getAttribute('data-scenario');
    loadScenario(key, btn);
  });

  document.querySelectorAll('.legend-item.off').forEach(item => {
    toggleLinkType(item.getAttribute('data-linktype'), item);
  });

  clearSelection();
  closeRelationPanel();
  restoreOriginalPositions();

  if (centralNodeOff) toggleCentralNode();

  currentViewBox = { ...baseViewBox };
  applyViewBox();
  updateStats();
  console.log('Red reiniciada');
}

function updateStats() {
  const totalNodes = document.querySelectorAll('#staticNetwork .node').length;
  const totalLinks = document.querySelectorAll('#staticNetwork .links line').length;
  const totalStructs = Object.keys(scenarios).length;
  const offStructs = document.querySelectorAll('.scenario-btn.active').length;

  const nEl = document.getElementById('statNodes');
  const lEl = document.getElementById('statLinks');
  const aEl = document.getElementById('statActive');
  if (nEl) nEl.textContent = totalNodes;
  if (lEl) lEl.textContent = totalLinks;
  if (aEl) aEl.textContent = (totalStructs - offStructs) + '/' + totalStructs;
}

document.addEventListener('DOMContentLoaded', function () {
  buildAdjacency();
  applyArrowDirections();
  applyDynamicSizing();
  applyConnectivityGlow();
  hideUndocumentedLines();
  applyViewBox();
  restoreSavedPositions();
  updateCentralNodePanel();
  updateStats();

  document.querySelectorAll('#staticNetwork .node').forEach(nodeEl => {
    nodeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (justDragged) { justDragged = false; return; }
      selectNode(nodeEl.id.replace(/^n_/, ''));
    });
    makeDraggable(nodeEl);
  });

  document.querySelectorAll('#staticNetwork .links line.link-soporte, #staticNetwork .links line.link-resiliencia, #staticNetwork .links line.has-data').forEach(line => {
    line.addEventListener('click', (e) => {
      e.stopPropagation();
      openRelationPanel(line);
    });
  });

  const svg = document.getElementById('staticNetwork');
  if (svg) {
    svg.addEventListener('click', (e) => {
      if (e.target === svg) {
        clearSelection();
        closeRelationPanel();
      }
    });
  }
});
