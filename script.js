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

    // Run once on page load (to show already visible elements)
    revealAll();

    // Run on scroll
    window.addEventListener('scroll', revealAll);

    // Run on scroll and on load
    revealIntro();
    window.addEventListener('scroll', revealIntro);

    // ----------------------------
    // Contact Form
    // ----------------------------
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent default submission

        fetch('https://formspree.io/f/YOUR_FORM_ID', { // replace with your endpoint
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = "thankyou.html"; // redirect to your page
                } else {
                    alert('Oops! Something went wrong.');
                }
            })
            .catch(() => {
                alert('Oops! Something went wrong.');
            });
    });

    // ----------------------------
    // Force download CV
    // ----------------------------
    document.getElementById('download-cv').addEventListener('click', function (e){
        e.preventDefault();
        fetch('cv.pdf')
        .then(resp => resp.blop())
        .then(blob => {
            const url = window.url.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'JasonWilliamsCV.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            
        })
    })
});
