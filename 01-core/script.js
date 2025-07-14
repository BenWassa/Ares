// Digital Synopsis JavaScript - Complete Interactivity for Project Ares
// Handles navigation, tooltips, progress tracking, and glossary integration

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
    if (navToggle && stickyNav) {
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
    }

    // ========== SCROLL PROGRESS INDICATOR ========== 
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        if (progressFill) {
            progressFill.style.width = Math.min(progress, 100) + '%';
        }
    }

    // ========== BACK TO TOP FUNCTIONALITY ========== 
    function updateBackToTop() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== SCROLL HANDLERS ========== 
    window.addEventListener('scroll', function() {
        updateProgressBar();
        updateBackToTop();
        updateActiveNavItem();
    });

    // ========== ACTIVE NAVIGATION ITEM ========== 
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('.section, .subsection');
        const navLinks = document.querySelectorAll('.nav-content a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ========== GLOSSARY SYSTEM ========== 
    let glossaryData = {};

    // Load glossary data
    async function loadGlossary() {
        try {
            const response = await fetch('./data/glossary.json');
            const data = await response.json();
            glossaryData = data.glossary;
            initializeGlossaryTerms();
        } catch (error) {
            console.warn('Could not load glossary data:', error);
        }
    }

    // Initialize glossary terms
    function initializeGlossaryTerms() {
        document.querySelectorAll('.glossary-term').forEach(function(el) {
            const term = el.getAttribute('data-term');
            const definition = glossaryData[term];
            
            if (definition) {
                el.setAttribute('data-definition', definition.definition);
                el.addEventListener('mouseenter', showTooltip);
                el.addEventListener('mouseleave', hideTooltip);
                el.addEventListener('click', showInSidePanel);
            }
        });
    }

    // Tooltip functionality
    function showTooltip(event) {
        const el = event.target;
        const def = el.getAttribute('data-definition');
        
        if (def && !el._tip) {
            const tip = document.createElement('div');
            tip.className = 'glossary-tooltip';
            tip.textContent = def;
            tip.style.position = 'absolute';
            tip.style.background = '#fffbe6';
            tip.style.border = '1px solid #c1440e';
            tip.style.padding = '0.5em 1em';
            tip.style.borderRadius = '4px';
            tip.style.maxWidth = '300px';
            tip.style.fontSize = '0.9rem';
            tip.style.lineHeight = '1.4';
            tip.style.zIndex = '1000';
            tip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            
            const rect = el.getBoundingClientRect();
            tip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
            tip.style.left = (rect.left + window.scrollX) + 'px';
            
            document.body.appendChild(tip);
            el._tip = tip;
        }
    }

    function hideTooltip(event) {
        const el = event.target;
        if (el._tip) {
            document.body.removeChild(el._tip);
            el._tip = null;
        }
    }

    // Side panel functionality
    function showInSidePanel(event) {
        const el = event.target;
        const term = el.getAttribute('data-term');
        const definition = glossaryData[term];
        
        if (definition && sidePanel) {
            const content = sidePanel.querySelector('.concept-placeholder');
            if (content) {
                content.innerHTML = `
                    <h5>${definition.term}</h5>
                    <p><strong>Definition:</strong> ${definition.definition}</p>
                    ${definition.extendedDefinition ? `<p><strong>Extended:</strong> ${definition.extendedDefinition}</p>` : ''}
                    ${definition.relatedTerms ? `<p><strong>Related:</strong> ${definition.relatedTerms.join(', ')}</p>` : ''}
                `;
                content.style.textAlign = 'left';
                content.style.fontStyle = 'normal';
                content.style.background = 'white';
                content.style.border = 'none';
            }
            sidePanel.classList.add('active');
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                sidePanel.classList.remove('active');
            }, 10000);
        }
    }

    // ========== EXPANDABLE SECTIONS ========== 
    function initializeExpandables() {
        document.querySelectorAll('.expandable-trigger').forEach(trigger => {
            trigger.addEventListener('click', function() {
                const target = document.querySelector(this.getAttribute('data-target'));
                if (target) {
                    target.classList.toggle('expanded');
                    this.classList.toggle('expanded');
                }
            });
        });
    }

    // ========== SMOOTH SCROLLING FOR INTERNAL LINKS ========== 
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close navigation if open
                if (navToggle && stickyNav) {
                    navToggle.classList.remove('active');
                    stickyNav.classList.remove('active');
                }
            }
        });
    });

    // ========== KEYBOARD NAVIGATION ========== 
    document.addEventListener('keydown', function(e) {
        // ESC key closes navigation and side panel
        if (e.key === 'Escape') {
            if (navToggle && stickyNav) {
                navToggle.classList.remove('active');
                stickyNav.classList.remove('active');
            }
            if (sidePanel) {
                sidePanel.classList.remove('active');
            }
        }
    });

    // ========== INITIALIZATION ========== 
    loadGlossary();
    initializeExpandables();
    updateProgressBar();
    updateBackToTop();
    updateActiveNavItem();
    
    // Initial setup
    console.log('Project Ares Digital Synopsis initialized successfully');
});
