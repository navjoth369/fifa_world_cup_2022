// FIFA World Cup 2022 Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNavigation();
    
    // Add fade-in animation to elements
    addFadeInAnimation();
    
    // Initialize group filtering if on teams page
    if (window.location.pathname.includes('teams.html')) {
        initGroupFiltering();
    }
    
    // Initialize match filtering if on fixtures page
    if (window.location.pathname.includes('fixtures.html')) {
        initMatchFiltering();
    }
    
    // Contact form handling
    if (window.location.pathname.includes('contact.html')) {
        initContactForm();
    }
    
    // Set active navigation item
    setActiveNavItem();
});

// Mobile Navigation
function initMobileNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking on a nav item
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }
}

// Fade-in Animation
function addFadeInAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe cards and sections
    const elementsToAnimate = document.querySelectorAll('.card, .team-card, .match-card, section');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Group Filtering for Teams Page
function initGroupFiltering() {
    const groupFilter = document.getElementById('group-filter');
    const teamCards = document.querySelectorAll('.team-card');
    
    if (groupFilter && teamCards.length > 0) {
        groupFilter.addEventListener('change', function() {
            const selectedGroup = this.value;
            
            teamCards.forEach(card => {
                const cardGroup = card.dataset.group;
                
                if (selectedGroup === 'all' || cardGroup === selectedGroup) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Match Filtering for Fixtures Page
function initMatchFiltering() {
    const stageFilter = document.getElementById('stage-filter');
    const matchCards = document.querySelectorAll('.match-card');
    
    if (stageFilter && matchCards.length > 0) {
        stageFilter.addEventListener('change', function() {
            const selectedStage = this.value;
            
            matchCards.forEach(card => {
                const cardStage = card.dataset.stage;
                
                if (selectedStage === 'all' || cardStage === selectedStage) {
                    card.style.display = 'flex';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    if (type === 'success') {
        notification.style.background = '#28a745';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Set active navigation item
function setActiveNavItem() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        if (currentPath.includes(linkPath) || (currentPath === '/' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Tournament countdown (even though it's in the past, for demo purposes)
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    
    if (countdownElement) {
        const finalDate = new Date('2022-12-18T15:00:00Z'); // Final match date
        const now = new Date();
        
        if (now > finalDate) {
            countdownElement.innerHTML = '<h3>🏆 Tournament Completed!</h3><p>Argentina won the 2022 FIFA World Cup</p>';
            countdownElement.classList.add('winner-highlight');
        } else {
            // This would work if the tournament was in the future
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = finalDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.innerHTML = `
                <h3>Time to Final:</h3>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <div><strong>${days}</strong><br>Days</div>
                    <div><strong>${hours}</strong><br>Hours</div>
                    <div><strong>${minutes}</strong><br>Minutes</div>
                    <div><strong>${seconds}</strong><br>Seconds</div>
                </div>
            `;
        }
    }
}

// Initialize countdown if element exists
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
});

// World Cup data for dynamic content
const worldCupData = {
    groups: {
        'A': ['Qatar', 'Ecuador', 'Senegal', 'Netherlands'],
        'B': ['England', 'Iran', 'USA', 'Wales'],
        'C': ['Argentina', 'Saudi Arabia', 'Mexico', 'Poland'],
        'D': ['France', 'Australia', 'Denmark', 'Tunisia'],
        'E': ['Spain', 'Costa Rica', 'Germany', 'Japan'],
        'F': ['Belgium', 'Canada', 'Morocco', 'Croatia'],
        'G': ['Brazil', 'Serbia', 'Switzerland', 'Cameroon'],
        'H': ['Portugal', 'Ghana', 'Uruguay', 'South Korea']
    },
    
    knockoutResults: {
        'Round of 16': [
            'Netherlands 3-1 USA',
            'Argentina 2-1 Australia',
            'France 3-1 Poland',
            'England 3-0 Senegal',
            'Japan 1(1)-1(3) Croatia',
            'Brazil 4-1 South Korea',
            'Morocco 0(3)-0(0) Spain',
            'Portugal 6-1 Switzerland'
        ],
        'Quarter-finals': [
            'Croatia 1(4)-1(2) Brazil',
            'Netherlands 2(3)-2(4) Argentina',
            'Morocco 1-0 Portugal',
            'France 2-1 England'
        ],
        'Semi-finals': [
            'Argentina 3-0 Croatia',
            'France 2-0 Morocco'
        ],
        'Final': 'Argentina 4-2 France (3-3 AET, 4-2 Pens)'
    },
    
    finalStandings: [
        { position: 1, team: 'Argentina', flag: '🇦🇷' },
        { position: 2, team: 'France', flag: '🇫🇷' },
        { position: 3, team: 'Croatia', flag: '🇭🇷' },
        { position: 4, team: 'Morocco', flag: '🇲🇦' }
    ]
};

// Export data for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = worldCupData;
} else {
    window.worldCupData = worldCupData;
}
