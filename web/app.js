// API Configuration
const API_BASE_URL = 'http://localhost:8081/api';
let authToken = null;
let currentUser = null;

// Utility Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'clients') {
        loadClients();
    } else if (tabName === 'loans') {
        loadBranchLoans();
    } else if (tabName === 'apply') {
        loadClientsForLoan();
    }
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(API_BASE_URL + endpoint, options);
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Request failed');
        }
        
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const response = await apiCall('/auth/login', 'POST', { username, password });
        
        authToken = response.token;
        currentUser = response;
        
        if (response.role === 'ADMIN') {
            showScreen('adminDashboard');
            loadAdminData();
        } else {
            showScreen('branchDashboard');
            loadClients();
        }
    } catch (error) {
        errorDiv.textContent = 'Login failed. Please check your credentials.';
    }
});

function logout() {
    authToken = null;
    currentUser = null;
    document.getElementById('loginForm').reset();
    showScreen('loginScreen');
}

// Admin Functions
async function loadAdminData() {
    try {
        const pendingLoans = await apiCall('/admin/loans/pending');
        
        document.getElementById('pendingCount').textContent = pendingLoans.length;
        
        const pendingLoansDiv = document.getElementById('pendingLoans');
        pendingLoansDiv.innerHTML = '';
        
        if (pendingLoans.length === 0) {
            pendingLoansDiv.innerHTML = '<p style="color: #666;">No pending loan applications</p>';
            return;
        }
        
        pendingLoans.forEach(loan => {
            const loanCard = document.createElement('div');
            loanCard.className = 'loan-card';
            loanCard.innerHTML = `
                <div class="loan-info">
                    <h3>Loan #${loan.loanNumber}</h3>
                    <p><strong>Client:</strong> ${loan.clientName}</p>
                    <p><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                    <p><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</p>
                    <p><strong>Purpose:</strong> ${loan.loanPurpose}</p>
                    <p><strong>Branch:</strong> ${loan.branchName}</p>
                    <span class="badge badge-pending">Pending</span>
                </div>
                <div class="loan-actions">
                    <button class="btn btn-success" onclick="approveLoan(${loan.id})">Approve</button>
                    <button class="btn btn-danger" onclick="rejectLoan(${loan.id})">Reject</button>
                </div>
            `;
            pendingLoansDiv.appendChild(loanCard);
        });
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

async function approveLoan(loanId) {
    try {
        await apiCall(`/admin/loans/${loanId}/approve`, 'POST', {
            interestRate: 12.0
        });
        alert('Loan approved successfully!');
        loadAdminData();
    } catch (error) {
        alert('Failed to approve loan: ' + error.message);
    }
}

async function rejectLoan(loanId) {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
        await apiCall(`/admin/loans/${loanId}/reject`, 'POST', {
            rejectionReason: reason
        });
        alert('Loan rejected');
        loadAdminData();
    } catch (error) {
        alert('Failed to reject loan: ' + error.message);
    }
}

// Branch Functions
async function loadClients() {
    try {
        const clients = await apiCall('/branch/clients');
        
        const clientsList = document.getElementById('clientsList');
        clientsList.innerHTML = '';
        
        if (clients.length === 0) {
            clientsList.innerHTML = '<p style="color: #666;">No clients registered yet</p>';
            return;
        }
        
        clients.forEach(client => {
            const clientItem = document.createElement('div');
            clientItem.className = 'list-item';
            clientItem.innerHTML = `
                <h3>${client.fullName}</h3>
                <p><strong>National ID:</strong> ${client.nationalId}</p>
                <p><strong>Phone:</strong> ${client.phoneNumber}</p>
                <p><strong>Email:</strong> ${client.email || 'N/A'}</p>
                <p><strong>Address:</strong> ${client.address || 'N/A'}</p>
            `;
            clientsList.appendChild(clientItem);
        });
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

async function loadBranchLoans() {
    try {
        const loans = await apiCall('/branch/loans');
        
        const loansList = document.getElementById('loansList');
        loansList.innerHTML = '';
        
        if (loans.length === 0) {
            loansList.innerHTML = '<p style="color: #666;">No loan applications yet</p>';
            return;
        }
        
        loans.forEach(loan => {
            const loanItem = document.createElement('div');
            loanItem.className = 'list-item';
            loanItem.innerHTML = `
                <h3>Loan #${loan.loanNumber}</h3>
                <p><strong>Client:</strong> ${loan.clientName}</p>
                <p><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                <p><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</p>
                <p><strong>Purpose:</strong> ${loan.loanPurpose}</p>
                <span class="badge badge-${loan.status.toLowerCase()}">${loan.status}</span>
            `;
            loansList.appendChild(loanItem);
        });
    } catch (error) {
        console.error('Error loading loans:', error);
    }
}

async function loadClientsForLoan() {
    try {
        const clients = await apiCall('/branch/clients');
        const select = document.getElementById('loanClient');
        select.innerHTML = '<option value="">-- Select Client --</option>';
        
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.fullName} (${client.nationalId})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading clients:', error);
    }
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('registerMessage');
    
    const clientData = {
        fullName: document.getElementById('clientName').value,
        nationalId: document.getElementById('nationalId').value,
        dateOfBirth: document.getElementById('dob').value,
        phoneNumber: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };
    
    try {
        await apiCall('/branch/clients', 'POST', clientData);
        messageDiv.className = 'message success';
        messageDiv.textContent = 'Client registered successfully!';
        document.getElementById('registerForm').reset();
        
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000);
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Failed to register client: ' + error.message;
    }
});

document.getElementById('loanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('loanMessage');
    
    const loanData = {
        clientId: parseInt(document.getElementById('loanClient').value),
        requestedAmount: parseFloat(document.getElementById('loanAmount').value),
        repaymentPeriodMonths: parseInt(document.getElementById('repaymentPeriod').value),
        loanPurpose: document.getElementById('loanPurpose').value
    };
    
    try {
        await apiCall('/branch/loans', 'POST', loanData);
        messageDiv.className = 'message success';
        messageDiv.textContent = 'Loan application submitted successfully!';
        document.getElementById('loanForm').reset();
        
        setTimeout(() => {
            messageDiv.textContent = '';
        }, 3000);
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Failed to submit loan application: ' + error.message;
    }
});

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-RW', {
        style: 'currency',
        currency: 'RWF'
    }).format(amount);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showScreen('loginScreen');
});
