/* ============================================
   SCRIPT.JS — Rishav Portfolio Interactions
   ============================================ */

// ---- Matrix Rain ----
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let columns, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / 16);
    drops = Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = '14px "Share Tech Mono", monospace';
    const chars = '01アイウエオカキクケコABCDEFGHIJKLMNOP<>{}[]()';
    for (let i = 0; i < drops.length; i++) {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(c, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- Navbar shrink on scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.padding = window.scrollY > 60 ? '0.6rem 2rem' : '1rem 2rem';
});

// ---- Typed effect: Name ----
function typeText(el, text, speed = 80, cb) {
  let i = 0;
  el.textContent = '';
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(t); if (cb) cb(); }
  }, speed);
}

window.addEventListener('DOMContentLoaded', () => {
  const nameEl    = document.getElementById('typed-name');
  const taglineEl = document.getElementById('typed-tagline');

  typeText(nameEl, 'Rishav', 120, () => {
    setTimeout(() => {
      typeText(taglineEl, 'Building scalable web apps, one commit at a time.', 45);
    }, 300);
  });
});

// ---- Intersection Observer fade-in ----
const fadeEls = document.querySelectorAll(
  '.project-card, .skill-cat, .rb-item, .link-card, .about-grid, .resume-block'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// ---- Contact Form ----
const form    = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Simulate send (replace with real EmailJS / FormSpree logic)
  setTimeout(() => {
    formMsg.textContent = '✓ Message sent! I\'ll get back to you soon.';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    form.reset();
    setTimeout(() => { formMsg.textContent = ''; }, 5000);
  }, 1500);
});

// ---- Smooth active nav highlight ----
const sections = document.querySelectorAll('section[id]');
const navAnchs = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchs.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
});
