import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

const page = (p) => resolve(import.meta.dirname, p);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": page("src") },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: page("index.html"),
        "404": page("404.html"),
        blog: page("blog.html"),
        favorites: page("favorites.html"),
        "posts/em-dashes-suck": page("posts/em-dashes-suck.html"),
        "posts/t4-cuda-update-01": page("posts/t4-cuda-update-01.html"),
        "posts/v5-0-0-is-live": page("posts/v5-0-0-is-live.html"),
        "posts/simplicity-is-the-new-sophistication":
          page("posts/simplicity-is-the-new-sophistication.html"),
        "posts/multi-agent-git-chaos": page("posts/multi-agent-git-chaos.html"),
        "posts/blueline-v0-2-0": page("posts/blueline-v0-2-0.html"),
        "projects/blueline": page("projects/blueline.html"),
        "projects/oot": page("projects/oot.html"),
        "projects/file-organizer-mcp": page("projects/file-organizer-mcp.html"),
      },
    },
  },
});