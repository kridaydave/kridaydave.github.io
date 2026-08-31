export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) {
      const notFoundUrl = new URL("/404.html", request.url);
      const notFoundRes = await env.ASSETS.fetch(notFoundUrl);
      return new Response(notFoundRes.body, {
        status: 404,
        headers: notFoundRes.headers,
      });
    }
    return response;
  },
};
