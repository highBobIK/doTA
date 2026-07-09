// script.js
// Интерактивность сайта Dota 2 Hub

document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // 1. Навигация — плавный скролл
    // ========================
    const navLinks = document.querySelectorAll('.nav-links a, .footer-links a');
    const navbar = document.getElementById('mainNavbar');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Закрываем мобильное меню, если открыто
                navbar.classList.remove('menu-open');
                document.body.style.overflow = '';

                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Кнопка "Начать изучение"
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const heroesSection = document.getElementById('heroes');
            if (heroesSection) {
                heroesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========================
    // 2. Бургер-меню (мобильное)
    // ========================
    const burgerBtn = document.getElementById('burgerBtn');

    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            navbar.classList.toggle('menu-open');
            // Блокируем скролл страницы при открытом меню
            if (navbar.classList.contains('menu-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Закрытие меню при клике вне навигации
    document.addEventListener('click', (e) => {
        if (navbar.classList.contains('menu-open') &&
            !e.target.closest('.nav-links') &&
            !e.target.closest('.burger-btn')) {
            navbar.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    });

    // ========================
    // 3. Эффект навбара при скролле
    // ========================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }, { passive: true });

    // ========================
    // 4. Scroll-анимации (IntersectionObserver)
    // ========================
    const animatedElements = document.querySelectorAll('.animate-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Фоллбэк для старых браузеров
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ========================
    // 5. Табы позиций
    // ========================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const positionPanels = document.querySelectorAll('.position-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Убираем active у всех
            tabButtons.forEach(b => b.classList.remove('active'));
            positionPanels.forEach(p => p.classList.remove('active'));

            // Активируем нужный таб и панель
            btn.classList.add('active');
            const targetPanel = document.getElementById(tabId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ========================
    // 6. Эффект частиц на баннере
    // ========================
    const particlesContainer = document.getElementById('particles');

    if (particlesContainer) {
        // Инъектируем CSS-анимацию для частиц
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: var(--p-opacity);
                }
                25% {
                    opacity: calc(var(--p-opacity) * 1.5);
                }
                100% {
                    transform: translateY(-100vh) translateX(var(--p-drift));
                    opacity: 0;
                }
            }
            .particle {
                position: absolute;
                border-radius: 50%;
                background: white;
                pointer-events: none;
                animation: particleFloat var(--p-duration) var(--p-delay) infinite linear;
                opacity: 0;
            }
        `;
        document.head.appendChild(styleSheet);

        // Создаём 40 частиц
        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 3 + 1; // 1-4px
            const left = Math.random() * 100;
            const top = Math.random() * 100 + 50; // Начинают снизу
            const opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
            const duration = Math.random() * 20 + 10; // 10-30с
            const delay = Math.random() * 15; // 0-15с
            const drift = (Math.random() - 0.5) * 100; // -50 до 50px

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${top}%;
                --p-opacity: ${opacity};
                --p-duration: ${duration}s;
                --p-delay: ${delay}s;
                --p-drift: ${drift}px;
            `;

            particlesContainer.appendChild(particle);
        }
    }

    // ========================
    // 7. Анимация счётчиков статистики
    // ========================
    const statNumbers = document.querySelectorAll('.stat-number');

    if ('IntersectionObserver' in window && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Не анимируем повторно
                    if (el.dataset.animated) return;
                    el.dataset.animated = 'true';

                    // Если это статичное значение (5v5), просто показываем
                    const staticValue = el.dataset.static;
                    if (staticValue) {
                        el.textContent = staticValue;
                        return;
                    }

                    const target = parseInt(el.dataset.target) || 0;
                    const suffix = el.dataset.suffix || '';
                    const duration = 2000; // 2 секунды
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Ease-out функция для плавного замедления
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(easeOut * target);

                        el.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    statsObserver.unobserve(el);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(el => statsObserver.observe(el));
    }

    // ========================
    // 8. Эффект параллакса на карточках героев
    // ========================
    const heroCards = document.querySelectorAll('.hero-card');

    heroCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
