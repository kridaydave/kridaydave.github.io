export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    
    if (response.status === 404) {
      const notFoundUrl = new URL("/404.html", request.url);
      const notFoundRes = await env.ASSETS.fetch(notFoundUrl);
      return new Response(notFoundRes.body, {
        status: 404,
        headers: notFoundRes.headers,
      });
    }

    const newHeaders = new Headers(response.headers);
    const pathname = url.pathname;

    // Cache static assets (CSS, JS, images, fonts, icons) with stale-while-revalidate
    if (pathname.match(/\.(css|js|svg|png|jpg|jpeg|webp|woff2?|ico|xml|txt)$/i)) {
      newHeaders.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    } else {
      // HTML pages: fast must-revalidate so updates reflect immediately while edge delivers fast
      newHeaders.set("Cache-Control", "public, max-age=0, must-revalidate");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};

