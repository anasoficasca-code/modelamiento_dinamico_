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
// LEYENDA (apagar/encender un tipo de relación: directa/indirecta/soporte/resiliencia)
// ---------------------------------------------------------------------------
function toggleLinkType(type, itemEl) {
  const isOff = itemEl.classList.toggle('off');
  const icon = itemEl.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-square-check', !isOff);
    icon.classList.toggle('fa-square', isOff);
  }

  document.querySelectorAll('.links line.link-' + type).forEach(link => {
    link.classList.toggle('type-off', isOff);
  });

  console.log((isOff ? 'Ocultando' : 'Mostrando') + ' relaciones tipo:', type);
}

// ---------------------------------------------------------------------------
// RELACIONES DOCUMENTADAS EN EL POT (frase exacta + página + dirección)
// Clave: "origen|destino" tal como aparece en la tabla (Desde -> Hacia).
// El sentido de la flecha se resuelve comparando esto contra data-s/data-t
// de cada línea, así que no importa en qué orden se dibujó la línea.
// ---------------------------------------------------------------------------
const relationData = {
  "vivienda|servicios_empresariales": {
    bidirectional: true, page: "31", relation: "soporte",
    phrase: '"donde hay más empleos formales que viviendas, se haga más vivienda vis con soportes urbanos adecuados, y que donde hay más densidad de vivienda popular, pero poco empleo formal, se proteja y amplíe suelo para que se instalen empresas y actividades productivas generadoras de trabajo."'
  },
  "transporte_publico|servicios_empresariales": {
    page: "165", relation: "soporte",
    phrase: '"Impacto en la productividad por tiempos de viaje" / "Consolidación de aglomeraciones por conectividad"'
  },
  "equipamientos|servicios_empresariales": {
    page: "165", relation: "soporte",
    phrase: '"Equipamiento como detonante de dinámicas económicas"'
  },
  "servicios_sociales|servicios_empresariales": {
    page: "171", relation: "soporte",
    phrase: '"fuentes de generación de empleo de proximidad y de fomentar dinámicas económicas complementarias en sus zonas de influencia."'
  },
  "vivienda|produccion_artesanal": {
    page: "102–103", relation: "soporte",
    phrase: '"cuando existan usos artesanales, creativos y culturales [...] los proyectos deberán restituir dichos usos en el primer piso en relación directa con el espacio público"'
  },
  "patrimonio_natural|produccion_artesanal": {
    page: "103", relation: "soporte",
    phrase: '"patrimonios locales, urbanos, rurales y naturales" y en el mismo apartado se desarrollan los "usos artesanales, creativos y culturales"'
  },
  "rios|equipamientos": {
    page: "154", relation: "soporte",
    phrase: '"el agua como elemento estructurador que conecta parques, equipamientos y centros productivos"'
  },
  "quebradas|equipamientos": {
    page: "154", relation: "soporte",
    phrase: '"el agua como elemento estructurador que conecta parques, equipamientos y centros productivos"'
  },
  "humedales|produccion_alimentos": {
    page: "97", relation: "resiliencia",
    phrase: '"la preservación de la Zona Rural del Norte, como suelos necesarios para la resiliencia climática, la producción de alimentos"'
  },

  // ---- Estructura Integradora de Patrimonios (EIP) ----
  "patrimonio_material|patrimonio_inmaterial": {
    page: "196", relation: "soporte",
    phrase: '"la EIP inscribe y precisa un sistema de relaciones del patrimonio cultural material, inmaterial y natural en el territorio."'
  },
  "patrimonio_material|patrimonio_natural": {
    page: "196", relation: "soporte",
    phrase: '"la EIP inscribe y precisa un sistema de relaciones del patrimonio cultural material, inmaterial y natural en el territorio."'
  },
  "patrimonio_inmaterial|patrimonio_natural": {
    page: "196", relation: "soporte",
    phrase: '"la EIP inscribe y precisa un sistema de relaciones del patrimonio cultural material, inmaterial y natural en el territorio."'
  },
  "patrimonio_arqueologico|patrimonio_natural": {
    page: "198", relation: "resiliencia",
    phrase: '"hoy pueden ser referentes de procesos adaptativos y que revelan prácticas de integralidad de la cultura con la naturaleza."'
  },
  "patrimonio_arqueologico|patrimonio_material": {
    page: "198", relation: "soporte",
    phrase: '"Este patrimonio cultural se convirtió en un referente de movilización"'
  },
  "sitios_sagrados|patrimonio_inmaterial": {
    page: "186", relation: "soporte",
    phrase: '"son el testimonio de complejas estrategias de cómo interpretamos y valoramos las huellas del territorio que..."'
  },

  // ---- Estructura Socioeconómica, Creativa y de Innovación (ESECI) ----
  "distrito_tec|servicios_empresariales": {
    page: "177", relation: "directa",
    description: "El Distrito de Ciencia, Tecnología e Innovación se plantea articulado con el tejido empresarial y conectado con las zonas empresariales.",
    phrase: '"atrae empleo a partir de la consolidación de un nodo de servicios urbanos articulado con el tejido empresarial, la academia y el sector público."'
  },
  "distrito_tec|sist_educacion": {
    page: "177", relation: "directa",
    description: "El Distrito/Campus conecta la aglomeración de conocimiento con otros actores y articula la academia dentro de su funcionamiento.",
    phrase: '"Conecta la principal aglomeración de conocimiento del país con las zonas empresariales del occidente y norte de la ciudad" y "facilitar el encuentro y la interacción entre actores (empresas, academia, sector público y ciudadanía)".'
  },
  "sist_educacion|servicios_empresariales": {
    page: "177", relation: "directa",
    description: "La educación superior aporta conocimiento y formación que se articula con las actividades empresariales.",
    phrase: '"Conecta la principal aglomeración de conocimiento del país con las zonas empresariales del occidente y norte de la ciudad".'
  },
  "zonas_industriales|servicios_empresariales": {
    page: "169", relation: "directa",
    description: "El POT relaciona las actividades económicas con los tejidos empresariales y la localización de actividades productivas.",
    phrase: '"se consolidan tejidos económicos continuos y complementarios entre el gran corazón productivo de escala urbana y las actividades económicas de soporte a la vida."'
  },
  "zonas_interes_turistico|plazas_mercado": {
    page: "92", relation: "directa",
    description: "El POT reconoce las plazas de mercado dentro de los elementos que pueden tener vocación turística.",
    phrase: '"Plazas de Mercado y otras infraestructuras con especial vocación turística."'
  },
  "centros_financieros|servicios_empresariales": {
    page: "171", relation: "directa", bidirectional: true,
    description: "Se tratan conjuntamente dentro de la estructura económica de la ciudad; por eso aquí no necesita una flecha, sino una relación bidireccional/no dirigida.",
    phrase: 'El documento identifica "Centros financieros" y "Eje de Servicios Empresariales Avenida El Dorado" dentro de la ESECI.'
  },
  "centros_abastecimiento|plazas_mercado": {
    page: "171", relation: "directa",
    description: "Relación funcional dentro del sistema de abastecimiento y comercialización de la ciudad; el POT identifica ambos elementos dentro de la ESECI, aunque no hay una frase que los conecte de forma literal.",
    phrase: 'El mapa identifica ambos por separado: "Centros de abastecimiento" y "Plazas de mercado".'
  },

  // ---- Estructura Funcional y del Cuidado (EFC) ----
  "red_vial|transporte_publico": {
    page: "43", relation: "soporte",
    phrase: '"Además del Metro, Bogotá necesita con urgencia ampliar sus entradas y salidas, tapar más huecos, hacer más vías, ciclorrutas, cables y corredores verdes con buses eléctricos para que el transporte público de calidad llegue a todas partes, conecte a la gente, la saque del trancón y la contaminación."'
  },
  "corredores_verdes|transporte_publico": {
    page: "30", relation: "soporte",
    phrase: '"Y que, en todo caso, las diversas zonas de la ciudad estén conectadas por un sistema multimodal de transporte público, colectivo, de energías limpias y renovables basadas en la red Metro y alimentadas por los demás modos y medios de transporte público como los corredores verdes, los cables y las ciclorrutas."'
  },
  "corredores_verdes|ciclorrutas": {
    page: "239–241", relation: "soporte",
    phrase: '"Por eso, además del Metro, y para alimentarlo y complementarlo, están los corredores verdes, con diseño ecosistémico, transporte público eléctrico, ciclorrutas seguras y andenes, plazas y espacios de encuentro..."'
  },
  "equipamientos|vivienda": {
    page: "126", relation: "soporte",
    phrase: '"Por un lado, priorizamos que los colegios o equipamientos educativos estén cerca de la vivienda o incluso cerca del trabajo de los padres."'
  },
  "equipamientos|manzanas_cuidado": {
    page: "125", relation: "soporte",
    phrase: '"Aprovechar los equipamientos existentes como anclas de las Manzanas del Cuidado, para que en estos diferentes entidades del Distrito cuiden a quienes nos cuidan, fue el cuello de botella se resolvió con el pot."'
  },
  "manzanas_cuidado|servicios_sociales": {
    page: "126", relation: "soporte",
    phrase: '"...cualifica los servicios sociales del Distrito y hace efectiva la articulación interinstitucional."'
  },
  "manzanas_cuidado|servicios_cuidado": {
    page: "122", relation: "soporte",
    phrase: '"Las Manzanas del Cuidado son áreas acotadas que agrupan diversas infraestructuras para brindar servicios de manera simultánea y articulada a las personas cuidadoras, a quienes ellas cuidan y a sus familias."'
  },

  // ---- Estructura Ecológica Principal (EEP) ----
  "areas_resiliencia|coberturas_vegetales": {
    page: "54", relation: "resiliencia",
    phrase: '"Estructura ecológica conectada y funcional para la resiliencia" / "las coberturas vegetales que conectan las áreas protegidas entre sí."'
  },
  "humedales|rios": {
    page: "22", relation: "soporte",
    phrase: '"Los humedales son las arterias de la eep de Bogotá. Su potencial tanto de biodiversidad como de regulación hídrica los definen, junto con las cuatro cuencas de la ciudad, como las conexiones entre los cerros y el río Bogotá."'
  },
  "corredores_mont|rios": {
    page: "22", relation: "soporte", punteada: true,
    phrase: '"...estrategias de conectividad y complementariedad de los ecosistemas como articuladores con su entorno regional y la protección del río Bogotá, la Reserva Thomas van der Hammen, los complejos de páramos, las reservas forestales, los ríos, los corredores montañosos, los humedales..."'
  }
};

function findRelation(s, t) {
  return relationData[s + '|' + t] || relationData[t + '|' + s] || null;
}

// Marca con 'has-data' cualquier línea que tenga ficha en relationData
// (independientemente de si es directa/indirecta/soporte/resiliencia) y le
// asigna la flecha correcta. Las líneas "directa/indirecta" sin ficha se
// quedan ocultas por defecto (ver hideUndocumentedLines).
function applyArrowDirections() {
  document.querySelectorAll('#staticNetwork .links line').forEach(line => {
    const s = line.getAttribute('data-s');
    const t = line.getAttribute('data-t');
    const rel = relationData[s + '|' + t];
    const relRev = relationData[t + '|' + s];
    const isDirectional = line.classList.contains('link-soporte') || line.classList.contains('link-resiliencia');

    if (!rel && !relRev) {
      // Sin ficha todavía: Soporte/Resiliencia igual llevan flecha (hacia
      // adelante por convención); Directa/Indirecta se quedan sin flecha.
      if (isDirectional) line.classList.add('arrow-forward');
      return;
    }

    line.classList.add('has-data');
    if ((rel && rel.punteada) || (relRev && relRev.punteada)) {
      line.classList.add('link-punteada');
    }

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
// (para no saturar el diagrama con conexiones sin evidencia documentada).
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

  const arrowSymbol = line.classList.contains('arrow-both') ? '↔' : '→';
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
  document.getElementById('relPage').textContent = rel ? rel.page : '—';

  document.getElementById('relationPanel').style.display = 'block';
  document.getElementById('relationPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeRelationPanel() {
  document.getElementById('relationPanel').style.display = 'none';
  if (selectedLink) selectedLink.classList.remove('link-selected');
  selectedLink = null;
}

// ---------------------------------------------------------------------------
// RED: adjacencia, selección/resaltado de nodo, zoom, reset, stats
// ---------------------------------------------------------------------------
let adjacency = {};       // nodeId -> Set de nodeIds vecinos
let nodeLinks = {};       // nodeId -> [line elements]
let selectedNode = null;
let justDragged = false;  // evita que el click de "soltar" dispare selección
const baseViewBox = { x: -20, y: -20, w: 1040, h: 940 };
let currentViewBox = { ...baseViewBox };
const POS_STORAGE_KEY = 'rapot_modulo07_node_positions';

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

// Convierte coordenadas de pantalla (clientX/clientY) a coordenadas internas
// del SVG, respetando el viewBox y el zoom actual.
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

// Asigna deg-low / deg-mid / deg-high según cuántas conexiones tiene cada
// nodo, para darle más glow (y ya venían con más tamaño) a los que más
// conectividad tienen dentro de la red.
function applyConnectivityGlow() {
  document.querySelectorAll('#staticNetwork .node').forEach(nodeEl => {
    const id = nodeEl.id.replace(/^n_/, '');
    const degree = (adjacency[id] || new Set()).size;
    nodeEl.classList.remove('deg-low', 'deg-mid', 'deg-high');
    if (degree >= 6) nodeEl.classList.add('deg-high');
    else if (degree >= 3) nodeEl.classList.add('deg-mid');
    else nodeEl.classList.add('deg-low');
  });
}

function nodeLabel(nodeEl) {
  const span = nodeEl.querySelector('.node-label');
  return span ? span.textContent.replace(/\s+/g, ' ').trim() : nodeEl.id;
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
  // Reactivar todas las estructuras
  document.querySelectorAll('.scenario-btn.active').forEach(btn => {
    const key = btn.getAttribute('data-scenario');
    loadScenario(key, btn);
  });

  // Reactivar solo Soporte/Resiliencia si estaban ocultas desde la leyenda.
  // Directa/Indirecta se dejan ocultas, que es el estado por defecto del diagrama.
  document.querySelectorAll('.legend-item.off').forEach(item => {
    const type = item.getAttribute('data-linktype');
    if (type === 'soporte' || type === 'resiliencia') {
      toggleLinkType(type, item);
    }
  });

  clearSelection();
  closeRelationPanel();
  restoreOriginalPositions();
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
  applyConnectivityGlow();
  hideUndocumentedLines();
  applyViewBox();
  restoreSavedPositions();
  updateStats();

  document.querySelectorAll('#staticNetwork .node').forEach(nodeEl => {
    nodeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (justDragged) { justDragged = false; return; }
      selectNode(nodeEl.id.replace(/^n_/, ''));
    });
    makeDraggable(nodeEl);
  });

  // Clicable: cualquier línea que tenga ficha en el POT (Directa documentada,
  // Soporte o Resiliencia), no solo Soporte/Resiliencia.
  document.querySelectorAll('#staticNetwork .links line.link-soporte, #staticNetwork .links line.link-resiliencia, #staticNetwork .links line.has-data').forEach(line => {
    line.addEventListener('click', (e) => {
      e.stopPropagation();
      openRelationPanel(line);
    });
  });

  // clic en fondo del SVG limpia la selección y cierra el panel
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
