// Smooth Scroll for Secondary Button
document.querySelector('.btn-secondary').addEventListener('click', () => {
    document.querySelector('.screenshots').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Screenshot Carousel
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

let scrollAmount = 0;
const scrollStep = 310; // Width of screenshot + gap

prevBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({
        left: -scrollStep,
        behavior: 'smooth'
    });
});

nextBtn.addEventListener('click', () => {
    carouselTrack.scrollBy({
        left: scrollStep,
        behavior: 'smooth'
    });
});

// Auto-scroll carousel (optional)
let autoScrollInterval;

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        if (carouselTrack.scrollLeft >= carouselTrack.scrollWidth - carouselTrack.clientWidth) {
            carouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carouselTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
    }, 4000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Start auto-scroll on load
startAutoScroll();

// Pause auto-scroll on hover
carouselTrack.addEventListener('mouseenter', stopAutoScroll);
carouselTrack.addEventListener('mouseleave', startAutoScroll);

// Pause auto-scroll on touch
carouselTrack.addEventListener('touchstart', stopAutoScroll);
carouselTrack.addEventListener('touchend', () => {
    setTimeout(startAutoScroll, 2000);
});

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Intersection Observer for Stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                animateCounter(stat, target);
                stat.removeAttribute('data-target'); // Prevent re-animation
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Feature Cards Animation on Scroll
const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            featureObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.5s ease';
    featureObserver.observe(card);
});

// Download Button Click Handler
document.querySelector('.btn-download').addEventListener('click', () => {
    // Create ripple effect
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255,255,255,0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);

    // Simulated download action
    showDownloadNotification();
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .download-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2d5016, #4a3728);
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 3.5s forwards;
        border: 2px solid #ff6b35;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
    
    .notification-icon {
        font-size: 2rem;
        animation: bounce 1s ease-in-out infinite;
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    
    .notification-text h4 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
    }
    
    .notification-text p {
        margin: 5px 0 0;
        font-size: 0.9rem;
        opacity: 0.9;
    }
`;
document.head.appendChild(style);

function showDownloadNotification() {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-icon">✓</div>
        <div class="notification-text">
            <h4>Download Starting...</h4>
            <p>MALAYALAM MILTIA (18MB)</p>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);

    // Update download counter
    updateDownloadCount();
}

function updateDownloadCount() {
    const downloadStat = document.querySelector('.stat-number[data-target="50000"]');
    if (downloadStat && !downloadStat.dataset.target) {
        const currentCount = parseInt(downloadStat.textContent.replace(/,/g, ''));
        downloadStat.textContent = (currentCount + 1).toLocaleString();
    }
}

// Parallax Effect on Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-image, .android-icon');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Real-time players online counter (simulated)
function updatePlayersOnline() {
    const playersStat = document.querySelectorAll('.stat-number')[1];
    if (playersStat) {
        const baseCount = 2500;
        const randomVariation = Math.floor(Math.random() * 100) - 50;
        const newCount = baseCount + randomVariation;
        playersStat.textContent = newCount.toLocaleString();
    }
}

// Update players count every 10 seconds
setInterval(updatePlayersOnline, 10000);

// Social Icons Hover Effect Enhancement
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) rotate(5deg) scale(1.1)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg) scale(1)';
    });
});

// Footer Links Animation
document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(5px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0)';
    });
});

// Prevent right-click on images (optional protection)
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
});

// Console Easter Egg
console.log('%c🎮 MALAYALAM MILTIA 🎮', 'font-size: 20px; font-weight: bold; color: #ff6b35;');
console.log('%cDeveloped by ABHIYAN', 'font-size: 14px; color: #2d5016;');
console.log('%cWant to work on game development? Contact us!', 'font-size: 12px; color: #4a3728;');

// Performance optimization: Lazy load screenshots
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth scroll behavior to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (if needed in future)
const mobileMenuToggle = () => {
    // Reserved for future mobile menu implementation
};

// Add touch feedback for mobile
if ('ontouchstart' in window) {
    document.querySelectorAll('.btn-download, .btn-secondary, .feature-card').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
}
