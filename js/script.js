document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const formBtn = document.querySelector('.form-btn');
    const formContainer = document.querySelector('.form-container');

    menuToggle.addEventListener('click', () => {
        if (formContainer.classList.contains('show-form')) {
            formContainer.classList.remove('show-form');
        }
        nav.classList.toggle('show-menu');
        menuToggle.classList.toggle('active');
    });
    formBtn.addEventListener('click', () => {
        // Close menu if open
        if (nav.classList.contains('show-menu')) {
            nav.classList.remove('show-menu');
            menuToggle.classList.remove('active');
        }
        formContainer.classList.toggle('show-form');
    });
});



