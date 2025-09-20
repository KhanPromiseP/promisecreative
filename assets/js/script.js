document.addEventListener('DOMContentLoaded', function() {
    // --- Preloader Elements & Initial Setup ---
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.progress-bar');
    const SESSION_VISITED_KEY = 'site_visited_this_session'; // Flag to mark if any page has been visited in this session

    // Function to hide the preloader (defined once)
    function hidePreloader() {
        if (preloader) {
            // Check if preloader is currently visible or animating
            if (preloader.style.opacity === '1' || preloader.style.display === 'flex') {
                preloader.style.opacity = '0'; // Start fade out
                preloader.addEventListener('transitionend', () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }, { once: true });

                // Fallback: Ensure it's hidden even if transitionend doesn't fire or there's no CSS transition
                setTimeout(() => {
                    if (preloader.style.display !== 'none') {
                        preloader.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                }, 600); // Should be slightly longer than your fade-out transition duration
            } else {
                // If preloader is already hidden or not visible, just ensure styles are correct
                preloader.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
    }

    // --- Main Preloader Control Logic ---

    // 1. Check if the user has visited any page in this session.
    // This flag is set true as soon as ANY page loads with the preloader logic.
    const hasVisitedInSession = sessionStorage.getItem(SESSION_VISITED_KEY);

    // 2. Determine the type of navigation (fresh load vs. reload/back_forward)
    let isFreshNavigation = true; // Assume fresh unless proven otherwise
    if (window.performance && window.performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0) {
            const navigationType = navigationEntries[0].type;
            if (navigationType === 'back_forward' || navigationType === 'reload') {
                isFreshNavigation = false;
            }
        }
    } else if (window.performance && window.performance.navigation) { // Deprecated fallback
        const navigationType = performance.navigation.type;
        if (navigationType === performance.navigation.TYPE_BACK_FORWARD || navigationType === performance.navigation.TYPE_RELOAD) {
            isFreshNavigation = false;
        }
    }

    // 3. Check if the current page is the "main" page (index.html or root URL)
    // Adjust this regex if your main page URL is more complex than just '/' or '/index.html'
    const isMainPage = window.location.pathname === '/' ||
                       window.location.pathname === '/index.html' ||
                       window.location.pathname === '/index.htm'; // Common variations

    // --- DECISION POINT FOR PRELOADER ---
    // The main, custom preloader animation will ONLY run if:
    // A) It's the very first time the user has ever landed on this site *in this session*.
    // B) AND that first landing is directly on the *main* page (index.html).
    // C) AND it's a fresh navigation (not a reload or back/forward).
    if (!hasVisitedInSession && isMainPage && isFreshNavigation) {
        // This is a true first visit to the main page.
        sessionStorage.setItem(SESSION_VISITED_KEY, 'true'); // Mark as visited for this session

        // Ensure preloader is visible initially with full opacity
        if (preloader) {
            preloader.style.display = 'flex'; // Or 'block', depending on your CSS
            preloader.style.opacity = '1'; // Ensure it's opaque at the start
            document.body.style.overflow = 'hidden'; // Prevent scrolling during preloader animation
        }

        // --- Your EXISTING Preloader Animation Logic (now conditional) ---
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);

                // Hide preloader when your simulated loading is complete
                setTimeout(() => {
                    hidePreloader(); // Call the unified hidePreloader function
                }, 300); // Original delay after progress complete
            }
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }, 100);

    } else {
        // --- NO CUSTOM PRELOADER FOR THESE CASES ---
        // If it's not the very first visit to the main page, or it's a reload/back/forward,
        // then we immediately hide the custom preloader.
        hidePreloader();
    }

    // Optional: Smooth scroll to section if URL has a hash (e.g., #services)
    if (window.location.hash) {
        // Delay ensures the page content is fully rendered before scrolling
        // This is important for "Back to Services" links that use hashes.
        setTimeout(() => {
            const targetSection = document.querySelector(window.location.hash);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 0); // Small delay to allow layout to settle
    }


    // Initialize Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#6c63ff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#6c63ff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or use preferred color scheme
const savedTheme = localStorage.getItem('theme') ||
(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply the saved theme
if (savedTheme === 'dark') {
html.setAttribute('data-theme', 'dark');
themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
}

themeToggle.addEventListener('click', function() {
if (html.getAttribute('data-theme') === 'dark') {
html.removeAttribute('data-theme');
localStorage.setItem('theme', 'light');
themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
} else {
html.setAttribute('data-theme', 'dark');
localStorage.setItem('theme', 'dark');
themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
}
});

    // Typewriter Effect
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement;
            this.words = words;
            this.txt = '';
            this.wordIndex = 0;
            this.wait = parseInt(wait, 10);
            this.type();
            this.isDeleting = false;
        }

        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

            let typeSpeed = 200;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }

            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 500;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

// Auto-close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Add this JavaScript for the explicit close button
document.querySelector('.navbar-close-btn').addEventListener('click', function() {
    const navbar = document.querySelector('.navbar-collapse');
    const bsCollapse = bootstrap.Collapse.getInstance(navbar) || new bootstrap.Collapse(navbar);
    bsCollapse.hide();
});

// --- NEW: Close mobile menu when clicking outside ---
document.addEventListener('click', function(event) {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler'); // Get the hamburger icon button

    // Check if the navbar is currently open
    if (navbarCollapse.classList.contains('show')) {
        // Check if the click was outside the navbar itself AND not on the toggler button
        // .contains(event.target) checks if the clicked element is within the navbarCollapse
        // or if the clicked element IS the navbarToggler
        if (!navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }
});


    // Init TypeWriter
    const txtElement = document.querySelector('.typewrite');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-type'));
        const wait = txtElement.getAttribute('data-period');
        new TypeWriter(txtElement, words, wait);
    }

    // Stats Counter Animation
    const statItems = document.querySelectorAll('.stat-item');
    const statsSection = document.querySelector('.stats-section');

    function animateStats() {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75) &&
            (rect.bottom >= window.innerHeight * 0.25);

        if (isVisible) {
            statItems.forEach(item => {
                const numberElement = item.querySelector('.stat-number');
                const target = parseInt(numberElement.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        clearInterval(timer);
                        current = target;
                    }
                    numberElement.textContent = Math.floor(current);
                }, 16);
            });

            // Remove event listener after animation
            window.removeEventListener('scroll', animateStatsOnScroll);
        }
    }

    function animateStatsOnScroll() {
        animateStats();
    }

    window.addEventListener('scroll', animateStatsOnScroll);

    // Portfolio Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    // Auto-rotate testimonials
    let testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);

    // Pause auto-rotation on hover
    const testimonialSlider = document.querySelector('.testimonials-slider');
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });

    testimonialSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    });

    

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll Animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.75) {
                element.classList.add('animated');
            }
        });
    }

    // Initial check
    checkScroll();

    // Check on scroll
    window.addEventListener('scroll', checkScroll);
});