import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Favorites from "./pages/Favorites.jsx";
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
  // Workers Assets redirects /blog.html to the pretty /blog, so both forms
  // must resolve to the same page or the pretty URL lands on the 404.
  const path =
    window.location.pathname.replace(/\/+$/g, "").replace(/\.html$/, "") || "/";

  const postMatch = path.match(/^\/posts\/([^/]+?)$/);
  if (postMatch) return <ArticlePage type="post" slug={postMatch[1]} />;

  const projectMatch = path.match(/^\/projects\/([^/]+?)$/);
  if (projectMatch) return <ArticlePage type="project" slug={projectMatch[1]} />;

  switch (path) {
    case "/":
    case "/index":
      return <Home />;
    case "/blog":
      return <Blog />;
    case "/favorites":
      return <Favorites />;
    default:
      return <NotFound />;
  }
}

export default function App() {
  return resolvePage();
}