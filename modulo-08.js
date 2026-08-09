// MODULO 08: MODELO PROPIO
console.log('Módulo 08: Modelo Propio - Inicializado');

// STATE
let modelElements = [];
let modelConnections = [];
let selectedElement = null;
let isDrawingMode = false;

// CANVAS
const svg = d3.select('#modelCanvas');
let zoomLevel = 1;

// INIT
document.addEventListener('DOMContentLoaded', function() {
  console.log('Constructor de modelo listo');
  updateStats();
});

// SWITCH TABS
function switchTab(tab) {
  const lists = document.querySelectorAll('.elements-list');
  lists.forEach(list => list.style.display = 'none');
  
  if (tab === 'structures') {
    document.getElementById('structuresList').style.display = 'flex';
  } else if (tab === 'actors') {
    document.getElementById('actorsList').style.display = 'flex';
  } else if (tab === 'processes') {
    document.getElementById('processesList').style.display = 'flex';
  }
  
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.closest('.tab-btn').classList.add('active');
}

// DRAG ELEMENT
function dragElement(event, type, name) {
  event.dataTransfer.effectAllowed = 'copy';
  event.dataTransfer.setData('type', type);
  event.dataTransfer.setData('name', name);
  console.log('Arrastrando:', type, name);
}

// ALLOW DROP
function allowDrop(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

// DROP ELEMENT
function dropElement(event) {
  event.preventDefault();
  
  const type = event.dataTransfer.getData('type');
  const name = event.dataTransfer.getData('name');
  
  const svg = d3.select('#modelCanvas');
  const rect = svg.node().getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const element = {
    id: 'elem_' + Date.now(),
    type: type,
    name: name,
    x: x,
    y: y,
    color: getColorByType(type),
    kpi: ''
  };
  
  modelElements.push(element);
  renderCanvas();
  updateStats();
  console.log('Elemento añadido:', element);
}

// GET COLOR BY TYPE
function getColorByType(type) {
  const colors = {
    structure: '#2fd4c8',
    actor: '#5b8def',
    process: '#a276f2'
  };
  return colors[type] || '#2fd4c8';
}

// RENDER CANVAS
function renderCanvas() {
  const svg = d3.select('#modelCanvas');
  svg.selectAll('*').remove();
  
  // CONNECTIONS
  svg.append('g').selectAll('line')
    .data(modelConnections)
    .enter()
    .append('line')
    .attr('x1', d => modelElements.find(e => e.id === d.source)?.x || 0)
    .attr('y1', d => modelElements.find(e => e.id === d.source)?.y || 0)
    .attr('x2', d => modelElements.find(e => e.id === d.target)?.x || 0)
    .attr('y2', d => modelElements.find(e => e.id === d.target)?.y || 0)
    .attr('stroke', 'rgba(47,212,200,0.4)')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)');
  
  // ARROWHEAD
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('refX', 9)
    .attr('refY', 3)
    .attr('orient', 'auto')
    .append('polygon')
    .attr('points', '0 0, 10 3, 0 6')
    .attr('fill', 'rgba(47,212,200,0.4)');
  
  // ELEMENTS
  const nodeGroup = svg.append('g').selectAll('g')
    .data(modelElements)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .on('click', (event, d) => selectElement(d));
  
  nodeGroup.append('circle')
    .attr('r', 24)
    .attr('fill', d => d.color)
    .attr('opacity', d => d.id === selectedElement?.id ? 0.9 : 0.7)
    .attr('stroke', d => d.id === selectedElement?.id ? '#fff' : 'none')
    .attr('stroke-width', 2);
  
  nodeGroup.append('text')
    .text(d => d.name.substring(0, 2).toUpperCase())
    .attr('fill', '#fff')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('font-weight', '700')
    .attr('font-size', '12px')
    .attr('pointer-events', 'none');
  
  // LABELS
  nodeGroup.append('text')
    .text(d => d.name.substring(0, 10))
    .attr('fill', 'var(--text)')
    .attr('text-anchor', 'middle')
    .attr('dy', '40px')
    .attr('font-size', '10px')
    .attr('pointer-events', 'none');
}

// SELECT ELEMENT
function selectElement(element) {
  selectedElement = element;
  
  document.getElementById('elementName').value = element.name;
  document.getElementById('elementDesc').value = 'Descripción de ' + element.name;
  document.getElementById('elementColor').value = element.color;
  document.getElementById('elementKPI').value = element.kpi || '';
  
  renderCanvas();
  console.log('Elemento seleccionado:', element);
}

// UPDATE ELEMENT
function updateElement() {
  if (!selectedElement) return;
  
  selectedElement.name = document.getElementById('elementName').value;
  selectedElement.color = document.getElementById('elementColor').value;
  selectedElement.kpi = document.getElementById('elementKPI').value;
  
  renderCanvas();
}

// APPLY PROPERTIES
function applyProperties() {
  updateElement();
  alert('Propiedades aplicadas');
}

// ENABLE DRAWING
function enableDrawing() {
  isDrawingMode = !isDrawingMode;
  const btn = event.target.closest('.tool-btn');
  btn.classList.toggle('active');
  console.log('Modo dibujo:', isDrawingMode);
}

// DELETE SELECTED
function deleteSelected() {
  if (!selectedElement) {
    alert('Selecciona un elemento primero');
    return;
  }
  
  modelElements = modelElements.filter(e => e.id !== selectedElement.id);
  modelConnections = modelConnections.filter(
    c => c.source !== selectedElement.id && c.target !== selectedElement.id
  );
  
  selectedElement = null;
  renderCanvas();
  updateStats();
}

// ZOOM
function zoomIn() {
  zoomLevel += 0.1;
  svg.attr('transform', `scale(${zoomLevel})`);
}

function zoomOut() {
  if (zoomLevel > 0.5) {
    zoomLevel -= 0.1;
    svg.attr('transform', `scale(${zoomLevel})`);
  }
}

// UPDATE STATS
function updateStats() {
  document.getElementById('nodeCount').textContent = modelElements.length;
  document.getElementById('linkCount').textContent = modelConnections.length;
  const density = modelElements.length > 0 
    ? (modelConnections.length / (modelElements.length * (modelElements.length - 1) / 2) * 100).toFixed(1)
    : 0;
  document.getElementById('densityCount').textContent = density + '%';
}

// LOAD TEMPLATE
function loadTemplate(template) {
  modelElements = [];
  modelConnections = [];
  
  const templates = {
    green: [
      { name: 'Ecología', type: 'structure' },
      { name: 'Biodiversidad', type: 'process' },
      { name: 'Ciclos Naturales', type: 'process' },
      { name: 'Resiliencia Climática', type: 'process' }
    ],
    inclusive: [
      { name: 'Género', type: 'actor' },
      { name: 'Discapacidad', type: 'actor' },
      { name: 'Infancia', type: 'actor' },
      { name: 'Espacios Inclusivos', type: 'structure' }
    ],
    economic: [
      { name: 'Economía Verde', type: 'structure' },
      { name: 'Empleo Formal', type: 'process' },
      { name: 'Innovación', type: 'process' },
      { name: 'Productividad', type: 'process' }
    ],
    integrated: [
      { name: 'Ecología', type: 'structure' },
      { name: 'Funcional', type: 'structure' },
      { name: 'Económica', type: 'structure' },
      { name: 'Patrimonio', type: 'structure' },
      { name: 'Género', type: 'actor' },
      { name: 'Discapacidad', type: 'actor' }
    ]
  };
  
  const templateData = templates[template] || [];
  
  templateData.forEach((item, idx) => {
    modelElements.push({
      id: 'elem_' + idx,
      type: item.type,
      name: item.name,
      x: 100 + (idx * 120),
      y: 100 + (idx % 2) * 200,
      color: getColorByType(item.type),
      kpi: ''
    });
  });
  
  renderCanvas();
  updateStats();
  alert('Plantilla cargada: ' + template);
}

// EXPORT MODEL
function exportModel(format) {
  if (format === 'json') {
    const data = {
      elements: modelElements,
      connections: modelConnections,
      timestamp: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'modelo-propio.json', 'application/json');
  } else if (format === 'pdf') {
    alert('Exportando a PDF... (funcionalidad de pago)');
  }
}

function downloadFile(content, filename, mimeType) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// SAVE MODEL
function saveModel() {
  const modelName = prompt('¿Cómo se llama tu modelo?', 'Mi Bogotá');
  if (modelName) {
    localStorage.setItem('modelo_' + Date.now(), JSON.stringify({
      name: modelName,
      elements: modelElements,
      connections: modelConnections
    }));
    alert('Modelo guardado: ' + modelName);
  }
}

// COMPARE WITH POT
function compareWithPOT() {
  alert('Comparando tu modelo con el POT original...');
  console.log('Elementos en tu modelo:', modelElements.length);
  console.log('Conexiones:', modelConnections.length);
}

// PUBLISH MODEL
function publishModel() {
  if (modelElements.length === 0) {
    alert('Tu modelo está vacío. Añade elementos primero.');
    return;
  }
  
  const shareLink = 'https://rapot.bogota.gov.co/share/' + Math.random().toString(36).substr(2, 9);
  document.getElementById('shareLink').value = shareLink;
  alert('Modelo publicado en: ' + shareLink);
}

// COPY LINK
function copyLink() {
  const link = document.getElementById('shareLink').value;
  if (link) {
    navigator.clipboard.writeText(link);
    alert('Enlace copiado al portapapeles');
  }
}

// INVITE COLLABORATOR
function inviteCollaborator() {
  const email = prompt('Correo del colaborador:');
  if (email) {
    alert('Invitación enviada a: ' + email);
  }
}

// RESET BUILDER
function resetBuilder() {
  if (confirm('¿Estás seguro de que quieres limpiar el canvas?')) {
    modelElements = [];
    modelConnections = [];
    selectedElement = null;
    renderCanvas();
    updateStats();
    alert('Canvas limpiado');
  }
}

// EXPORT DATA
window.MODELO_PROPIO = {
  elements: modelElements,
  connections: modelConnections
};

console.log('Constructor de modelo listo:', window.MODELO_PROPIO);
