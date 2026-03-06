// Add back button to login screen
document.addEventListener('DOMContentLoaded', function() {
    const loginBox = document.querySelector('.login-box');
    if (loginBox) {
        // Create back button
        const backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'btn-back-to-home';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Home';
        backButton.onclick = function() {
            showScreen('landingPage');
        };
        
        // Insert at the beginning of login box
        loginBox.insertBefore(backButton, loginBox.firstChild);
    }
});
