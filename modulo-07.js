// MODULO 07: SIMULADOR
console.log('Módulo 07: Simulador - Inicializado');

// Cada botón de escenario "apaga" (quita) una de las 4 estructuras del
// modelo POT. Al volver a tocarlo, la estructura se reactiva.
const scenarios = {
  sin_eep:   { label: 'Escenario sin Estructura Ecológica Principal', struct: 'eco' },
  sin_efc:   { label: 'Escenario sin Estructura Funcional y del Cuidado', struct: 'func' },
  sin_eseci: { label: 'Escenario sin Estructura Socioeconómica, Creativa y de Innovación', struct: 'econ' },
  sin_eip:   { label: 'Escenario sin Estructura Integradora de Patrimonios', struct: 'patri' }
};

// LOAD SCENARIO
// Alterna el estado on/off de la estructura asociada al botón:
// apaga (atenúa) todos los nodos y enlaces de esa estructura en el
// diagrama, y actualiza el botón para reflejar el estado.
function loadScenario(scenarioKey, buttonEl) {
  const scenario = scenarios[scenarioKey];
  if (!scenario) return;

  const struct = scenario.struct;
  const isOff = buttonEl.classList.toggle('active');

  // Icono del botón: circle-minus (encendido) <-> power-off (apagado)
  const icon = buttonEl.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-circle-minus', !isOff);
    icon.classList.toggle('fa-power-off', isOff);
  }

  // Nodos de esa estructura
  document.querySelectorAll('.node.n-' + struct).forEach(node => {
    node.classList.toggle('node-off', isOff);
  });

  // Enlaces donde participa esa estructura (directos o cruzados)
  document.querySelectorAll('.links line.l-' + struct).forEach(link => {
    link.classList.toggle('link-off', isOff);
  });

  console.log((isOff ? 'Apagando' : 'Reactivando') + ' estructura:', scenario.label);
}
