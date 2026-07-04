document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const toggleIcon = mobileToggle.querySelector('i');

    function toggleMenu() {
        mobileNav.classList.toggle('active');
        if (mobileNav.classList.contains('active')) {
            toggleIcon.classList.replace('ph-list', 'ph-x');
            document.body.style.overflow = 'hidden'; 
        } else {
            toggleIcon.classList.replace('ph-x', 'ph-list');
            document.body.style.overflow = '';
        }
    }

    mobileToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');

    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === currentPath || (href.startsWith('index.html') && currentPath === 'index.html'))) {
            link.style.color = 'var(--text-primary)';
        }
    });
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    initHeroCanvas();
    const devTrack = document.querySelector('.dev-scroll-track');
    const devCards = document.querySelectorAll('.dev-card');

    if (devTrack && devCards.length > 0) {
        let activeIndex = 0;

        function updateCarousel() {
            devCards.forEach((card, index) => {
                if (index === activeIndex) {
                    card.style.setProperty('--card-scale', 1);
                    card.style.setProperty('--card-opacity', 1);
                } else {
                    card.style.setProperty('--card-scale', 0.85);
                    card.style.setProperty('--card-opacity', 0.3);
                }
            });
            const cardWidth = 300;
            const gap = 32;
            const viewportCenter = window.innerWidth / 2;
            const offset = viewportCenter - (cardWidth / 2) - (activeIndex * (cardWidth + gap));

            devTrack.style.transform = `translateX(${offset}px)`;
        }

        devCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                activeIndex = index;
                updateCarousel();
            });
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }
});

function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
            if (this.y > height) this.y = 0;
            if (this.y < 0) this.y = height;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        if (width > 768) {
            for(let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for(let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        connectParticles();

        requestAnimationFrame(animate);
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    let opacity = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(239, 68, 68, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    animate();
}
