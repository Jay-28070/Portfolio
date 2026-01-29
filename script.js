'use strict';

document.addEventListener('DOMContentLoaded', () => {
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

    function revealElements(elements) {
        const windowHeight = window.innerHeight;

        elements.forEach(el => {
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

    // Throttle function to limit scroll event firing
    let scrollTimeout;
    function throttledReveal() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                revealAll();
                scrollTimeout = null;
            }, 50);
        }
    }

    // Run once on page load (to show already visible elements)
    revealAll();

    // Run on scroll with throttling
    window.addEventListener('scroll', throttledReveal, { passive: true });

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
                        window.location.href = "thankyou.html"; 
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
            fetch('cv.pdf')
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
