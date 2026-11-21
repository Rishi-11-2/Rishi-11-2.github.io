document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('menu');
    const links = [...document.querySelectorAll('.nav__link')];

    // Mobile menu
    const setMenu = (open) => {
        menu.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    links.forEach((link) => link.addEventListener('click', () => setMenu(false)));

    // Highlight the nav link for the section in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) =>
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));

    // Contact form (Netlify Forms)
    const form = document.getElementById('contactForm');
    const say = (text, type) => {
        form.querySelector('.form-message')?.remove();
        const el = document.createElement('div');
        el.className = `form-message status--${type}`;
        el.setAttribute('role', type === 'error' ? 'alert' : 'status');
        el.textContent = text;
        form.prepend(el);
        if (type === 'success') setTimeout(() => el.remove(), 5000);
    };

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = data.get('name').trim();
        const email = data.get('email').trim();
        const message = data.get('message').trim();

        if (name.length < 2) return say('Enter your name (at least 2 characters).', 'error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return say('Enter a valid email address.', 'error');
        if (message.length < 10) return say('Write a message of at least 10 characters.', 'error');

        const btn = form.querySelector('button[type="submit"]');
        const label = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending…';
        try {
            const res = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });
            if (!res.ok) throw new Error('Request failed');
            say('Message sent. I’ll reply soon.', 'success');
            form.reset();
        } catch {
            say('The message didn’t send. Check your connection and try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = label;
        }
    });

    // Footer year
    const footer = document.querySelector('.footer p');
    if (footer) footer.textContent = footer.textContent.replace('2025', new Date().getFullYear());
});
