const menuButton = document.querySelector('#menuButton');
const mainNav = document.querySelector('#mainNav');
const form = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const cepInput = document.querySelector('#cep');
const cityInput = document.querySelector('#city');
const cursorGlow = document.querySelector('.cursor-glow');

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (cursorGlow) {
  window.addEventListener('pointermove', event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

if (cepInput && cityInput && formStatus) {
  cepInput.addEventListener('input', event => {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 8);
    event.target.value = digits.replace(/^(\d{5})(\d)/, '$1-$2');
  });

  cepInput.addEventListener('blur', async () => {
    const cep = cepInput.value.replace(/\D/g, '');
    cityInput.value = '';
    if (cep.length !== 8) return;

    formStatus.className = 'form-status';
    formStatus.textContent = 'CONSULTANDO COORDENADAS...';

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Falha na consulta');
      const data = await response.json();
      if (data.erro) throw new Error('CEP não encontrado');

      cityInput.value = `${data.localidade} - ${data.uf}`;
      formStatus.textContent = 'LOCALIZAÇÃO IDENTIFICADA COM SUCESSO.';
      formStatus.className = 'form-status success';
    } catch (error) {
      formStatus.textContent = 'NÃO FOI POSSÍVEL LOCALIZAR ESSE CEP.';
      formStatus.className = 'form-status error';
    }
  });
}

if (form && formStatus) {
  const submitButton = document.querySelector('#contactSubmitButton');
  const submitLabel = submitButton?.querySelector('.submit-label');

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    if (!name || !email || !message) {
      formStatus.textContent = 'PREENCHA NOME, E-MAIL E MENSAGEM.';
      formStatus.className = 'form-status error';
      return;
    }

    if (!emailInput.checkValidity()) {
      formStatus.textContent = 'DIGITE UM E-MAIL VÁLIDO.';
      formStatus.className = 'form-status error';
      emailInput.focus();
      return;
    }

    const originalLabel = submitLabel?.textContent || 'ENVIAR TRANSMISSÃO';

    if (submitButton) submitButton.disabled = true;
    if (submitLabel) submitLabel.textContent = 'ENVIANDO...';

    formStatus.textContent = 'ESTABELECENDO CONEXÃO E ENVIANDO MENSAGEM...';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(form);

      const response = await fetch('https://formsubmit.co/ajax/pvrezende2023@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Falha no envio da mensagem.');
      }

      formStatus.textContent =
        `TRANSMISSÃO ENVIADA, ${name.toUpperCase()}! RESPONDEREI PELO E-MAIL INFORMADO.`;
      formStatus.className = 'form-status success';

      form.reset();
      if (cityInput) cityInput.value = '';
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);

      formStatus.textContent =
        'NÃO FOI POSSÍVEL ENVIAR AGORA. TENTE NOVAMENTE OU USE O WHATSAPP.';
      formStatus.className = 'form-status error';
    } finally {
      if (submitButton) submitButton.disabled = false;
      if (submitLabel) submitLabel.textContent = originalLabel;
    }
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();


const skillCards = document.querySelectorAll('.skill-card');
const skillName = document.querySelector('#skillName');
const skillCategory = document.querySelector('#skillCategory');
const skillDescription = document.querySelector('#skillDescription');

function activateSkill(card) {
  if (!card || !skillName || !skillCategory || !skillDescription) return;
  skillCards.forEach(item => {
    item.classList.remove('active');
    item.setAttribute('aria-pressed', 'false');
  });
  card.classList.add('active');
  card.setAttribute('aria-pressed', 'true');
  skillName.textContent = card.dataset.name;
  skillCategory.textContent = card.dataset.category;
  skillDescription.textContent = card.dataset.description;
}

skillCards.forEach(card => {
  card.addEventListener('mouseenter', () => activateSkill(card));
  card.addEventListener('focus', () => activateSkill(card));
  card.addEventListener('click', () => activateSkill(card));
});


// Adiciona uma moto animada ao redor de cada projeto.
function initProjectMotorcycles() {
  const projectCards = document.querySelectorAll('.mission-card, .project-showcase');
  const colors = [
    '#ff2a2a', // vermelho
    '#00d8ff', // azul-ciano
    '#c7ff1a', // verde-limão
    '#ff9d00', // laranja
    '#a855f7', // roxo
    '#22c55e', // verde
    '#611208'  // rosa
  ];

  projectCards.forEach((card, index) => {
    if (card.querySelector('.moto-runner')) return;

    const motorcycle = document.createElement('span');
    motorcycle.className = 'moto-runner';
    motorcycle.setAttribute('aria-hidden', 'true');
    motorcycle.style.setProperty('--moto-color', colors[index % colors.length]);
    motorcycle.style.animationDelay = `${index * -1.15}s`;

    card.appendChild(motorcycle);
  });
}

initProjectMotorcycles();


// ==========================================================
// MODAL DE JOGOS FAVORITOS
// ==========================================================

const gamesTrigger = document.querySelector('#gamesTrigger');
const gamesModal = document.querySelector('#gamesModal');
const gamesModalClose = document.querySelector('#gamesModalClose');
const gamesModalBackdrop = document.querySelector('[data-close-games]');

let lastFocusedElement = null;

function openGamesModal() {
  if (!gamesModal) return;

  lastFocusedElement = document.activeElement;
  gamesModal.classList.add('open');
  gamesModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('games-modal-open');

  window.setTimeout(() => {
    gamesModalClose?.focus();
  }, 100);
}

function closeGamesModal() {
  if (!gamesModal) return;

  gamesModal.classList.remove('open');
  gamesModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('games-modal-open');

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

gamesTrigger?.addEventListener('click', openGamesModal);

gamesTrigger?.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openGamesModal();
  }
});

gamesModalClose?.addEventListener('click', closeGamesModal);
gamesModalBackdrop?.addEventListener('click', closeGamesModal);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && gamesModal?.classList.contains('open')) {
    closeGamesModal();
  }
});


// ==========================================================
// MODAL DE FILMES FAVORITOS
// ==========================================================

const cinemaTrigger = document.querySelector('#cinemaTrigger');
const cinemaModal = document.querySelector('#cinemaModal');
const cinemaModalClose = document.querySelector('#cinemaModalClose');
const cinemaModalBackdrop = document.querySelector('[data-close-cinema]');

let lastCinemaFocusedElement = null;

function openCinemaModal() {
  if (!cinemaModal) return;

  lastCinemaFocusedElement = document.activeElement;
  cinemaModal.classList.add('open');
  cinemaModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cinema-modal-open');

  window.setTimeout(() => {
    cinemaModalClose?.focus();
  }, 100);
}

function closeCinemaModal() {
  if (!cinemaModal) return;

  cinemaModal.classList.remove('open');
  cinemaModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cinema-modal-open');

  if (lastCinemaFocusedElement instanceof HTMLElement) {
    lastCinemaFocusedElement.focus();
  }
}

cinemaTrigger?.addEventListener('click', openCinemaModal);

cinemaTrigger?.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openCinemaModal();
  }
});

cinemaModalClose?.addEventListener('click', closeCinemaModal);
cinemaModalBackdrop?.addEventListener('click', closeCinemaModal);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && cinemaModal?.classList.contains('open')) {
    closeCinemaModal();
  }
});


// ==========================================================
// MODAL DE VIAGENS
// ==========================================================

const travelTrigger = document.querySelector('#travelTrigger');
const travelModal = document.querySelector('#travelModal');
const travelModalClose = document.querySelector('#travelModalClose');
const travelModalBackdrop = document.querySelector('[data-close-travel]');

let lastTravelFocusedElement = null;

function openTravelModal() {
  if (!travelModal) return;

  lastTravelFocusedElement = document.activeElement;
  travelModal.classList.add('open');
  travelModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('travel-modal-open');

  window.setTimeout(() => {
    travelModalClose?.focus();
  }, 100);
}

function closeTravelModal() {
  if (!travelModal) return;

  travelModal.classList.remove('open');
  travelModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('travel-modal-open');

  if (lastTravelFocusedElement instanceof HTMLElement) {
    lastTravelFocusedElement.focus();
  }
}

travelTrigger?.addEventListener('click', openTravelModal);

travelTrigger?.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openTravelModal();
  }
});

travelModalClose?.addEventListener('click', closeTravelModal);
travelModalBackdrop?.addEventListener('click', closeTravelModal);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && travelModal?.classList.contains('open')) {
    closeTravelModal();
  }
});


// ==========================================================
// IMAGENS DOS DESTINOS — WIKIPÉDIA
// ==========================================================

const travelImages = document.querySelectorAll(
  '.travel-card img[data-wiki-title]'
);

function createTravelImageFallback(image) {
  const card = image.closest('.travel-card');
  const placeName = image.alt.replace(/^Imagem de\s+/i, '');

  image.removeAttribute('src');
  image.style.background = `
    radial-gradient(circle at 80% 20%, rgba(75, 163, 255, .22), transparent 36%),
    linear-gradient(145deg, #151c27, #090d13)
  `;

  if (!card || card.querySelector('.travel-image-error')) return;

  const fallback = document.createElement('span');
  fallback.className = 'travel-image-error';
  fallback.textContent = placeName;
  fallback.style.cssText = `
    position: absolute;
    top: 64px;
    left: 22px;
    right: 22px;
    z-index: 2;
    color: rgba(255, 255, 255, .72);
    text-align: center;
    font: 800 1rem var(--font-display);
    letter-spacing: .08em;
    text-transform: uppercase;
    pointer-events: none;
  `;

  card.appendChild(fallback);
}

async function loadTravelImage(image) {
  const language = image.dataset.wikiLang || 'pt';
  const pageTitle = image.dataset.wikiTitle;

  if (!pageTitle || image.dataset.loaded === 'true') return;

  const endpoint =
    `https://${language}.wikipedia.org/api/rest_v1/page/summary/` +
    encodeURIComponent(pageTitle);

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Wikipédia respondeu com status ${response.status}`);
    }

    const page = await response.json();
    const imageUrl =
      page.originalimage?.source ||
      page.thumbnail?.source;

    if (!imageUrl) {
      throw new Error('O artigo não possui imagem principal.');
    }

    image.src = imageUrl;
    image.dataset.loaded = 'true';

    image.addEventListener(
      'error',
      () => createTravelImageFallback(image),
      { once: true }
    );
  } catch (error) {
    console.warn(
      `Não foi possível carregar a imagem de ${pageTitle}:`,
      error
    );
    createTravelImageFallback(image);
  }
}

function loadAllTravelImages() {
  travelImages.forEach(loadTravelImage);
}

// Carrega ao abrir a janela e também deixa as imagens preparadas
// caso o conteúdo já esteja visível.
travelTrigger?.addEventListener('click', loadAllTravelImages);
travelTrigger?.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    loadAllTravelImages();
  }
});

if (travelModal?.classList.contains('open')) {
  loadAllTravelImages();
}


// ==========================================================
// PAPEL DE PAREDE MECÂNICO 3D
// ==========================================================

function mechanicSVG(type) {
  const common = `fill="url(#steel)" stroke="#5f6c7d" stroke-width="1.5"`;
  const defs = `
    <defs>
      <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset=".22" stop-color="#cfd7e3"/>
        <stop offset=".48" stop-color="#748196"/>
        <stop offset=".69" stop-color="#edf2f8"/>
        <stop offset="1" stop-color="#667387"/>
      </linearGradient>
    </defs>`;

  if (type === 'gear') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${defs}
      <g ${common}>
        <path d="M44 5h12l3 12a35 35 0 018 3l11-6 8 8-6 11a35 35 0 013 8l12 3v12l-12 3a35 35 0 01-3 8l6 11-8 8-11-6a35 35 0 01-8 3l-3 12H44l-3-12a35 35 0 01-8-3l-11 6-8-8 6-11a35 35 0 01-3-8L5 56V44l12-3a35 35 0 013-8l-6-11 8-8 11 6a35 35 0 018-3z"/>
        <circle cx="50" cy="50" r="24" fill="#111822"/>
        <circle cx="50" cy="50" r="10"/>
      </g></svg>`;
  }

  if (type === 'turbo') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${defs}
      <g ${common}>
        <circle cx="50" cy="50" r="39"/>
        <circle cx="50" cy="50" r="28" fill="#111822"/>
        <circle cx="50" cy="50" r="8"/>
        <path d="M50 20c13 1 22 8 25 19-10-5-18-6-25-3z"/>
        <path d="M80 50c-1 13-8 22-19 25 5-10 6-18 3-25z"/>
        <path d="M50 80c-13-1-22-8-25-19 10 5 18 6 25 3z"/>
        <path d="M20 50c1-13 8-22 19-25-5 10-6 18-3 25z"/>
      </g></svg>`;
  }

  if (type === 'suspension') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${defs}
      <g ${common}>
        <rect x="31" y="5" width="38" height="11" rx="4"/>
        <rect x="31" y="84" width="38" height="11" rx="4"/>
        <rect x="44" y="16" width="12" height="68" rx="5"/>
        <path d="M34 23c31 0 31 9 0 9s-31 9 0 9 31 9 0 9-31 9 0 9 31 9 0 9-31 9 0 9" fill="none" stroke="url(#steel)" stroke-width="8" stroke-linecap="round"/>
      </g></svg>`;
  }

  if (type === 'wrench') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${defs}
      <path ${common} d="M69 7a25 25 0 00-23 35L12 76a11 11 0 0016 16l34-34A25 25 0 0093 27L77 43 64 30l16-16A25 25 0 0069 7z"/>
      <circle cx="20" cy="84" r="5" fill="#111822"/>
    </svg>`;
  }

  return `<svg viewBox="0 0 100 100" aria-hidden="true">${defs}
    <g ${common}>
      <path d="M17 12l13 4 5 15-9 9-15-5-4-13z"/>
      <rect x="31" y="29" width="14" height="66" rx="6" transform="rotate(-39 38 62)"/>
      <path d="M77 7a20 20 0 00-18 28L31 63l11 11 28-28A20 20 0 0094 21L82 33l-9-9 12-12a20 20 0 00-8-5z"/>
    </g></svg>`;
}

function initMechanicWallpaper() {
  const sections = document.querySelectorAll(
    '.profile.section, .skills-section.section, .missions.section, .arsenal.section, .universe.section, .contact.section'
  );

  if (!sections.length) return;

  const symbols = ['gear', 'wrench', 'turbo', 'suspension', 'tools'];
  const palettes = [
    ['#ff2a2a', 'rgba(255,42,42,.42)'],
    ['#00c9ff', 'rgba(0,201,255,.40)'],
    ['#c7ff1a', 'rgba(199,255,26,.32)'],
    ['#ffad2f', 'rgba(255,173,47,.36)'],
    ['#a855f7', 'rgba(168,85,247,.36)']
  ];

  const positions = [
    [3, 8], [80, 5], [8, 38], [84, 35], [3, 72], [78, 76], [42, 13], [45, 78]
  ];

  sections.forEach((section, sectionIndex) => {
    section.querySelector('.mechanic-wallpaper')?.remove();

    const layer = document.createElement('div');
    layer.className = 'mechanic-wallpaper';
    layer.setAttribute('aria-hidden', 'true');

    const count = section.matches('.missions, .arsenal') ? 8 : 6;

    for (let index = 0; index < count; index += 1) {
      const type = symbols[(index + sectionIndex) % symbols.length];
      const palette = palettes[(index + sectionIndex * 2) % palettes.length];
      const position = positions[(index + sectionIndex) % positions.length];
      const item = document.createElement('span');
      const shell = document.createElement('span');

      item.className = `mechanic-symbol type-${type} depth-${['back', 'mid', 'front'][index % 3]}`;
      shell.className = 'mechanic-symbol-shell';
      shell.innerHTML = mechanicSVG(type);

      const size = 112 + ((index * 23 + sectionIndex * 17) % 92);
      item.style.left = `${position[0] + ((sectionIndex * 3) % 6)}%`;
      item.style.top = `${position[1] + ((index * 2) % 7)}%`;
      item.style.setProperty('--symbol-size', `${size}px`);
      item.style.setProperty('--symbol-color', palette[0]);
      item.style.setProperty('--symbol-glow', palette[1]);
      item.style.setProperty('--float-time', `${13 + ((index + sectionIndex) % 7) * 2}s`);
      item.style.setProperty('--spin-time', `${18 + ((index * 2 + sectionIndex) % 8) * 2}s`);
      item.style.setProperty('--start-rotate', `${-22 + ((index * 19 + sectionIndex * 7) % 44)}deg`);
      item.style.setProperty('--move-x', `${16 + ((index * 11) % 26)}px`);
      item.style.setProperty('--move-y', `${18 + ((index * 13) % 30)}px`);
      item.style.animationDelay = `${-((index * 2.4 + sectionIndex) % 15)}s`;

      item.appendChild(shell);
      layer.appendChild(item);
    }

    section.prepend(layer);
  });
}

initMechanicWallpaper();
