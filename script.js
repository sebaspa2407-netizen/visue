/* =========================================================
   VISUE · script.js

   ► PARA PERSONALIZAR LA PÁGINA, EDITA SOLO EL BLOQUE «CONFIG».
   Mientras un valor siga entre corchetes [ ... ] o vacío,
   la página muestra un espacio de «pendiente» y nada se rompe.
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. CONFIGURACIÓN (aquí cambias enlaces, fotos y datos)
   --------------------------------------------------------- */
const CONFIG = {
  prototipoUrl: 'https://visue20-frontend.vercel.app/',
  videoUrl: 'https://www.youtube.com/watch?v=MDtb_P5W9Kk',
  ensayoPdf: 'https://docs.google.com/document/d/13LzTMo5PFNy2eBeTMrvqe5KWZMRYZB8x/edit',
  ensayoDescripcion: '',

  // Capturas reales del prototipo. Basta con guardar las imágenes con estos nombres
  // dentro de assets/img/ y aparecerán solas. Escribe el texto alternativo (alt).
  capturas: [
    { src: 'assets/img/captura-1.jpg', alt: 'Captura real del prototipo de VISUE: la cámara capturando la mano del usuario.' },
    { src: 'assets/img/captura-2.jpg', alt: 'Captura real del prototipo de VISUE: reconocimiento de los puntos de la mano y de la letra.' },
    { src: 'assets/img/captura-3.jpg', alt: 'Captura real del prototipo de VISUE: la letra reconocida convertida en texto y voz, y el avatar.' }
  ],

};

/* ---------------------------------------------------------
   2. UTILIDADES
   --------------------------------------------------------- */
const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** ¿El valor fue completado? (no vacío y no es un marcador [ ... ]) */
function isConfigured(value) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  return v !== '' && !/^\[.*\]$/.test(v);
}

/**
 * Valida una URL antes de usarla. Solo admite http(s) y rutas relativas
 * (evita esquemas peligrosos como javascript:). Devuelve '' si no es válida.
 */
function safeUrl(value) {
  if (!isConfigured(value)) return '';
  try {
    const url = new URL(value.trim(), window.location.href);
    return (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'file:')
      ? value.trim() : '';
  } catch (e) {
    return '';
  }
}

/** Muestra un aviso breve (accesible) en la parte inferior. */
let toastTimer;
function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 4200);
}

/** Intenta cargar una imagen; llama a onOk solo si existe. */
function tryImage(src, onOk) {
  const img = new Image();
  img.onload = () => onOk(img);
  img.onerror = () => { /* no existe: se mantiene el espacio «pendiente» */ };
  img.src = src;
}

/* ---------------------------------------------------------
   3. MENÚ MÓVIL Y ENCABEZADO
   --------------------------------------------------------- */
function initNavigation() {
  const header = $('.site-header');
  const toggle = $('.nav-toggle');
  const menu = $('#menu');
  if (!header || !toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

  // Cierra el menú al elegir una opción
  $$('a', menu).forEach((link) => link.addEventListener('click', () => setOpen(false)));

  // Cierra con la tecla Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Si se ensancha la pantalla (modo escritorio), restablece el estado
  window.matchMedia('(min-width: 980px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });

  // Sombra/borde del encabezado al hacer scroll
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Resalta en el menú la sección visible («scroll-spy»)
  const links = $$('.nav__list a[href^="#"]:not(.btn)');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => spy.observe(section));
  }
}

/* ---------------------------------------------------------
   4. ANIMACIONES AL DESPLAZARSE + CONTADORES
   --------------------------------------------------------- */
function formatNumber(n) {
  return n.toLocaleString('es-CO'); // 459784 → «459.784»
}

function animateCounter(el) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  if (prefersReducedMotion) { el.textContent = formatNumber(target); return; }

  const duration = 1300;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initReveal() {
  const items = $$('.reveal');
  const counters = $$('[data-count]');

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return; // los contadores conservan el número final escrito en el HTML
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObserver.observe(el));
}

/* ---------------------------------------------------------
   5. SECCIÓN «PRUEBA VISUE» (enlace + iframe opcional)
   --------------------------------------------------------- */
function initPrototype() {
  const url = safeUrl(CONFIG.prototipoUrl);
  const notConfiguredMsg = 'Aún falta pegar el enlace del prototipo (script.js → CONFIG.prototipoUrl).';

  // Botones que abren el prototipo en otra pestaña
  $$('[data-prototype-link]').forEach((link) => {
    if (url) {
      link.href = url;
    } else {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast(notConfiguredMsg);
      });
    }
  });

  // Vista previa incrustada (se carga solo si la persona lo pide)
  const toggle = $('#embed-toggle');
  const frame = $('#embed-frame');
  const slot = $('#embed-slot');
  if (!toggle || !frame || !slot) return;

  toggle.addEventListener('click', () => {
    if (!url) { showToast(notConfiguredMsg); return; }

    const willOpen = frame.hasAttribute('hidden');
    frame.toggleAttribute('hidden', !willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
    toggle.textContent = willOpen ? 'Ocultar vista previa' : 'Ver vista previa incrustada';

    // Crea el iframe una sola vez (así no se pide la cámara hasta que se necesite)
    if (willOpen && !slot.firstElementChild) {
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.title = 'Prototipo de VISUE';
      iframe.loading = 'lazy';
      iframe.allow = 'camera; microphone; autoplay; clipboard-write';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      slot.appendChild(iframe);
    }
    if (willOpen && !prefersReducedMotion) frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ---------------------------------------------------------
   6. VIDEO PITCH
   --------------------------------------------------------- */
function getYouTubeId(rawUrl) {
  try {
    const u = new URL(rawUrl);
    const host = u.hostname.replace(/^www\./, '');
    let id = null;
    if (host === 'youtu.be') {
      id = u.pathname.slice(1);
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else {
        const match = u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{6,})/);
        if (match) id = match[1];
      }
    }
    return id && /^[\w-]{6,}$/.test(id) ? id : null;
  } catch (e) { return null; }
}

function getVimeoId(rawUrl) {
  try {
    const u = new URL(rawUrl);
    if (!u.hostname.replace(/^www\./, '').endsWith('vimeo.com')) return null;
    const match = u.pathname.match(/(\d{6,})/);
    return match ? match[1] : null;
  } catch (e) { return null; }
}

function initVideo() {
  const slot = $('#video-slot');
  const url = safeUrl(CONFIG.videoUrl);
  if (!slot || !url) return; // se mantiene el espacio «pendiente»

  const ytId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);
  let element;

  if (ytId) {
    element = document.createElement('iframe');
    element.src = 'https://www.youtube-nocookie.com/embed/' + ytId + '?rel=0';
    element.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    element.allowFullscreen = true;
  } else if (vimeoId) {
    element = document.createElement('iframe');
    element.src = 'https://player.vimeo.com/video/' + vimeoId;
    element.allow = 'autoplay; fullscreen; picture-in-picture';
    element.allowFullscreen = true;
  } else if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
    element = document.createElement('video');
    element.src = url;
    element.controls = true;
    element.playsInline = true;
    element.preload = 'metadata';
    element.setAttribute('aria-label', 'Video pitch de VISUE');
  } else {
    // Enlace de otra plataforma: ofrece abrirlo en una pestaña nueva
    element = document.createElement('div');
    element.className = 'video__link';
    element.innerHTML = '<p><strong>Mira el video pitch de VISUE</strong></p>';
    const a = document.createElement('a');
    a.className = 'btn btn--primary';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'Ver video';
    element.appendChild(a);
  }

  if (element.tagName === 'IFRAME') {
    element.title = 'Video pitch de VISUE';
    element.loading = 'lazy';
  }
  slot.replaceChildren(element);
}

/* ---------------------------------------------------------
   7. ENSAYO (visor PDF + botones)
   --------------------------------------------------------- */
function initEssay() {
  if (isConfigured(CONFIG.ensayoDescripcion)) {
    const desc = $('[data-essay-desc]');
    if (desc) desc.textContent = CONFIG.ensayoDescripcion;
  }

  const url = safeUrl(CONFIG.ensayoPdf);
  const download = $('[data-pdf-download]');
  const open = $('[data-pdf-open]');
  const slot = $('#pdf-slot');
  const msg = 'Aún falta indicar el PDF del ensayo (script.js → CONFIG.ensayoPdf).';

  if (!url) {
    [download, open].forEach((btn) => btn && btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(msg);
    }));
    return;
  }

  if (download) { download.href = url; download.setAttribute('download', 'Ensayo-VISUE.pdf'); }
  if (open) open.href = url;

  if (slot) {
    const iframe = document.createElement('iframe');
    iframe.src = url + '#view=FitH';
    iframe.title = 'Visor del ensayo de VISUE (PDF)';
    iframe.loading = 'lazy';
    slot.replaceChildren(iframe);
  }
}

/* ---------------------------------------------------------
   8. CAPTURAS DEL PROTOTIPO
   Solo se muestra una captura si el archivo de imagen existe.
   Nunca se inventan imágenes: si falta, queda el espacio vacío.
   --------------------------------------------------------- */
function initShots() {
  CONFIG.capturas.forEach((shot, index) => {
    const figure = $('[data-shot="' + index + '"]');
    if (!figure || !isConfigured(shot.src)) return;
    tryImage(shot.src, (loaded) => {
      const img = document.createElement('img');
      img.src = shot.src;
      img.alt = shot.alt || 'Captura del prototipo de VISUE';
      img.loading = 'lazy';
      img.width = loaded.naturalWidth;
      img.height = loaded.naturalHeight;
      figure.replaceChildren(img);
    });
  });
}

/* ---------------------------------------------------------
   9. EQUIPO
   --------------------------------------------------------- */
function initTeam() {
  CONFIG.equipo.forEach((data, index) => {
    const card = $('[data-member="' + index + '"]');
    if (!card) return;
    const name = $('.member__name', card).textContent.trim();

    // Rol y descripción (si se completaron en CONFIG)
    const role = $('.member__role', card);
    const desc = $('.member__desc', card);
    if (isConfigured(data.rol))         { role.textContent = data.rol;         role.classList.remove('is-pending'); }
    if (isConfigured(data.descripcion)) { desc.textContent = data.descripcion; desc.classList.remove('is-pending'); }

    // Fotografía (solo si el archivo existe)
    if (isConfigured(data.foto)) {
      tryImage(data.foto, () => {
        const img = document.createElement('img');
        img.src = data.foto;
        img.alt = 'Fotografía de ' + name;
        img.loading = 'lazy';
        img.width = 148;
        img.height = 148;
        $('.member__photo', card).replaceChildren(img);
        const hint = $('.member__photo-hint', card);
        if (hint) hint.remove();
      });
    }

    // Enlace al portafolio
    const link = $('[data-portfolio]', card);
    const href = safeUrl(data.portafolio);
    if (href) {
      link.href = href;
    } else {
      // Sin enlace todavía: botón deshabilitado y aviso al tocarlo
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast('El portafolio de ' + name + ' aún no está configurado (script.js → CONFIG.equipo).');
      });
    }
  });
}

/* ---------------------------------------------------------
   10. INICIO
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initReveal();
  initPrototype();
  initVideo();
  initEssay();
  initShots();
  initTeam();
});
