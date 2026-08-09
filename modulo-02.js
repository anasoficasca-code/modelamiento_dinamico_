// MODULO 02: MEDIR LA RED - VERSIÓN CORREGIDA
console.log('Módulo 02: Medir la Red - Inicializado');

// ESPERAR A QUE TODO CARGUE
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado');
  
  setTimeout(() => {
    if (typeof d3 === 'undefined') {
      console.error('D3 no está disponible');
      return;
    }
    console.log('D3 disponible, inicializando...');
    initialize();
  }, 500);
});

// DATOS REALES DEL POT
const potData = {
  EEP: {
    name: "Estructura Ecológica Principal",
    color: "#2fd4c8",
    nodes: [
      "Quebradas", "Ríos", "Humedales", "Áreas de resiliencia climática",
      "Áreas protegidas", "Conectores ecosistémicos", "Parques ecológicos de montaña",
      "Coberturas vegetales", "Parques de borde", "Bosques urbanos",
      "Corredores montañosos", "Reservas forestales", "Complejos de páramos",
      "Paisajes sostenibles"
    ]
  },
  EFC: {
    name: "Estructura Funcional y del Cuidado",
    color: "#5b8def",
    nodes: [
      "Movilidad", "Transporte público", "Ciclorrutas", "Corredores verdes",
      "Espacio público", "Parques", "UPL", "Proximidad", "Servicios sociales",
      "Accesibilidad", "Manzanas del Cuidado", "Servicios de cuidado",
      "Vivienda", "Equipamientos", "Red vial", "Servicios públicos"
    ]
  },
  ESECI: {
    name: "Estructura Socioeconómica, Creativa y de Innovación",
    color: "#a276f2",
    nodes: [
      "Huertas", "Agricultura urbana", "Producción de alimentos",
      "Economía circular", "Negocios verdes", "Industria",
      "Actividades productivas", "Actividades económicas",
      "Aglomeraciones económicas", "Empleo", "Comercio",
      "Economías de proximidad", "Innovación", "Actividades creativas",
      "Turismo", "Servicios"
    ]
  },
  EIP: {
    name: "Estructura Integradora de Patrimonios",
    color: "#f76fb0",
    nodes: [
      "Patrimonios", "Patrimonio material", "Patrimonio inmaterial",
      "Memoria", "Prácticas culturales", "Dinámicas comunitarias",
      "Patrimonio natural", "Saberes del lugar", "Identidades",
      "Patrimonio local", "Modos de habitar", "Cultura"
    ]
  }
};

// RELACIONES (30 total)
const relationships = [
  { source: "Quebradas", target: "Ríos", strength: "strong" },
  { source: "Ríos", target: "Humedales", strength: "strong" },
  { source: "Humedales", target: "Áreas de resiliencia climática", strength: "medium" },
  { source: "Humedales", target: "Áreas protegidas", strength: "strong" },
  { source: "Conectores ecosistémicos", target: "Humedales", strength: "medium" },
  { source: "Conectores ecosistémicos", target: "Parques ecológicos de montaña", strength: "medium" },
  { source: "Conectores ecosistémicos", target: "Coberturas vegetales", strength: "medium" },
  { source: "Parques de borde", target: "Ríos", strength: "strong" },
  { source: "Bosques urbanos", target: "Coberturas vegetales", strength: "medium" },
  { source: "Movilidad", target: "Transporte público", strength: "strong" },
  { source: "Transporte público", target: "Ciclorrutas", strength: "medium" },
  { source: "Movilidad", target: "Espacio público", strength: "strong" },
  { source: "Espacio público", target: "Parques", strength: "medium" },
  { source: "UPL", target: "Proximidad", strength: "strong" },
  { source: "UPL", target: "Servicios sociales", strength: "strong" },
  { source: "Manzanas del Cuidado", target: "Servicios de cuidado", strength: "strong" },
  { source: "Vivienda", target: "Equipamientos", strength: "strong" },
  { source: "Agricultura urbana", target: "Producción de alimentos", strength: "strong" },
  { source: "Economía circular", target: "Negocios verdes", strength: "strong" },
  { source: "Actividades productivas", target: "Empleo", strength: "strong" },
  { source: "Innovación", target: "Empleo", strength: "medium" },
  { source: "Patrimonios", target: "Patrimonio material", strength: "strong" },
  { source: "Patrimonios", target: "Patrimonio inmaterial", strength: "strong" },
  { source: "Patrimonio material", target: "Memoria", strength: "medium" },
  { source: "Prácticas culturales", target: "Dinámicas comunitarias", strength: "medium" },
  { source: "Ríos", target: "Movilidad", strength: "medium" },
  { source: "Coberturas vegetales", target: "Negocios verdes", strength: "weak" },
  { source: "Agricultura urbana", target: "Áreas protegidas", strength: "weak" },
  { source: "Empleo", target: "Vivienda", strength: "strong" },
  { source: "Patrimonio local", target: "Turismo", strength: "medium" }
];

// STATE
let allNodes = [];
let allLinks = [];
let selectedNode = null;
let currentAction = null;
let networkSimulation = null;

// INITIALIZE
function initialize() {
  console.log('Inicializando simulador...');
  buildNodeList();
  populateDropdown();
  buildNodeListUI();
  updateStats();
  drawNetwork();
  console.log('✅ Simulador listo');
}

// BUILD ALL NODES
function buildNodeList() {
  allNodes = [];
  for (let structure in potData) {
    potData[structure].nodes.forEach(node => {
      allNodes.push({
        id: node,
        label: node,
        structure: structure,
        structureName: potData[structure].name,
        color: potData[structure].color,
        active: true,
        influence: 1.0,
        x: Math.random() * 400,
        y: Math.random() * 400
      });
    });
  }
  
  allLinks = relationships.map(rel => ({
    source: rel.source,
    target: rel.target,
    strength: rel.strength,
    active: true
  }));
  
  console.log('✅ Nodos:', allNodes.length, 'Enlaces:', allLinks.length);
}

// POPULATE DROPDOWN
function populateDropdown() {
  const select = document.getElementById('nodeSelect');
  if (!select) return;
  
  select.innerHTML = '<option value="">-- Selecciona un concepto --</option>';
  
  allNodes.forEach(node => {
    const option = document.createElement('option');
    option.value = node.id;
    option.textContent = node.id + ' (' + node.structure + ')';
    select.appendChild(option);
  });
}

// BUILD NODE LIST UI
function buildNodeListUI() {
  const nodeList = document.getElementById('nodeList');
  if (!nodeList) return;
  
  nodeList.innerHTML = allNodes.slice(0, 15).map(node => `
    <div class="node-list-item" onclick="selectNode('${node.id}')" style="border-left: 3px solid ${node.color};">
      ${node.label}
    </div>
  `).join('');
}

// SELECT NODE - MOSTRAR SOLO SUS CONEXIONES
function selectNode(nodeId) {
  selectedNode = allNodes.find(n => n.id === nodeId);
  
  if (!selectedNode) return;
  
  const select = document.getElementById('nodeSelect');
  if (select) select.value = nodeId;
  
  const connectedTo = allLinks.filter(l => l.source === nodeId && l.active).length;
  const connectedFrom = allLinks.filter(l => l.target === nodeId && l.active).length;
  const totalConnections = connectedTo + connectedFrom;
  
  const info = document.getElementById('selectedNodeInfo');
  if (info) {
    info.innerHTML = `
      <div class="node-info-content">
        <div class="node-info-name">${selectedNode.label}</div>
        <div class="node-info-structure">${selectedNode.structure}</div>
        <div class="node-info-connections">
          <div class="connection-count">🔗 Conexiones: ${totalConnections}</div>
          <div class="connection-count">${selectedNode.structureName}</div>
        </div>
      </div>
    `;
  }
  
  drawNetwork();
}

// SEARCH NODES
function searchNodes(query) {
  const nodeList = document.getElementById('nodeList');
  if (!nodeList) return;
  
  if (!query) {
    buildNodeListUI();
    return;
  }
  
  const filtered = allNodes.filter(n => 
    n.label.toLowerCase().includes(query.toLowerCase())
  );
  
  nodeList.innerHTML = filtered.slice(0, 15).map(node => `
    <div class="node-list-item" onclick="selectNode('${node.id}')" style="border-left: 3px solid ${node.color};">
      ${node.label}
    </div>
  `).join('');
}

// APPLY ACTION
function applyAction(action) {
  if (!selectedNode) {
    alert('Selecciona un nodo primero');
    return;
  }
  
  currentAction = action;
  
  switch(action) {
    case 'apagar':
      selectedNode.active = false;
      allLinks.forEach(link => {
        if (link.source === selectedNode.id || link.target === selectedNode.id) {
          link.active = false;
        }
      });
      break;
    case 'desconectar':
      allLinks.forEach(link => {
        if (link.source === selectedNode.id || link.target === selectedNode.id) {
          link.active = false;
        }
      });
      break;
    case 'aumentar':
      selectedNode.influence = Math.min(2.0, selectedNode.influence + 0.3);
      break;
    case 'disminuir':
      selectedNode.influence = Math.max(0.5, selectedNode.influence - 0.3);
      break;
  }
  
  updateStats();
  updateComparison();
  drawNetwork();
}

// UPDATE STATS
function updateStats() {
  const activeNodes = allNodes.filter(n => n.active).length;
  const activeLinks = allLinks.filter(l => l.active).length;
  const density = activeNodes > 1 ? (activeLinks / (activeNodes * (activeNodes - 1) / 2)).toFixed(2) : 0;
  
  const totalNodesEl = document.getElementById('totalNodes');
  const totalLinksEl = document.getElementById('totalLinks');
  const densityEl = document.getElementById('density');
  
  if (totalNodesEl) totalNodesEl.textContent = activeNodes;
  if (totalLinksEl) totalLinksEl.textContent = activeLinks;
  if (densityEl) densityEl.textContent = density;
}

// UPDATE COMPARISON
function updateComparison() {
  const afterNodes = allNodes.filter(n => n.active).length;
  const afterLinks = allLinks.filter(l => l.active).length;
  const afterDensity = afterNodes > 1 ? (afterLinks / (afterNodes * (afterNodes - 1) / 2)).toFixed(2) : 0;
  
  const beforeNodes = 87;
  const beforeLinks = 156;
  
  const deltaNodos = afterNodes - beforeNodes;
  const deltaImpacto = beforeLinks > 0 ? ((afterLinks - beforeLinks) / beforeLinks * 100).toFixed(1) : 0;
  
  const afterNodesEl = document.getElementById('afterNodes');
  const afterLinksEl = document.getElementById('afterLinks');
  const afterDensityEl = document.getElementById('afterDensity');
  const deltaNodosEl = document.getElementById('deltaNodos');
  const deltaImpactoEl = document.getElementById('deltaImpacto');
  
  if (afterNodesEl) afterNodesEl.textContent = afterNodes;
  if (afterLinksEl) afterLinksEl.textContent = afterLinks;
  if (afterDensityEl) afterDensityEl.textContent = afterDensity;
  if (deltaNodosEl) deltaNodosEl.textContent = deltaNodos > 0 ? '+' + deltaNodos : deltaNodos;
  if (deltaImpactoEl) deltaImpactoEl.textContent = deltaImpacto > 0 ? '+' + deltaImpacto + '%' : deltaImpacto + '%';
}

// ⭐ DRAW NETWORK - VERSIÓN COMPLETAMENTE CORREGIDA
function drawNetwork() {
  const svg = d3.select('#networkViz');
  if (svg.empty()) {
    console.error('SVG #networkViz no encontrado');
    return;
  }
  
  const container = svg.node().parentElement;
  const width = container.offsetWidth - 40;
  const height = 500;
  
  svg.attr('width', width).attr('height', height);
  svg.selectAll('*').remove();
  
  let activeNodes = allNodes.filter(n => n.active);
  let activeLinks = allLinks.filter(l => l.active);
  
  // SI HAY UN NODO SELECCIONADO - MOSTRAR SOLO CONEXIONES DIRECTAS
  if (selectedNode && selectedNode.active) {
    const connectedNodeIds = new Set();
    connectedNodeIds.add(selectedNode.id);
    
    allLinks.forEach(link => {
      if (link.active) {
        if (link.source === selectedNode.id) {
          connectedNodeIds.add(link.target);
        }
        if (link.target === selectedNode.id) {
          connectedNodeIds.add(link.source);
        }
      }
    });
    
    activeNodes = allNodes.filter(n => connectedNodeIds.has(n.id) && n.active);
    activeLinks = allLinks.filter(l => 
      l.active && 
      connectedNodeIds.has(l.source) && 
      connectedNodeIds.has(l.target)
    );
  } else {
    activeLinks = activeLinks.filter(l => 
      activeNodes.some(n => n.id === l.source) &&
      activeNodes.some(n => n.id === l.target)
    );
  }
  
  console.log('🎨 Dibujando:', activeNodes.length, 'nodos,', activeLinks.length, 'enlaces');
  
  if (networkSimulation) networkSimulation.stop();
  
  // ⭐ PASO CRÍTICO: Crear links con referencias a OBJETOS, no strings
  const linksForSimulation = activeLinks.map(link => {
    const sourceNode = activeNodes.find(n => n.id === link.source);
    const targetNode = activeNodes.find(n => n.id === link.target);
    
    if (!sourceNode || !targetNode) {
      return null;
    }
    
    return {
      source: sourceNode,
      target: targetNode,
      strength: link.strength
    };
  }).filter(l => l !== null);
  
  // ⭐ SIMULACIÓN CON forceLink CORRECTO
  networkSimulation = d3.forceSimulation(activeNodes)
    .force('link', d3.forceLink(linksForSimulation)
      .id(d => d.id)
      .distance(d => {
        if (d.strength === 'strong') return 80;
        if (d.strength === 'medium') return 100;
        return 120;
      }))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(20));
  
  // RENDERIZAR EN CAPAS
  const linkGroup = svg.append('g');
  const nodeGroup = svg.append('g');
  const labelGroup = svg.append('g');
  
  const link = linkGroup.selectAll('line')
    .data(linksForSimulation)
    .enter()
    .append('line')
    .attr('stroke', d => {
      if (d.strength === 'strong') return 'rgba(47,212,200,0.8)';
      if (d.strength === 'medium') return 'rgba(91,141,239,0.6)';
      return 'rgba(162,118,242,0.3)';
    })
    .attr('stroke-width', d => {
      if (d.strength === 'strong') return 3;
      if (d.strength === 'medium') return 2;
      return 1.5;
    });
  
  const node = nodeGroup.selectAll('circle')
    .data(activeNodes)
    .enter()
    .append('circle')
    .attr('r', d => {
      const baseSize = 12 * (d.influence || 1);
      return d.id === selectedNode?.id ? baseSize + 6 : baseSize;
    })
    .attr('fill', d => d.color)
    .attr('opacity', d => d.id === selectedNode?.id ? 1 : 0.8)
    .attr('stroke', d => d.id === selectedNode?.id ? '#fff' : 'rgba(255,255,255,0.3)')
    .attr('stroke-width', d => d.id === selectedNode?.id ? 3 : 2)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  const labels = labelGroup.selectAll('text')
    .data(activeNodes)
    .enter()
    .append('text')
    .text(d => d.label.substring(0, 12))
    .attr('font-size', d => d.id === selectedNode?.id ? '11px' : '9px')
    .attr('font-weight', d => d.id === selectedNode?.id ? 'bold' : 'normal')
    .attr('fill', '#e7eaf2')
    .attr('text-anchor', 'middle')
    .attr('pointer-events', 'none');
  
  networkSimulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    labels
      .attr('x', d => d.x)
      .attr('y', d => d.y + 4);
  });
  
  function dragstarted(event, d) {
    if (!event.active) networkSimulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) networkSimulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// SIMULATION
function runSimulation() {
  updateStats();
  updateComparison();
  console.log('Simulación ejecutada');
}

function resetSimulation() {
  selectedNode = null;
  currentAction = null;
  buildNodeList();
  populateDropdown();
  buildNodeListUI();
  updateStats();
  drawNetwork();
  const info = document.getElementById('selectedNodeInfo');
  if (info) {
    info.innerHTML = '<div class="info-placeholder">Selecciona un nodo para ver detalles</div>';
  }
}

function toggleVisualization(type) {
  const toggleNodos = document.getElementById('toggleNodos');
  const toggleLinks = document.getElementById('toggleLinks');
  
  if (toggleNodos && toggleLinks) {
    if (type === 'nodos') {
      toggleNodos.classList.add('active');
      toggleLinks.classList.remove('active');
    } else {
      toggleLinks.classList.add('active');
      toggleNodos.classList.remove('active');
    }
  }
}

// RESIZE
window.addEventListener('resize', () => {
  drawNetwork();
});

console.log('✅ Módulo 02 completamente cargado y funcionando');
