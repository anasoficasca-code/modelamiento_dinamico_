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
  }
};

function findRelation(s, t) {
  return relationData[s + '|' + t] || relationData[t + '|' + s] || null;
}

// Asigna la clase de flecha correcta a cada línea Soporte/Resiliencia según
// la ficha del POT (o hacia adelante por defecto si aún no hay ficha).
function applyArrowDirections() {
  document.querySelectorAll('#staticNetwork .links line.link-soporte, #staticNetwork .links line.link-resiliencia').forEach(line => {
    const s = line.getAttribute('data-s');
    const t = line.getAttribute('data-t');
    const rel = relationData[s + '|' + t];
    const relRev = relationData[t + '|' + s];

    let cls = 'arrow-forward';
    if ((rel && rel.bidirectional) || (relRev && relRev.bidirectional)) {
      cls = 'arrow-both';
    } else if (relRev) {
      // la ficha está guardada en sentido contrario a como se dibujó la línea
      cls = 'arrow-backward';
    }
    line.classList.add(cls);
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
  badge.textContent = relationName === 'soporte' ? 'Soporte' : 'Resiliencia';
  badge.className = 'relation-badge ' + (relationName === 'soporte' ? 'badge-soporte' : 'badge-resiliencia');

  document.getElementById('relPhrase').textContent = rel ? rel.phrase : 'Aún no hay una ficha con la frase exacta del POT para esta relación.';
  document.getElementById('relPage').textContent = rel ? rel.page : '—';

  document.getElementById('relationPanel').style.display = 'block';
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
const baseViewBox = { x: 122, y: 110, w: 737, h: 625 };
let currentViewBox = { ...baseViewBox };

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
  updateStats();

  // Por defecto se ocultan las líneas "Directa" e "Indirecta" (grises) para
  // no saturar el diagrama; quedan disponibles desde la leyenda si se quieren ver.
  document.querySelectorAll('.legend-item[data-linktype="directa"], .legend-item[data-linktype="indirecta"]').forEach(item => {
    toggleLinkType(item.getAttribute('data-linktype'), item);
  });

  document.querySelectorAll('#staticNetwork .node').forEach(nodeEl => {
    nodeEl.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(nodeEl.id.replace(/^n_/, ''));
    });
  });

  document.querySelectorAll('#staticNetwork .links line.link-soporte, #staticNetwork .links line.link-resiliencia').forEach(line => {
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
