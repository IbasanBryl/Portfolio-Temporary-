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
    const rotateY = offsetX * 7;
    const rotateX = offsetY * -7;
    const moveX = offsetX * 10;
    const moveY = offsetY * 10;

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
const navLinks = document.querySelectorAll(".nav-links a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => navObserver.observe(section));
