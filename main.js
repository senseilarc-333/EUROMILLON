import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm';
import { MatrixRain } from './matrix-rain.js';
import { EcommerceSystem } from './ecommerce.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Iniciar Ecommerce
  new EcommerceSystem();

  // 2. Iniciar Matrix Rain Background
  const matrix = new MatrixRain('matrix-canvas');
  matrix.start();

  // 3. Secuencia de Animación "El Despertar" (Hero)
  const tl = gsap.timeline();

  // Ocultar elementos iniciales para la intro
  gsap.set('.hero-content', { opacity: 0, y: 50 });
  gsap.set('header', { y: -100 });

  // Remover loader (SIEMPRE se quita, pase lo que pase)
  const loaderEl = document.getElementById('loader');
  setTimeout(() => {
    loaderEl.style.opacity = '0';
    loaderEl.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      loaderEl.style.display = 'none';
      startAwakeningSequence();
    }, 500);
  }, 1200);

  function startAwakeningSequence() {
    try {
      matrix.triggerAwakening();
      gsap.to('#hero', {
        backgroundColor: '#0a0a0a',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          matrix.stopAwakening();
          tl.to('header', { y: 0, duration: 1, ease: 'power3.out' })
            .to('.hero-content', { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out' }, '-=0.5');
        }
      });
    } catch(e) {
      // Si algo falla, igual mostramos el contenido
      gsap.set('header', { y: 0 });
      gsap.set('.hero-content', { opacity: 1, y: 0 });
    }
  }

  // 4. Animaciones de scroll simples con Intersection Observer para Productos y Social Proof
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('#autoridad .container, .product-card, .terminal').forEach(el => {
    gsap.set(el, { opacity: 0, y: 50 });
    observer.observe(el);
  });

  // Efecto de glow interactivo en el botón principal
  const btnMatrix = document.getElementById('cta-main');
  btnMatrix.addEventListener('mousemove', (e) => {
    const rect = btnMatrix.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Actualizar variables CSS para el glow dinámico
    btnMatrix.style.setProperty('--mouse-x', `${x}px`);
    btnMatrix.style.setProperty('--mouse-y', `${y}px`);
  });

  // Botón Hero navega a productos
  btnMatrix.addEventListener('click', () => {
    document.querySelector('#productos').scrollIntoView({ behavior: 'smooth' });
  });

});
