// Demo Mode - No Backend Required
let currentUser = null;

// Mock data
const mockClients = [
    { id: 1, fullName: "John Doe", nationalId: "1234567890123", phoneNumber: "+250788123456", email: "john@example.com", address: "Kigali, Rwanda" },
    { id: 2, fullName: "Jane Smith", nationalId: "9876543210987", phoneNumber: "+250788234567", email: "jane@example.com", address: "Musanze, Rwanda" },
    { id: 3, fullName: "Bob Johnson", nationalId: "5555555555555", phoneNumber: "+250788345678", email: "bob@example.com", address: "Huye, Rwanda" },
    { id: 4, fullName: "Alice Williams", nationalId: "1111222233334", phoneNumber: "+250788456789", email: "alice@example.com", address: "Rubavu, Rwanda" },
    { id: 5, fullName: "Charlie Brown", nationalId: "9999888877776", phoneNumber: "+250788567890", email: "charlie@example.com", address: "Nyagatare, Rwanda" }
];

const mockLoans = [
    { id: 1, loanNumber: "LN001", clientName: "John Doe", requestedAmount: 5000000, repaymentPeriodMonths: 12, loanPurpose: "Business expansion", status: "PENDING", branchName: "Main Branch" },
    { id: 2, loanNumber: "LN002", clientName: "Jane Smith", requestedAmount: 3000000, repaymentPeriodMonths: 6, loanPurpose: "Education", status: "APPROVED", branchName: "Main Branch" },
    { id: 3, loanNumber: "LN003", clientName: "Bob Johnson", requestedAmount: 2000000, repaymentPeriodMonths: 24, loanPurpose: "Home improvement", status: "PENDING", branchName: "East Branch" },
    { id: 4, loanNumber: "LN004", clientName: "Alice Williams", requestedAmount: 7500000, repaymentPeriodMonths: 18, loanPurpose: "Agriculture", status: "APPROVED", branchName: "Main Branch" },
    { id: 5, loanNumber: "LN005", clientName: "Charlie Brown", requestedAmount: 1500000, repaymentPeriodMonths: 12, loanPurpose: "Small business", status: "PENDING", branchName: "East Branch" }
];

const recentActivities = [
    { type: 'payment', client: 'Client #C1048', amount: 50, time: '1 hours ago' },
    { type: 'payment', client: 'Client #C1001', amount: 100, time: '2 hours ago' },
    { type: 'payment', client: 'Client #C1002', amount: 150, time: '3 hours ago' },
    { type: 'payment', client: 'Client #C1003', amount: 200, time: '4 hours ago' },
    { type: 'payment', client: 'Client #C1004', amount: 250, time: '5 hours ago' }
];

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

// Authentication
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Demo login - accept any credentials
    if (username === 'admin' && password === 'admin123') {
        currentUser = { username: 'admin', role: 'ADMIN', fullName: 'System Admin' };
        showScreen('adminDashboard');
        loadAdminData();
    } else if (username === 'branch1' && password === 'branch123') {
        currentUser = { username: 'branch1', role: 'BRANCH_USER', fullName: 'Branch User 1' };
        showScreen('branchDashboard');
        loadClients();
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials. Use admin/admin123 or branch1/branch123';
    }
});

function logout() {
    currentUser = null;
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').textContent = '';
    showScreen('loginScreen');
}

// Admin Functions
function loadAdminData() {
    const pendingLoans = mockLoans.filter(loan => loan.status === 'PENDING');
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    const totalDisbursed = approvedLoans.reduce((sum, loan) => sum + loan.requestedAmount, 0);
    
    document.getElementById('pendingCount').textContent = pendingLoans.length;
    document.getElementById('approvedCount').textContent = approvedLoans.length;
    document.getElementById('clientCount').textContent = mockClients.length;
    document.getElementById('activeLoansCount').textContent = approvedLoans.length;
    document.getElementById('totalDisbursed').textContent = formatCurrency(totalDisbursed);
    document.getElementById('defaultRate').textContent = '2.4%';
    
    // Load pending loans
    const pendingLoansDiv = document.getElementById('pendingLoans');
    pendingLoansDiv.innerHTML = '';
    
    if (pendingLoans.length === 0) {
        pendingLoansDiv.innerHTML = '<p style="color: #666;">No pending loan applications</p>';
    } else {
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
    }
    
    // Load recent activity
    const activityDiv = document.getElementById('recentActivity');
    activityDiv.innerHTML = '';
    
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">✓</div>
            <div class="activity-details">
                <h4>Loan Repayment Received - $${activity.amount}</h4>
                <p>${activity.client} • ${activity.time}</p>
            </div>
        `;
        activityDiv.appendChild(activityItem);
    });
}

function approveLoan(loanId) {
    const loan = mockLoans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'APPROVED';
        
        // Show success animation
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(40, 167, 69, 0.4);
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        notification.innerHTML = `
            <strong>✓ Success!</strong><br>
            Loan #${loan.loanNumber} approved successfully!
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        
        loadAdminData();
    }
}

function rejectLoan(loanId) {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    const loan = mockLoans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'REJECTED';
        
        // Show rejection notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(220, 53, 69, 0.4);
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        notification.innerHTML = `
            <strong>✗ Rejected</strong><br>
            Loan #${loan.loanNumber} has been rejected
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        
        loadAdminData();
    }
}

// Branch Functions
function loadClients() {
    const clientsList = document.getElementById('clientsList');
    clientsList.innerHTML = '';
    
    if (mockClients.length === 0) {
        clientsList.innerHTML = '<p style="color: #666;">No clients registered yet</p>';
        return;
    }
    
    mockClients.forEach(client => {
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
}

function loadBranchLoans() {
    const loansList = document.getElementById('loansList');
    loansList.innerHTML = '';
    
    if (mockLoans.length === 0) {
        loansList.innerHTML = '<p style="color: #666;">No loan applications yet</p>';
        return;
    }
    
    mockLoans.forEach(loan => {
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
}

function loadClientsForLoan() {
    const select = document.getElementById('loanClient');
    select.innerHTML = '<option value="">-- Select Client --</option>';
    
    mockClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.fullName} (${client.nationalId})`;
        select.appendChild(option);
    });
}

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('registerMessage');
    
    const newClient = {
        id: mockClients.length + 1,
        fullName: document.getElementById('clientName').value,
        nationalId: document.getElementById('nationalId').value,
        dateOfBirth: document.getElementById('dob').value,
        phoneNumber: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };
    
    mockClients.push(newClient);
    
    messageDiv.className = 'message success';
    messageDiv.textContent = 'Client registered successfully!';
    document.getElementById('registerForm').reset();
    
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 3000);
});

document.getElementById('loanForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('loanMessage');
    
    const clientId = parseInt(document.getElementById('loanClient').value);
    const client = mockClients.find(c => c.id === clientId);
    
    if (!client) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Please select a client';
        return;
    }
    
    const newLoan = {
        id: mockLoans.length + 1,
        loanNumber: 'LN' + String(mockLoans.length + 1).padStart(3, '0'),
        clientName: client.fullName,
        requestedAmount: parseFloat(document.getElementById('loanAmount').value),
        repaymentPeriodMonths: parseInt(document.getElementById('repaymentPeriod').value),
        loanPurpose: document.getElementById('loanPurpose').value,
        status: 'PENDING',
        branchName: 'Main Branch'
    };
    
    mockLoans.push(newLoan);
    
    messageDiv.className = 'message success';
    messageDiv.textContent = 'Loan application submitted successfully!';
    document.getElementById('loanForm').reset();
    
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 3000);
});

function formatCurrency(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(0) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(0) + 'k';
    }
    return new Intl.NumberFormat('en-RW', {
        style: 'currency',
        currency: 'RWF'
    }).format(amount);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showScreen('loginScreen');
});
