// Thème light/dark
(function () {
  const html = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const themeLabel = themeBtn?.querySelector(".toggle-label");

  const stored = localStorage.getItem("yanis-theme");
  if (stored === "light" || stored === "dark") {
    html.setAttribute("data-theme", stored);
  }

  const applyLabel = () => {
    const current = html.getAttribute("data-theme") || "dark";
    if (themeLabel) {
      themeLabel.textContent = current === "dark" ? "Light" : "Dark";
    }
  };

  applyLabel();

  themeBtn?.addEventListener("click", () => {
    const current = html.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("yanis-theme", next);
    applyLabel();
  });
})();

// Audio KH2 play/pause
(function () {
  const audio = document.getElementById("son");
  const btn = document.getElementById("audioToggle");
  const label = document.getElementById("audio-label");

  if (!audio || !btn || !label) return;

  // Lancer l’audio (au cas où autoplay est bloqué)
  audio.volume = 0.6;

  const syncLabel = () => {
    label.textContent = audio.paused ? "Play" : "Pause";
  };

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => syncLabel())
        .catch(() => {
          // si le navigateur bloque, on change juste le texte
          syncLabel();
        });
    } else {
      audio.pause();
      syncLabel();
    }
  });

  syncLabel();
})();

// Texte qui change dans le titre
(function () {
  const el = document.getElementById("changing-text");
  if (!el) return;

  const messages = [
    "Silly stuff selection",
    "Pick something useless but fun",
    "Play / Notes / Text / A2ple",
    "What do u want from me ?!"
  ];

  let index = 0;
  const update = () => {
    el.textContent = messages[index];
    index = (index + 1) % messages.length;
  };

  update();
  setInterval(update, 3200);
})();

// Heure et date
(function () {
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");

  if (!timeEl || !dateEl) return;

  const pad = (n) => (n < 10 ? "0" + n : String(n));

  const update = () => {
    const now = new Date();
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    timeEl.textContent = `${h}:${m}`;

    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric"
    };
    dateEl.textContent = now
      .toLocaleDateString("fr-CA", options)
      .replace(",", "");
  };

  update();
  setInterval(update, 15_000);
})();

// Slider opacité du sang
(function () {
  const img = document.querySelector(".bloodOnScreen");
  const range = document.getElementById("bloodOpacity");
  const resetBtn = document.getElementById("resetOpacity");
  const valueEl = document.getElementById("bloodOpacityValue");

  if (!img || !range || !resetBtn || !valueEl) return;

  const DEFAULT = 0.3;

  const update = () => {
    const val = parseFloat(range.value);
    img.style.opacity = val;
    valueEl.textContent = Math.round(val * 100) + "%";
    localStorage.setItem("yanis-blood-opacity", String(val));
  };

  // Restore saved
  const stored = localStorage.getItem("yanis-blood-opacity");
  if (stored !== null && !isNaN(parseFloat(stored))) {
    range.value = stored;
  } else {
    range.value = String(DEFAULT);
  }
  update();

  range.addEventListener("input", update);

  resetBtn.addEventListener("click", () => {
    range.value = String(DEFAULT);
    update();
  });
})();
