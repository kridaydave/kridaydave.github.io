/* ============================================
   Portfolio Interactions
   ============================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Banner Video (respect reduced motion) ---
const bannerVideo = document.querySelector('.banner-video');
if (bannerVideo) {
  if (prefersReducedMotion) {
    bannerVideo.pause();
    bannerVideo.removeAttribute('src');
  } else {
    bannerVideo.play().catch(() => {});
  }
}

// --- Theme Toggle ---
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

function setTheme(dark) {
  if (dark) {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(!html.classList.contains('dark'));
  });
}

// --- Mobile Menu ---
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- Character Reveal Animation ---
function initCharReveal() {
  const el = document.querySelector('.char-reveal');
  if (!el) return;

  const text = el.dataset.text || 'Student · Founder · Builder';
  el.innerHTML = '';

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.transitionDelay = `${i * 40}ms`;
    el.appendChild(span);
  });

  if (prefersReducedMotion) {
    el.classList.add('revealed');
  } else {
    setTimeout(() => el.classList.add('revealed'), 400);
  }
}

// --- Scroll Reveal ---
function initScrollReveal() {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -4% 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Tag elements for reveal
function tagRevealElements() {
  const groups = [
    '.about-content',
    '.contact-grid',
    '.projects-grid',
    '.timeline',
    '.writing-list',
    '.tech-filters',
    '.tech-grid',
    '.quote-section',
    '.cta-section',
    '.contact-form',
  ];

  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.dataset.delay = String(Math.min(i, 2));
    });
  });
}

// --- Post & List Choreography ---
function initStaggeredReveals() {
  const postEls = document.querySelectorAll('.post-header, .post-body > *');
  postEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 60, 360)}ms`;
  });

  document.querySelectorAll('.blog-list .writing-item').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
  });
}

// --- Terminal Typewriter ---
const TYPE_CHARS_PER_FRAME = 3;

function typeBlock(code) {
  const full = code.dataset.fullText;
  const cursor = document.createElement('span');
  cursor.className = 'code-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  let i = 0;

  function step() {
    if (i >= full.length) {
      setTimeout(() => cursor.remove(), 1400);
      return;
    }
    i = Math.min(full.length, i + TYPE_CHARS_PER_FRAME);
    code.textContent = full.slice(0, i);
    code.appendChild(cursor);
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initTypewriter() {
  const pres = document.querySelectorAll('.post-body pre');
  if (!pres.length) return;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  pres.forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) return;
    pre.style.minHeight = `${pre.offsetHeight}px`;
    code.dataset.fullText = code.textContent;
    code.textContent = '';
    pre.classList.add('code-terminal');
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        typeBlock(entry.target.querySelector('code'));
      });
    },
    { threshold: 0.35 }
  );

  pres.forEach(pre => observer.observe(pre));
}

// --- Tech Stack Filters ---
function initTechFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const techItems = document.querySelectorAll('.tech-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      techItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

// --- Contact Form ---
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (window.location.protocol === 'file:') {
      formStatus.className = 'error';
      formStatus.textContent = 'The contact form works after deployment or through the local Cloudflare server.';
      return;
    }

    const submitButton = contactForm.querySelector('.submit-btn');
    submitButton.disabled = true;
    formStatus.className = '';
    formStatus.textContent = 'Sending...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Message could not be sent.');
      formStatus.textContent = 'Message received. Thank you.';
      contactForm.reset();
    } catch (error) {
      formStatus.className = 'error';
      formStatus.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
}

// --- Dynamic Year ---
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// --- Active Nav Link on Scroll ---
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-48px 0px -50% 0px' }
  );

  sections.forEach(section => observer.observe(section));
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  tagRevealElements();
  initStaggeredReveals();
  initCharReveal();
  initScrollReveal();
  initTypewriter();
  initTechFilters();
  initActiveNav();
});
