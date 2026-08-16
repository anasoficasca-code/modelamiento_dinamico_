/* ==========================================================
   RAPOT · MÓDULO — LA RED IMPLÍCITA DEL POT (Bogotá Reverdece 2022-2035)
   Reconstruido a partir de verificación directa contra el Decreto 555 de 2021.

   TRANSPARENCIA METODOLÓGICA (léase esto primero — responde a la exigencia
   del profesor de explicar de qué fuentes y con qué proceso se llega a
   cada conclusión):

   El acceso remoto al PDF oficial (633 páginas) tiene un tope técnico que
   impidió extraer el cuerpo textual completo de los artículos 41 en
   adelante (donde vive el detalle de cada estructura). Por eso, CADA nodo
   y CADA relación de esta red trae una etiqueta `fuente` con 4 niveles de
   confianza, visible en el panel de información:

     - "cita_literal"       → texto exacto verificado entre comillas + página real.
     - "indice_oficial"     → título exacto del artículo/sección confirmado en el
                              índice oficial del decreto; el cuerpo del artículo
                              no se pudo verificar palabra por palabra.
     - "fuente_secundaria"  → viene del "ABC del POT" (resumen oficial de la SDP),
                              prensa oficial o datos abiertos — NO es cita directa
                              del decreto.
     - "inferencia"         → razonamiento propio del equipo (agrupación temática,
                              relación hipotética, o señalamiento de una AUSENCIA
                              de articulación) — marcado explícitamente como tal,
                              nunca presentado como si fuera texto del POT.

   No se inventan citas. Donde no hay verificación, se dice explícitamente.
   ========================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

/* -------- Estructuras: metadatos verificados contra el índice oficial -------- */
const STRUCT_STYLE = {
  e1: {
    color: "#4ade80", label: "1. Estructura Ecológica Principal", short: "EEP",
    articulos: "Art. 41–79 (39 artículos)", paginas: "pp. 70–101",
    fuente: "indice_oficial",
    nota: "Definición general Art. 41 (p.70). Es la estructura con MÁS artículos dedicados dentro del capítulo de Estructuras Territoriales — internamente muy densa, pero (ver hallazgos) casi sin puentes confirmados hacia las otras 3."
  },
  e2: {
    color: "#5b8def", label: "2. Estructura Funcional y del Cuidado", short: "EFC",
    articulos: "Art. 88–99 (12 artículos)", paginas: "pp. 109–120",
    fuente: "indice_oficial",
    nota: "Definición general Art. 88 (p.109). Organizada en 4 sistemas oficiales (Espacio Público Peatonal, Movilidad, Cuidado y Servicios Sociales, Servicios Públicos)."
  },
  e3: {
    color: "#ef9552", label: "3. Estructura Socioeconómica, Creativa y de Innovación", short: "ESECI",
    articulos: "Art. 100–101 en su capítulo propio (2 artículos)", paginas: "pp. 120–122",
    fuente: "indice_oficial",
    nota: "HALLAZGO: es la única de las 4 estructuras que NO tiene su propio capítulo de componentes/reservas/sistemas — su contenido real se desarrolla después, disperso, como 'Áreas de Actividad' en el Libro III (Art. 240 p.223, Art. 243 p.224, Art. 327 p.279). El modelo no le da una lógica sistémica propia: la trata como efecto de zonificación, no como estructura con componentes protegidos."
  },
  e4: {
    color: "#a276f2", label: "4. Estructura Integradora de Patrimonios", short: "EIP",
    articulos: "Art. 80–87 (8 artículos)", paginas: "pp. 101–109",
    fuente: "indice_oficial",
    nota: "Definición general Art. 80 (p.101)."
  },
};

/* -------- Niveles de confianza de fuente: color + etiqueta -------- */
const FUENTE_STYLE = {
  cita_literal:      { color: "#2fd4c8", label: "Cita literal verificada",         icon: "fa-quote-right" },
  indice_oficial:     { color: "#5b8def", label: "Índice oficial (título confirmado)", icon: "fa-list-check" },
  fuente_secundaria:  { color: "#f5c945", label: "Fuente secundaria (ABC POT / prensa oficial / datos abiertos)", icon: "fa-newspaper" },
  inferencia:         { color: "#ef9552", label: "Inferencia razonada del equipo",  icon: "fa-lightbulb" },
};

/* ==========================================================
   NODOS — organizados por estructura. Cada nodo trae:
   articulo, pagina, fuente (nivel de confianza), cita (si existe),
   cartografia (url si aplica), nota (explicación breve)
   ========================================================== */
const ODS_NODES = [

  /* ============ 1. ESTRUCTURA ECOLÓGICA PRINCIPAL (verde) ============ */
  { id:"cerros", cat:"e1", name:"CERROS\nORIENTALES", icon:"fa-mountain-sun",
    articulo:"Art. 7", pagina:"33", fuente:"cita_literal",
    cita:"“Consolidación de los paisajes bogotanos a través de las áreas protegidas, la Reserva Thomas Van Der Hammen, los complejos de páramos, los corredores montañosos, las reservas forestales y los ríos y humedales que comparte con su entorno regional.”",
    nota:"Nombrado como elemento regional (no tiene artículo propio verificado dentro de la EEP; su régimen real depende en parte de la CAR, no solo del POT).",
    cartografia:"https://www.sdp.gov.co/micrositios/cerros-orientales/que-es" },

  { id:"sinap_pub", cat:"e1", name:"ÁREAS PROTEGIDAS\nPÚBLICAS SINAP", icon:"fa-lock",
    articulo:"Art. 45", pagina:"77-78", fuente:"indice_oficial",
    cita:null, nota:"Subsección 1: 'Componente Áreas Protegidas del Sistema Nacional de Áreas Protegidas -SINAP-'.",
    cartografia:"https://datosabiertos.bogota.gov.co/dataset/estructura-ecologica-principal-bogota-d-c" },

  { id:"sinap_priv", cat:"e1", name:"ÁREAS PROTEGIDAS\nPRIVADAS SINAP", icon:"fa-lock-open",
    articulo:"Art. 46", pagina:"78", fuente:"indice_oficial", cita:null,
    nota:"Distinta de las públicas — el decreto las regula por separado." },

  { id:"reserva_cuenca", cat:"e1", name:"RESERVA CUENCA\nALTA RÍO BOGOTÁ", icon:"fa-water",
    articulo:"Art. 49", pagina:"79", fuente:"indice_oficial", cita:null,
    nota:"'Reserva Forestal Protectora Productora de la Cuenca Alta del Río Bogotá'." },

  { id:"van_der_hammen", cat:"e1", name:"RESERVA THOMAS\nVAN DER HAMMEN", icon:"fa-tree",
    articulo:"Art. 50 / Art. 7", pagina:"79-80 / 33", fuente:"cita_literal",
    cita:"“…la Reserva Thomas Van Der Hammen…” (Art. 7, p.33). Título oficial de su artículo propio: 'Reserva Forestal Regional Productora del Norte de Bogotá D.C., “Thomas van der Hammen”' (Art. 50).",
    nota:"EJEMPLO CLAVE del hallazgo 'general vs. particular': es de los pocos elementos ecológicos nombrado por su nombre propio en el articulado, mientras otros (humedales, coberturas) se tratan solo como categoría genérica.",
    cartografia:"https://www.ideca.gov.co/node/2815" },

  { id:"sist_distrital_ap", cat:"e1", name:"SISTEMA DISTRITAL\nÁREAS PROTEGIDAS", icon:"fa-shield-halved",
    articulo:"Art. 51", pagina:"80", fuente:"indice_oficial", cita:null, nota:null },

  { id:"paisajes", cat:"e1", name:"PAISAJES\nSOSTENIBLES", icon:"fa-sun",
    articulo:"Art. 52-53", pagina:"81-82", fuente:"indice_oficial", cita:null, nota:null },

  { id:"parques_m", cat:"e1", name:"PARQUES ECOLÓGICOS\nDE MONTAÑA", icon:"fa-campground",
    articulo:"Art. 54", pagina:"82-83", fuente:"indice_oficial", cita:null, nota:null },

  { id:"humedales", cat:"e1", name:"RESERVAS\nDISTRITALES DE\nHUMEDAL (17)", icon:"fa-droplet",
    articulo:"Art. 55-57", pagina:"83-85", fuente:"indice_oficial",
    cita:"Única mención textual de humedales verificada en todo el rango accesible del decreto: “…los ríos y humedales que comparte con su entorno regional” (Art. 7, p.33) — GENÉRICA, sin nombrar ninguno.",
    nota:"HALLAZGO CENTRAL: Bogotá tiene 17 humedales oficiales (el propio POT subió de 15 a 17, sumando Tingua Azul e Hyntiba-El Escritorio, y los eleva de 'parque ecológico' a 'reserva distrital', mayor protección). No pudimos verificar si el cuerpo de los Art.55-57 los nombra uno por uno o delega esa identificación a los planos/anexos — es la pregunta abierta más importante para completar con el PDF completo. Lo que SÍ es seguro: en el único fragmento verificado del articulado, jamás se nombra un humedal específico.",
    cartografia:"https://visorgeo.ambientebogota.gov.co/" },

  { id:"paramos", cat:"e1", name:"COMPLEJO DE PÁRAMOS\nCRUZ VERDE-SUMAPAZ", icon:"fa-mountain",
    articulo:"Art. 59", pagina:"85-86", fuente:"indice_oficial", cita:null,
    nota:"También nombrado genéricamente como 'complejos de páramos' en Art. 7 (cita literal)." },

  { id:"sist_hidrico", cat:"e1", name:"SISTEMA\nHÍDRICO", icon:"fa-water",
    articulo:"Art. 60", pagina:"86-87", fuente:"indice_oficial", cita:null, nota:null },

  { id:"cuerpos_hidricos", cat:"e1", name:"CUERPOS HÍDRICOS\n(RÍOS·QUEBRADAS)", icon:"fa-water",
    articulo:"Art. 62-65", pagina:"87-90", fuente:"indice_oficial", cita:null,
    nota:"Incluye 'Cuerpos Hídricos Naturales' (Art.62), 'Artificiales' (Art.63-64) y criterios de rondas hídricas (Art.65)." },

  { id:"parque_b", cat:"e1", name:"PARQUES\nDE BORDE", icon:"fa-archway",
    articulo:"Art. 68-70", pagina:"92-96", fuente:"indice_oficial", cita:null, nota:null },

  { id:"resiliencia", cat:"e1", name:"ÁREAS DE\nRESILIENCIA\nCLIMÁTICA", icon:"fa-shield-heart",
    articulo:"Art. 71", pagina:"96-97", fuente:"indice_oficial", cita:null, nota:null },

  /* ============ 2. ESTRUCTURA FUNCIONAL Y DEL CUIDADO (azul) ============ */
  { id:"esp_publico", cat:"e2", name:"SISTEMA ESPACIO\nPÚBLICO PEATONAL", icon:"fa-tree-city",
    articulo:"Art. 89-91", pagina:"110-112", fuente:"indice_oficial",
    nota:"Nombre oficial: 'Sistema de Espacio Público Peatonal Para el Encuentro'. Art.90 = 'Componentes del Sistema Distrital de Espacio Público Peatonal para el Encuentro'." },

  { id:"parques", cat:"e2", name:"PARQUES", icon:"fa-tree",
    articulo:"Art. 89-91 (agrupado)", pagina:"110-112", fuente:"inferencia",
    nota:"Sub-componente agrupado por lógica temática bajo el Sistema de Espacio Público — no verificado como artículo individual propio." },

  { id:"corredores", cat:"e2", name:"CORREDORES /\nEJES VERDES", icon:"fa-route",
    articulo:"Art. 89-91 (agrupado)", pagina:"110-112", fuente:"inferencia", nota:"Igual que Parques: agrupación inferida, no artículo propio verificado." },

  { id:"movilidad", cat:"e2", name:"SISTEMA DE\nMOVILIDAD", icon:"fa-road",
    articulo:"Art. 92-93", pagina:"112-113", fuente:"indice_oficial", nota:null },

  { id:"transporte", cat:"e2", name:"TRANSPORTE\nPÚBLICO", icon:"fa-bus",
    articulo:"Art. 92-93 (agrupado)", pagina:"112-113", fuente:"inferencia", nota:"Sub-componente agrupado bajo Sistema de Movilidad." },

  { id:"ciclorutas", cat:"e2", name:"CICLORRUTAS", icon:"fa-person-biking",
    articulo:"Art. 92-93 (agrupado)", pagina:"112-113", fuente:"inferencia", nota:"Sub-componente agrupado bajo Sistema de Movilidad." },

  { id:"cuidado", cat:"e2", name:"SISTEMA DEL CUIDADO\nY SERV. SOCIALES", icon:"fa-people-roof",
    articulo:"Art. 94-97", pagina:"113-118", fuente:"indice_oficial",
    nota:"Incluye 'Equipamientos de urgencia' (Art.96)." },

  { id:"manzanas", cat:"e2", name:"MANZANAS\nDEL CUIDADO", icon:"fa-hand-holding-heart",
    articulo:"Art. 94-97 (agrupado)", pagina:"113-118", fuente:"fuente_secundaria",
    nota:"Programa insignia ampliamente confirmado en comunicados oficiales de la Alcaldía; no verificamos su número de artículo exacto dentro del rango 94-97." },

  { id:"equip", cat:"e2", name:"EQUIPAMIENTOS", icon:"fa-school",
    articulo:"Art. 96", pagina:"~116", fuente:"indice_oficial", nota:"'Equipamientos de urgencia' confirmado en el índice; el resto de tipologías de equipamiento, agrupado por inferencia." },

  { id:"serv_publicos", cat:"e2", name:"SISTEMA DE\nSERVICIOS PÚBLICOS", icon:"fa-bolt",
    articulo:"Art. 98-99", pagina:"118-120", fuente:"indice_oficial", nota:null },

  { id:"vivienda", cat:"e2", name:"VIVIENDA\n(sin estructura propia)", icon:"fa-house-circle-exclamation",
    articulo:"— no confirmado dentro de EFC", pagina:"—", fuente:"inferencia",
    nota:"HALLAZGO: no encontramos evidencia de que 'vivienda' tenga un componente propio dentro de la Estructura Funcional y del Cuidado — probablemente se trata en otro capítulo (revitalización, Libro III) como política transversal, no como 'componente' de una estructura territorial. Queda fuera de las 4 estructuras como tal, aunque es central a la vida urbana." },

  /* ============ 3. ESTRUCTURA SOCIOECONÓMICA, CREATIVA E INNOVACIÓN (naranja) ============ */
  { id:"eseci_base", cat:"e3", name:"ESECI\n(definición general)", icon:"fa-city",
    articulo:"Art. 100-101", pagina:"120-122", fuente:"indice_oficial",
    nota:"HALLAZGO: solo 2 artículos en el capítulo de Estructuras Territoriales — la más corta de las 4, por lejos (EEP tiene 39, EFC 12, EIP 8)." },

  { id:"areas_actividad", cat:"e3", name:"ÁREAS DE\nACTIVIDAD", icon:"fa-map-location-dot",
    articulo:"Art. 240 / 243", pagina:"223 / 224", fuente:"indice_oficial",
    nota:"Aquí es donde el POT realmente desarrolla la lógica socioeconómica — no como 'componentes' protegidos (como la EEP) sino como categorías de uso del suelo (zonificación). Título: 'Áreas de Actividad del suelo urbano y de expansión urbana' (Art.240) y 'Usos del suelo permitidos por área de actividad' (Art.243)." },

  { id:"grandes_serv", cat:"e3", name:"GRANDES SERVICIOS\nMETROPOLITANOS", icon:"fa-industry",
    articulo:"Art. 327 / Art. 8", pagina:"279 / 34", fuente:"indice_oficial", nota:"Mencionado también como elemento distrital del MOT (Art.8)." },

  { id:"financieros", cat:"e3", name:"CENTROS\nFINANCIEROS", icon:"fa-building-columns",
    articulo:"dentro de Áreas de Actividad", pagina:"—", fuente:"inferencia", nota:"No verificado como categoría con nombre propio; asumido como sub-tipo de Área de Actividad Estructurante." },

  { id:"tecnodistrito", cat:"e3", name:"DISTRITO\nTECNOLÓGICO", icon:"fa-microchip",
    articulo:"dentro de Áreas de Actividad", pagina:"—", fuente:"inferencia", nota:"No verificado directamente en el articulado." },

  { id:"plazas", cat:"e3", name:"PLAZAS\nDE MERCADO", icon:"fa-store",
    articulo:"dentro de Áreas de Actividad", pagina:"—", fuente:"inferencia", nota:"No verificado directamente en el articulado." },

  { id:"turismo", cat:"e3", name:"ZONAS DE\nINTERÉS TURÍSTICO", icon:"fa-map-location-dot",
    articulo:"dentro de Áreas de Actividad", pagina:"—", fuente:"inferencia", nota:"No verificado directamente en el articulado." },

  /* ============ 4. ESTRUCTURA INTEGRADORA DE PATRIMONIOS (morada) ============ */
  { id:"eip_base", cat:"e4", name:"EIP\n(definición general)", icon:"fa-landmark",
    articulo:"Art. 80", pagina:"101", fuente:"indice_oficial", nota:null },

  { id:"pemp_ch", cat:"e4", name:"PEMP · CENTRO\nHISTÓRICO", icon:"fa-place-of-worship",
    articulo:"Art. 83", pagina:"103-104", fuente:"indice_oficial", nota:"'Plan Especial de Manejo y Protección del Centro Histórico'." },

  { id:"arqueologico", cat:"e4", name:"PATRIMONIO\nARQUEOLÓGICO", icon:"fa-monument",
    articulo:"Art. 84", pagina:"104-105", fuente:"indice_oficial",
    nota:"'Medidas de protección para áreas con potencial arqueológico'. El ABC del POT usa como ejemplo el 'Parque Arqueológico El Carmen', sagrado para la comunidad Usmeka — otro caso de tratamiento nominal/particular, esta vez en patrimonio." },

  { id:"paisaje_patrim", cat:"e4", name:"PAISAJE URBANO\nY RURAL PATRIMONIAL", icon:"fa-mountain-city",
    articulo:"Art. 85", pagina:"105-106", fuente:"indice_oficial", nota:null },

  { id:"patrim_cult_nat", cat:"e4", name:"PATRIMONIO\nCULTURAL Y NATURAL", icon:"fa-leaf",
    articulo:"Art. 86", pagina:"106-108", fuente:"indice_oficial",
    nota:"El decreto trata 'cultural' y 'natural' en el MISMO artículo — no los separa como estructuras internas distintas." },

  { id:"sist_info_patrim", cat:"e4", name:"SISTEMA DE\nINFORMACIÓN PATRIMONIO", icon:"fa-database",
    articulo:"Art. 87", pagina:"108-109", fuente:"indice_oficial", nota:null },

  { id:"pinmaterial", cat:"e4", name:"PATRIMONIO\nINMATERIAL", icon:"fa-masks-theater",
    articulo:"dentro Art. 86", pagina:"106-108", fuente:"inferencia", nota:"No tiene artículo propio confirmado — se infiere como parte de 'patrimonio cultural' (Art.86)." },
];

ODS_NODES.forEach(n => { n.vx = 0; n.vy = 0; n.fixed = false; });

/* ==========================================================
   LAYOUT RADIAL AUTOMÁTICO — 4 hubs grandes (uno por estructura),
   con sus componentes en anillo alrededor. Así el tamaño y la posición
   de cada hub reflejan lo verificado (peso en artículos), no una
   composición manual arbitraria.
   ========================================================== */
const HUB_CENTERS = {
  e1: { x: 620,  y: 430 },
  e2: { x: 1780, y: 300 },
  e3: { x: 620,  y: 1000 },
  e4: { x: 1780, y: 950 },
};
const STRUCT_ARTICLE_WEIGHT = { e1: 39, e2: 12, e3: 2, e4: 8 }; // conteo real confirmado en el índice oficial

function layoutNetwork() {
  const byCat = { e1: [], e2: [], e3: [], e4: [] };
  ODS_NODES.forEach(n => byCat[n.cat].push(n));

  Object.keys(byCat).forEach(cat => {
    const list = byCat[cat];
    const center = HUB_CENTERS[cat];
    const ringRadius = 250 + Math.sqrt(STRUCT_ARTICLE_WEIGHT[cat]) * 22;
    list.forEach((n, i) => {
      const angle = (i / list.length) * Math.PI * 2 - Math.PI / 2;
      n.x = center.x + Math.cos(angle) * ringRadius;
      n.y = center.y + Math.sin(angle) * ringRadius;
      n.color = STRUCT_STYLE[cat].color;
      // radio visual: base + refuerzo si es cita_literal (más "sólido" documentalmente)
      n.r = 42 + (n.fuente === "cita_literal" ? 10 : n.fuente === "indice_oficial" ? 4 : 0);
      n.homeX = n.x; n.homeY = n.y;
    });
  });

  // Nodo-hub visible por estructura (representa el peso real en artículos)
  Object.keys(HUB_CENTERS).forEach(cat => {
    const c = HUB_CENTERS[cat];
    ODS_NODES.push({
      id: "hub_" + cat, cat, isHub: true,
      name: STRUCT_STYLE[cat].short, icon: "fa-diagram-project",
      articulo: STRUCT_STYLE[cat].articulos, pagina: STRUCT_STYLE[cat].paginas,
      fuente: STRUCT_STYLE[cat].fuente, cita: null, nota: STRUCT_STYLE[cat].nota,
      cartografia: null,
      x: c.x, y: c.y, homeX: c.x, homeY: c.y,
      color: STRUCT_STYLE[cat].color,
      r: 30 + Math.sqrt(STRUCT_ARTICLE_WEIGHT[cat]) * 9,
      vx: 0, vy: 0, fixed: false,
    });
  });
}
layoutNetwork();

function nodeById(id) { return ODS_NODES.find(n => n.id === id); }

/* ==========================================================
   ARISTAS
   - "estructural": dentro de la misma estructura, conectada a su hub.
     fuente: casi siempre "inferencia" (agrupación oficial del índice,
     no una frase relacional literal del decreto).
   - "puente": ENTRE estructuras, con evidencia real (textual o de índice)
     de que el decreto sí las relaciona.
   - "vacio": ENTRE estructuras, ausencia de articulación confirmada — el
     hallazgo central de la investigación (ver mensaje al usuario).
   ========================================================== */
const TYPE_STYLE = {
  estructural: { label: "Relación estructural (dentro de la estructura)" },
  puente:      { label: "Puente confirmado entre estructuras", color: "#2fd4c8" },
  vacio:       { label: "Vacío de articulación (hallazgo crítico)", color: "#ef4444" },
};

const RAW_EDGES = [];

// 1) cada componente conecta con el hub de su propia estructura (radial)
ODS_NODES.filter(n => !n.isHub).forEach(n => {
  RAW_EDGES.push({
    s: "hub_" + n.cat, t: n.id, type: "estructural", cat: n.cat,
    fuente: "indice_oficial",
    articulo: n.articulo, pagina: n.pagina,
    analisis: `'${n.name.replace(/\n/g," ")}' se agrupa bajo ${STRUCT_STYLE[n.cat].short} porque el índice oficial del decreto lo ubica en su capítulo (${n.articulo}, p.${n.pagina}). Esta es una relación de PERTENENCIA documental, no una frase relacional citada del texto.`,
    cita: n.cita || null,
  });
});

// 2) relaciones internas seleccionadas (inferencia razonada por lógica temática/hidrológica, NO citas literales de relación)
const INTRA = [
  ["cerros","cuerpos_hidricos","e1","Los cerros orientales son la principal fuente de escorrentía hacia los cuerpos hídricos de la sabana — relación hidrológica de sentido común, no una frase citada del decreto."],
  ["cuerpos_hidricos","humedales","e1","Los cuerpos hídricos alimentan los humedales aguas abajo — relación hidrológica estándar; el decreto NO articula esta relación explícitamente en el fragmento verificado."],
  ["paramos","cuerpos_hidricos","e1","Los páramos son la zona de nacimiento del recurso hídrico que abastece los cuerpos de agua distritales — relación ecológica de sentido común."],
  ["van_der_hammen","sist_distrital_ap","e1","La reserva se articula formalmente al Sistema Distrital de Áreas Protegidas (Art.51) — inferencia razonable dado que ambas viven en la misma subsección 'Zonas de Conservación'."],
  ["sinap_pub","sist_distrital_ap","e1","Ambas son parte del mismo esquema de gobernanza de áreas protegidas (nacional vs. distrital) — inferencia por co-pertenencia a la Subsección 1."],
  ["humedales","resiliencia","e1","Los humedales amortiguan inundaciones y son citados como parte de la resiliencia climática en fuentes secundarias oficiales — no verificado como frase literal del decreto."],
  ["esp_publico","parques","e2","'Parques' se agrupa por inferencia bajo el Sistema de Espacio Público Peatonal (Art.89-91)."],
  ["esp_publico","corredores","e2","'Corredores/ejes verdes' se agrupa por inferencia bajo el mismo sistema."],
  ["movilidad","transporte","e2","'Transporte público' se agrupa por inferencia bajo el Sistema de Movilidad (Art.92-93)."],
  ["movilidad","ciclorutas","e2","'Ciclorrutas' se agrupa por inferencia bajo el mismo sistema."],
  ["cuidado","manzanas","e2","Manzanas del Cuidado es, según comunicados oficiales de la Alcaldía (fuente secundaria), el instrumento insignia del Sistema del Cuidado y de Servicios Sociales (Art.94-97)."],
  ["cuidado","equip","e2","Los equipamientos de urgencia (Art.96) son parte confirmada de este sistema; otras tipologías de equipamiento se agrupan por inferencia."],
  ["eseci_base","areas_actividad","e3","La ESECI se operacionaliza realmente a través de las Áreas de Actividad (Art.240/243) — es la relación mejor confirmada de esta estructura, vía índice oficial."],
  ["areas_actividad","grandes_serv","e3","Los 'Grandes Servicios Metropolitanos' son una categoría de Área de Actividad confirmada en el índice (Art.327)."],
  ["areas_actividad","financieros","e3","Inferencia: los centros financieros probablemente caen bajo un área de actividad estructurante — no verificado con nombre propio en el articulado."],
  ["areas_actividad","tecnodistrito","e3","Inferencia, no verificada con nombre propio."],
  ["areas_actividad","plazas","e3","Inferencia, no verificada con nombre propio."],
  ["areas_actividad","turismo","e3","Inferencia, no verificada con nombre propio."],
  ["eip_base","pemp_ch","e4","El PEMP-CH (Art.83) es el instrumento de manejo patrimonial más detallado y confirmado de la EIP."],
  ["eip_base","arqueologico","e4","Confirmado por índice oficial (Art.84)."],
  ["patrim_cult_nat","pinmaterial","e4","El patrimonio inmaterial se infiere como parte de 'patrimonio cultural y natural' (Art.86), que no lo separa explícitamente."],
  ["paisaje_patrim","patrim_cult_nat","e4","Ambos artículos (85 y 86) son consecutivos y temáticamente continuos — inferencia de continuidad, no cita de relación."],
  ["eip_base","sist_info_patrim","e4","Confirmado por índice oficial (Art.87)."],
];
INTRA.forEach(([s,t,cat,analisis]) => {
  RAW_EDGES.push({ s, t, type:"estructural", cat, fuente:"inferencia", articulo:null, pagina:null, analisis, cita:null });
});

// 3) PUENTES confirmados (evidencia real, aunque escasa) entre estructuras
const PUENTES = [
  ["hub_e1","hub_e2","e1-e2","indice_oficial","Art. 3",null,
    "“Tiene como eje ordenador la Estructura Ecológica Principal” (Art. 3) — la EEP se declara eje ordenador de TODO el modelo, lo que en teoría debería articularla con las demás estructuras. Es el puente conceptual más fuerte que encontramos, pero es una declaración de principio, no un mecanismo operativo articulado con la EFC."],
  ["cerros","grandes_serv","e1-e3","cita_literal","Art. 7","33",
    "El Art. 7 menciona en el MISMO párrafo la Reserva Thomas van der Hammen, los cerros y proyectos de infraestructura estratégica (Regiotram, Metro, Anillo Logístico de Occidente) — es un puente de CO-OCURRENCIA textual, no de articulación funcional explícita: aparecen juntos en la lista de 'elementos regionales', pero el decreto no explica cómo interactúan."],
  ["van_der_hammen","areas_actividad","e1-e3","inferencia","—",null,
    "Puente hipotético/tensión: la presión de desarrollo urbano e industrial (Áreas de Actividad, zona de Chía/Cota) sobre la Reserva Van der Hammen es ampliamente documentada en prensa — no está articulada dentro del propio decreto como relación explícita."],
];
PUENTES.forEach(([s,t,cat,fuente,articulo,pagina,analisis]) => {
  RAW_EDGES.push({ s, t, type:"puente", cat, fuente, articulo, pagina, analisis, cita: fuente==="cita_literal" ? "“…la Reserva Thomas Van Der Hammen, los complejos de páramos, los corredores montañosos, las reservas forestales y los ríos y humedales que comparte con su entorno regional.” (Art. 7, p.33)" : null });
});

// 4) VACÍOS DE ARTICULACIÓN — el hallazgo central: dónde el índice oficial
//    NO muestra ningún mecanismo compartido entre EEP y las otras 3 estructuras,
//    pese a que la interdependencia real (ecológica, urbana) es evidente.
const VACIOS = [
  ["humedales","vivienda","e1-e2","No existe en el índice oficial ningún artículo que articule 'Reservas Distritales de Humedal' (Art.55-57) con la producción de vivienda — pese a que la expansión de vivienda sobre rondas de humedal es uno de los conflictos urbanos más documentados de Bogotá (Jaboque, Tibanica, Capellanía). El modelo declara ambos como componentes, pero no dice cómo se relacionan."],
  ["humedales","manzanas","e1-e2","Las Manzanas del Cuidado (fuente secundaria) se promocionan como cercanas a espacios verdes, pero no encontramos un mecanismo articulado en el índice oficial que conecte su localización con la protección de humedales."],
  ["cuerpos_hidricos","movilidad","e1-e2","No hay artículo confirmado que articule el Sistema Hídrico (Art.60-65) con el Sistema de Movilidad (Art.92-93), pese a que rondas hídricas y trazados viales compiten por el mismo suelo en la práctica (caso ampliamente documentado: Avenida Longitudinal de Occidente-ALO junto al río Bogotá)."],
  ["paramos","areas_actividad","e1-e3","Ningún artículo confirmado conecta la protección de páramos (Art.59) con las Áreas de Actividad económica (Art.240/243) — la estructura ecológica y la socioeconómica no comparten ni un solo mecanismo verificado en el índice oficial."],
  ["resiliencia","grandes_serv","e1-e3","Las Áreas de Resiliencia Climática (Art.71) no tienen ningún puente confirmado hacia los Grandes Servicios Metropolitanos (Art.327) — pese a que estos últimos son, típicamente, infraestructura de alto impacto ambiental."],
  ["sist_hidrico","pemp_ch","e1-e4","No hay artículo que conecte el Sistema Hídrico (Art.60) con el Plan Especial de Manejo del Centro Histórico (Art.83) — aunque el centro histórico de Bogotá se fundó junto a los ríos San Francisco/Vicachá, hoy canalizados."],
  ["areas_actividad","paisaje_patrim","e3-e4","Ningún puente confirmado entre las Áreas de Actividad económica (Art.240) y la protección del paisaje urbano/rural patrimonial (Art.85) — pese a que la presión inmobiliaria sobre zonas patrimoniales es un conflicto documentado (ej. La Candelaria, Chapinero)."],
  ["van_der_hammen","tecnodistrito","e1-e3","Vacío directamente relevante al caso que mencionaste: no existe mecanismo articulado en el índice entre la Reserva Van der Hammen y el desarrollo de distritos de innovación/tecnológicos en el norte de la ciudad, pese a que ese es el conflicto de uso del suelo más mediático asociado a la reserva."],
];
VACIOS.forEach(([s,t,cat,analisis]) => {
  RAW_EDGES.push({ s, t, type:"vacio", cat, fuente:"inferencia", articulo:null, pagina:null, analisis, cita:null });
});

RAW_EDGES.forEach(edge => {
  const s = nodeById(edge.s), t = nodeById(edge.t);
  if (!s || !t) { console.warn("Arista con nodo inexistente:", edge.s, edge.t); return; }
  edge.restLength = Math.hypot(t.x - s.x, t.y - s.y);
});

/* ==========================================================
   ZOOM / PAN
   ========================================================== */
const viewState = { x: 0, y: 0, scale: 1, minScale: 0.35, maxScale: 3.5 };
let baseViewBox = null;

function applyZoomPan(svg) {
  if (!baseViewBox) return;
  const [bx, by, bw, bh] = baseViewBox;
  const w = bw / viewState.scale, h = bh / viewState.scale;
  const x = bx + (bw - w) / 2 + viewState.x;
  const y = by + (bh - h) / 2 + viewState.y;
  svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
}

function setupZoomPan(svg) {
  const vb = svg.getAttribute("viewBox").split(" ").map(Number);
  baseViewBox = vb;

  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    viewState.scale = Math.min(viewState.maxScale, Math.max(viewState.minScale, viewState.scale * delta));
    applyZoomPan(svg);
  }, { passive: false });

  let panning = false, lastX = 0, lastY = 0;
  svg.addEventListener("pointerdown", (e) => {
    if (e.target !== svg) return; // solo si se hace click en fondo vacío
    panning = true; lastX = e.clientX; lastY = e.clientY;
    svg.classList.add("panning");
  });
  window.addEventListener("pointermove", (e) => {
    if (!panning) return;
    const vb2 = svg.getAttribute("viewBox").split(" ").map(Number);
    const scaleFactor = vb2[2] / svg.clientWidth;
    viewState.x -= (e.clientX - lastX) * scaleFactor;
    viewState.y -= (e.clientY - lastY) * scaleFactor;
    lastX = e.clientX; lastY = e.clientY;
    applyZoomPan(svg);
  });
  window.addEventListener("pointerup", () => { panning = false; svg.classList.remove("panning"); });

  document.getElementById("zoomIn")?.addEventListener("click", () => {
    viewState.scale = Math.min(viewState.maxScale, viewState.scale * 1.25); applyZoomPan(svg);
  });
  document.getElementById("zoomOut")?.addEventListener("click", () => {
    viewState.scale = Math.max(viewState.minScale, viewState.scale / 1.25); applyZoomPan(svg);
  });
  document.getElementById("zoomReset")?.addEventListener("click", () => {
    viewState.scale = 1; viewState.x = 0; viewState.y = 0; applyZoomPan(svg);
  });
}

/* -------- defs: glow + flechas -------- */
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

  ["puente", "vacio"].forEach(type => {
    const marker = document.createElementNS(SVG_NS, "marker");
    marker.setAttribute("id", "arrow-" + type);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "8"); marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "7"); marker.setAttribute("markerHeight", "7");
    marker.setAttribute("orient", "auto-start-reverse");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M0,0 L10,5 L0,10 z");
    path.setAttribute("fill", TYPE_STYLE[type].color);
    marker.appendChild(path);
    defs.appendChild(marker);
  });

  svg.appendChild(defs);
}

/* -------- aristas -------- */
function edgeColor(edge) {
  if (edge.type === "estructural") return STRUCT_STYLE[edge.cat].color;
  return TYPE_STYLE[edge.type].color;
}

function edgePathData(edge, s, t) {
  const dx = t.x - s.x, dy = t.y - s.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist, uy = dy / dist;
  const startPad = s.r + 2;
  const endPad = t.r + 8;
  const x1 = s.x + ux * startPad, y1 = s.y + uy * startPad;
  const x2 = t.x - ux * endPad,   y2 = t.y - uy * endPad;
  return `M${x1},${y1} L${x2},${y2}`;
}

function drawEdges(svg) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "edges-layer");

  RAW_EDGES.forEach((edge, i) => {
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const color = edgeColor(edge);
    const d = edgePathData(edge, s, t);

    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "edge-group edge-" + edge.type);
    group.setAttribute("data-index", i);
    group.setAttribute("data-type", edge.type);
    group.setAttribute("data-cat", edge.cat);
    group.setAttribute("data-source", edge.s);
    group.setAttribute("data-target", edge.t);
    group.style.setProperty("--edge-color", color);

    const hit = document.createElementNS(SVG_NS, "path");
    hit.setAttribute("d", d);
    hit.setAttribute("class", "ods-edge edge-hit");

    const visual = document.createElementNS(SVG_NS, "path");
    visual.setAttribute("d", d);
    visual.setAttribute("class", "ods-edge edge-visual");
    visual.setAttribute("stroke", color);
    visual.setAttribute("stroke-width", edge.type === "estructural" ? 1.6 : 2.8);
    if (edge.type === "vacio") visual.setAttribute("stroke-dasharray", "3,6");
    else if (edge.type === "estructural") visual.setAttribute("stroke-dasharray", "1,0");
    if (edge.type !== "estructural") visual.setAttribute("marker-end", `url(#arrow-${edge.type})`);
    visual.setAttribute("opacity", edge.type === "estructural" ? "0.55" : "0.95");

    group.appendChild(visual);
    group.appendChild(hit);
    group.addEventListener("click", (ev) => { ev.stopPropagation(); showEdgeInfo(i); });
    g.appendChild(group);

    edge._el = { visual, hit, d };
  });

  svg.appendChild(g);
}

/* -------- nodos -------- */
function drawNodes(svg) {
  const g = document.createElementNS(SVG_NS, "g");
  g.setAttribute("class", "nodes-layer");

  ODS_NODES.forEach(node => {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("class", "ods-node ods-node-" + node.cat + (node.isHub ? " ods-hub" : ""));
    group.setAttribute("data-id", node.id);
    group.setAttribute("data-cat", node.cat);

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("class", "node-ring");
    circle.setAttribute("cx", node.x); circle.setAttribute("cy", node.y); circle.setAttribute("r", node.r);
    circle.setAttribute("stroke", node.color);
    circle.setAttribute("stroke-width", node.isHub ? 3.5 : 2.5);
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
    iconEl.setAttribute("style", `color:${node.color}; font-size:${node.r * (node.isHub?0.5:0.4)}px; margin:1px 0;`);

    const nameEl = document.createElementNS(XHTML_NS, "div");
    nameEl.setAttribute("class", "node-name");
    nameEl.setAttribute("style", `font-size:${Math.max(node.r * (node.isHub?0.16:0.145), 7.5)}px; padding:0 3px; font-weight:700; color:#e7eaf2; line-height:1.15; white-space:pre-line;`);
    nameEl.textContent = node.name;

    const fuenteDot = document.createElementNS(XHTML_NS, "div");
    fuenteDot.setAttribute("class", "node-fuente-dot");
    fuenteDot.setAttribute("style", `width:7px;height:7px;border-radius:50%;background:${FUENTE_STYLE[node.fuente].color};margin-top:2px;`);

    wrapper.appendChild(iconEl); wrapper.appendChild(nameEl); wrapper.appendChild(fuenteDot);
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

/* -------- física (igual que antes, ancla al home calculado por el layout radial) -------- */
const PHYSICS = { spring: 0.045, anchor: 0.02, damping: 0.82, minVel: 0.02 };

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
    edge._el.visual.setAttribute("d", d);
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
    if (!s.fixed) { s.vx += fx; s.vy += fy; }
    if (!t.fixed) { t.vx -= fx; t.vy -= fy; }
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
  if (moving || ODS_NODES.some(n => n.fixed)) requestAnimationFrame(physicsStep);
  else physicsRunning = false;
}
function wakePhysics() { if (!physicsRunning) { physicsRunning = true; requestAnimationFrame(physicsStep); } }

/* -------- arrastre -------- */
function attachNodeDragHandler(group, node) {
  const svg = document.getElementById("networkViz");
  let dragging = false, moved = false, startClientX = 0, startClientY = 0;

  function toSvgPoint(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const m = svg.getScreenCTM().inverse();
    return pt.matrixTransform(m);
  }

  group.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    dragging = true; moved = false;
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
  setupZoomPan(svg);
}

/* -------- panel de información: ARISTA -------- */
function fuenteBadgeHTML(fuente) {
  const st = FUENTE_STYLE[fuente] || FUENTE_STYLE.inferencia;
  return `<span class="fuente-badge" style="color:${st.color};background:${st.color}22;border:1px solid ${st.color}55;">
    <i class="fa-solid ${st.icon}"></i> ${st.label}</span>`;
}

function showEdgeInfo(index) {
  const edge = RAW_EDGES[index];
  const s = nodeById(edge.s), t = nodeById(edge.t);

  document.querySelectorAll(".edge-group").forEach(el => el.classList.remove("edge-selected"));
  document.querySelector(`.edge-group[data-index="${index}"]`)?.classList.add("edge-selected");
  document.querySelectorAll(".ods-node").forEach(el => el.classList.remove("node-selected"));

  const label = (n) => n.name.replace(/\n/g, " ");
  document.getElementById("edgeInfoTitle").textContent = `${label(s)} → ${label(t)}`;

  const typeEl = document.getElementById("edgeInfoType");
  const typeColor = edgeColor(edge);
  typeEl.innerHTML = TYPE_STYLE[edge.type].label + (edge.cat ? " · " + (STRUCT_STYLE[edge.cat]?.short || edge.cat) : "");
  typeEl.style.color = typeColor;
  typeEl.style.background = typeColor + "26";

  document.getElementById("edgeInfoFuente").innerHTML = fuenteBadgeHTML(edge.fuente);
  document.getElementById("edgeInfoQuote").textContent = edge.cita ? edge.cita : "(No hay cita literal disponible para esta relación — ver análisis abajo.)";
  document.getElementById("edgeInfoAnalisis").textContent = edge.analisis || "";
  document.getElementById("edgeInfoPage").textContent =
    (edge.articulo ? `${edge.articulo}` : "Sin artículo específico") + (edge.pagina ? ` · p. ${edge.pagina}` : "");
  document.getElementById("edgeInfoPanel").classList.add("visible");
  document.getElementById("nodeInfoPanel")?.classList.remove("visible");

  document.querySelectorAll(".matrix-row[data-edge]").forEach(row => {
    row.classList.toggle("row-highlight", Number(row.dataset.edge) === index);
  });
}

function hideEdgeInfo() {
  document.getElementById("edgeInfoPanel").classList.remove("visible");
  document.querySelectorAll(".edge-group").forEach(el => el.classList.remove("edge-selected"));
  document.querySelectorAll(".matrix-row[data-edge]").forEach(row => row.classList.remove("row-highlight"));
}

/* -------- panel de información: NODO (clic simple) -------- */
function showNodeInfo(id) {
  const node = nodeById(id);
  if (!node) return;
  document.querySelectorAll(".ods-node").forEach(el => el.classList.remove("node-selected"));
  document.querySelector(`.ods-node[data-id="${id}"]`)?.classList.add("node-selected");

  const panel = document.getElementById("nodeInfoPanel");
  document.getElementById("nodeInfoTitle").textContent = node.name.replace(/\n/g, " ");
  document.getElementById("nodeInfoStruct").innerHTML =
    `<span class="swatch-tag" style="background:${node.color}"></span> ${STRUCT_STYLE[node.cat].label}`;
  document.getElementById("nodeInfoFuente").innerHTML = fuenteBadgeHTML(node.fuente);
  document.getElementById("nodeInfoArticulo").textContent =
    (node.articulo ? node.articulo : "—") + (node.pagina && node.pagina !== "—" ? ` · p. ${node.pagina}` : "");
  document.getElementById("nodeInfoQuote").textContent = node.cita ? node.cita : "(Sin cita literal verificada para este componente — ver nota metodológica.)";
  document.getElementById("nodeInfoNota").textContent = node.nota || "";

  const mapaWrap = document.getElementById("nodeInfoMapaWrap");
  const mapaLink = document.getElementById("nodeInfoMapa");
  if (node.cartografia) {
    mapaWrap.style.display = "flex";
    mapaLink.href = node.cartografia;
  } else {
    mapaWrap.style.display = "none";
  }

  panel.classList.add("visible");
  document.getElementById("edgeInfoPanel")?.classList.remove("visible");
}

function hideNodeInfo() {
  document.getElementById("nodeInfoPanel").classList.remove("visible");
  document.querySelectorAll(".ods-node").forEach(el => el.classList.remove("node-selected"));
}

/* -------- visibilidad por leyenda -------- */
const typeOff = new Set();
const nodeOff = new Set();
const catOff = new Set();

function refreshEdgeVisibility() {
  const visibleNodes = new Set(ODS_NODES.map(n => n.id));
  document.querySelectorAll(".edge-group").forEach(group => {
    const type = group.dataset.type, cat = group.dataset.cat, s = group.dataset.source, t = group.dataset.target;
    const hidden = typeOff.has(type) || nodeOff.has(s) || nodeOff.has(t) || catOff.has(cat);
    group.classList.toggle("hidden-edge", hidden);
  });
  document.querySelectorAll(".ods-node").forEach(node => {
    const nodeId = node.dataset.id;
    node.classList.toggle("hidden-node", nodeOff.has(nodeId));
  });
}

function toggleNode(id) {
  const group = document.querySelector(`.ods-node[data-id="${id}"]`);
  if (!group) return;
  if (nodeOff.has(id)) { nodeOff.delete(id); group.classList.remove("node-off"); }
  else { nodeOff.add(id); group.classList.add("node-off"); }
  refreshEdgeVisibility();
}

/* -------- clic simple (info) / doble (apagar) / triple (flujo) -------- */
function attachNodeClickHandler(group, id) {
  let count = 0, timer = null;
  group.addEventListener("click", (ev) => {
    ev.stopPropagation();
    if (group.dataset.suppressClick) return;
    count++;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (count === 1) showNodeInfo(id);
      else if (count === 2) toggleNode(id);
      else if (count >= 3) toggleNodeFlow(id);
      count = 0;
    }, 300);
  });
}

/* -------- spotlight / flujo -------- */
let spotlight = null;
function clearSpotlight() {
  spotlight = null;
  document.querySelectorAll(".insight-card").forEach(c => c.classList.remove("active"));
  applySpotlightState();
}
function setSpotlightNodes(nodeIds, expand) { spotlight = { mode:"nodes", nodes:new Set(nodeIds), expand:!!expand }; applySpotlightState(); }
function setSpotlightTypes(types) { spotlight = { mode:"types", types }; applySpotlightState(); }
function setSpotlightCats(cats) { spotlight = { mode:"cats", cats }; applySpotlightState(); }

function applySpotlightState() {
  let visibleNodes = null, visibleEdges = null;
  if (spotlight && spotlight.mode === "nodes") {
    visibleNodes = new Set(spotlight.nodes); visibleEdges = new Set();
    RAW_EDGES.forEach((edge, i) => {
      const sIn = spotlight.nodes.has(edge.s), tIn = spotlight.nodes.has(edge.t);
      if (spotlight.expand) { if (sIn || tIn) { visibleEdges.add(i); visibleNodes.add(edge.s); visibleNodes.add(edge.t); } }
      else if (sIn && tIn) visibleEdges.add(i);
    });
  } else if (spotlight && spotlight.mode === "types") {
    visibleEdges = new Set(); visibleNodes = new Set();
    RAW_EDGES.forEach((edge, i) => { if (spotlight.types.includes(edge.type)) { visibleEdges.add(i); visibleNodes.add(edge.s); visibleNodes.add(edge.t); } });
  } else if (spotlight && spotlight.mode === "cats") {
    visibleNodes = new Set(); visibleEdges = new Set();
    RAW_EDGES.forEach((edge, i) => { if (spotlight.cats.includes(edge.cat)) { visibleEdges.add(i); visibleNodes.add(edge.s); visibleNodes.add(edge.t); } });
  }
  document.querySelectorAll(".ods-node").forEach(el => {
    const id = el.dataset.id;
    el.classList.toggle("node-focus-dim", visibleNodes ? !visibleNodes.has(id) : false);
  });
  document.querySelectorAll(".edge-group").forEach(el => {
    const idx = Number(el.dataset.index);
    el.classList.toggle("edge-focus-dim", visibleEdges ? !visibleEdges.has(idx) : false);
  });
}
function toggleNodeFlow(id) {
  const already = spotlight && spotlight.mode === "nodes" && spotlight.expand && spotlight.nodes.size === 1 && spotlight.nodes.has(id);
  if (already) clearSpotlight(); else setSpotlightNodes([id], true);
}

/* -------- tarjetas de insight -------- */
function toggleInsight(key) {
  const card = document.querySelector(`.insight-card[data-insight="${key}"]`);
  if (!card) return;
  if (card.classList.contains("active")) { clearSpotlight(); return; }
  document.querySelectorAll(".insight-card").forEach(c => c.classList.remove("active"));
  if (key === "todas") { clearSpotlight(); return; }
  if (key === "vacio" || key === "puente" || key === "estructural") setSpotlightTypes([key]);
  else if (["e1","e2","e3","e4"].includes(key)) setSpotlightCats([key]);
  card.classList.add("active");
}

/* -------- leyenda -------- */
function setupLegendToggle() {
  document.querySelectorAll(".legend-item input").forEach(input => {
    input.addEventListener("change", (e) => {
      const item = e.target.closest(".legend-item");
      const mode = item.dataset.mode;
      const val = item.dataset.type || item.dataset.cat;
      if (e.target.checked) { if (mode === "type") typeOff.delete(val); else catOff.delete(val); }
      else { if (mode === "type") typeOff.add(val); else catOff.add(val); }
      item.classList.toggle("off", !e.target.checked);
      refreshEdgeVisibility();
    });
  });
  document.getElementById("edgeInfoClose")?.addEventListener("click", hideEdgeInfo);
  document.getElementById("nodeInfoClose")?.addEventListener("click", hideNodeInfo);
}

/* -------- métricas -------- */
function computeMetrics() {
  const realNodes = ODS_NODES.filter(n => !n.isHub);
  const nodeCount = realNodes.length;
  const edgeCount = RAW_EDGES.length;
  const degrees = {};
  ODS_NODES.forEach(n => { degrees[n.id] = 0; });
  RAW_EDGES.forEach(e => { degrees[e.s] = (degrees[e.s]||0)+1; degrees[e.t] = (degrees[e.t]||0)+1; });

  const vacios = RAW_EDGES.filter(e => e.type === "vacio").length;
  const puentes = RAW_EDGES.filter(e => e.type === "puente").length;
  const estructurales = RAW_EDGES.filter(e => e.type === "estructural").length;

  const porFuente = { cita_literal:0, indice_oficial:0, fuente_secundaria:0, inferencia:0 };
  [...ODS_NODES, ...RAW_EDGES].forEach(x => { if (x.fuente) porFuente[x.fuente] = (porFuente[x.fuente]||0)+1; });

  return { nodeCount, edgeCount, vacios, puentes, estructurales, porFuente, degrees };
}

function renderMetrics() {
  const m = computeMetrics();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("metricNodes", m.nodeCount);
  set("metricEdges", m.edgeCount);
  set("metricVacios", m.vacios);
  set("metricPuentes", m.puentes);
  set("metricCitaLiteral", m.porFuente.cita_literal);
  set("metricIndiceOficial", m.porFuente.indice_oficial);
  set("metricInferencia", m.porFuente.inferencia);

  Object.keys(STRUCT_STYLE).forEach(cat => {
    const el = document.getElementById("struct-" + cat);
    const nCount = ODS_NODES.filter(n => n.cat === cat && !n.isHub).length;
    const eOut = RAW_EDGES.filter(e => e.cat === cat + "-" + Object.keys(STRUCT_STYLE).find(c=>c!==cat)).length;
    if (el) el.textContent = `${STRUCT_STYLE[cat].label}: ${STRUCT_STYLE[cat].articulos} · ${nCount} componentes en la red`;
  });
}

/* -------- tabla dinámica de relaciones (reemplaza la tabla estática rota) -------- */
function renderMatrix() {
  const container = document.getElementById("matrixRows");
  if (!container) return;
  container.innerHTML = "";
  RAW_EDGES.forEach((edge, i) => {
    const s = nodeById(edge.s), t = nodeById(edge.t);
    if (!s || !t) return;
    const row = document.createElement("div");
    row.className = "matrix-row";
    row.dataset.edge = i;
    const color = edgeColor(edge);
    row.innerHTML = `
      <div class="matrix-cell"><span class="swatch-tag" style="background:${STRUCT_STYLE[edge.cat]?.color || '#8b93a8'}"></span> ${STRUCT_STYLE[edge.cat]?.short || edge.cat}</div>
      <div class="matrix-cell">${s.name.replace(/\n/g," ")} → ${t.name.replace(/\n/g," ")}</div>
      <div class="matrix-cell"><span class="alignment-tag" style="background:${color}26;color:${color}">${TYPE_STYLE[edge.type].label}</span></div>
      <div class="matrix-cell">${fuenteBadgeHTML(edge.fuente)}</div>
      <div class="matrix-cell">${edge.articulo || "—"}${edge.pagina ? " · p."+edge.pagina : ""}</div>
      <div class="matrix-cell quote-cell">${edge.analisis || ""}</div>
    `;
    row.addEventListener("click", () => showEdgeInfo(i));
    container.appendChild(row);
  });
}

/* -------- filtros de barra superior -------- */
function filterNetwork(mode) {
  document.querySelectorAll(".network-controls .control-btn").forEach(btn => btn.classList.remove("active"));
  if (window.event && window.event.currentTarget) window.event.currentTarget.classList.add("active");

  typeOff.clear(); catOff.clear();
  document.querySelectorAll(".legend-item input").forEach(inp => { inp.checked = true; inp.closest(".legend-item").classList.remove("off"); });

  const groups = {
    all: null,
    vacio: { types: ["vacio"] },
    puente: { types: ["puente"] },
    estructural: { types: ["estructural"] },
    e1: { cats: ["e1"] }, e2: { cats: ["e2"] }, e3: { cats: ["e3"] }, e4: { cats: ["e4"] },
  };
  const active = groups[mode];
  if (!active) { refreshEdgeVisibility(); return; }

  if (active.types) {
    ["estructural","puente","vacio"].forEach(t => { if (!active.types.includes(t)) typeOff.add(t); });
  }
  if (active.cats) {
    Object.keys(STRUCT_STYLE).forEach(c => { if (!active.cats.includes(c)) catOff.add(c); });
  }
  document.querySelectorAll(".legend-item[data-mode='type']").forEach(item => {
    const show = !active.types || active.types.includes(item.dataset.type);
    item.querySelector("input").checked = show;
    item.classList.toggle("off", !show);
  });
  document.querySelectorAll(".legend-item[data-mode='cat']").forEach(item => {
    const show = !active.cats || active.cats.includes(item.dataset.cat);
    item.querySelector("input").checked = show;
    item.classList.toggle("off", !show);
  });
  refreshEdgeVisibility();
}

document.addEventListener("DOMContentLoaded", () => {
  renderNetwork();
  setupLegendToggle();
  renderMetrics();
  renderMatrix();
  document.getElementById("networkViz")?.addEventListener("click", () => { hideEdgeInfo(); hideNodeInfo(); });
});
