const body = document.body;
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.querySelector('.theme-toggle');
const loadingScreen = document.querySelector('.loading-screen');
const backToTop = document.querySelector('.back-to-top');
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryCards = document.querySelectorAll('.gallery-card');
const testimonialItems = document.querySelectorAll('.testimonial');
const prevButton = document.querySelector('.slider-btn.prev');
const nextButton = document.querySelector('.slider-btn.next');
const counters = document.querySelectorAll('[data-count]');
const revealItems = document.querySelectorAll('.reveal');

window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    body.classList.add('loaded');
  }, 1200);
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  backToTop.classList.toggle('visible', window.scrollY > 500);
});

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const savedTheme = localStorage.getItem('aurora-theme');
if (savedTheme === 'dark') {
  body.classList.add('dark');
  themeToggle.textContent = '☀';
}

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀' : '☾';
  localStorage.setItem('aurora-theme', isDark ? 'dark' : 'light');
});

const sections = document.querySelectorAll('main section[id]');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count || 0);
    const duration = 1200;
    const startTime = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = `${target}`;
      }
    };

    requestAnimationFrame(tick);
  });
};

const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    galleryCards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === 'all' || filter === category;
      card.classList.toggle('hide', !show);
    });
  });
});

let currentTestimonial = 0;
const showTestimonial = (index) => {
  testimonialItems.forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === index);
  });
};

const rotateTestimonials = () => {
  currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
  showTestimonial(currentTestimonial);
};

prevButton?.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
  showTestimonial(currentTestimonial);
});

nextButton?.addEventListener('click', rotateTestimonials);
setInterval(rotateTestimonials, 6000);

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelector('.reservation-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('예약 요청이 접수되었습니다. 빠르게 연락드리겠습니다.');
});
