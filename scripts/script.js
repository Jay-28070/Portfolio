'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------
    // Loading Screen - Optimized
    // ----------------------------
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
        // Hide loading screen immediately to allow scrolling
        const hideLoader = () => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        };
        
        // Hide after a very short delay (just enough to show it briefly)
        setTimeout(hideLoader, 300);
    }

    // ----------------------------
    // Animations
    // ----------------------------

    //Heading animation (Greeting page)
    const greeting = document.querySelector('.greeting-h1'); // class, not ID
    if (greeting) {
        greeting.classList.add('show');
    }

    //Sections (Resume) and Project Cards (Projects page) animations
    const sections = document.querySelectorAll('.section');
    const projectCards = document.querySelectorAll('.project-card');

    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -15% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all sections and project cards
        sections.forEach(section => observer.observe(section));
        projectCards.forEach(card => observer.observe(card));

        // Lazy load videos - only load when near viewport
        const videos = document.querySelectorAll('.project-card video');
        
        if (videos.length > 0) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    
                    if (entry.isIntersecting && !video.dataset.loaded) {
                        // Load the video source
                        const source = video.querySelector('source');
                        const videoSrc = video.dataset.src || (source ? source.dataset.src : null);
                        
                        if (videoSrc) {
                            if (source) source.src = videoSrc;
                            video.src = videoSrc;
                            video.load();
                            video.dataset.loaded = 'true';
                            
                            // Play video when loaded
                            video.addEventListener('loadeddata', () => {
                                if (entry.isIntersecting) {
                                    video.play().catch(() => {});
                                }
                            }, { once: true });
                        }
                    } else if (!entry.isIntersecting && video.dataset.loaded) {
                        // Pause video when out of view
                        video.pause();
                    } else if (entry.isIntersecting && video.dataset.loaded) {
                        // Resume playing if scrolled back into view
                        video.play().catch(() => {});
                    }
                });
            }, { 
                rootMargin: '100px',
                threshold: 0.1 
            });
            
            videos.forEach(video => videoObserver.observe(video));
        }
    } else {
        // Fallback for older browsers
        function revealElements(elements) {
            const windowHeight = window.innerHeight;

            elements.forEach(el => {
                if (el.classList.contains('show')) return;

                const elTop = el.getBoundingClientRect().top;

                if (elTop < windowHeight * 0.85) {
                    el.classList.add('show');
                }
            });
        }

        function revealAll() {
            revealElements(sections);
            revealElements(projectCards);
        }

        let ticking = false;
        function throttledReveal() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    revealAll();
                    ticking = false;
                });
                ticking = true;
            }
        }

        revealAll();
        window.addEventListener('scroll', throttledReveal, { passive: true });
    }

    // ----------------------------
    // Project Modals
    // ----------------------------
    const modal = document.getElementById('project-modal');
    const modalBody = modal ? modal.querySelector('.modal-body') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
    const infoButtons = document.querySelectorAll('.btn-info');

    if (modal && modalBody) {
        // Open modal
        infoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                const template = document.getElementById(modalId);
                
                if (template) {
                    modalBody.innerHTML = template.innerHTML;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';

                    // Load videos in modal if present
                    const modalVideos = modalBody.querySelectorAll('video[data-src]');
                    modalVideos.forEach(video => {
                        const source = video.querySelector('source');
                        const videoSrc = video.dataset.src || source.dataset.src;
                        if (videoSrc && !video.src) {
                            source.src = videoSrc;
                            video.src = videoSrc;
                            video.load();
                        }
                    });
                }
            });
        });

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Pause any playing videos
            const videos = modalBody.querySelectorAll('video');
            videos.forEach(v => v.pause());
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ----------------------------
    // Project Filters
    // ----------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allProjects = document.querySelectorAll('.project-card');
    const subheadings = document.querySelectorAll('.subheading');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Filter projects
                allProjects.forEach(project => {
                    const category = project.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        project.classList.remove('hidden');
                    } else {
                        project.classList.add('hidden');
                    }
                });

                // Show/hide subheadings based on visible projects
                subheadings.forEach(heading => {
                    const nextGrid = heading.nextElementSibling;
                    if (nextGrid && nextGrid.classList.contains('projects-grid')) {
                        const visibleCards = nextGrid.querySelectorAll('.project-card:not(.hidden)');
                        heading.style.display = visibleCards.length > 0 ? 'block' : 'none';
                    }
                });
            });
        });
    }

    // ----------------------------
    // Hamburger Menu
    // ----------------------------
    const hamburger = document.getElementById('hamburger');
    const navbarLinks = document.getElementById('navbar-links');

    if (hamburger && navbarLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navbarLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navbarLinks.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navbarLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navbarLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navbarLinks.classList.remove('active');
            }
        });
    }

    // ----------------------------
    // Contact Form
    // ----------------------------
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); 

            fetch('https://formspree.io/f/meovjbpd', { 
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
                .then(response => {
                    if (response.ok) {
                        window.location.href = "thanks.html"; 
                    } else {
                        alert('Oops! Something went wrong.');
                    }
                })
                .catch(() => {
                    alert('Oops! Something went wrong.');
                });
        });
    }

    // ----------------------------
    // Force download CV
    // ----------------------------
    const downloadCv = document.getElementById('download-cv');
    if (downloadCv) {
        downloadCv.addEventListener('click', function (e) {
            e.preventDefault();
            fetch('../media/other/cv.pdf')
                .then(resp => resp.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'JasonWilliamsCV.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                })
        });
    }
});
