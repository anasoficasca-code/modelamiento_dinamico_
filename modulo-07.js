// MODULO 07: SIMULADOR
console.log('Módulo 07: Simulador - Inicializado');

// SIMULATION STATE
let currentScenario = 'baseline';
let simulationState = {
  density: 0.41,
  connectivity: 156,
  resilience: 0.68,
  ods: 0.71,
  inclusion: 0.52,
  interventions: []
};

const scenarioData = {
  baseline: {
    density: 0.41,
    connectivity: 156,
    resilience: 0.68,
    ods: 0.71,
    inclusion: 0.52,
    bio: 0,
    cycles: 0,
    climate: 0,
    social: 0,
    access: 0,
    gender: 0,
    employment: 0,
    green: 0,
    prod: 0,
    ods_align: '12/17',
    conflict: 0,
    coverage: 0.71
  },
  inclusive: {
    density: 0.48,
    connectivity: 172,
    resilience: 0.78,
    ods: 0.82,
    inclusion: 0.80,
    social: 28,
    access: 35,
    gender: 42,
    ods_align: '14/17',
    conflict: -35,
    coverage: 0.85
  },
  green: {
    density: 0.52,
    connectivity: 181,
    resilience: 0.85,
    ods: 0.88,
    inclusion: 0.65,
    bio: 25,
    cycles: 18,
    climate: 22,
    ods_align: '15/17',
    conflict: -40,
    coverage: 0.88
  },
  economic: {
    density: 0.45,
    connectivity: 168,
    resilience: 0.72,
    ods: 0.79,
    inclusion: 0.68,
    employment: 15,
    green: 32,
    prod: 12,
    ods_align: '13/17',
    conflict: -25,
    coverage: 0.82
  },
  integrated: {
    density: 0.58,
    connectivity: 195,
    resilience: 0.92,
    ods: 0.95,
    inclusion: 0.88,
    bio: 25,
    cycles: 18,
    climate: 22,
    social: 28,
    access: 35,
    gender: 42,
    employment: 15,
    green: 32,
    prod: 12,
    ods_align: '17/17',
    conflict: -55,
    coverage: 0.95
  }
};

const networkData = {
  nodes: [
    { id: 'EEP', label: 'Ecología', category: 'estructura' },
    { id: 'EFC', label: 'Funcional', category: 'estructura' },
    { id: 'ESECI', label: 'Económica', category: 'estructura' },
    { id: 'EIP', label: 'Patrimonio', category: 'estructura' },
    { id: 'Infancia', label: 'Infancia', category: 'interv' },
    { id: 'Discap', label: 'Discapacidad', category: 'interv' },
    { id: 'Formal', label: 'Formalización', category: 'interv' },
    { id: 'Biodiv', label: 'Biodiversidad', category: 'interv' },
    { id: 'Patrimo', label: 'Patrimonio', category: 'interv' }
  ],
  links: [
    { source: 'EFC', target: 'Infancia', strength: 'strong' },
    { source: 'EFC', target: 'Discap', strength: 'strong' },
    { source: 'EEP', target: 'Biodiv', strength: 'strong' },
    { source: 'ESECI', target: 'Formal', strength: 'strong' },
    { source: 'EIP', target: 'Patrimo', strength: 'strong' },
    { source: 'Infancia', target: 'Discap', strength: 'medium' },
    { source: 'Biodiv', target: 'Infancia', strength: 'medium' },
    { source: 'Formal', target: 'Infancia', strength: 'medium' }
  ]
};

// INIT
document.addEventListener('DOMContentLoaded', function() {
  drawImpactNetwork();
});

// LOAD SCENARIO
function loadScenario(scenario) {
  currentScenario = scenario;
  console.log('Cargando escenario:', scenario);
  
  const data = scenarioData[scenario];
  updateIndicators(data);
}

// UPDATE SIMULATION
function updateSimulation() {
  const year = document.getElementById('yearSlider').value;
  const investment = document.getElementById('investmentSlider').value;
  const capacity = document.getElementById('capacitySlider').value;
  
  document.getElementById('yearDisplay').textContent = year;
  document.getElementById('investmentDisplay').textContent = investment + '%';
  document.getElementById('capacityDisplay').textContent = capacity + '%';
  
  console.log('Parámetros actualizados:', { year, investment, capacity });
}

// RUN SIMULATION
function runSimulation() {
  console.log('Ejecutando simulación para escenario:', currentScenario);
  const data = scenarioData[currentScenario];
  updateIndicators(data);
  alert('Simulación ejecutada para: ' + currentScenario);
}

// UPDATE INDICATORS
function updateIndicators(data) {
  document.getElementById('densityValue').textContent = data.density.toFixed(2);
  document.getElementById('connectivityValue').textContent = data.connectivity;
  document.getElementById('resilienceValue').textContent = Math.round(data.resilience * 100) + '%';
  document.getElementById('odsValue').textContent = Math.round(data.ods * 100) + '%';
  document.getElementById('inclusionValue').textContent = Math.round(data.inclusion * 100) + '%';
  
  // Cambios
  document.getElementById('densityChange').textContent = '+' + Math.round((data.density - 0.41) * 100) + '%';
  document.getElementById('connectivityChange').textContent = '+' + (data.connectivity - 156) + ' conexiones';
  document.getElementById('resilienceChange').textContent = '+' + Math.round((data.resilience - 0.68) * 100) + '%';
  document.getElementById('odsChange').textContent = '+' + Math.round((data.ods - 0.71) * 100) + '%';
  document.getElementById('inclusionChange').textContent = '+' + Math.round((data.inclusion - 0.52) * 100) + '%';
  
  // Impactos detallados
  if (data.bio) document.getElementById('bioValue').textContent = '+' + data.bio + '%';
  if (data.cycles) document.getElementById('cyclesValue').textContent = '+' + data.cycles + '%';
  if (data.climate) document.getElementById('climateValue').textContent = '+' + data.climate + '%';
  if (data.social) document.getElementById('socialValue').textContent = '+' + data.social + '%';
  if (data.access) document.getElementById('accessValue').textContent = '+' + data.access + '%';
  if (data.gender) document.getElementById('genderValue').textContent = '+' + data.gender + '%';
  if (data.employment) document.getElementById('employmentValue').textContent = '+' + data.employment + '%';
  if (data.green) document.getElementById('greenValue').textContent = '+' + data.green + '%';
  if (data.prod) document.getElementById('prodValue').textContent = '+' + data.prod + '%';
  
  document.getElementById('odsAlignValue').textContent = data.ods_align;
  document.getElementById('conflictValue').textContent = data.conflict > 0 ? '+' + data.conflict + '%' : data.conflict + '%';
  document.getElementById('coverageValue').textContent = Math.round(data.coverage * 100) + '%';
}

// RESET SIMULATION
function resetSimulation() {
  currentScenario = 'baseline';
  document.getElementById('yearSlider').value = 2030;
  document.getElementById('investmentSlider').value = 50;
  document.getElementById('capacitySlider').value = 60;
  
  updateSimulation();
  updateIndicators(scenarioData.baseline);
  
  document.querySelectorAll('.intervention-item input').forEach(cb => cb.checked = false);
  console.log('Simulación reiniciada');
}

// SET SPEED
function setSpeed(speed) {
  document.querySelectorAll('.speed-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  console.log('Velocidad de simulación:', speed);
}

// DRAW IMPACT NETWORK
function drawImpactNetwork() {
  const svg = d3.select('#impactNetwork');
  const width = svg.node().parentElement.offsetWidth;
  const height = 400;
  
  svg.attr('width', width).attr('height', height);
  svg.selectAll('*').remove();
  
  const nodes = networkData.nodes;
  const links = networkData.links.map(link => ({
    source: nodes.find(n => n.id === link.source),
    target: nodes.find(n => n.id === link.target),
    strength: link.strength
  })).filter(l => l.source && l.target);
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2));
  
  // LINKS
  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', d => {
      if (d.strength === 'strong') return 'rgba(47,212,200,0.6)';
      return 'rgba(91,141,239,0.4)';
    })
    .attr('stroke-width', d => d.strength === 'strong' ? 2.5 : 1.5);
  
  // NODES
  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', d => d.category === 'estructura' ? 14 : 12)
    .attr('fill', d => {
      if (d.category === 'estructura') return 'rgba(47,212,200,0.8)';
      return 'rgba(74,222,128,0.8)';
    })
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5);
  
  // LABELS
  const labels = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .text(d => d.label.substring(0, 8))
    .attr('font-size', '9px')
    .attr('fill', '#e7eaf2')
    .attr('text-anchor', 'middle')
    .attr('pointer-events', 'none');
  
  simulation.on('tick', () => {
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
      .attr('y', d => d.y + 3);
  });
}

// EXPORT SCENARIO
function exportScenario() {
  const data = scenarioData[currentScenario];
  let report = 'SIMULACIÓN POT - ESCENARIO: ' + currentScenario.toUpperCase() + '\n';
  report += '='.repeat(50) + '\n\n';
  
  report += 'INDICADORES CLAVE:\n';
  report += 'Densidad: ' + data.density.toFixed(2) + '\n';
  report += 'Conectividad: ' + data.connectivity + ' enlaces\n';
  report += 'Resiliencia: ' + Math.round(data.resilience * 100) + '%\n';
  report += 'Alineación ODS: ' + Math.round(data.ods * 100) + '%\n';
  report += 'Inclusión: ' + Math.round(data.inclusion * 100) + '%\n\n';
  
  report += 'IMPACTOS ESPECÍFICOS:\n';
  if (data.bio) report += '- Biodiversidad: +' + data.bio + '%\n';
  if (data.social) report += '- Inclusión social: +' + data.social + '%\n';
  if (data.employment) report += '- Empleo formal: +' + data.employment + '%\n';
  if (data.gender) report += '- Igualdad de género: +' + data.gender + '%\n';
  
  downloadFile(report, 'simulacion-' + currentScenario + '.txt');
}

function downloadFile(content, filename) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// COMPARE SCENARIOS
function compareScenarios() {
  alert('Abriendo comparador de escenarios...');
  console.log('Comparando todos los escenarios');
}

// SAVE SCENARIO
function saveScenario() {
  alert('Guardando escenario: ' + currentScenario);
  console.log('Escenario guardado');
}

// EXPORT DATA
window.SIMULADOR = {
  scenarios: scenarioData,
  currentScenario: currentScenario
};

console.log('Simulador listo:', window.SIMULADOR);
