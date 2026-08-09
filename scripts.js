// ===================== DATOS DE LAS RELACIONES (tabla del POT) =====================
const relations = {
  e1: {
    label: "EEP → ESECI",
    quote: "la conservación del ambiente como formas de productividad, sustento y desarrollo sostenible.",
    page: "p. 31"
  },
  e2: {
    label: "EIP → EEP",
    quote: "Por eso promovemos la ciudad a que reconozca el patrimonio local, las dinámicas comunitarias, los sistemas cooperativos de producción sostenible como huertas productivas, bancos de semillas nativas y plantas de uso medicinal, entre otros.",
    page: "p. 31"
  },
  e3: {
    label: "EFC → EEP",
    quote: "En la ruralidad es urgente mejorar las condiciones habitacionales, desde los componentes de servicios públicos domiciliarios, accesibilidad y movilidad, con equipamientos que faciliten la economía campesina, familiar y comunitaria, el turismo responsable de naturaleza que vincule residentes y saberes del lugar y la conservación del ambiente como formas de productividad, sustento y desarrollo sostenible.",
    page: "p. 31"
  },
  e4: {
    label: "EFC → ESECI",
    quote: "Bajo la nueva visión del POT, la infraestructura social es compatible con otros usos y equipamientos, como centros deportivos, culturales y de recreación, entre otros. Esto propicia infraestructuras compartidas y multifuncionales que contribuyen a la interculturalidad, que estimulan la permanencia de los estudiantes en el sistema educativo y que promueven la generación de conocimiento.",
    page: "p. 126"
  },
  e5: {
    label: "EIP → EFC",
    quote: "El POT busca intervenir estratégicamente, vinculando las dinámicas patrimoniales, ambientales, sociales y culturales para proteger y garantizar la permanencia y calidad de vida de los pobladores originales de las zonas de renovación urbana y actuaciones estratégicas.",
    page: "p. 30"
  },
  e6: {
    label: "EIP → ESECI",
    quote: "El mismo planteamiento vincula patrimonio local, dinámicas comunitarias y producción sostenible, permitiendo analizar su relación con la dimensión socioeconómica.",
    page: "p. 35"
  }
};

// ===================== POPUP DE RELACIONES =====================
(function initRelationPopups(){
  const links = document.querySelectorAll(".link[data-relation]");

  function closePopup(){
    const existing = document.querySelector(".pot-popup");
    if (existing) existing.remove();
    document.removeEventListener("click", onOutsideClick, true);
  }

  function onOutsideClick(e){
    const popup = document.querySelector(".pot-popup");
    if (popup && !popup.contains(e.target) && !e.target.closest(".link")) {
      closePopup();
    }
  }

  function openPopup(relationId, x, y){
    closePopup();
    const data = relations[relationId];
    if (!data) return;

    const popup = document.createElement("div");
    popup.className = "pot-popup";
    popup.innerHTML = `
      <button class="pot-popup-close" aria-label="Cerrar">✕</button>
      <div class="pot-relation">${data.label}</div>
      <div class="pot-quote">&ldquo;${data.quote}&rdquo;</div>
      <div class="pot-page">${data.page}</div>
    `;

    document.body.appendChild(popup);

    // posicionar y ajustar para que no se salga de la pantalla
    const rect = popup.getBoundingClientRect();
    const margin = 16;
    let left = x + 16;
    let top = y + 16;

    if (left + rect.width + margin > window.innerWidth) {
      left = x - rect.width - 16;
    }
    if (top + rect.height + margin > window.innerHeight) {
      top = window.innerHeight - rect.height - margin;
    }
    if (left < margin) left = margin;
    if (top < margin) top = margin;

    popup.style.left = left + "px";
    popup.style.top = top + "px";

    popup.querySelector(".pot-popup-close").addEventListener("click", (ev) => {
      ev.stopPropagation();
      closePopup();
    });

    setTimeout(() => document.addEventListener("click", onOutsideClick, true), 0);
  }

  links.forEach((link) => {
    const relationId = link.getAttribute("data-relation");

    link.addEventListener("click", (e) => {
      e.stopPropagation();
      links.forEach((l) => l.classList.remove("link-active"));
      link.classList.add("link-active");
      openPopup(relationId, e.clientX, e.clientY);
    });

    // accesibilidad: abrir con teclado (Enter / espacio)
    link.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const box = link.getBoundingClientRect();
        links.forEach((l) => l.classList.remove("link-active"));
        link.classList.add("link-active");
        openPopup(relationId, box.left + box.width / 2, box.top + box.height / 2);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopup();
  });
})();
