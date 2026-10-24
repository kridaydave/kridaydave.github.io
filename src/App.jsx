import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import NowPage from "./pages/NowPage.jsx";
import Rants from "./pages/Rants.jsx";
import Favorites from "./pages/Favorites.jsx";
import Uses from "./pages/Uses.jsx";
import NotFound from "./pages/NotFound.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";

/**
 * URL -> page mapping. The site stays a multi-page app: every entry HTML file
 * keeps its original public URL (/blog.html, /posts/slug.html, ...), so this
 * resolver simply renders the page that matches the current path. Unknown
 * paths fall through to the 404 page (the Worker serves /404.html for asset
 * misses, exactly as before). This is intentionally *not* client-side routing:
 * navigation between pages is a real document load, like the static site.
 */
function resolvePage() {
  const path = window.location.pathname.replace(/\/+$/g, "") || "/";

  const postMatch = path.match(/^\/posts\/([^/]+?)(?:\.html)?$/);
  if (postMatch) return <ArticlePage type="post" slug={postMatch[1]} />;

  const projectMatch = path.match(/^\/projects\/([^/]+?)(?:\.html)?$/);
  if (projectMatch) return <ArticlePage type="project" slug={projectMatch[1]} />;

  switch (path) {
    case "/":
    case "/index.html":
      return <Home />;
    case "/blog.html":
      return <Blog />;
    case "/now.html":
      return <NowPage />;
    case "/rants.html":
      return <Rants />;
    case "/favorites.html":
      return <Favorites />;
    case "/uses.html":
      return <Uses />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  return resolvePage();
}