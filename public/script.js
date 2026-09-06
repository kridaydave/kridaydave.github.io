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

// --- Tech Stack Filters (removed - no filtering needed for ~7 items) ---
function initTechFilters() {}

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

// --- Live GitHub Stats & Releases (cached at worker edge) ---
async function initGitHubStats() {
  const badgeEls = document.querySelectorAll('.github-badge[data-repo]');
  const releaseEls = document.querySelectorAll('.release-badge[data-repo]');
  if (!badgeEls.length && !releaseEls.length) return;

  let statsData = null;
  try {
    const cached = sessionStorage.getItem('gh_stats_v2');
    if (cached) statsData = JSON.parse(cached);
  } catch (e) {}

  if (!statsData) {
    try {
      const res = await fetch('/api/github-stats');
      if (res.ok) {
        statsData = await res.json();
        try { sessionStorage.setItem('gh_stats_v2', JSON.stringify(statsData)); } catch (e) {}
      }
    } catch (e) {}
  }

  // Update star badges
  badgeEls.forEach(badge => {
    const repo = badge.dataset.repo;
    const countEl = badge.querySelector('.star-count');
    if (!repo || !countEl) return;

    if (statsData && statsData[repo] && typeof statsData[repo].stars === 'number') {
      const n = statsData[repo].stars;
      if (n < 10) {
        badge.style.display = 'none';
      } else {
        countEl.textContent = n.toLocaleString();
        badge.style.display = '';
      }
    }
  });

  // Update release badges
  releaseEls.forEach(badge => {
    const repo = badge.dataset.repo;
    const tagEl = badge.querySelector('.release-tag');
    if (!repo || !tagEl) return;

    if (statsData && statsData[repo] && statsData[repo].release) {
      tagEl.textContent = statsData[repo].release;
      if (statsData[repo].releaseUrl) {
        badge.href = statsData[repo].releaseUrl;
      }
      badge.innerHTML = `<span class="release-dot"></span> <span class="release-tag">${statsData[repo].release}</span>`;
      badge.style.display = 'inline-flex';
    }
  });
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

// --- GitHub Activity Graph (cached longer, fails gracefully) ---
async function initActivityGraph() {
  const grid = document.querySelector('.activity-grid');
  const tooltip = document.querySelector('.activity-tooltip');
  const wrap = document.querySelector('.activity-graph-wrap');
  const totalEl = document.querySelector('.activity-total-count');
  if (!grid || !tooltip || !wrap) return;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let data = null;

  try {
    const raw = localStorage.getItem('gh_contributions_kridaydave');
    const ts = Number(localStorage.getItem('gh_contributions_ts') || 0);
    // cache 24h, not per session
    if (raw && Date.now() - ts < 24 * 60 * 60 * 1000) data = JSON.parse(raw);
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
          localStorage.setItem('gh_contributions_kridaydave', JSON.stringify(data));
          localStorage.setItem('gh_contributions_ts', String(Date.now()));
        } catch (e) {}
      }
    } catch (err) {}
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

    const showTooltip = () => {
      const c = item.count;
      tooltip.textContent = `${c === 0 ? 'No' : c} contribution${c === 1 ? '' : 's'} on ${formattedDate}`;
      const cellRect = cell.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      // left is relative to the wrap's content box, which shifts with horizontal scroll
      tooltip.style.left = `${cellRect.left - wrapRect.left + wrap.scrollLeft + (cellRect.width / 2)}px`;
      tooltip.style.top = `${cellRect.top - wrapRect.top - 8}px`;
      tooltip.classList.add('visible');
    };
    const hideTooltip = () => {
      tooltip.classList.remove('visible');
    };

    cell.addEventListener('mouseenter', showTooltip);
    cell.addEventListener('mouseleave', hideTooltip);
    // Touch: tap toggles the tooltip, tapping elsewhere dismisses it
    cell.addEventListener('click', (e) => {
      e.stopPropagation();
      showTooltip();
    });

    cellsFragment.appendChild(cell);
  });

  grid.innerHTML = '';
  grid.appendChild(cellsFragment);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.activity-cell')) tooltip.classList.remove('visible');
  });
  wrap.addEventListener('scroll', () => {
    tooltip.classList.remove('visible');
  }, { passive: true });

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

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function highlightTokens(text, tokens) {
    if (!tokens || !tokens.length || !text) return text;
    const pattern = new RegExp(`(${tokens.map(escapeRegex).join('|')})`, 'gi');
    return text.replace(pattern, '<mark class="search-highlight">$1</mark>');
  }

  function getMatchSnippet(lines, fallbackText, tokens) {
    if (!tokens || !tokens.length) return fallbackText;

    let matchedLine = '';
    if (lines && lines.length) {
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (tokens.some(t => lower.includes(t))) {
          matchedLine = line;
          break;
        }
      }
    }

    const target = matchedLine || fallbackText || '';
    if (!target) return '';

    const lower = target.toLowerCase();
    let firstIdx = -1;
    let matchLen = 0;
    for (const t of tokens) {
      const idx = lower.indexOf(t);
      if (idx !== -1 && (firstIdx === -1 || idx < firstIdx)) {
        firstIdx = idx;
        matchLen = t.length;
      }
    }

    if (firstIdx === -1) return target;

    // Window around match
    const start = Math.max(0, firstIdx - 50);
    const end = Math.min(target.length, firstIdx + matchLen + 75);
    let snippet = target.slice(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < target.length) snippet = snippet + '...';

    return snippet;
  }

  // Preload & index lines for search
  items.forEach(item => {
    const titleEl = item.querySelector('.writing-title, .rant-title');
    const excerptEl = item.querySelector('.writing-excerpt');
    const bodyEl = item.querySelector('.rant-body');

    item._titleEl = titleEl;
    item._excerptEl = excerptEl;
    item._bodyEl = bodyEl;

    item._originalTitle = titleEl ? titleEl.textContent : '';
    item._originalExcerpt = excerptEl ? excerptEl.textContent : (item.dataset.excerpt || '');
    item._originalParagraphs = bodyEl ? Array.from(bodyEl.querySelectorAll('p')).map(p => p.textContent) : [];

    item._contentLines = [];
    if (item._originalParagraphs.length) {
      item._contentLines = [...item._originalParagraphs];
    }

    const link = item.tagName === 'A' ? item : item.querySelector('a');
    if (link && link.href) {
      fetch(link.href)
        .then(res => res.ok ? res.text() : '')
        .then(html => {
          if (!html) return;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const postBody = doc.querySelector('.post-body');
          if (postBody) {
            item._contentLines = Array.from(postBody.querySelectorAll('p, h2, li'))
              .map(el => el.textContent.trim())
              .filter(Boolean);
            item.dataset.fullContent = item._contentLines.join(' ').toLowerCase();
          } else {
            item.dataset.fullContent = doc.body.textContent.toLowerCase();
          }
          if (searchQuery.trim()) {
            filter();
          }
        })
        .catch(() => {});
    }
  });

  function filter() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();
    const queryTokens = query ? query.split(/\s+/).filter(Boolean) : [];

    items.forEach(item => {
      const tags = (item.dataset.tags || '').toLowerCase();
      const text = (item.textContent || '').toLowerCase();
      const fullContent = item.dataset.fullContent || '';
      const haystack = tags + ' ' + text + ' ' + fullContent;

      const matchesTag = currentTag === 'all' || tags.includes(currentTag);
      const matchesSearch = queryTokens.length === 0 || queryTokens.every(token => haystack.includes(token));

      if (matchesTag && matchesSearch) {
        item.classList.remove('hidden');
        item.style.display = '';
        visibleCount++;

        if (queryTokens.length > 0) {
          // Highlight title
          if (item._titleEl) {
            item._titleEl.innerHTML = highlightTokens(escapeHtml(item._originalTitle), queryTokens);
          }
          // Highlight excerpt / show matching line
          if (item._excerptEl) {
            const snippet = getMatchSnippet(item._contentLines, item._originalExcerpt, queryTokens);
            item._excerptEl.innerHTML = highlightTokens(escapeHtml(snippet), queryTokens);
          }
          // Highlight paragraphs for rants
          if (item._bodyEl && item._originalParagraphs.length) {
            const pEls = item._bodyEl.querySelectorAll('p');
            pEls.forEach((p, idx) => {
              const orig = item._originalParagraphs[idx] || p.textContent;
              p.innerHTML = highlightTokens(escapeHtml(orig), queryTokens);
            });
          }
        } else {
          // Restore original state
          if (item._titleEl) item._titleEl.textContent = item._originalTitle;
          if (item._excerptEl) item._excerptEl.textContent = item._originalExcerpt;
          if (item._bodyEl && item._originalParagraphs.length) {
            const pEls = item._bodyEl.querySelectorAll('p');
            pEls.forEach((p, idx) => {
              p.textContent = item._originalParagraphs[idx] || p.textContent;
            });
          }
        }
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
      if (!action) return;
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

// --- GitHub Recent Activity (removed - duplicate with activity graph) ---
async function initGitHubActivity() {}

// --- Dynamic Latest Essay (auto-syncs from RSS feed) ---
async function initLatestEssay() {
  const card = document.querySelector('.latest-note-card');
  if (!card) return;

  try {
    const res = await fetch('/rss.xml');
    if (!res.ok) return;
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const firstItem = xml.querySelector('channel > item');
    if (!firstItem) return;

    const title = firstItem.querySelector('title')?.textContent?.trim();
    const link = firstItem.querySelector('link')?.textContent?.trim();
    const desc = firstItem.querySelector('description')?.textContent?.trim();
    const pubDateStr = firstItem.querySelector('pubDate')?.textContent?.trim();

    if (!title || !link) return;

    const dateEl = card.querySelector('.latest-note-date');
    const linkEl = card.querySelector('.latest-note-link');
    const titleEl = card.querySelector('.latest-note-title');
    const excerptEl = card.querySelector('.latest-note-excerpt');

    if (pubDateStr && dateEl) {
      const d = new Date(pubDateStr);
      if (!isNaN(d.getTime())) {
        dateEl.textContent = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      }
    }

    if (linkEl) {
      try {
        const url = new URL(link, window.location.origin);
        linkEl.href = url.pathname.replace(/^\//, '');
      } catch (_) {
        linkEl.href = link;
      }
    }

    if (titleEl) titleEl.textContent = title;
    if (excerptEl && desc) excerptEl.textContent = desc;
  } catch (_) {}
}

// --- Dynamic Year + Now Updated ---
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
const nowUpdatedEl = document.getElementById('now-updated');
if (nowUpdatedEl) {
  const d = new Date();
  nowUpdatedEl.textContent = `Last updated: ${d.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
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
  initLatestEssay();
  initCopyButtons();
  initActivityGraph();
  initReadingProgress();
  initRoutineClock();
  initWallClock();
  initGitHubActivity();
});



