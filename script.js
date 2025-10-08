// MarketGap - JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Sidebar Toggle for Dashboard
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Chart Controls Functionality
    const chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            chartButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically update the chart data
            // For demo purposes, we'll just animate the chart lines
            animateChartLines();
        });
    });

    // Animate Chart Lines
    function animateChartLines() {
        const chartLines = document.querySelectorAll('.chart-line');
        chartLines.forEach((line, index) => {
            line.style.transform = 'scaleY(0)';
            setTimeout(() => {
                line.style.transform = 'scaleY(1)';
            }, index * 100);
        });
    }

    // Notification Badge Animation
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            const badge = this.querySelector('.notification-badge');
            if (badge) {
                badge.style.animation = 'pulse 0.3s ease-in-out';
                setTimeout(() => {
                    badge.style.animation = '';
                }, 300);
            }
        });
    }

    // Stats Counter Animation
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    animateValue(target, 0, parseFloat(finalValue.replace(/[^\d.]/g, '')), 2000, finalValue.includes('%') ? '%' : finalValue.includes('k') ? 'k+' : '');
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    function animateValue(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * easeOutCubic(progress);
            
            if (suffix === '%') {
                element.textContent = Math.floor(current) + '%';
            } else if (suffix === 'k+') {
                element.textContent = (current / 1000).toFixed(1) + 'k+';
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Initialize counter animation
    animateCounters();

    // Opportunity Score Animation
    const scoreCircles = document.querySelectorAll('.score-circle');
    scoreCircles.forEach(circle => {
        const score = parseInt(circle.textContent);
        circle.style.background = `conic-gradient(
            ${getScoreColor(score)} ${score * 3.6}deg,
            rgba(255, 255, 255, 0.2) ${score * 3.6}deg
        )`;
    });

    function getScoreColor(score) {
        if (score >= 80) return 'linear-gradient(135deg, #43e97b 0%, #10b981 100%)';
        if (score >= 60) return 'linear-gradient(135deg, #fee140 0%, #f59e0b 100%)';
        return 'linear-gradient(135deg, #4facfe 0%, #3b82f6 100%)';
    }

    // Search Functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            // Here you would implement actual search functionality
            // For demo purposes, we'll just show a simple filter effect
            filterOpportunities(searchTerm);
        });
    }

    function filterOpportunities(searchTerm) {
        const opportunities = document.querySelectorAll('.opportunity-item');
        opportunities.forEach(opportunity => {
            const title = opportunity.querySelector('h4').textContent.toLowerCase();
            const description = opportunity.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                opportunity.style.display = 'flex';
                opportunity.style.animation = 'fadeIn 0.3s ease-in-out';
            } else {
                opportunity.style.display = searchTerm === '' ? 'flex' : 'none';
            }
        });
    }

    // Pricing Card Hover Effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            } else {
                this.style.transform = 'translateY(0) scale(1.05)';
            }
        });
    });

    // Feature Card Animations
    const featureCards = document.querySelectorAll('.feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-fade-in-up');
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    featureCards.forEach(card => {
        cardObserver.observe(card);
    });

    // Dashboard Card Interactions
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });

    // Opportunity Item Click Handler
    const opportunityItems = document.querySelectorAll('.opportunity-item');
    opportunityItems.forEach(item => {
        item.addEventListener('click', function() {
            // Here you would typically navigate to a detailed view
            // For demo purposes, we'll just show an alert
            const title = this.querySelector('h4').textContent;
            showNotification(`Abrindo detalhes para: ${title}`, 'info');
        });
    });

    // Action Button Handlers
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('span').textContent;
            showNotification(`Executando: ${action}`, 'success');
            
            // Add loading state
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processando...</span>';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    padding: var(--spacing-4);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-3);
                    z-index: 10000;
                    min-width: 300px;
                    border-left: 4px solid;
                    animation: slideInRight 0.3s ease-out;
                }
                .notification-info { border-left-color: var(--info-color); }
                .notification-success { border-left-color: var(--success-color); }
                .notification-warning { border-left-color: var(--warning-color); }
                .notification-error { border-left-color: var(--danger-color); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-2);
                    flex: 1;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--gray-400);
                    cursor: pointer;
                    padding: var(--spacing-1);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'error': return 'exclamation-circle';
            default: return 'info-circle';
        }
    }

    // Sidebar Navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Update main content based on navigation
            const section = this.getAttribute('href').substring(1);
            updateDashboardContent(section);
        });
    });

    function updateDashboardContent(section) {
        const mainContent = document.querySelector('.dashboard-content');
        if (!mainContent) return;
        
        // Here you would typically load different content based on the section
        // For demo purposes, we'll just show a notification
        showNotification(`Navegando para: ${section.replace('-', ' ').toUpperCase()}`, 'info');
        
        // Update page title
        const pageTitle = document.querySelector('.top-bar h1');
        if (pageTitle) {
            pageTitle.textContent = section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
    }

    // Initialize tooltips (if needed)
    function initTooltips() {
        const elementsWithTooltips = document.querySelectorAll('[data-tooltip]');
        elementsWithTooltips.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }

    function showTooltip(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Initialize all functionality
    initTooltips();
    
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Processando...';
                submitBtn.disabled = true;
                
                // Simulate form processing
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    showNotification('Formulário enviado com sucesso!', 'success');
                }, 2000);
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-box input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals/sidebars
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar.open');
            if (sidebar) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        showNotification('Ocorreu um erro inesperado. Tente novamente.', 'error');
    });

    // Service Worker registration (for PWA capabilities)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }
});

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for external use
window.MarketGap = {
    showNotification: function(message, type) {
        // This function is available globally
        const event = new CustomEvent('showNotification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }
};