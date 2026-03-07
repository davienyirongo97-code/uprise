// Make stat cards clickable with beautiful interactions
document.addEventListener('DOMContentLoaded', function() {
    
    // Add click handlers to stat cards
    function makeStatsClickable() {
        const statCards = document.querySelectorAll('#adminDashboard .stat-card');
        
        statCards.forEach((card, index) => {
            // Add ripple effect on click
            card.addEventListener('click', function(e) {
                createRipple(e, this);
                handleStatCardClick(index);
            });
            
            // Add tooltips
            const tooltips = [
                'Click to view all clients',
                'Click to view active loans',
                'Click to view disbursement details',
                'Click to view defaults',
                'Click to view pending reviews',
                'Click to view approved loans'
            ];
            
            card.setAttribute('data-tooltip', tooltips[index] || 'Click for details');
        });
    }
    
    // Create ripple effect
    function createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Handle stat card clicks
    function handleStatCardClick(index) {
        const actions = [
            showAllClients,
            showActiveLoans,
            showDisbursementDetails,
            showDefaults,
            showPendingReviews,
            showApprovedLoans
        ];
        
        if (actions[index]) {
            // Add success feedback
            showNotification('Loading details...', 'info');
            actions[index]();
        }
    }
    
    // Action functions
    function showAllClients() {
        console.log('Showing all clients...');
        // Your existing function or create modal
        if (typeof showAllClientsModal === 'function') {
            showAllClientsModal();
        }
    }
    
    function showActiveLoans() {
        console.log('Showing active loans...');
        if (typeof showApprovedLoansModal === 'function') {
            showApprovedLoansModal();
        }
    }
    
    function showDisbursementDetails() {
        console.log('Showing disbursement details...');
        if (typeof showDisbursedModal === 'function') {
            showDisbursedModal();
        }
    }
    
    function showDefaults() {
        console.log('Showing defaults...');
        if (typeof showDefaultsModal === 'function') {
            showDefaultsModal();
        }
    }
    
    function showPendingReviews() {
        console.log('Showing pending reviews...');
        showAdminTab('loans');
    }
    
    function showApprovedLoans() {
        console.log('Showing approved loans...');
        if (typeof showApprovedLoansModal === 'function') {
            showApprovedLoansModal();
        }
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize
    makeStatsClickable();
    
    // Re-initialize when dashboard loads
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                makeStatsClickable();
            }
        });
    });
    
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) {
        observer.observe(adminDashboard, { childList: true, subtree: true });
    }
});
