(() => {
    'use strict';

    const root = document.documentElement;
    root.classList.add('js');
    const themeToggle = document.getElementById('theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const mediaTheme = window.matchMedia('(prefers-color-scheme: dark)');
    let savedTheme = null;
    try {
        const value = localStorage.getItem('theme');
        if (value === 'light' || value === 'dark') savedTheme = value;
    } catch { /* The page remains usable when storage is blocked. */ }

    const applyTheme = (theme) => {
        const dark = theme === 'dark';
        root.dataset.theme = theme;
        themeToggle.setAttribute('aria-label', dark ? 'Activar tema claro' : 'Activar tema oscuro');
        themeToggle.setAttribute('aria-pressed', String(dark));
        themeColor.setAttribute('content', dark ? '#111c19' : '#f7f8f5');
    };
    applyTheme(savedTheme || (mediaTheme.matches ? 'dark' : 'light'));
    themeToggle.addEventListener('click', () => {
        savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(savedTheme);
        try { localStorage.setItem('theme', savedTheme); } catch { /* Optional preference. */ }
    });
    mediaTheme.addEventListener('change', (event) => {
        if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
    });

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const isMenuOpen = () => navToggle.getAttribute('aria-expanded') === 'true';
    const setMenu = (open, returnFocus = false) => {
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        navMenu.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open && mobileQuery.matches);
        if (returnFocus) navToggle.focus();
    };
    navToggle.addEventListener('click', () => setMenu(!isMenuOpen()));
    navMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', (event) => {
        if (isMenuOpen() && !document.getElementById('header').contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
        if (!isMenuOpen() || !mobileQuery.matches) return;
        if (event.key === 'Escape') setMenu(false, true);
        if (event.key === 'Tab') {
            const focusable = [...document.querySelectorAll('#header a, #header button')]
                .filter((element) => element.getClientRects().length > 0);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
    mobileQuery.addEventListener('change', () => setMenu(false));

    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('main section[id]')];
    if ('IntersectionObserver' in window) {
        const visibleSections = new Set();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visibleSections.add(entry.target);
                else visibleSections.delete(entry.target);
            });
            const active = sections.find((section) => visibleSections.has(section));
            navLinks.forEach((link) => {
                const selected = !!active && link.hash === '#' + active.id;
                link.classList.toggle('active', selected);
                if (selected) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
        sections.forEach((section) => observer.observe(section));
    }

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        if (!name || !message) {
            formStatus.textContent = 'Completa tu nombre y un mensaje para preparar el correo.';
            document.getElementById(!name ? 'name' : 'message').focus();
            return;
        }
        const body = 'Hola Jonathan,\n\n' + message + '\n\nNombre: ' + name + '\nCorreo de contacto: ' + email;
        const mailto = 'mailto:contaled.vct@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        window.location.href = mailto;
        formStatus.textContent = 'Continúa el envío en tu aplicación de correo. Si no se abre, puedes escribirme directamente o contactarme por WhatsApp.';
    });

    const copyButton = document.getElementById('copy-email');
    const copyStatus = document.getElementById('copy-status');
    let copyTimer;
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('contaled.vct@gmail.com');
            copyButton.querySelector('span').textContent = 'Correo copiado';
            copyStatus.textContent = 'Correo copiado: contaled.vct@gmail.com';
            clearTimeout(copyTimer);
            copyTimer = setTimeout(() => { copyButton.querySelector('span').textContent = 'Copiar correo'; }, 3000);
        } catch {
            copyStatus.textContent = 'Puedes escribir a contaled.vct@gmail.com.';
            copyButton.querySelector('span').textContent = 'contaled.vct@gmail.com';
        }
    });

    document.getElementById('year').textContent = String(new Date().getFullYear());
})();
