// Módulo 03: Discurso vs Realidad
console.log('Módulo 03: Discurso vs Realidad - Inicializado');

// DATOS DE ANÁLISIS
const analysisData = {
  todos: [
    { elemento: 'Movilidad', discurso: 95, realidad: 42, gap: 53, tipo: 'contradiccion' },
    { elemento: 'Espacios Públicos', discurso: 88, realidad: 35, gap: 53, tipo: 'contradiccion' },
    { elemento: 'Ríos', discurso: 92, realidad: 89, gap: 3, tipo: 'alineacion' },
    { elemento: 'Vivienda', discurso: 84, realidad: 82, gap: 2, tipo: 'alineacion' },
    { elemento: 'Equipamientos', discurso: 78, realidad: 77, gap: 1, tipo: 'alineacion' },
    { elemento: 'Economía Circular', discurso: 85, realidad: 38, gap: 47, tipo: 'contradiccion' },
    { elemento: 'Patrimonio', discurso: 72, realidad: 28, gap: 44, tipo: 'contradiccion' },
    { elemento: 'Agricultura', discurso: 68, realidad: 32, gap: 36, tipo: 'brecha' }
  ],
  contradicciones: [
    { elemento: 'Movilidad', discurso: 95, realidad: 42, gap: 53, tipo: 'contradiccion', severidad: 'crítica' },
    { elemento: 'Espacios Públicos', discurso: 88, realidad: 35, gap: 53, tipo: 'contradiccion', severidad: 'crítica' },
    { elemento: 'Economía Circular', discurso: 85, realidad: 38, gap: 47, tipo: 'contradiccion', severidad: 'alta' },
    { elemento: 'Patrimonio', discurso: 72, realidad: 28, gap: 44, tipo: 'contradiccion', severidad: 'alta' }
  ],
  alineaciones: [
    { elemento: 'Ríos', discurso: 92, realidad: 89, gap: 3, tipo: 'alineacion' },
    { elemento: 'Vivienda', discurso: 84, realidad: 82, gap: 2, tipo: 'alineacion' },
    { elemento: 'Equipamientos', discurso: 78, realidad: 77, gap: 1, tipo: 'alineacion' }
  ],
  brechas: [
    { elemento: 'Agricultura', discurso: 68, realidad: 32, gap: 36, tipo: 'brecha' }
  ]
};

let chartInstance = null;
let currentFilter = 'all';

// INIT
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado');
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      initChart();
      updateElementsList('all');
    } else {
      console.error('Chart.js no está disponible');
    }
  }, 300);
});

// INIT CHART
function initChart() {
  const ctx = document.getElementById('comparisonChart');
  if (!ctx) {
    console.error('Canvas #comparisonChart no encontrado');
    return;
  }

  const data = analysisData.todos;
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.elemento),
      datasets: [
        {
          label: 'Importancia Discursiva',
          data: data.map(d => d.discurso),
          backgroundColor: 'rgba(47, 212, 200, 0.3)',
          borderColor: '#2fd4c8',
          borderWidth: 2,
          borderRadius: 4
        },
        {
          label: 'Importancia Estructural',
          data: data.map(d => d.realidad),
          backgroundColor: 'rgba(91, 141, 239, 0.3)',
          borderColor: '#5b8def',
          borderWidth: 2,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#e7eaf2',
            font: { size: 12, weight: '600' },
            padding: 16,
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: '#8891a5',
            font: { size: 11 }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.07)'
          }
        },
        x: {
          ticks: {
            color: '#8891a5',
            font: { size: 11 }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
  
  console.log('✅ Chart inicializado');
}

// UPDATE CHART
function updateChart(metric) {
  if (!chartInstance) return;
  
  const data = analysisData[currentFilter] || analysisData.todos;
  
  switch(metric) {
    case 'discurso':
      chartInstance.data.datasets[0].borderColor = '#2fd4c8';
      chartInstance.data.datasets[0].borderWidth = 3;
      chartInstance.data.datasets[1].borderColor = 'rgba(91, 141, 239, 0.4)';
      chartInstance.data.datasets[1].borderWidth = 1;
      break;
    case 'realidad':
      chartInstance.data.datasets[0].borderColor = 'rgba(47, 212, 200, 0.4)';
      chartInstance.data.datasets[0].borderWidth = 1;
      chartInstance.data.datasets[1].borderColor = '#5b8def';
      chartInstance.data.datasets[1].borderWidth = 3;
      break;
    case 'brecha':
      const brechas = data.map(d => d.gap);
      chartInstance.data.datasets[0].data = brechas;
      chartInstance.data.datasets[0].label = 'Brecha (Discurso - Real)';
      chartInstance.data.datasets[0].backgroundColor = brechas.map(b => b > 30 ? 'rgba(247, 111, 176, 0.3)' : 'rgba(74, 222, 128, 0.3)');
      chartInstance.data.datasets[1].data = Array(brechas.length).fill(0);
      chartInstance.data.datasets[1].label = '';
      break;
    default:
      chartInstance.data.datasets[0].borderColor = '#2fd4c8';
      chartInstance.data.datasets[0].borderWidth = 2;
      chartInstance.data.datasets[1].borderColor = '#5b8def';
      chartInstance.data.datasets[1].borderWidth = 2;
  }
  
  chartInstance.update();
}

// FILTER ANALYSIS
function filterAnalysis(type) {
  currentFilter = type;
  
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Encontrar y activar el botón correcto
  const activeBtn = document.querySelector(`[data-filter="${type}"]`) || 
                    document.querySelector('.tab-btn');
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  console.log('✅ Filtrando por:', type);
  updateElementsList(type);
  updateChart('all');
}

// UPDATE ELEMENTS LIST
function updateElementsList(type) {
  const container = document.getElementById('elementsList');
  if (!container) {
    console.error('Contenedor #elementsList no encontrado');
    return;
  }
  
  let data = analysisData[type] || analysisData.todos;
  
  container.innerHTML = data.map(item => `
    <div class="element-item ${item.tipo}">
      <div class="element-header">
        <div class="element-name">${item.elemento}</div>
        <div class="element-gap">${item.gap}%</div>
      </div>
      <div class="element-bars">
        <div class="bar-group">
          <div class="bar-label">Discurso</div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${item.discurso}%; background: #2fd4c8;"></div>
          </div>
          <div class="bar-value">${item.discurso}%</div>
        </div>
        <div class="bar-group">
          <div class="bar-label">Realidad</div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${item.realidad}%; background: #5b8def;"></div>
          </div>
          <div class="bar-value">${item.realidad}%</div>
        </div>
      </div>
      <div class="element-badge ${item.tipo}">
        ${getBadgeLabel(item.tipo)}
      </div>
    </div>
  `).join('');
  
  console.log(`📊 Mostrando ${data.length} elementos`);
}

// GET BADGE LABEL
function getBadgeLabel(tipo) {
  const labels = {
    'contradiccion': '⚠️ Contradicción',
    'alineacion': '✓ Alineado',
    'brecha': '⊢ Brecha'
  };
  return labels[tipo] || tipo;
}

// ACTIONS
function downloadReport() {
  let report = 'ANÁLISIS DISCURSO VS REALIDAD\n';
  report += '============================\n\n';
  
  const data = analysisData[currentFilter] || analysisData.todos;
  report += `Filtro: ${currentFilter}\n`;
  report += `Elementos analizados: ${data.length}\n\n`;
  
  data.forEach(item => {
    report += `${item.elemento}\n`;
    report += `  Discurso: ${item.discurso}%\n`;
    report += `  Realidad: ${item.realidad}%\n`;
    report += `  Brecha: ${item.gap}%\n`;
    report += `  Tipo: ${item.tipo}\n\n`;
  });
  
  downloadFile(report, 'analisis-discurso-realidad.txt');
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

function generateRecommendations() {
  alert('Generando recomendaciones basadas en el análisis...');
  console.log('Creando plan de acción');
}

function shareFindings() {
  alert('Generando enlace para compartir hallazgos...');
  console.log('Creando enlace compartible');
}

console.log('✅ Módulo 03 completamente cargado');
