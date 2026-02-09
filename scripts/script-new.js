'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------
    // Smooth Scroll Navigation
    // ----------------------------
    const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                const hamburger = document.getElementById('hamburger');
                const navbarLinks = document.getElementById('navbar-links');
                if (hamburger && navbarLinks) {
                    hamburger.classList.remove('active');
                    navbarLinks.classList.remove('active');
                }
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ----------------------------
    // Active Navigation on Scroll
    // ----------------------------
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.navbar-links a[href="#${sectionId}"]`);
            
            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active-page'));
                navLink.classList.add('active-page');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation, { passive: true });

    // ----------------------------
    // Animations
    // ----------------------------
    const projectCards = document.querySelectorAll('.project-card');
    const skillCategories = document.querySelectorAll('.skill-category');
    const certificateCards = document.querySelectorAll('.certificate-card');

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
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        projectCards.forEach(card => observer.observe(card));
        skillCategories.forEach(skill => observer.observe(skill));
        certificateCards.forEach(cert => observer.observe(cert));

        // Lazy load videos - only load when near viewport
        const videos = document.querySelectorAll('.project-card video');
        
        if (videos.length > 0) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    
                    if (entry.isIntersecting && !video.dataset.loaded) {
                        const source = video.querySelector('source');
                        const videoSrc = video.dataset.src || (source ? source.dataset.src : null);
                        
                        if (videoSrc) {
                            if (source) source.src = videoSrc;
                            video.src = videoSrc;
                            video.load();
                            video.dataset.loaded = 'true';
                            
                            video.addEventListener('loadeddata', () => {
                                if (entry.isIntersecting) {
                                    video.play().catch(() => {});
                                }
                            }, { once: true });
                        }
                    } else if (!entry.isIntersecting && video.dataset.loaded) {
                        video.pause();
                    } else if (entry.isIntersecting && video.dataset.loaded) {
                        video.play().catch(() => {});
                    }
                });
            }, { 
                rootMargin: '100px',
                threshold: 0.1 
            });
            
            videos.forEach(video => videoObserver.observe(video));
        }
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
                        const videoSrc = video.dataset.src || (source ? source.dataset.src : null);
                        if (videoSrc && !video.src) {
                            if (source) source.src = videoSrc;
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
            const videos = modalBody.querySelectorAll('video');
            videos.forEach(v => v.pause());
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

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
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                allProjects.forEach(project => {
                    const category = project.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        project.classList.remove('hidden');
                    } else {
                        project.classList.add('hidden');
                    }
                });

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
                        alert('Message sent successfully! I\'ll get back to you soon.');
                        form.reset();
                    } else {
                        alert('Oops! Something went wrong.');
                    }
                })
                .catch(() => {
                    alert('Oops! Something went wrong.');
                });
        });
    }
});
