// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    // Handle navigation link clicks with improved smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Highlight active navigation link on scroll
    function highlightActiveNavLink() {
        const scrollPosition = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(highlightActiveNavLink, 10);
    });

    // Header background on scroll - Light orange glassmorphism theme
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(var(--color-surface-rgb), 0.85)';
            header.style.backdropFilter = 'blur(24px) saturate(180%)';
            header.style.boxShadow = '0 2px 20px rgba(var(--color-orange-500-rgb), 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.backgroundColor = 'rgba(var(--color-surface-rgb), 0.7)';
            header.style.backdropFilter = 'blur(20px) saturate(180%)';
            header.style.boxShadow = '0 2px 20px rgba(var(--color-orange-500-rgb), 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)';
        }
    });

    // Enhanced contact form handling with Netlify Forms
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();
            
            // Clear any existing messages
            clearFormMessages();
            
            // Validate form
            if (!validateForm(name, email, message)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit to Netlify
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Show success message
                showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                // Reset form
                this.reset();
            })
            .catch(() => {
                // Show error message
                showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Improved form validation function
    function validateForm(name, email, message) {
        const errors = [];
        
        // Validate name
        if (!name || name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Validate message
        if (!message || message.length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        // Show errors if any
        if (errors.length > 0) {
            showFormMessage(errors.join('<br>'), 'error');
            return false;
        }
        
        return true;
    }

    // Improved form message function
    function showFormMessage(message, type) {
        clearFormMessages();
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message status status--${type}`;
        messageElement.innerHTML = message;
        messageElement.style.marginBottom = 'var(--space-16)';
        
        // Insert message before the form
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageElement, form);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 5000);
        }
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Clear form messages function
    function clearFormMessages() {
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
    }

    // Add loading animation to project cards
    const projectCards = document.querySelectorAll('.project__card');
    const platformCards = document.querySelectorAll('.platform__card');

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project and platform cards
    [...projectCards, ...platformCards].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add hover effect to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });

        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Skip ripple effect for navigation buttons
            if (this.classList.contains('nav__link') || this.hasAttribute('href')) {
                return;
            }
            
            // Create ripple effect for form buttons
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Enhanced hero CTA button
    const heroCTA = document.querySelector('.hero__cta');
    if (heroCTA) {
        heroCTA.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = aboutSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Ensure all external links open in new tabs
    function ensureExternalLinksOpenInNewTabs() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    // Call the function to ensure external links work properly
    ensureExternalLinksOpenInNewTabs();

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.style.opacity = '0';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < originalText.length) {
                    heroTitle.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 80);
                }
            };
            typeWriter();
        }, 300);
    }

    // Add dynamic year to footer
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer p');
    if (footerText && footerText.textContent.includes('2025')) {
        footerText.textContent = footerText.textContent.replace('2025', currentYear);
    }

    // Initialize active nav link on page load
    setTimeout(highlightActiveNavLink, 100);

    console.log('Portfolio website loaded successfully!');
});


// Add CSS for ripple effect and enhanced styling
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    .nav__link.active {
        color: var(--color-primary) !important;
    }

    .nav__link.active::after {
        width: 100% !important;
    }

    .form-message {
        padding: var(--space-12);
        border-radius: var(--radius-base);
        animation: slideDown 0.3s ease-out;
        font-weight: var(--font-weight-medium);
    }

    .form-message.status--success {
        background-color: rgba(var(--color-success-rgb), 0.15);
        color: var(--color-success);
        border: 1px solid rgba(var(--color-success-rgb), 0.25);
    }

    .form-message.status--error {
        background-color: rgba(var(--color-error-rgb), 0.15);
        color: var(--color-error);
        border: 1px solid rgba(var(--color-error-rgb), 0.25);
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero__title {
        transition: opacity 0.3s ease;
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
`;

document.head.appendChild(style);