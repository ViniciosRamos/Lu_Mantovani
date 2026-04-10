// script.js – Animações avançadas com GSAP + Lenis + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========== LENIS (rolagem suave) ==========
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ========== LOADER ==========
window.addEventListener('load', () => {
  const tl = gsap.timeline({
    onComplete: () => {
      document.getElementById('loader').style.display = 'none';
    }
  });
  tl.to('.loader-letter', { opacity: 0, y: -20, stagger: 0.05, duration: 0.5 })
    .to('.loader-progress', { opacity: 0, duration: 0.3 }, '-=0.2')
    .to('#loader', { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
  
  animateHero();
});

function animateHero() {
  gsap.from('.hero-line', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.out', delay: 0.2 });
  gsap.from('.title-line', { y: 120, opacity: 0, stagger: 0.15, duration: 1.2, ease: 'expo.out', delay: 0.3 });
  gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 1, ease: 'power2.out', delay: 0.6 });
  gsap.from('.hero-scroll-indicator', { opacity: 0, x: 20, duration: 1, delay: 1 });
}

// ========== ANIMAÇÕES SCROLL ==========
gsap.from('.about-image-wrapper', {
  scrollTrigger: {
    trigger: '.about',
    start: 'top 75%',
    toggleActions: 'play none none none'
  },
  opacity: 0,
  x: -60,
  duration: 1.2,
  ease: 'expo.out'
});

gsap.from('.about-text .section-tag, .about-headline, .about-description, .about-stats', {
  scrollTrigger: {
    trigger: '.about',
    start: 'top 75%',
  },
  opacity: 0,
  y: 40,
  stagger: 0.1,
  duration: 1,
  ease: 'power2.out'
});

// Cards do portfólio com revelação
gsap.utils.toArray('.project-card').forEach((card, i) => {
  ScrollTrigger.create({
    trigger: card,
    start: 'top 85%',
    onEnter: () => card.classList.add('in-view'),
    once: true
  });
  
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 85%',
    },
    opacity: 0,
    y: 80,
    duration: 1,
    ease: 'expo.out',
    delay: i * 0.05
  });
});

// ========== NOVO CURSOR MINIMALISTA ==========
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animação suave do cursor
gsap.ticker.add(() => {
  const speed = 0.15;
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;
  gsap.set(cursor, { x: cursorX, y: cursorY });
});

// Efeito hover em elementos interativos
const interactiveElements = document.querySelectorAll('a, button, .project-card, .menu-toggle, .drawer-close, .social-link');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
});

// Efeito magnético para cards (opcional, mantido)
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(card, {
      x: x * 0.05,
      y: y * 0.05,
      duration: 0.4,
      ease: 'power2.out'
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  });
});

// ========== MENU DRAWER ==========
const menuToggle = document.querySelector('.menu-toggle');
const menuDrawer = document.querySelector('.menu-drawer');
const drawerClose = document.querySelector('.drawer-close');
const drawerLinks = document.querySelectorAll('.drawer-link');
const drawerBackdrop = document.querySelector('.drawer-backdrop');

function openMenu() {
  menuToggle.classList.add('active');
  menuDrawer.classList.add('active');
  menuToggle.setAttribute('aria-expanded', 'true');
  lenis.stop();
}

function closeMenu() {
  menuToggle.classList.remove('active');
  menuDrawer.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  lenis.start();
}

menuToggle.addEventListener('click', openMenu);
drawerClose.addEventListener('click', closeMenu);
drawerBackdrop.addEventListener('click', closeMenu);

// Navegação suave ao clicar nos links
drawerLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    closeMenu();
    
    if (targetElement) {
      lenis.scrollTo(targetElement, {
        offset: 0,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  });
});

// Fechar com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuDrawer.classList.contains('active')) {
    closeMenu();
  }
});

// ========== PARALLAX NAS IMAGENS DO PORTFÓLIO ==========
gsap.utils.toArray('.project-image img').forEach(img => {
  gsap.to(img, {
    y: () => -img.offsetHeight * 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: img.closest('.project-card'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5
    }
  });
});

// Conectar com Three.js
if (typeof updateThreeOnScroll === 'function') {
  lenis.on('scroll', ({ scroll, limit }) => {
    updateThreeOnScroll(scroll / limit);
  });
}
