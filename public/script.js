/* ============================================
   Kriday Dave · Portfolio Interactions
   Clean, performant, zero-bloat.
   ============================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Banner Video ---
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

// --- Subtitle Character Reveal ---
function initCharReveal() {
  const el = document.querySelector('.char-reveal');
  if (!el) return;

  const text = el.dataset.text || 'Student · Founder · Builder';
  el.innerHTML = '';

  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.transitionDelay = `${i * 35}ms`;
    el.appendChild(span);
  });

  if (prefersReducedMotion) {
    el.classList.add('revealed');
  } else {
    setTimeout(() => el.classList.add('revealed'), 300);
  }
}

// --- Scroll Reveal ---
function initScrollReveal() {
  const groups = [
    '.about-content', '.contact-grid', '.projects-grid', '.latest-note-card',
    '.timeline', '.writing-list', '.tech-filters', '.tech-grid',
    '.quote-section', '.cta-section', '.goat-card', '.media-grid',
    '.activity-graph-wrap', '.rants-list'
  ];

  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.dataset.delay = String(Math.min(i, 2));
    });
  });

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
    { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Tech Stack Filters ---
function initTechFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const techItems = document.querySelectorAll('.tech-item');
  if (!filterBtns.length) return;

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

// --- Active Nav Link on Scroll ---
function initActiveNav() {
  const hashLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!hashLinks.length) return;

  function updateActiveNav() {
    const scrollPos = window.scrollY;
    const isAtBottom = scrollPos + window.innerHeight >= document.documentElement.scrollHeight - 80;
    let activeHash = '#top';

    if (isAtBottom) {
      activeHash = '#contact';
    } else {
      const contactEl = document.querySelector('#contact');
      const aboutEl = document.querySelector('#about');
      if (contactEl && scrollPos + 180 >= contactEl.offsetTop) {
        activeHash = '#contact';
      } else if (aboutEl && scrollPos + 180 >= aboutEl.offsetTop) {
        activeHash = '#about';
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
          const stars = data.stargazers_count.toLocaleString();
          countEl.textContent = stars;
          repoCache[repo] = stars;
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

// --- GitHub Activity Graph (Resilient & Non-blocking) ---
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch('https://github-contributions-api.jogruber.de/v4/kridaydave?y=last', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        data = await res.json();
        try {
          sessionStorage.setItem('gh_contributions_kridaydave', JSON.stringify(data));
        } catch (e) {}
      }
    } catch (err) {
      // Fallback cleanly if offline or third-party API is slow
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

// --- Live IST Routine Activity ---
function getISTRoutine(hour, minute) {
  const mins = hour * 60 + minute;
  // 12 AM - 8 AM: Sleeping
  if (mins < 480) return { activity: 'Sleeping / AFK', statusClass: 'status-sleep' };
  // 8 AM - 12 PM: Morning prep & physics
  if (mins < 720) return { activity: 'Morning prep & problem solving', statusClass: 'status-study' };
  // 12 PM - 4 PM: Classes
  if (mins < 960) return { activity: 'In classes', statusClass: 'status-class' };
  // 4 PM - 5 PM: Break
  if (mins < 1020) return { activity: 'Break & reset', statusClass: 'status-break' };
  // 5 PM - 8 PM: JEE prep
  if (mins < 1200) return { activity: 'Studying (JEE prep)', statusClass: 'status-study' };
  // 8 PM - 9 PM: Dinner
  if (mins < 1260) return { activity: 'Dinner & break', statusClass: 'status-break' };
  // 9 PM - 12 AM: Hacking & shipping
  return { activity: 'Hacking & shipping agent tooling', statusClass: 'status-code' };
}

function initRoutineClock() {
  const timeEl = document.getElementById('ist-clock');
  const activityEl = document.getElementById('routine-activity');
  const dotEl = document.querySelector('.now-dot');
  if (!timeEl && !activityEl) return;

  function update() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(now);

    let h = 0, m = 0;
    for (const part of parts) {
      if (part.type === 'hour') h = parseInt(part.value, 10);
      if (part.type === 'minute') m = parseInt(part.value, 10);
    }
    if (h === 24) h = 0;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    if (timeEl) timeEl.textContent = `${formatter.format(now)} IST`;

    const { activity, statusClass } = getISTRoutine(h, m);
    if (activityEl) activityEl.textContent = activity;
    if (dotEl) dotEl.className = `now-dot ${statusClass}`;
  }

  update();
  setInterval(update, 1000);
}

// --- Now Page: Analog Wall Clock ---
function initWallClock() {
  const hourHand = document.getElementById('now-hand-hour');
  const minuteHand = document.getElementById('now-hand-minute');
  const secondHand = document.getElementById('now-hand-second');
  const digitalEl = document.getElementById('now-digital-time');
  const activityEl = document.getElementById('now-activity-text');
  const dotEl = document.getElementById('now-dot');

  if (!hourHand || !minuteHand || !secondHand) return;

  function update() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(now);

    let h = 0, m = 0, s = 0;
    for (const part of parts) {
      if (part.type === 'hour') h = parseInt(part.value, 10);
      if (part.type === 'minute') m = parseInt(part.value, 10);
      if (part.type === 'second') s = parseInt(part.value, 10);
    }
    if (h === 24) h = 0;

    const hourDeg = (h % 12) * 30 + m * 0.5;
    const minuteDeg = m * 6 + s * 0.1;
    const secondDeg = s * 6;

    hourHand.setAttribute('transform', `rotate(${hourDeg}, 110, 110)`);
    minuteHand.setAttribute('transform', `rotate(${minuteDeg}, 110, 110)`);
    secondHand.setAttribute('transform', `rotate(${secondDeg}, 110, 110)`);

    if (digitalEl) {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      digitalEl.textContent = `${formatter.format(now)} IST`;
    }

    if (activityEl) {
      const { activity, statusClass } = getISTRoutine(h, m);
      activityEl.textContent = activity;
      if (dotEl) dotEl.className = `now-dot ${statusClass}`;
    }
  }

  update();
  setInterval(update, 1000);
}

// --- Instant Search & Filter (Blog & Rants) ---
function initListSearch(config) {
  const searchInput = document.getElementById(config.inputId);
  const tagBtns = document.querySelectorAll(config.tagSelector);
  const items = document.querySelectorAll(config.itemSelector);
  const emptyState = document.getElementById(config.emptyStateId);
  if (!items.length) return;

  let currentTag = 'all';
  let searchQuery = '';

  function filter() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    items.forEach(item => {
      const tags = (item.dataset.tags || '').toLowerCase();
      const text = (item.textContent || '').toLowerCase();

      const matchesTag = currentTag === 'all' || tags.includes(currentTag);
      const matchesSearch = !query || text.includes(query);

      if (matchesTag && matchesSearch) {
        item.classList.remove('hidden');
        item.style.display = '';
        visibleCount++;
      } else {
        item.classList.add('hidden');
        item.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      emptyState.classList.toggle('hidden', visibleCount > 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filter();
    });
  }

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTag = (btn.dataset.blogTag || btn.dataset.rantTag || 'all').toLowerCase();
      filter();
    });
  });
}

// --- Post Utilities (Read Time & Clipboard Actions) ---
function initPostUtilities() {
  const postBody = document.querySelector('.post-body');
  const readTimeEl = document.querySelector('.post-read-time');
  if (postBody && readTimeEl) {
    const text = postBody.innerText || '';
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    readTimeEl.textContent = `${minutes} min read`;
  }

  document.querySelectorAll('.post-action-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const action = btn.dataset.action;
      const labelSpan = btn.querySelector('span');
      const originalText = labelSpan ? labelSpan.textContent : '';

      try {
        if (action === 'copy-link') {
          await navigator.clipboard.writeText(window.location.href);
        } else if (action === 'copy-markdown') {
          const title = document.querySelector('.post-title')?.textContent?.trim() || '';
          const bodyText = postBody ? postBody.innerText.trim() : '';
          const content = `# ${title}\n\n${window.location.href}\n\n${bodyText}`;
          await navigator.clipboard.writeText(content);
        }
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = action === 'copy-link' ? window.location.href : (postBody ? postBody.innerText : '');
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      btn.classList.add('copied');
      if (labelSpan) labelSpan.textContent = 'Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (labelSpan) labelSpan.textContent = originalText;
      }, 1600);
    });
  });
}

// --- Instant Prefetch on Hover / Touch ---
function initPrefetch() {
  const prefetched = new Set();

  function prefetchUrl(url) {
    if (!url || prefetched.has(url)) return;
    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.origin !== window.location.origin) return;
      if (parsed.pathname === window.location.pathname) return;

      prefetched.add(url);
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = parsed.href;
      link.as = 'document';
      document.head.appendChild(link);
    } catch (e) {}
  }

  document.addEventListener('pointerenter', (e) => {
    const anchor = e.target.closest('a');
    if (anchor && anchor.href && !anchor.target) {
      prefetchUrl(anchor.href);
    }
  }, { passive: true, capture: true });

  document.addEventListener('touchstart', (e) => {
    const anchor = e.target.closest('a');
    if (anchor && anchor.href && !anchor.target) {
      prefetchUrl(anchor.href);
    }
  }, { passive: true, capture: true });
}

// --- GitHub Recent Activity (live) ---
async function initGitHubActivity() {
  const wrap = document.getElementById('github-activity');
  const textEl = document.getElementById('github-activity-text');
  if (!wrap || !textEl) return;

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  try {
    const cached = sessionStorage.getItem('gh_activity_kridaydave');
    let event = cached ? JSON.parse(cached) : null;
    let fromCache = !!event;

    if (!event) {
      const res = await fetch('https://api.github.com/users/kridaydave/events/public?per_page=10');
      if (!res.ok) throw new Error('gh api failed');
      const events = await res.json();
      event = events.find(e => e.type === 'PushEvent') || events[0];
      if (event) {
        try { sessionStorage.setItem('gh_activity_kridaydave', JSON.stringify(event)); } catch(e) {}
        // expire after 10 mins via timestamp
        try { sessionStorage.setItem('gh_activity_ts', String(Date.now())); } catch(e) {}
      }
    } else {
      const ts = Number(sessionStorage.getItem('gh_activity_ts') || 0);
      if (Date.now() - ts > 10 * 60 * 1000) {
        sessionStorage.removeItem('gh_activity_kridaydave');
        sessionStorage.removeItem('gh_activity_ts');
      }
    }

    if (!event) return;
    const repo = event.repo ? event.repo.name.replace('kridaydave/', '').replace('Epoch-AI-Lab/', '') : 'github';
    const ago = timeAgo(event.created_at);
    const msg = event.payload && event.payload.commits && event.payload.commits[0] ? event.payload.commits[0].message.split('\n')[0].slice(0, 60) : event.type.replace('Event','');
    textEl.textContent = `Last push: ${repo} · ${ago} · ${msg}`;
    wrap.style.display = 'inline-flex';
  } catch (e) {
    // silent fail
  }
}

// --- Dynamic Year ---
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCharReveal();
  initTechFilters();
  initMediaFilters();
  initListSearch({ inputId: 'blog-search', tagSelector: '[data-blog-tag]', itemSelector: '.blog-list .writing-item', emptyStateId: 'blog-empty-state' });
  initListSearch({ inputId: 'rants-search', tagSelector: '[data-rant-tag]', itemSelector: '.rants-list .rant-card', emptyStateId: 'rants-empty-state' });
  initPostUtilities();
  initPrefetch();
  initActiveNav();
  initGitHubStats();
  initCopyButtons();
  initActivityGraph();
  initReadingProgress();
  initRoutineClock();
  initWallClock();
  initGitHubActivity();
});
