/* ============================================================
   main.js — Portfolio JS (Mohamed Irfan M Y)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. NAV — scroll shadow + hamburger
  ---------------------------------------------------------- */
  const header   = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     2. PARTICLE CANVAS (Hero Background)
  ---------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['rgba(0,224,255,', 'rgba(155,109,255,', 'rgba(34,211,160,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 600 + 200;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const progress = this.life / this.maxLife;
      this.alpha = progress < 0.2
        ? (progress / 0.2) * this.maxAlpha
        : progress > 0.8
          ? ((1 - progress) / 0.2) * this.maxAlpha
          : this.maxAlpha;
      if (this.life > this.maxLife) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  // Create 80 particles
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ----------------------------------------------------------
     3. TYPEWRITER
  ---------------------------------------------------------- */
  const phrases = [
    'Software Developer',
    'Flutter Engineer',
    'IoT Systems Builder',
    'Embedded Firmware Dev',
    'Firebase Architect',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const tw = document.getElementById('typewriter-text');

  function typeLoop() {
    const word = phrases[phraseIdx];
    if (!deleting) {
      tw.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      tw.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 55 : 90);
  }
  setTimeout(typeLoop, 800);

  /* ----------------------------------------------------------
     4. SCROLL REVEAL (data-animate / data-delay)
  ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('animated'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     5. RESUME MODAL
  ---------------------------------------------------------- */
  const resumeBtn   = document.getElementById('resumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const modalClose  = document.getElementById('modalClose');

  function openModal() {
    resumeModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    resumeModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  resumeBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  // Close on backdrop click
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) closeModal();
  });

  /* ----------------------------------------------------------
     6. SMOOTH ACTIVE NAV LINK HIGHLIGHT
  ---------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => sectionObserver.observe(sec));

});