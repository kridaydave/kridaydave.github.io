const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#site-nav");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const revealGroups = [
  [".manifesto .label", ".manifesto blockquote", ".manifesto-note"],
  [".section-heading .label", ".section-heading h2"],
  [".featured-project"],
  [".project-row"],
  [".now > *"],
  [".contact-intro", "#contact-form"],
  ["footer > *"],
];

revealGroups.forEach((selectors) => {
  selectors.forEach((selector, selectorIndex) => {
    document.querySelectorAll(selector).forEach((element, elementIndex) => {
      element.classList.add("reveal");
      element.dataset.delay = String(Math.min(selectorIndex + elementIndex, 2));
    });
  });
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
  );
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

const projectVisual = document.querySelector(".project-visual");
if (projectVisual && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  projectVisual.addEventListener("pointermove", (event) => {
    const bounds = projectVisual.getBoundingClientRect();
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
    projectVisual.style.setProperty("--mx", `${offsetX}px`);
    projectVisual.style.setProperty("--my", `${offsetY}px`);
  });
  projectVisual.addEventListener("pointerleave", () => {
    projectVisual.style.setProperty("--mx", "0px");
    projectVisual.style.setProperty("--my", "0px");
  });
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (window.location.protocol === "file:") {
    formStatus.className = "error";
    formStatus.textContent = "The contact form works after deployment or through the local Cloudflare server.";
    return;
  }
  const submitButton = contactForm.querySelector("button");
  submitButton.disabled = true;
  formStatus.className = "";
  formStatus.textContent = "Sending...";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Message could not be sent.");
    formStatus.textContent = "Message received. Thank you.";
    contactForm.reset();
  } catch (error) {
    formStatus.className = "error";
    formStatus.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
