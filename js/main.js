(() => {
    'use strict';

    /* ============================================
       DOM References
       ============================================ */
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const contactForm = document.getElementById('contact-form');
    const revealElements = document.querySelectorAll('.reveal');

    /* ============================================
       Particles Background
       ============================================ */
    const createParticles = () => {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = window.innerWidth < 768 ? 30 : 60;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;

            container.appendChild(particle);
        }
    };

    /* ============================================
       Mobile Menu
       ============================================ */
    const toggleMenu = (open) => {
        navMenu.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    if (navToggle) {
        navToggle.addEventListener('click', () => toggleMenu(true));
    }

    if (navClose) {
        navClose.addEventListener('click', () => toggleMenu(false));
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) toggleMenu(false);
        });
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            toggleMenu(false);
        }
    });

    /* ============================================
       Theme Toggle (Dark / Light Mode)
       ============================================ */
    const getPreferredTheme = () => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', theme);
    };

    applyTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    /* ============================================
       Header Hide / Show on Scroll
       ============================================ */
    let lastScroll = 0;

    const handleHeaderScroll = () => {
        const currentScroll = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 500;

        if (currentScroll > heroHeight) {
            header.classList.toggle('header-hidden', currentScroll > lastScroll);
        } else {
            header.classList.remove('header-hidden');
        }

        lastScroll = currentScroll;
    };

    /* ============================================
       Active Nav Link Highlighting
       ============================================ */
    const updateActiveLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);

            if (link) {
                link.classList.toggle('active-link', scrollPos >= top && scrollPos < top + height);
            }
        });
    };

    /* ============================================
       Scroll Reveal Animations
       ============================================ */
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 120;

        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    };

    /* ============================================
       Contact Form Handler
       ============================================ */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;

            // Simulate sending
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Mensaje enviado!';
                btn.style.background = 'linear-gradient(135deg, #00e676, #00c853)';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    contactForm.reset();
                }, 2500);
            }, 1500);
        });

        // Auto-resize textarea
        const textarea = contactForm.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
            });
        }
    }

    /* ============================================
       Smooth Scroll Enhancement
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 70;
                const top = target.offsetTop - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ============================================
       Event Listeners
       ============================================ */
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        updateActiveLink();
        revealOnScroll();
    }, { passive: true });

    window.addEventListener('load', () => {
        createParticles();
        revealOnScroll();
        updateActiveLink();
    });

    window.addEventListener('resize', () => {
        // Re-create particles on resize with delay
        clearTimeout(window._particleTimer);
        window._particleTimer = setTimeout(() => {
            const container = document.getElementById('particles');
            if (container) {
                container.innerHTML = '';
                createParticles();
            }
        }, 500);
    });

})();