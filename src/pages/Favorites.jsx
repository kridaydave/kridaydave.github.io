import Layout from "../components/Layout.jsx";

const STAR_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/* Each pick carries its own hover overlay: hand-drawn line art that stands in
   for the poster until you point at the card. */
const GAMES = [
  {
    poster: "god-of-war.webp",
    title: "God of War & Ragnarök",
    meta: "Santa Monica Studio · 2018 / 2022",
    status: "PEAK COMBAT",
    note: "Kratos and Atreus across the Norse realms. The Leviathan Axe throw and recall mechanic never gets old.",
  },
  {
    poster: "gtav.webp",
    title: "Grand Theft Auto V",
    meta: "Rockstar Games · 2013",
    status: "TIMELESS",
    note: "Over a decade later and Los Santos remains the benchmark for open-world sandbox design.",
  },
  {
    poster: "gtasa.webp",
    title: "Grand Theft Auto: San Andreas",
    meta: "Rockstar Games · 2004",
    status: "CLASSIC",
    note: "Grove Street, CJ, turf wars, and the greatest map variety on the PS2 generation. Peak open-world atmosphere.",
  },
  {
    poster: "cod-mw2.webp",
    title: "Call of Duty: Modern Warfare 2",
    meta: "Infinity Ward · 2009",
    status: "PEAK FPS",
    note: "The golden era of arcade FPS. Iconic campaign missions, Rust 1v1s, and the most memorable multiplayer lobbies in gaming history.",
  },
  {
    poster: "mk1.webp",
    title: "Mortal Kombat 1",
    meta: "NetherRealm Studios · 2023",
    status: "FIGHTING",
    note: "Fluid aerial combos, fresh Kameo fighter dynamics, and crisp visual presentation.",
  },
  {
    poster: "rdr2.webp",
    title: "Red Dead Redemption 2",
    meta: "Rockstar Games · 2018 · Open World Western",
    status: "GOAT",
    note: "Arthur Morgan's story and the insane level of detail set a standard nothing has topped.",
  },
];

const ANIME = [
  {
    poster: "jjk.webp",
    title: "Jujutsu Kaisen",
    meta: "MAPPA · 2020 · Dark Fantasy",
    note: "Cursed energy, domain expansions, and fight choreography that goes harder than it has any right to. Gojo alone carries seasons.",
    overlay: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1">
        {/* Cursed energy swirl */}
        <circle cx="60" cy="60" r="15" strokeDasharray="3 5" opacity="0.6" />
        <circle cx="60" cy="60" r="28" strokeDasharray="5 8" opacity="0.5" />
        <circle cx="60" cy="60" r="42" strokeDasharray="8 12" opacity="0.4" />
        <circle cx="60" cy="60" r="55" strokeDasharray="4 10" opacity="0.3" />
        <path d="M60 20 C75 35, 80 50, 60 60 C40 50, 45 35, 60 20Z" strokeWidth="0.8" opacity="0.5" />
        <path d="M100 60 C85 75, 70 80, 60 60 C70 40, 85 45, 100 60Z" strokeWidth="0.8" opacity="0.5" />
        <path d="M60 100 C45 85, 40 70, 60 60 C80 70, 75 85, 60 100Z" strokeWidth="0.8" opacity="0.5" />
        <path d="M20 60 C35 45, 50 40, 60 60 C50 80, 35 75, 20 60Z" strokeWidth="0.8" opacity="0.5" />
      </svg>
    ),
  },
  {
    poster: "naruto.webp",
    title: "Naruto",
    meta: "Studio Pierrot · 2002 · Shonen",
    note: "Pain arc, the Itachi reveal, Rock Lee dropping the weights. Skip the filler and this is one of the best stories ever told in anime.",
    overlay: (
      <svg xmlns="http://www.w3.org/2000/svg" width="140" height="120" viewBox="0 0 140 120" fill="none" stroke="currentColor" strokeWidth="1.2">
        {/* Kunai */}
        <g transform="translate(25, 20) rotate(35, 20, 40)">
          <path d="M20 10 L15 40 L20 38 L25 40 Z" opacity="0.6" />
          <line x1="20" y1="40" x2="20" y2="65" opacity="0.5" />
          <path d="M16 58 L20 65 L24 58" opacity="0.5" />
        </g>
        {/* Shuriken */}
        <g transform="translate(80, 35)" opacity="0.55">
          <path d="M20 8 L22 18 L30 12 L24 20 L32 22 L24 24 L30 32 L22 26 L20 36 L18 26 L10 32 L16 24 L8 22 L16 20 L10 12 L18 18 Z" />
          <circle cx="20" cy="22" r="3" />
        </g>
        {/* Small kunai */}
        <g transform="translate(50, 70) rotate(-20, 10, 20)" opacity="0.4">
          <path d="M10 5 L8 20 L10 19 L12 20 Z" />
          <line x1="10" y1="20" x2="10" y2="35" />
        </g>
      </svg>
    ),
  },
];

const SHOWS = [
  {
    poster: "the-boys.webp",
    title: "The Boys",
    meta: "Amazon Studios · 2019 · Superhero Satire",
    note: "What happens when superheroes are corporate products. Homelander is the best villain on TV right now and it is not close.",
    overlay: (
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Cracked V for Compound V */}
        <path d="M30 20 L50 80 L70 20" strokeWidth="3" opacity="0.6" />
        {/* Cracks */}
        <path d="M42 45 L35 50" opacity="0.4" strokeWidth="1" />
        <path d="M45 55 L40 62" opacity="0.35" strokeWidth="1" />
        <path d="M55 50 L62 48" opacity="0.4" strokeWidth="1" />
        <path d="M58 40 L65 35" opacity="0.3" strokeWidth="1" />
        <path d="M50 70 L47 75" opacity="0.3" strokeWidth="1" />
        {/* Splatter dots */}
        <circle cx="33" cy="52" r="2" fill="currentColor" opacity="0.25" />
        <circle cx="65" cy="33" r="1.5" fill="currentColor" opacity="0.2" />
        <circle cx="45" cy="76" r="1.5" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  {
    poster: "loki.webp",
    title: "Loki",
    meta: "Marvel Studios · 2021 · MCU",
    note: "The TVA, variants, and time branching. Season 2's ending where he becomes the god of stories hit different.",
    overlay: (
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Loki horns silhouette */}
        <path d="M50 75 L50 45 L35 15" strokeWidth="2" opacity="0.6" />
        <path d="M50 45 L65 15" strokeWidth="2" opacity="0.6" />
        {/* Curve on horns */}
        <path d="M35 15 C30 10, 28 15, 30 20" opacity="0.5" />
        <path d="M65 15 C70 10, 72 15, 70 20" opacity="0.5" />
        {/* TVA clock circle */}
        <circle cx="50" cy="58" r="14" strokeDasharray="3 3" opacity="0.35" />
        <line x1="50" y1="58" x2="50" y2="48" opacity="0.3" strokeWidth="1.5" />
        <line x1="50" y1="58" x2="57" y2="55" opacity="0.3" strokeWidth="1" />
      </svg>
    ),
  },
];

/** The two hero picks that get a full-width card instead of a poster tile. */
const GOATS = [
  {
    poster: "breaking-bad.webp",
    pill: "GOAT · CRIME DRAMA",
    title: "Breaking Bad + Better Call Saul",
    meta: "AMC · 2008 / 2015 · Crime Drama",
    quote:
      "Walter White's descent and Jimmy McGill's transformation. Two shows that are really one story, and the writing never dips once.",
  },
  {
    poster: "moon-knight.webp",
    pill: "FAVORITE · MCU",
    title: "Moon Knight",
    meta: "Marvel Studios · 2022 · MCU",
    quote:
      "Oscar Isaac playing two people in the same body. The Egyptian mythology and identity crisis made this the best Marvel show.",
  },
];

function Poster({ pick }) {
  return (
    <div className="media-poster-wrap">
      <img
        src={`assets/favorites/${pick.poster}`}
        alt={pick.title}
        className="media-poster"
        loading="lazy"
      />
      {pick.overlay && <div className="media-hover-overlay">{pick.overlay}</div>}
    </div>
  );
}

function MediaCard({ pick, typeLabel, typeClass, status }) {
  return (
    <article className="media-card">
      <Poster pick={pick} />
      <div className="media-card-body">
        {typeLabel && (
          <div className="media-card-top">
            <span className={`media-type-tag ${typeClass}`}>{typeLabel}</span>
            {status && <span className="media-status-tag">{status}</span>}
          </div>
        )}
        <h3 className="media-card-title">{pick.title}</h3>
        <p className="media-card-meta">{pick.meta}</p>
        <p className="media-card-note">{pick.note}</p>
      </div>
    </article>
  );
}

function GroupHeader({ title, count }) {
  return (
    <section className="section media-group-header">
      <h2 className="media-group-title">{title}</h2>
      <span className="media-group-count">{count}</span>
    </section>
  );
}

function GoatCard({ pick }) {
  return (
    <div className="goat-card">
      <div className="goat-media">
        <img
          src={`assets/favorites/${pick.poster}`}
          alt={pick.title}
          className="goat-img"
          loading="lazy"
        />
      </div>
      <div className="goat-info">
        <div className="goat-badge-row">
          <span className="goat-pill">
            {STAR_ICON}
            {pick.pill}
          </span>
          <span className="media-type-tag show-tag">TV SHOW</span>
        </div>
        <h2 className="goat-title">{pick.title}</h2>
        <p className="goat-meta">{pick.meta}</p>
        <p className="goat-quote">{pick.quote}</p>
      </div>
    </div>
  );
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function Favorites() {
  return (
    <Layout active="favorites">
      <section className="section favorites-header-section">
        <h1 className="section-title">Favorites</h1>
        <p className="favorites-desc">Shit i like.</p>
      </section>

      <div className="media-section">
        <GroupHeader title="Video Games" count={plural(GAMES.length, "Pick")} />
        <section className="section favorites-grid-section">
          <div className="media-grid">
            {GAMES.map((pick) => (
              <MediaCard
                key={pick.title}
                pick={pick}
                typeLabel="GAME"
                typeClass="game-tag"
                status={pick.status}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="media-section">
        <GroupHeader title="Anime" count={plural(ANIME.length, "Pick")} />
        <section className="section favorites-grid-section">
          <div className="media-grid">
            {ANIME.map((pick) => (
              <MediaCard key={pick.title} pick={pick} />
            ))}
          </div>
        </section>
      </div>

      <div className="media-section">
        <GroupHeader title="TV Shows" count={plural(SHOWS.length + GOATS.length, "Pick")} />
        {GOATS.map((pick) => (
          <section className="section goat-section" key={pick.title}>
            <GoatCard pick={pick} />
          </section>
        ))}
        <section className="section favorites-grid-section">
          <div className="media-grid">
            {SHOWS.map((pick) => (
              <MediaCard key={pick.title} pick={pick} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
