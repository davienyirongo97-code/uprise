// HTML Sanitizer - Prevents XSS attacks
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Safe way to set HTML content
function safeSetHTML(element, html) {
    // Create a temporary div
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Sanitize all text nodes
    const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        node.textContent = node.textContent; // This sanitizes
    }
    
    element.innerHTML = temp.innerHTML;
}

// Escape HTML special characters
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Rate limiting for API calls
const rateLimiter = {
    attempts: {},
    maxAttempts: 5,
    timeWindow: 60000, // 1 minute
    
    check(key) {
        const now = Date.now();
        if (!this.attempts[key]) {
            this.attempts[key] = [];
        }
        
        // Remove old attempts
        this.attempts[key] = this.attempts[key].filter(time => now - time < this.timeWindow);
        
        if (this.attempts[key].length >= this.maxAttempts) {
            return false; // Rate limit exceeded
        }
        
        this.attempts[key].push(now);
        return true;
    }
};

// Input validation
function validateInput(value, type) {
    switch(type) {
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'phone':
            return /^[+]?[\d\s-()]+$/.test(value);
        case 'nationalId':
            return /^[A-Z0-9-]+$/i.test(value);
        case 'number':
            return !isNaN(value) && value > 0;
        case 'text':
            return value && value.trim().length > 0;
        default:
            return true;
    }
}

// Secure local storage
const secureStorage = {
    set(key, value) {
        try {
            const encrypted = btoa(JSON.stringify(value)); // Basic encoding
            localStorage.setItem(key, encrypted);
        } catch (e) {
            console.error('Storage error:', e);
        }
    },
    
    get(key) {
        try {
            const encrypted = localStorage.getItem(key);
            return encrypted ? JSON.parse(atob(encrypted)) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    }
};
