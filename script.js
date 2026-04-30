const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const getSavedTheme = () => {
  try {
    return window.localStorage.getItem("portfolio-theme");
  } catch (error) {
    return null;
  }
};
const saveTheme = (theme) => {
  try {
    window.localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    // Theme still changes for the current page if storage is unavailable.
  }
};
const savedTheme = getSavedTheme();
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
const initialTheme = savedTheme || (prefersLight ? "light" : "dark");

document.documentElement.dataset.theme = initialTheme;

const updateThemeButton = () => {
  if (!themeToggle) {
    return;
  }

  const currentTheme = document.documentElement.dataset.theme || "dark";
  themeToggle.textContent = currentTheme === "light" ? "Dark" : "Light";
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${currentTheme === "light" ? "dark" : "light"} theme`
  );

  if (themeMeta) {
    themeMeta.setAttribute("content", currentTheme === "light" ? "#f7f8fa" : "#050505");
  }
};

updateThemeButton();

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme || "dark";
  const nextTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  saveTheme(nextTheme);
  updateThemeButton();
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
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
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

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

const stagePhoto = document.querySelector(".stage-photo");
const stagePhotoCard = document.querySelector(".stage-photo-card");
const stagePhotoCardImage = stagePhotoCard?.querySelector("img");

if (stagePhoto && stagePhotoCard && stagePhotoCardImage) {
  stagePhotoCard.addEventListener("click", () => {
    const mainPhoto = {
      src: stagePhoto.getAttribute("src"),
      alt: stagePhoto.getAttribute("alt"),
      position: stagePhoto.dataset.photoPosition || "center",
    };
    const cardPhoto = {
      src: stagePhotoCardImage.getAttribute("src"),
      alt: stagePhotoCardImage.getAttribute("alt"),
      position: stagePhotoCardImage.dataset.photoPosition || "center",
    };

    if (!mainPhoto.src || !cardPhoto.src) {
      return;
    }

    stagePhoto.setAttribute("src", cardPhoto.src);
    stagePhoto.setAttribute("alt", cardPhoto.alt || "");
    stagePhoto.dataset.photoPosition = cardPhoto.position;
    stagePhoto.style.objectPosition = cardPhoto.position;

    stagePhotoCardImage.setAttribute("src", mainPhoto.src);
    stagePhotoCardImage.setAttribute("alt", mainPhoto.alt || "");
    stagePhotoCardImage.dataset.photoPosition = mainPhoto.position;
    stagePhotoCardImage.style.objectPosition = mainPhoto.position;
    stagePhotoCard.setAttribute("aria-label", `Show ${mainPhoto.alt || "other"} photo`);
  });
}

const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

const showFormMessage = (message, tone) => {
  if (!formMsg) {
    return;
  }

  formMsg.textContent = message;
  formMsg.dataset.tone = tone;
};

if (contactForm && formMsg) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");
    const accessKeyField = contactForm.querySelector('input[name="access_key"]');
    const subjectField = contactForm.querySelector('input[name="subject"]');
    const submitButton = contactForm.querySelector(".submit-btn");
    const name = nameField?.value.trim();
    const email = emailField?.value.trim();
    const message = messageField?.value.trim();
    const accessKey = accessKeyField?.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [nameField, emailField, messageField].forEach((field) => {
      field?.removeAttribute("aria-invalid");
    });

    if (!name || !email || !message) {
      [nameField, emailField, messageField].forEach((field) => {
        if (field && !field.value.trim()) {
          field.setAttribute("aria-invalid", "true");
        }
      });
      showFormMessage("Fill all fields.", "error");
      return;
    }

    if (!emailPattern.test(email)) {
      emailField?.setAttribute("aria-invalid", "true");
      showFormMessage("Use a valid email.", "error");
      return;
    }

    if (!accessKey || accessKey === "PASTE_WEB3FORMS_ACCESS_KEY_HERE") {
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:ibasanbryl7@gmail.com?subject=${subject}&body=${body}`;
      showFormMessage("Opening your email app with the message ready.", "success");
      return;
    }

    if (subjectField) {
      subjectField.value = `Portfolio inquiry from ${name}`;
    }

    submitButton?.setAttribute("disabled", "");
    showFormMessage("Sending...", "success");

    try {
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.body?.message || "Message failed");
      }

      contactForm.reset();
      showFormMessage("Message sent.", "success");
    } catch (error) {
      showFormMessage(error.message || "Could not send. Try again.", "error");
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("[data-nav-link]");

if ("IntersectionObserver" in window) {
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
}

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("navLinks");
const mobileNav = window.matchMedia("(max-width: 1100px)");

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

  const syncNavState = () => {
    if (!mobileNav.matches) {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  };

  syncNavState();

  if (typeof mobileNav.addEventListener === "function") {
    mobileNav.addEventListener("change", syncNavState);
  } else if (typeof mobileNav.addListener === "function") {
    mobileNav.addListener(syncNavState);
  }
}
