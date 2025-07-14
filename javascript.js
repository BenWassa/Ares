// Digital Synopsis JavaScript - Structural Interactivity

document.addEventListener('DOMContentLoaded', function() {
    // ========== ELEMENTS ========== 
    const navToggle = document.getElementById('nav-toggle');
    const navContent = document.getElementById('nav-content');
    const stickyNav = document.getElementById('sticky-nav');
    const sidePanel = document.getElementById('side-panel');
    const backToTop = document.getElementById('back-to-top');
    const progressFill = document.getElementById('progress-fill');
    const mainContent = document.querySelector('.main-content');

    // ========== NAVIGATION TOGGLE ========== 
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        stickyNav.classList.toggle('active');
    });

    // Close navigation when clicking outside
    document.addEventListener('click', function(event) {
        if (!stickyNav.contains(event.target) && !navToggle.contains(event.target)) {
            navToggle.classList.remove('active');
            stickyNav.classList.remove('active');
        }
    });

    // ========== SCROLL PROGRESS INDICATOR ========== 
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.inner