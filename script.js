(() => {
  const WA = "5594981368441";

  // Links "Pedir horário" abrem o WhatsApp com mensagem pronta para o tratamento.
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const msg = `Olá! Vim pelo site e quero saber mais sobre: ${a.dataset.wa}.`;
    a.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    a.target = "_blank";
    a.rel = "noopener";
  });

  // Cabeçalho sólido e botão flutuante depois do topo.
  const top = document.querySelector("[data-top]");
  const fab = document.querySelector(".wa-float");
  const hero = document.querySelector(".hero");
  const onScroll = () => {
    const y = window.scrollY;
    top.classList.toggle("is-solid", y > 40);
    fab.classList.toggle("is-visible", y > hero.offsetHeight * 0.6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Abas de tratamentos (teclado: setas, Home, End).
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = (tab, focus = true) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab, false));
    tab.addEventListener("keydown", (e) => {
      const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (e.key in map) {
        e.preventDefault();
        select(tabs[(map[e.key] + tabs.length) % tabs.length]);
      }
    });
  });

  // Comparador antes/depois.
  const cmp = document.querySelector("[data-compare]");
  const range = cmp.querySelector(".compare-range");
  const before = cmp.querySelector(".compare-before");
  const after = cmp.querySelector(".compare-after");
  const setPos = (v) => cmp.style.setProperty("--pos", `${v}%`);
  range.addEventListener("input", () => setPos(range.value));

  // Arrastar com o dedo ou o mouse em qualquer ponto da foto (o iPhone não move
  // um range invisível a menos que se toque exatamente no polegar dele).
  let dragging = false;
  const moveTo = (clientX) => {
    const r = cmp.getBoundingClientRect();
    const v = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    range.value = v;
    setPos(v);
  };
  cmp.addEventListener("pointerdown", (e) => {
    dragging = true;
    cmp.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  });
  cmp.addEventListener("pointermove", (e) => { if (dragging) moveTo(e.clientX); });
  const stop = () => { dragging = false; };
  cmp.addEventListener("pointerup", stop);
  cmp.addEventListener("pointercancel", stop);

  document.querySelectorAll(".case").forEach((btn) => {
    btn.addEventListener("click", () => {
      const n = btn.dataset.case;
      document.querySelectorAll(".case").forEach((b) => b.setAttribute("aria-pressed", b === btn));
      before.src = `/assets/resultados/rino-${n}-antes.jpg`;
      after.src = `/assets/resultados/rino-${n}-depois.jpg`;
      range.value = 50;
      setPos(50);
    });
  });

  // Pré-carrega os outros casos quando a seção aparece.
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      for (let n = 2; n <= 5; n++) {
        ["antes", "depois"].forEach((t) => { new Image().src = `/assets/resultados/rino-${n}-${t}.jpg`; });
      }
      io.disconnect();
    }
  });
  io.observe(cmp);

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
