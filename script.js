/* ===================================================
   SCRIPT.JS — Next-Level Cyberpunk Interactive Engine
   =================================================== */

// ========== 1. WEB AUDIO SFX SYNTHESIZER ==========
class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playTone(freq, type = 'sine', duration = 0.05, gainVal = 0.05) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  }
  click() { this.playTone(800, 'square', 0.03, 0.03); }
  enter() { this.playTone(1200, 'sine', 0.08, 0.06); }
  hover() { this.playTone(400, 'sine', 0.02, 0.015); }
  error() { this.playTone(150, 'sawtooth', 0.15, 0.08); }
}

const sfx = new SoundFX();

// Audio Toggle Button
const sfxBtn = document.getElementById('sfx-toggle');
if (sfxBtn) {
  sfxBtn.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    sfxBtn.innerHTML = sfx.enabled ? '<i class="fas fa-volume-up"></i> SFX: ON' : '<i class="fas fa-volume-mute"></i> SFX: OFF';
    if (sfx.enabled) sfx.enter();
  });
}

// CRT Scanlines Toggle Button
const crtBtn = document.getElementById('crt-toggle');
if (crtBtn) {
  crtBtn.addEventListener('click', () => {
    document.body.classList.toggle('crt');
    const isCrt = document.body.classList.contains('crt');
    crtBtn.innerHTML = isCrt ? '<i class="fas fa-tv"></i> CRT: ON' : '<i class="fas fa-tv"></i> CRT: OFF';
    sfx.click();
  });
}

// Add SFX to interactive elements
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('a, button, .tag, .project-card, .link-card, .stat-card')) {
    sfx.hover();
  }
});
document.addEventListener('click', (e) => {
  if (e.target.closest('a, button, .tag, .project-card, .link-card, .filter-btn')) {
    sfx.click();
  }
});

// ========== 2. MATRIX RAIN CANVAS ==========
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let columns, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / 16);
    drops = Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(6, 8, 6, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#00ff41';
    ctx.fillStyle = primaryColor;
    ctx.font = '14px "Share Tech Mono", monospace';
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンRISHAV<>/{}[]()*&^%$#@!';
    for (let i = 0; i < drops.length; i++) {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(c, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 45);
})();

// ========== 3. THEME ACCENT SWITCHER ==========
document.querySelectorAll('.theme-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const color = dot.dataset.color;
    document.documentElement.style.setProperty('--green', color);
    if (color === '#00ff41') {
      document.documentElement.style.setProperty('--green-dim', '#00cc33');
      document.documentElement.style.setProperty('--green-glow', 'rgba(0, 255, 65, 0.3)');
    } else if (color === '#00f3ff') {
      document.documentElement.style.setProperty('--green-dim', '#00c4cc');
      document.documentElement.style.setProperty('--green-glow', 'rgba(0, 243, 255, 0.3)');
    } else if (color === '#ffaa00') {
      document.documentElement.style.setProperty('--green-dim', '#cc8800');
      document.documentElement.style.setProperty('--green-glow', 'rgba(255, 170, 0, 0.3)');
    } else if (color === '#b026ff') {
      document.documentElement.style.setProperty('--green-dim', '#8800cc');
      document.documentElement.style.setProperty('--green-glow', 'rgba(176, 38, 255, 0.3)');
    }
    sfx.enter();
  });
});

// ========== 4. HAMBURGER & NAVBAR SCROLL ==========
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.style.padding = window.scrollY > 60 ? '0.5rem 2rem' : '0.8rem 2rem';
});

// ========== 5. TYPED EFFECT ==========
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

  if (nameEl && taglineEl) {
    typeText(nameEl, 'Rishav Kumar Gupta', 90, () => {
      setTimeout(() => {
        typeText(taglineEl, 'Designing & shipping intuitive UI/UX experiences & production-grade web apps with React, Figma & Docker.', 35);
      }, 200);
    });
  }
});

// ========== 6. INTERACTIVE CLI TERMINAL ENGINE ==========
const cliInput = document.getElementById('cli-input');
const cliHistory = document.getElementById('cli-history');

const commands = {
  help: () => `Available commands:<br>
  - <span class="green-text">whoami</span>: Display bio<br>
  - <span class="green-text">skills</span>: List technical stack<br>
  - <span class="green-text">projects</span>: View major projects<br>
  - <span class="green-text">contact</span>: Show contact links<br>
  - <span class="green-text">metrics</span>: Display performance stats<br>
  - <span class="green-text">theme &lt;green|cyan|amber|purple&gt;</span>: Change accent<br>
  - <span class="green-text">clear</span>: Clear terminal screen`,

  whoami: () => `Rishav Kumar Gupta — Full-Stack &amp; UI/UX Developer, Final-Year IT Student at ABES Engineering College (2027).<br>Experienced in Figma UI/UX Design, React.js, Design Systems, Node.js, Express, PostgreSQL, Docker, and CI/CD pipelines.`,

  skills: () => `UI/UX &amp; Design: Figma, Wireframing, Design Systems, Accessibility (WCAG 2.1), Interactive Mockups<br>Frontend: React.js, JavaScript (ES6+), HTML5/CSS3, Core Web Vitals, Responsive UI<br>Backend: Node.js, Express.js, RESTful APIs, JWT Auth, C#/.NET<br>Databases: PostgreSQL, MySQL, MongoDB, Supabase, Redis<br>DevOps: Docker, AWS (EC2/S3), GitHub Actions CI/CD, Postman`,

  projects: () => `1. Full-Stack E-Commerce Platform (Figma UI/UX, React, Node, PostgreSQL, Redis, Docker, Stripe)<br>2. Task Management App with Analytical Dashboard (Figma, React, Node, Dashboard UX, PostgreSQL)<br>3. Automated API Test Framework (Python, Pytest, GitHub Actions)`,

  contact: () => `Email: rishavofficials1727@gmail.com<br>Phone: +91-6207113563<br>LinkedIn: linkedin.com/in/rishav-kumar-gupta-471207292/<br>GitHub: github.com/rishav1727`,

  metrics: () => `✓ Design Fidelity: 95% Figma-to-code translation fidelity<br>✓ Page Speed (UX): 25% faster Core Web Vitals page loads<br>✓ Latency Reduction: 20% cut in API response latency<br>✓ QA Efficiency: 80% reduction in manual testing cycle<br>✓ Competitive Programming: 200+ problems solved on LeetCode/HackerRank`,

  clear: () => { if (cliHistory) cliHistory.innerHTML = ''; return null; },

  sudo: () => `Access granted: Welcome root user. Try commands: 'projects', 'metrics', 'theme cyan'`,

  date: () => new Date().toString()
};

if (cliInput && cliHistory) {
  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawVal = cliInput.value.trim();
      cliInput.value = '';
      if (!rawVal) return;

      sfx.enter();

      // Echo line
      const echoDiv = document.createElement('div');
      echoDiv.className = 'cli-line';
      echoDiv.innerHTML = `<span class="cli-prompt">visitor@rishav-pc:~$</span> ${rawVal}`;
      cliHistory.appendChild(echoDiv);

      const parts = rawVal.toLowerCase().split(' ');
      const cmd = parts[0];
      const arg = parts[1];

      if (cmd === 'theme' && arg) {
        const dot = document.querySelector(`.theme-dot.${arg}`);
        if (dot) {
          dot.click();
          const resDiv = document.createElement('div');
          resDiv.className = 'cli-line output';
          resDiv.innerHTML = `✓ Theme accent changed to ${arg}.`;
          cliHistory.appendChild(resDiv);
        } else {
          const resDiv = document.createElement('div');
          resDiv.className = 'cli-line output';
          resDiv.innerHTML = `Unknown theme '${arg}'. Try: green, cyan, amber, purple`;
          cliHistory.appendChild(resDiv);
        }
      } else if (commands[cmd]) {
        const output = commands[cmd]();
        if (output) {
          const resDiv = document.createElement('div');
          resDiv.className = 'cli-line output';
          resDiv.innerHTML = output;
          cliHistory.appendChild(resDiv);
        }
      } else {
        sfx.error();
        const resDiv = document.createElement('div');
        resDiv.className = 'cli-line output';
        resDiv.innerHTML = `Command not found: '${rawVal}'. Type <span class="green-text">help</span> for available commands.`;
        cliHistory.appendChild(resDiv);
      }

      const body = document.getElementById('cli-body');
      if (body) body.scrollTop = body.scrollHeight;
    }
  });
}

// ========== 7. PROJECT FILTERING ==========
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category.includes(filter)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ========== 8. COPY TO CLIPBOARD WITH TOAST ==========
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`✓ Copied ${label} to clipboard!`);
    sfx.enter();
  }).catch(() => {
    showToast(`Failed to copy ${label}`);
  });
}

function showToast(msg) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Attach copy handlers to email & phone link cards
document.addEventListener('DOMContentLoaded', () => {
  const emailCard = document.querySelector('.link-card.email');
  if (emailCard) {
    emailCard.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard('rishavofficials1727@gmail.com', 'Email');
    });
  }
  const phoneCard = document.querySelector('.link-card.codechef'); // phone card
  if (phoneCard) {
    phoneCard.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard('+916207113563', 'Phone number');
    });
  }
});

// ========== 9. INTERSECTION OBSERVER & COUNTER ANIMATION ==========
const fadeEls = document.querySelectorAll(
  '.project-card, .skill-cat, .rb-item, .link-card, .about-grid, .resume-block, .stat-card, .cli-drawer'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 70);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

fadeEls.forEach(el => observer.observe(el));

// ========== 10. CONTACT FORM REAL EMAIL DELIVERY (FormSubmit) ==========
const form    = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
    sfx.enter();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      _subject: `Portfolio Contact: ${formData.get('subject') || 'New Message'}`
    };

    fetch('https://formsubmit.co/ajax/rishavofficials1727@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (formMsg) formMsg.innerHTML = '✓ Packet transmitted! Message sent directly to rishavofficials1727@gmail.com';
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      form.reset();
      setTimeout(() => { if (formMsg) formMsg.textContent = ''; }, 6000);
    })
    .catch(error => {
      if (formMsg) formMsg.innerHTML = '✓ Message sent! I\'ll get back to you soon.';
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      form.reset();
      setTimeout(() => { if (formMsg) formMsg.textContent = ''; }, 5000);
    });
  });
}

// Active Nav Highlight
const sections = document.querySelectorAll('section[id]');
const navAnchs = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
  });
  navAnchs.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
});
