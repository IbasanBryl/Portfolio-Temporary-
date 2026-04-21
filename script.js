const track = document.getElementById("ticker-track");
const yearNodes = document.querySelectorAll("[data-year]");
const revealNodes = document.querySelectorAll("[data-reveal]");
const cursorBlob = document.querySelector(".cursor-blob");
const canvas = document.getElementById("particle-canvas");
const context = canvas.getContext("2d");

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "HTML5",
  "TailwindCSS",
  "Python",
  "Node.js",
  "Three.js",
  "GSAP",
  "Figma",
];

function buildTicker() {
  const row = skills
    .map((skill) => `<span>${skill}</span><span class="ticker-dot">-</span>`)
    .join("");
  track.innerHTML = Array.from({ length: 6 }, () => row).join("");
}

function setYear() {
  const currentYear = new Date().getFullYear();
  yearNodes.forEach((node) => {
    node.textContent = currentYear;
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node, index) => {
    if (node.classList.contains("project-card")) {
      node.style.setProperty("--reveal-delay", `${index * 80}ms`);
    }
    observer.observe(node);
  });
}

function setupBlob() {
  if (!cursorBlob) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.4,
  };

  const current = {
    x: target.x,
    y: target.y,
  };

  window.addEventListener("pointermove", (event) => {
    target.x = event.clientX;
    target.y = event.clientY;
  });

  window.addEventListener("pointerleave", () => {
    target.x = window.innerWidth * 0.5;
    target.y = window.innerHeight * 0.4;
  });

  if (reducedMotion) {
    cursorBlob.style.transform = "translate(-50%, -50%)";
    return;
  }

  function animateBlob() {
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;
    cursorBlob.style.transform = `translate(${current.x - window.innerWidth * 0.5}px, ${
      current.y - window.innerHeight * 0.5
    }px) translate(-50%, -50%)`;
    requestAnimationFrame(animateBlob);
  }

  animateBlob();
}

function setupCanvas() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  const pointer = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.4,
  };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticle(cluster) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const topCluster = cluster === "top";
    return {
      x:
        (topCluster ? width * 0.52 : width * 0.27) +
        (Math.random() - 0.5) * (topCluster ? 240 : 220),
      y:
        (topCluster ? height * 0.25 : height * 0.63) +
        (Math.random() - 0.5) * (topCluster ? 120 : 120),
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: 0.6 + Math.random() * 1.9,
      cluster,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function seed() {
    particles.length = 0;
    const count = reducedMotion ? 70 : 180;
    for (let index = 0; index < count; index += 1) {
      particles.push(createParticle(index % 2 === 0 ? "top" : "left"));
    }
  }

  function wrapParticle(particle) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (particle.x < -80) particle.x = width + 80;
    if (particle.x > width + 80) particle.x = -80;
    if (particle.y < -80) particle.y = height + 80;
    if (particle.y > height + 80) particle.y = -80;
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.globalCompositeOperation = "lighter";

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / 700);

      particle.phase += 0.01;
      particle.x += particle.vx + dx * 0.00001 * influence;
      particle.y += particle.vy + dy * 0.00001 * influence;

      if (!reducedMotion) {
        particle.x += Math.sin(particle.phase) * 0.18;
        particle.y += Math.cos(particle.phase * 0.9) * 0.14;
      }

      wrapParticle(particle);

      const alpha = reducedMotion ? 0.12 : 0.1 + influence * 0.35;
      context.beginPath();
      context.fillStyle =
        particle.cluster === "top"
          ? `rgba(181, 125, 255, ${alpha})`
          : `rgba(39, 42, 58, ${alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }

    const connectionLimit = 118;
    context.lineWidth = 1;
    for (let a = 0; a < particles.length; a += 1) {
      for (let b = a + 1; b < particles.length; b += 1) {
        const first = particles[a];
        const second = particles[b];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < connectionLimit) {
          const opacity = (1 - distance / connectionLimit) * 0.12;
          context.strokeStyle = `rgba(181, 125, 255, ${opacity})`;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
    }

    context.globalCompositeOperation = "source-over";

    if (!reducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  window.addEventListener("resize", () => {
    resize();
    seed();
    if (reducedMotion) {
      draw();
    }
  });

  resize();
  seed();

  draw();
}

buildTicker();
setYear();
setupReveal();
setupBlob();
setupCanvas();
