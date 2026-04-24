const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${(index % 4) * 70}ms`;
  revealObserver.observe(element);
});

const portraitFrame = document.getElementById("portraitFrame");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (portraitFrame && !reduceMotion.matches) {
  portraitFrame.addEventListener("mousemove", (event) => {
    const rect = portraitFrame.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = offsetX * 6;
    const rotateX = offsetY * -6;
    const moveX = offsetX * 10;
    const moveY = offsetY * 8;

    portraitFrame.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${moveX}px, ${moveY * -0.3}px, 0)`;
  });

  portraitFrame.addEventListener("mouseleave", () => {
    portraitFrame.style.transform = "";
  });
}

const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if (contactForm && formMsg) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMsg.textContent = "Message sent. I will get back to you soon.";
    formMsg.style.color = "var(--accent)";
    contactForm.reset();
    window.setTimeout(() => {
      formMsg.textContent = "";
    }, 5000);
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLinks = document.querySelectorAll(`[data-nav-link][href="#${entry.target.id}"]`);
      activeLinks.forEach((link) => link.classList.add("active"));
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("navLinks");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
