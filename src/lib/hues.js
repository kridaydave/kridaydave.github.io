/* Per-tag planet hues, shared by the blog index and article pages: the
   last (most specific) tag token names the body's colour. */
export const TAG_HUES = {
  dev: "#7aa2ff",
  cuda: "#ffb54d",
  release: "#7bd88f",
  architecture: "#b07cff",
  governance: "#ff7ab8",
  blueline: "#5fd4d0",
};

export const hueFor = (tags) =>
  TAG_HUES[tags.split(" ").filter(Boolean).at(-1)] ?? "#7aa2ff";

/* Machine tags per article slug — the content files only carry display
   tag strings, so the index maps slugs back to their tag tokens. */
export const SLUG_TAGS = {
  "em-dashes-suck": "dev",
  "t4-cuda-update-01": "cuda",
  "v5-0-0-is-live": "dev release",
  "simplicity-is-the-new-sophistication": "dev architecture",
  "multi-agent-git-chaos": "oot governance",
  "blueline-v0-2-0": "blueline",
};
