// =============================================================================
// RAPOT · Módulo 01 — Construir la Red
// Datos y lógica de la vista de red por estructura (EEP / EFS / ESE / EIP)
// =============================================================================

console.log('✓ Módulo 01 iniciando...');

// -----------------------------------------------------------------------
// 1. DATOS POR ESTRUCTURA
// -----------------------------------------------------------------------
// Cada estructura tiene su propia lista de relaciones {origen, destino, tipo, sustento, page}.
// EIP se deja intencionalmente vacía: la red de Patrimonios todavía no está
// construida y no debe inventarse información.
// -----------------------------------------------------------------------

const POT_DATA = {
  EEP: [
    { origen: "Quebradas", destino: "Ríos", tipo: "Directa", sustento: "El agua llega a Bogotá por cientos de escorrentías, quebradas y ríos que alimentan las cuatro cuencas.", page: "p. 51" },
    { origen: "Ríos", destino: "Quebradas", tipo: "Soporte", sustento: "Las cuatro cuencas (Tunjuelo, Fucha, Salitre y Torca) se alimentan de las quebradas y desembocan en el río Bogotá.", page: "p. 51" },
    { origen: "Ríos", destino: "Humedales", tipo: "Directa", sustento: "Los humedales son ecosistemas clave para la mitigación y adaptación al cambio climático, ligados al ciclo del río.", page: "p. 51" },
    { origen: "Humedales", destino: "Áreas protegidas", tipo: "Soporte", sustento: "El POT amplía en un 20% el área de humedales y declara dos nuevos como reservas.", page: "p. 54" },
    { origen: "Conectores ecosistémicos", destino: "Humedales", tipo: "Directa", sustento: "Los conectores abarcan espacios verdes hasta los humedales y parques de montaña.", page: "p. 58" },
    { origen: "Conectores ecosistémicos", destino: "Parques ecológicos de montaña", tipo: "Directa", sustento: "Los conectores incluyen parques ecológicos de montaña como Entrenubes y Soratama.", page: "p. 58" },
    { origen: "Conectores ecosistémicos", destino: "Áreas protegidas", tipo: "Soporte", sustento: "Los conectores priorizan coberturas vegetales que conecten las áreas protegidas.", page: "p. 58" },
    { origen: "Conectores ecosistémicos", destino: "Coberturas vegetales", tipo: "Directa", sustento: "Gracias al Manual de coberturas, los conectores priorizan más y mejores coberturas vegetales.", page: "p. 58" },
    { origen: "Parques de borde", destino: "Coberturas vegetales", tipo: "Directa", sustento: "La red de parques de borde contribuye a la mejora de las coberturas vegetales.", page: "p. 58" },
    { origen: "Parques de borde", destino: "Ríos", tipo: "Resiliencia", sustento: "Los parques de borde se establecen a lo largo de la ronda del río Bogotá.", page: "p. 58" },
    { origen: "Áreas de resiliencia climática", destino: "Coberturas vegetales", tipo: "Resiliencia", sustento: "Las áreas de resiliencia deben contar con coberturas que optimicen condiciones ambientales.", page: "p. 58" },
    { origen: "Bosques urbanos", destino: "Coberturas vegetales", tipo: "Directa", sustento: "El POT delinea 21 áreas estratégicas como bosques urbanos con nuevo manual de coberturas.", page: "p. 57" },
    { origen: "Bosques urbanos", destino: "Áreas protegidas", tipo: "Indirecta", sustento: "Los bosques urbanos incrementan la biodiversidad dentro de las áreas protegidas.", page: "p. 57" },
    { origen: "Corredores montañosos", destino: "Reservas forestales", tipo: "Soporte", sustento: "El POT protege corredores montañosos y reservas forestales como parte de la Estructura Ecológica Regional.", page: "p. 22" },
    { origen: "Reservas forestales", destino: "Ríos", tipo: "Soporte", sustento: "Las reservas forestales forman la Estructura Ecológica Regional que asegura el abastecimiento hídrico.", page: "p. 22" },
    { origen: "Complejos de páramos", destino: "Ríos", tipo: "Soporte", sustento: "El agua proviene del sistema de páramos más grande del mundo, por escorrentías, quebradas y ríos.", page: "p. 51" },
    { origen: "Paisajes sostenibles", destino: "Áreas protegidas", tipo: "Soporte", sustento: "El POT protege Paisajes Sostenibles y Parques Ecológicos de Montaña como conjunto.", page: "p. 21" },
    { origen: "Áreas protegidas", destino: "Complejos de páramos", tipo: "Directa", sustento: "El POT amplía protección sobre cerros orientales, corredor de páramos de Sumapaz y Chingaza.", page: "p. 21" },
    { origen: "Humedales", destino: "Áreas de resiliencia climática", tipo: "Resiliencia", sustento: "Los humedales regulan el agua, previenen inundaciones y son hogar de especies polinizadoras.", page: "p. 57" }
  ],
  EFS: [
    { origen: "Vivienda", destino: "Equipamientos", tipo: "Soporte", sustento: "La vivienda se articula con los sistemas de cuidado y equipamientos comunitarios.", page: "p. 29" },
    { origen: "Movilidad", destino: "Vivienda", tipo: "Directa", sustento: "La movilidad conecta a las comunidades con sus viviendas y servicios.", page: "p. 30" },
    { origen: "Espacio público", destino: "Equipamientos", tipo: "Directa", sustento: "El espacio público integra los equipamientos de servicios y cuidado.", page: "p. 31" },
    { origen: "Equipamientos", destino: "Salud", tipo: "Soporte", sustento: "Los equipamientos incluyen centros de salud comunitaria.", page: "p. 32" },
    { origen: "Salud", destino: "Educación", tipo: "Soporte", sustento: "La salud y la educación son servicios complementarios de cuidado.", page: "p. 32" },
    { origen: "Educación", destino: "Comunidades", tipo: "Directa", sustento: "La educación fortalece el tejido comunitario.", page: "p. 33" },
    { origen: "Comunidades", destino: "Espacio público", tipo: "Directa", sustento: "Las comunidades se reúnen en espacios públicos compartidos.", page: "p. 31" },
    { origen: "Infraestructura de servicios", destino: "Agua potable", tipo: "Directa", sustento: "La infraestructura garantiza servicios de agua potable.", page: "p. 34" },
    { origen: "Agua potable", destino: "Vivienda", tipo: "Soporte", sustento: "El acceso a agua es fundamental para la vivienda digna.", page: "p. 34" },
    { origen: "Saneamiento", destino: "Vivienda", tipo: "Soporte", sustento: "El saneamiento es esencial para la calidad de vida.", page: "p. 35" },
    { origen: "Energía", destino: "Equipamientos", tipo: "Soporte", sustento: "La energía permite el funcionamiento de los equipamientos.", page: "p. 36" },
    { origen: "Telecomunicaciones", destino: "Comunidades", tipo: "Indirecta", sustento: "Las TIC conectan a las comunidades.", page: "p. 37" },
    { origen: "Transporte público", destino: "Movilidad", tipo: "Directa", sustento: "El transporte público es la base de la movilidad urbana.", page: "p. 30" },
    { origen: "Ciclorrutas", destino: "Movilidad", tipo: "Soporte", sustento: "Las ciclorrutas complementan el sistema de movilidad.", page: "p. 39" },
    { origen: "Espacios de recreación", destino: "Espacio público", tipo: "Directa", sustento: "Los espacios recreativos enriquecen el espacio público.", page: "p. 40" },
    { origen: "Deportes", destino: "Comunidades", tipo: "Soporte", sustento: "El deporte cohesiona a las comunidades.", page: "p. 41" },
    { origen: "Cultura", destino: "Equipamientos", tipo: "Directa", sustento: "La cultura se desarrolla en equipamientos especializados.", page: "p. 42" },
    { origen: "Seguridad alimentaria", destino: "Vivienda", tipo: "Soporte", sustento: "La seguridad alimentaria es esencial para la vida digna.", page: "p. 43" },
    { origen: "Huertos urbanos", destino: "Seguridad alimentaria", tipo: "Directa", sustento: "Los huertos urbanos producen alimentos frescos.", page: "p. 44" },
    { origen: "Cuidadores y cuidadoras", destino: "Comunidades", tipo: "Directa", sustento: "Los cuidadores y cuidadoras fortalecen el tejido comunitario.", page: "p. 45" }
  ],
  ESE: [
    { origen: "Economía creativa", destino: "Empleo", tipo: "Directa", sustento: "La economía creativa genera empleos locales y sostenibles.", page: "p. 31" },
    { origen: "Distritos creativos", destino: "Economía creativa", tipo: "Soporte", sustento: "Los distritos creativos son espacios de innovación y creación.", page: "p. 46" },
    { origen: "Turismo", destino: "Empleo", tipo: "Directa", sustento: "El turismo genera empleo y dinámicas económicas locales.", page: "p. 47" },
    { origen: "Comercio local", destino: "Empleo", tipo: "Directa", sustento: "El comercio local genera oportunidades de trabajo.", page: "p. 48" },
    { origen: "Emprendimiento", destino: "Economía creativa", tipo: "Soporte", sustento: "El emprendimiento impulsa la innovación económica.", page: "p. 49" },
    { origen: "Innovación tecnológica", destino: "Emprendimiento", tipo: "Directa", sustento: "La innovación tecnológica potencia los emprendimientos.", page: "p. 50" },
    { origen: "Formación técnica", destino: "Emprendimiento", tipo: "Soporte", sustento: "La formación técnica prepara emprendedores.", page: "p. 51" },
    { origen: "Investigación", destino: "Innovación tecnológica", tipo: "Directa", sustento: "La investigación genera innovaciones.", page: "p. 52" },
    { origen: "Universidades", destino: "Investigación", tipo: "Soporte", sustento: "Las universidades generan conocimiento e investigación.", page: "p. 53" },
    { origen: "Centros de innovación", destino: "Emprendimiento", tipo: "Soporte", sustento: "Los centros de innovación apoyan emprendimientos.", page: "p. 54" },
    { origen: "Finanzas solidarias", destino: "Emprendimiento", tipo: "Soporte", sustento: "Las finanzas solidarias financian emprendimientos locales.", page: "p. 55" },
    { origen: "Cooperativas", destino: "Economía creativa", tipo: "Directa", sustento: "Las cooperativas impulsan la economía solidaria.", page: "p. 56" },
    { origen: "Comercio justo", destino: "Comercio local", tipo: "Directa", sustento: "El comercio justo garantiza prácticas éticas.", page: "p. 57" },
    { origen: "Producción sostenible", destino: "Economía creativa", tipo: "Soporte", sustento: "La producción sostenible es modelo de la nueva economía.", page: "p. 58" },
    { origen: "Bienes y servicios", destino: "Empleo", tipo: "Indirecta", sustento: "Los bienes y servicios generan valor y empleo.", page: "p. 59" },
    { origen: "Mercados locales", destino: "Comercio local", tipo: "Directa", sustento: "Los mercados locales dinamizan el comercio.", page: "p. 60" },
    { origen: "Agricultura urbana", destino: "Producción sostenible", tipo: "Directa", sustento: "La agricultura urbana produce alimentos localmente.", page: "p. 61" },
    { origen: "Agroindustria", destino: "Empleo", tipo: "Soporte", sustento: "La agroindustria genera valor agregado y empleo.", page: "p. 62" }
  ],
  // Estructura de Patrimonios: todavía en construcción.
  // No se agregan nodos ni relaciones hasta que exista información real.
  EIP: []
};

// -----------------------------------------------------------------------
// 2. CONFIGURACIÓN VISUAL DE LAS ESTRUCTURAS
// -----------------------------------------------------------------------
const STRUCTURES = {
  EEP: {
    id: 'EEP',
    shortName: 'EEP',
    label: 'EEP - Ecológica',
    fullName: 'Estructura Ecológica Principal',
    color: '#34d399',
    icon: 'fa-leaf',
    status: 'ready'
  },
  EFS: {
    id: 'EFS',
    shortName: 'EFS',
    label: 'EFS - Funcional',
    fullName: 'Estructura Funcional y del Cuidado',
    color: '#3b82f6',
    icon: 'fa-route',
    status: 'ready'
  },
  ESE: {
    id: 'ESE',
    shortName: 'ESE',
    label: 'ESE - Socioeconómica',
    fullName: 'Estructura Socioeconómica, Creativa y de Innovación',
    color: '#ef9552',
    icon: 'fa-briefcase',
    status: 'ready'
  },
  EIP: {
    id: 'EIP',
    shortName: 'EIP',
    label: 'EIP - Patrimonios',
    fullName: 'Estructura de Patrimonios',
    color: '#b06bf7',
    icon: 'fa-landmark',
    status: 'construction'
  }
};

const STRUCT_ORDER = ['EEP', 'EFS', 'ESE', 'EIP'];

// Tipos de relación → estilo de línea (color viene de las variables CSS --rel-*)
const REL_STYLE = {
  Directa: { color: 'var(--rel-directa)', hex: '#4d8dff', dashed: false },
  Indirecta: { color: 'var(--rel-indirecta)', hex: '#7b8c96', dashed: true },
  Soporte: { color: 'var(--rel-soporte)', hex: '#ff9a3d', dashed: false },
  Resiliencia: { color: 'var(--rel-resiliencia)', hex: '#2fd4c8', dashed: false }
};

// Umbral de grado para considerar un nodo "principal" (hub) dentro de la red visible
const PRINCIPAL_DEGREE_THRESHOLD = 4;

// -----------------------------------------------------------------------
// 3. ICONOGRAFÍA POR PALABRA CLAVE (Font Awesome — sin emojis)
// -----------------------------------------------------------------------
const ICON_RULES = [
  [/quebrad|río|ríos|humedal|agua|cuenca/i, 'fa-water'],
  [/bosque|árbol|cobertura|vegetal|páramo/i, 'fa-tree'],
  [/parque|recreaci[oó]n|espacio p[uú]blico/i, 'fa-tree-city'],
  [/vivienda|habitar|hogar/i, 'fa-house'],
  [/transporte|movilidad|ciclorruta|ciclocarril|red vial|vial/i, 'fa-route'],
  [/deporte/i, 'fa-futbol'],
  [/educaci[oó]n|formaci[oó]n|universidad/i, 'fa-graduation-cap'],
  [/salud/i, 'fa-heart-pulse'],
  [/cuidad/i, 'fa-hand-holding-heart'],
  [/equipamiento/i, 'fa-building-columns'],
  [/comunidad/i, 'fa-people-group'],
  [/energ[ií]a/i, 'fa-bolt'],
  [/telecomunicaci/i, 'fa-tower-broadcast'],
  [/saneamiento|potable|infraestructura de servicios/i, 'fa-droplet'],
  [/seguridad alimentaria|huerto|agricultura/i, 'fa-seedling'],
  [/patrimon|memoria|identidad|pr[aá]ctica cultural|saber/i, 'fa-landmark'],
  [/cultura/i, 'fa-masks-theater'],
  [/empleo|comercio|mercado|bien(es)? y servicio/i, 'fa-store'],
  [/econom[ií]a|distrito creativo|cooperativa/i, 'fa-briefcase'],
  [/innovaci[oó]n|tecnol[oó]gic|investigaci[oó]n|centro de innovaci[oó]n/i, 'fa-lightbulb'],
  [/finanza/i, 'fa-coins'],
  [/turismo/i, 'fa-umbrella-beach'],
  [/industria|producci[oó]n|agroindustria/i, 'fa-industry'],
  [/reserva forestal|corredor montañoso|área protegida|conector ecosist[eé]mico/i, 'fa-mountain-sun'],
  [/resiliencia clim[aá]tica|paisaje sostenible/i, 'fa-cloud-sun'],
  [/emprendimiento/i, 'fa-rocket']
];

function getNodeIcon(label, fallback) {
  for (const [regex, icon] of ICON_RULES) {
    if (regex.test(label)) return icon;
  }
  return fallback;
}

// -----------------------------------------------------------------------
// 4. ESTADO GLOBAL
// -----------------------------------------------------------------------
let activeStructureId = 'EEP';
let structureGraphs = {};     // { EEP: { nodes:[...], links:[...] }, ... }
let nodes = [];
let links = [];
let simulation = null;
let selectedNodeId = null;
let activeTypes = new Set(Object.keys(REL_STYLE));

// Persisten entre cambios de estructura (requisito §21-§23)
let showPrincipalNodes = true;
let showEdges = true;

// -----------------------------------------------------------------------
// 5. CONSTRUCCIÓN DE LOS GRAFOS (una vez, al cargar)
// -----------------------------------------------------------------------
function buildAllGraphs() {
  STRUCT_ORDER.forEach(structId => {
    const rows = POT_DATA[structId] || [];
    const nodeMap = new Map();
    const structLinks = [];
    const cfg = STRUCTURES[structId];

    rows.forEach(rel => {
      [rel.origen, rel.destino].forEach(name => {
        if (!nodeMap.has(name)) {
          nodeMap.set(name, {
            id: name,
            label: name,
            struct: structId,
            color: cfg.color,
            icon: getNodeIcon(name, cfg.icon),
            degree: 0
          });
        }
      });
      nodeMap.get(rel.origen).degree++;
      nodeMap.get(rel.destino).degree++;
      structLinks.push({
        source: rel.origen,
        target: rel.destino,
        tipo: rel.tipo,
        sustento: rel.sustento,
        page: rel.page
      });
    });

    const structNodes = Array.from(nodeMap.values());
    structNodes.forEach(n => {
      n.r = Math.max(26, Math.min(54, 24 + n.degree * 4));
      n.kind = n.degree >= PRINCIPAL_DEGREE_THRESHOLD ? 'principal' : 'secondary';
    });

    structureGraphs[structId] = { nodes: structNodes, links: structLinks };
  });

  console.log('✅ Grafos construidos:', STRUCT_ORDER.map(s => `${s}:${structureGraphs[s].nodes.length}n/${structureGraphs[s].links.length}r`).join(' · '));
}

// -----------------------------------------------------------------------
// 6. SIDEBAR DE ESTRUCTURAS (panel izquierdo del módulo)
// -----------------------------------------------------------------------
function renderStructureList() {
  const wrap = document.getElementById('structureList');
  if (!wrap) return;
  wrap.innerHTML = '';

  STRUCT_ORDER.forEach(structId => {
    const cfg = STRUCTURES[structId];
    const g = structureGraphs[structId];
    const count = cfg.status === 'construction' ? '–' : g.nodes.length;

    const item = document.createElement('div');
    item.className = 'structure-item' + (structId === activeStructureId ? ' active' : '');
    item.dataset.struct = structId;
    item.style.setProperty('--struct-color', cfg.color);
    item.innerHTML = `
      <span class="filter-dot" style="background:${cfg.color};"></span>
      <span class="structure-name">${cfg.label}</span>
      <span class="structure-count">${count}</span>
    `;
    item.addEventListener('click', () => selectStructure(structId));
    wrap.appendChild(item);
  });
}

// -----------------------------------------------------------------------
// 7. SELECCIÓN DE ESTRUCTURA
// -----------------------------------------------------------------------
function selectStructure(structId) {
  activeStructureId = structId;
  selectedNodeId = null;
  document.getElementById('detailPanel').style.display = 'none';

  renderStructureList();
  updateTitleCard();
  updateStatsForActiveStructure();

  const cfg = STRUCTURES[structId];
  if (cfg.status === 'construction') {
    showConstructionState(cfg);
    return;
  }
  hideConstructionState();

  const g = structureGraphs[structId];
  nodes = g.nodes.map(n => Object.assign({}, n)); // copia fresca: posiciones deterministas por estructura
  applyFilters();
}

function updateTitleCard() {
  const cfg = STRUCTURES[activeStructureId];
  const g = structureGraphs[activeStructureId];
  const title = document.getElementById('diagramTitle');
  const subtitle = document.getElementById('diagramSubtitle');
  if (!title || !subtitle) return;

  title.textContent = cfg.fullName;
  title.style.color = cfg.color;

  if (cfg.status === 'construction') {
    subtitle.textContent = 'Estructura en construcción';
  } else {
    subtitle.textContent = `Modo Analítico // Nodos = ${g.nodes.length}`;
  }
}

function updateStatsForActiveStructure() {
  const cfg = STRUCTURES[activeStructureId];
  const g = structureGraphs[activeStructureId];

  if (cfg.status === 'construction') {
    document.getElementById('statConceptos').textContent = '–';
    document.getElementById('statRelaciones').textContent = '–';
    document.getElementById('statFuentes').textContent = '–';
    document.getElementById('statTipos').textContent = '–';
    return;
  }

  const tiposPresentes = new Set(g.links.map(l => l.tipo));
  document.getElementById('statConceptos').textContent = g.nodes.length;
  document.getElementById('statRelaciones').textContent = g.links.length;
  document.getElementById('statFuentes').textContent = 1;
  document.getElementById('statTipos').textContent = tiposPresentes.size;
}

// -----------------------------------------------------------------------
// 8. ESTADO "EN CONSTRUCCIÓN" (EIP)
// -----------------------------------------------------------------------
function showConstructionState(cfg) {
  document.getElementById('graphSvgLayer').style.display = 'none';
  document.getElementById('nodeLayer').style.display = 'none';
  document.getElementById('layersCard').style.display = 'none';

  let el = document.getElementById('constructionState');
  if (!el) {
    el = document.createElement('div');
    el.id = 'constructionState';
    el.className = 'construction-state';
    document.getElementById('canvas-wrap').appendChild(el);
  }
  el.style.display = 'flex';
  el.style.setProperty('--construct-color', cfg.color);
  el.innerHTML = `
    <div class="construction-icon"><i class="fa-solid ${cfg.icon}"></i></div>
    <div class="construction-title">${cfg.fullName}</div>
    <div class="construction-badge"><i class="fa-solid fa-person-digging"></i> En construcción</div>
    <div class="construction-text">Todavía no se ha definido la red de conceptos y relaciones de esta estructura. Estará disponible cuando se incorpore la información oficial correspondiente.</div>
  `;
}

function hideConstructionState() {
  const el = document.getElementById('constructionState');
  if (el) el.style.display = 'none';
  document.getElementById('graphSvgLayer').style.display = 'block';
  document.getElementById('nodeLayer').style.display = 'block';
  document.getElementById('layersCard').style.display = 'flex';
}

// -----------------------------------------------------------------------
// 9. FILTROS (tipos de relación + capas)
// -----------------------------------------------------------------------
function applyFilters() {
  const cfg = STRUCTURES[activeStructureId];
  if (cfg.status === 'construction') return;

  const g = structureGraphs[activeStructureId];

  // Los nodos secundarios siempre se muestran; el switch "Nodos Principales"
  // controla específicamente los nodos principales (hubs) de la red.
  nodes = g.nodes.filter(n => n.kind !== 'principal' || showPrincipalNodes);

  const nodeIds = new Set(nodes.map(n => n.id));
  links = g.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target) && activeTypes.has(l.tipo));

  renderGraph();
}

// -----------------------------------------------------------------------
// 10. RENDER DEL GRAFO (SVG para líneas + capa HTML para nodos)
// -----------------------------------------------------------------------
function renderGraph() {
  const wrap = document.getElementById('canvas-wrap');
  const width = wrap.clientWidth;
  const height = wrap.clientHeight;

  const svg = d3.select('#graphSvgLayer').attr('width', width).attr('height', height);
  ensureArrowMarkers(svg);

  const nodeLayer = document.getElementById('nodeLayer');

  // Preservar posiciones existentes al re-renderizar (filtros, resize, etc.)
  const prevPositions = new Map();
  if (simulation) {
    simulation.nodes().forEach(n => prevPositions.set(n.id, { x: n.x, y: n.y, vx: n.vx, vy: n.vy }));
  }
  nodes.forEach((n, i) => {
    const prev = prevPositions.get(n.id);
    if (prev) {
      Object.assign(n, prev);
    } else {
      // Posición inicial determinista (espiral áurea) — nunca aleatoria.
      const angle = i * 2.399963229728653;
      const radius = 40 + i * 9;
      n.x = width / 2 + Math.cos(angle) * Math.min(radius, width / 2.4);
      n.y = height / 2 + Math.sin(angle) * Math.min(radius, height / 2.4);
    }
  });

  // --- Líneas (SVG) con flechas de dirección ---
  const linkSel = svg.select('#edgesGroup').selectAll('line.edge')
    .data(showEdges ? links : [], d => d.source + '→' + d.target + d.tipo);

  linkSel.exit().remove();

  const linkEnter = linkSel.enter()
    .append('line')
    .attr('class', 'edge')
    .attr('stroke', d => (REL_STYLE[d.tipo] || REL_STYLE.Directa).color)
    .attr('stroke-width', d => d.tipo === 'Resiliencia' ? 2.5 : 1.8)
    .attr('stroke-dasharray', d => (REL_STYLE[d.tipo] || {}).dashed ? '5,4' : 'none')
    .attr('marker-end', d => `url(#arrow-${d.tipo})`)
    .attr('opacity', 0);

  linkEnter.transition().duration(300).attr('opacity', 0.8);
  const allLinkSel = linkEnter.merge(linkSel);

  // --- Nodos (HTML, con íconos Font Awesome — sin emojis) ---
  const nodeSel = d3.select(nodeLayer).selectAll('div.node')
    .data(nodes, d => d.id);

  nodeSel.exit().transition().duration(250).style('opacity', 0).remove();

  const nodeEnter = nodeSel.enter()
    .append('div')
    .attr('class', d => `node ${d.kind}${d.id === selectedNodeId ? ' selected' : ''}`)
    .style('width', d => d.r * 2 + 'px')
    .style('height', d => d.r * 2 + 'px')
    .style('border-color', d => d.color)
    .style('box-shadow', d => nodeGlow(d.color))
    .style('opacity', 0)
    .html(d => `<div class="icon" style="color:${d.color};font-size:${Math.round(d.r * 0.5)}px;"><i class="fa-solid ${d.icon}"></i></div>
                <div class="label" style="font-size:${d.r >= 40 ? 11 : 9.5}px;">${d.label}</div>`);

  nodeEnter.transition().duration(300).style('opacity', 1);

  const allNodeSel = nodeEnter.merge(nodeSel)
    .attr('class', d => `node ${d.kind}${d.id === selectedNodeId ? ' selected' : ''}`)
    .style('border-color', d => d.color)
    .style('box-shadow', d => nodeGlow(d.color));

  attachDrag(allNodeSel);

  // --- Simulación de fuerzas (determinista: mismas posiciones iniciales → mismo resultado) ---
  if (simulation) simulation.stop();

  simulation = d3.forceSimulation(nodes)
    .velocityDecay(0.5)
    .force('link', d3.forceLink(links).id(d => d.id).distance(125).strength(0.25))
    .force('charge', d3.forceManyBody().strength(d => d.kind === 'principal' ? -420 : -220))
    .force('x', d3.forceX(width / 2).strength(d => d.kind === 'principal' ? 0.09 : 0.035))
    .force('y', d3.forceY(height / 2).strength(d => d.kind === 'principal' ? 0.09 : 0.035))
    .force('collide', d3.forceCollide(d => d.r + 16));

  simulation.on('tick', () => {
    allLinkSel.each(function (d) {
      const s = typeof d.source === 'object' ? d.source : nodes.find(n => n.id === d.source);
      const t = typeof d.target === 'object' ? d.target : nodes.find(n => n.id === d.target);
      if (!s || !t) return;
      const pt = edgeEndpoint(s, t);
      d3.select(this).attr('x1', s.x).attr('y1', s.y).attr('x2', pt.x).attr('y2', pt.y);
    });

    allNodeSel
      .style('left', d => (d.x - d.r) + 'px')
      .style('top', d => (d.y - d.r) + 'px');
  });
}

// Calcula el punto donde la línea debe terminar (borde del nodo destino)
// para que la flecha quede visible y no atraviese el círculo.
function edgeEndpoint(source, target) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const offset = target.r + 6;
  return {
    x: target.x - (dx / dist) * offset,
    y: target.y - (dy / dist) * offset
  };
}

function nodeGlow(hex) {
  return `0 0 16px -2px ${hexToRgba(hex, 0.5)}, inset 0 0 16px ${hexToRgba(hex, 0.06)}`;
}

function hexToRgba(hex, alpha) {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16), g = parseInt(v.substring(2, 4), 16), b = parseInt(v.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Crea (una sola vez) las puntas de flecha SVG para cada tipo de relación
function ensureArrowMarkers(svg) {
  let defs = svg.select('defs');
  if (defs.empty()) defs = svg.append('defs');
  if (svg.select('#edgesGroup').empty()) svg.append('g').attr('id', 'edgesGroup');

  Object.entries(REL_STYLE).forEach(([tipo, style]) => {
    if (!defs.select(`#arrow-${tipo}`).empty()) return;
    defs.append('marker')
      .attr('id', `arrow-${tipo}`)
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M0,0 L10,5 L0,10 Z')
      .attr('fill', style.hex);
  });
}

// -----------------------------------------------------------------------
// 11. ARRASTRE CON INERCIA
// -----------------------------------------------------------------------
function attachDrag(selection) {
  selection.on('pointerdown', function (event, d) {
    event.stopPropagation();
    const wrap = document.getElementById('canvas-wrap');
    const rect = wrap.getBoundingClientRect();
    let dragging = false;
    let last = { x: event.clientX, y: event.clientY, t: performance.now() };
    const startClient = { x: event.clientX, y: event.clientY };

    d3.select(this).classed('dragging', true).raise();
    simulation.alphaTarget(0.2).restart();
    d.fx = d.x; d.fy = d.y;

    function toLocal(cx, cy) {
      return { x: cx - rect.left, y: cy - rect.top };
    }

    function onMove(e) {
      const distMoved = Math.hypot(e.clientX - startClient.x, e.clientY - startClient.y);
      if (distMoved > 4) dragging = true;

      const p = toLocal(e.clientX, e.clientY);
      const now = performance.now();
      const dt = Math.max(now - last.t, 1);
      d.vx = (p.x - d.fx) / dt * 16 * 0.6;
      d.vy = (p.y - d.fy) / dt * 16 * 0.6;
      d.fx = p.x; d.fy = p.y;
      last = { x: e.clientX, y: e.clientY, t: now };
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      d3.select(this).classed('dragging', false);
      simulation.alphaTarget(0);
      d.fx = null; d.fy = null;
      if (!dragging) showDetail(d);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp.bind(this));
  });
}

// -----------------------------------------------------------------------
// 12. PANEL DE DETALLE
// -----------------------------------------------------------------------
function showDetail(node) {
  selectedNodeId = node.id;
  document.querySelectorAll('#nodeLayer .node').forEach(el => el.classList.remove('selected'));

  document.getElementById('detailPanel').style.display = 'flex';
  document.getElementById('detailName').textContent = node.label;
  document.getElementById('detailStruct').textContent = STRUCTURES[activeStructureId].fullName;

  const g = structureGraphs[activeStructureId];
  const outgoing = g.links.filter(l => l.source === node.id);
  const incoming = g.links.filter(l => l.target === node.id);

  document.getElementById('detailOut').innerHTML = outgoing.length
    ? outgoing.map(l => `<div style="padding:4px 0;">→ <strong>${l.target}</strong><span class="rel-tag">${l.tipo}</span></div>`).join('')
    : '<span style="color:var(--text-faint);font-size:11px;">Sin conexiones</span>';

  document.getElementById('detailIn').innerHTML = incoming.length
    ? incoming.map(l => `<div style="padding:4px 0;">← <strong>${l.source}</strong><span class="rel-tag">${l.tipo}</span></div>`).join('')
    : '<span style="color:var(--text-faint);font-size:11px;">Sin conexiones</span>';

  d3.select('#nodeLayer').selectAll('div.node').classed('selected', d => d.id === node.id);
}

// -----------------------------------------------------------------------
// 13. CONTROLES (filtros de tipo, capas, pestañas)
// -----------------------------------------------------------------------
function bindControls() {
  document.querySelectorAll('.filter-type').forEach(el => {
    el.addEventListener('change', () => {
      activeTypes = new Set(
        Array.from(document.querySelectorAll('.filter-type:checked')).map(i => i.value)
      );
      applyFilters();
    });
  });

  const togglePrincipal = document.getElementById('togglePrincipal');
  if (togglePrincipal) {
    togglePrincipal.addEventListener('change', e => {
      showPrincipalNodes = e.target.checked;
      applyFilters();
    });
  }

  const toggleEdges = document.getElementById('toggleEdges');
  if (toggleEdges) {
    toggleEdges.addEventListener('change', e => {
      showEdges = e.target.checked;
      renderGraph();
    });
  }

  document.querySelectorAll('.graph-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.graph-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.dataset.tab;
      const canvas = document.getElementById('canvas-wrap');
      canvas.classList.toggle('mode-concepts', mode === 'conceptos');
      canvas.classList.toggle('mode-relations', mode === 'relaciones');
    });
  });

  const detailPanel = document.getElementById('detailPanel');
  if (detailPanel) {
    detailPanel.addEventListener('click', e => {
      if (e.target === detailPanel) detailPanel.style.display = 'none';
    });
  }
}

// -----------------------------------------------------------------------
// 14. INICIO
// -----------------------------------------------------------------------
function init() {
  buildAllGraphs();
  renderStructureList();
  bindControls();
  selectStructure(activeStructureId);
}

window.addEventListener('load', init);

window.addEventListener('resize', () => {
  const wrap = document.getElementById('canvas-wrap');
  if (!wrap) return;
  d3.select('#graphSvgLayer').attr('width', wrap.clientWidth).attr('height', wrap.clientHeight);
  if (simulation) {
    simulation.force('x', d3.forceX(wrap.clientWidth / 2).strength(d => d.kind === 'principal' ? 0.09 : 0.035));
    simulation.force('y', d3.forceY(wrap.clientHeight / 2).strength(d => d.kind === 'principal' ? 0.09 : 0.035));
    simulation.alpha(0.3).restart();
  }
});

console.log('✓ Script listo');
