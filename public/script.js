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
    '.latest-note-card',
    '.timeline',
    '.writing-list',
    '.tech-filters',
    '.tech-grid',
    '.quote-section',
    '.cta-section',
    '.goat-card',
    '.media-grid',
    '.activity-graph-wrap',
    '.rants-list',
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

// --- Media Filters (Favorites Page) ---
function initMediaFilters() {
  const filterBtns = document.querySelectorAll('.media-filter-btn');
  const mediaSections = document.querySelectorAll('.media-section');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.mediaFilter;

      mediaSections.forEach(sec => {
        const cat = sec.dataset.mediaCategory;
        if (filter === 'all' || cat === filter) {
          sec.classList.remove('hidden');
        } else {
          sec.classList.add('hidden');
        }
      });
    });
  });
}

// --- Dynamic Year ---
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// --- Active Nav Link on Scroll ---
function initActiveNav() {
  const hashLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!hashLinks.length) return;

  function updateActiveNav() {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const isAtBottom = scrollPos + windowHeight >= docHeight - 80;

    let activeHash = '#top';

    if (isAtBottom) {
      activeHash = '#contact';
    } else {
      const aboutEl = document.querySelector('#about');
      const contactEl = document.querySelector('#contact');

      if (contactEl && scrollPos + 180 >= contactEl.offsetTop) {
        activeHash = '#contact';
      } else if (aboutEl && scrollPos + 180 >= aboutEl.offsetTop) {
        activeHash = '#about';
      } else {
        activeHash = '#top';
      }
    }

    hashLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === activeHash);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

// --- Live GitHub Stars ---
async function initGitHubStats() {
  const badgeEls = document.querySelectorAll('[data-repo]');
  if (!badgeEls.length) return;

  let repoCache = {};
  try {
    repoCache = JSON.parse(sessionStorage.getItem('gh_stars_cache') || '{}');
  } catch (e) {}

  for (const badge of badgeEls) {
    const repo = badge.dataset.repo;
    if (!repo) continue;

    const countEl = badge.querySelector('.star-count');
    if (!countEl) continue;

    if (repoCache[repo] !== undefined) {
      countEl.textContent = repoCache[repo];
      continue;
    }

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.stargazers_count === 'number') {
          const stars = data.stargazers_count;
          countEl.textContent = stars.toLocaleString();
          repoCache[repo] = stars.toLocaleString();
          try {
            sessionStorage.setItem('gh_stars_cache', JSON.stringify(repoCache));
          } catch (e) {}
        }
      }
    } catch (e) {}
  }
}

// --- Copy Command Snippets ---
function initCopyButtons() {
  document.querySelectorAll('.project-cmd').forEach(el => {
    el.addEventListener('click', async (e) => {
      e.stopPropagation();
      const text = el.dataset.copy || el.querySelector('code')?.textContent?.trim();
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      el.classList.add('copied');
      setTimeout(() => el.classList.remove('copied'), 1500);
    });
  });
}

// --- GitHub Activity Graph (Real GitHub Data) ---
async function initActivityGraph() {
  const grid = document.querySelector('.activity-grid');
  const tooltip = document.querySelector('.activity-tooltip');
  const wrap = document.querySelector('.activity-graph-wrap');
  const totalEl = document.querySelector('.activity-total-count');
  if (!grid || !tooltip || !wrap) return;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let data = null;

  try {
    const cached = sessionStorage.getItem('gh_contributions_kridaydave');
    if (cached) data = JSON.parse(cached);
  } catch (e) {}

  if (!data) {
    try {
      const res = await fetch('https://github-contributions-api.jogruber.de/v4/kridaydave?y=last');
      if (res.ok) {
        data = await res.json();
        try {
          sessionStorage.setItem('gh_contributions_kridaydave', JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Could not load live contributions, fallback will apply', err);
    }
  }

  const contributions = data?.contributions;
  if (!contributions || !contributions.length) return;

  if (totalEl && data.total?.lastYear !== undefined) {
    totalEl.textContent = Number(data.total.lastYear).toLocaleString();
  }

  const cellsFragment = document.createDocumentFragment();

  contributions.forEach(item => {
    const cell = document.createElement('div');
    cell.className = 'activity-cell';
    if (item.level > 0) cell.dataset.level = String(item.level);

    const d = new Date(item.date + 'T00:00:00');
    const formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    cell.dataset.date = formattedDate;
    cell.dataset.count = String(item.count);

    cell.addEventListener('mouseenter', () => {
      const c = item.count;
      tooltip.textContent = `${c === 0 ? 'No' : c} contribution${c === 1 ? '' : 's'} on ${formattedDate}`;
      
      const cellRect = cell.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      
      tooltip.style.left = `${cellRect.left - wrapRect.left + (cellRect.width / 2)}px`;
      tooltip.style.top = `${cellRect.top - wrapRect.top - 8}px`;
      tooltip.classList.add('visible');
    });

    cell.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });

    cellsFragment.appendChild(cell);
  });

  grid.innerHTML = '';
  grid.appendChild(cellsFragment);

  requestAnimationFrame(() => {
    wrap.scrollLeft = wrap.scrollWidth;
  });
}

// --- Reading Progress Indicator ---
function initReadingProgress() {
  const bar = document.querySelector('.reading-progress-bar');
  if (!bar) return;

  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) {
      bar.style.width = '0%';
      return;
    }
    const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
    bar.style.width = `${pct}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// --- Live IST Routine Clock ---
function initRoutineClock() {
  const timeEl = document.getElementById('ist-clock');
  const activityEl = document.getElementById('routine-activity');
  const dotEl = document.querySelector('.now-dot');
  if (!timeEl && !activityEl) return;

  function update() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(now);

    let hour = 0;
    let minute = 0;
    for (const part of parts) {
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    }
    if (hour === 24) hour = 0;

    const timeString = formatter.format(now);
    if (timeEl) {
      timeEl.textContent = `${timeString} IST`;
    }

    const currentMinutes = hour * 60 + minute;
    let activity = 'Building & shipping';
    let statusClass = 'status-code';

    // 00:00 - 08:00 (12 AM - 8 AM): Sleeping
    if (currentMinutes >= 0 && currentMinutes < 480) {
      activity = 'Sleeping / AFK';
      statusClass = 'status-sleep';
    }
    // 08:00 - 12:00 (8 AM - 12 PM): Morning prep & physics
    else if (currentMinutes >= 480 && currentMinutes < 720) {
      activity = 'Morning prep & problem solving';
      statusClass = 'status-study';
    }
    // 12:00 - 16:00 (12 PM - 4 PM): In classes
    else if (currentMinutes >= 720 && currentMinutes < 960) {
      activity = 'In classes';
      statusClass = 'status-class';
    }
    // 16:00 - 17:00 (4 PM - 5 PM): Break
    else if (currentMinutes >= 960 && currentMinutes < 1020) {
      activity = 'Break & reset';
      statusClass = 'status-break';
    }
    // 17:00 - 20:00 (5 PM - 8 PM): JEE study grind
    else if (currentMinutes >= 1020 && currentMinutes < 1200) {
      activity = 'Studying (JEE prep)';
      statusClass = 'status-study';
    }
    // 20:00 - 21:00 (8 PM - 9 PM): Dinner & break
    else if (currentMinutes >= 1200 && currentMinutes < 1260) {
      activity = 'Dinner & break';
      statusClass = 'status-break';
    }
    // 21:00 - 24:00 (9 PM - 12 AM): Coding & shipping tools
    else {
      activity = 'Hacking & shipping agent tooling';
      statusClass = 'status-code';
    }

    if (activityEl) {
      activityEl.textContent = activity;
    }

    if (dotEl) {
      dotEl.className = `now-dot ${statusClass}`;
    }
  }

  update();
  setInterval(update, 1000);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  tagRevealElements();
  initStaggeredReveals();
  initCharReveal();
  initScrollReveal();
  initTypewriter();
  initTechFilters();
  initMediaFilters();
  initActiveNav();
  initGitHubStats();
  initCopyButtons();
  initActivityGraph();
  initReadingProgress();
  initRoutineClock();
});

