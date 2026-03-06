// Demo Mode - No Backend Required
let currentUser = null;

// Mock data - Expanded with realistic sample data
const mockClients = [
    // Main Branch Clients
    { id: 1, firstName: "Chisomo", lastName: "Banda", fullName: "Chisomo Banda", nationalId: "MWI001234567", phoneNumber: "+265888123456", email: "chisomo.banda@email.com", district: "Lilongwe", homeVillage: "Area 25", employerName: "Ministry of Health", monthlySalary: 450000, witnessName: "Grace Phiri", witnessContact: "+265999234567" },
    { id: 2, firstName: "Thoko", lastName: "Mwale", fullName: "Thoko Mwale", nationalId: "MWI002345678", phoneNumber: "+265888234567", email: "thoko.mwale@email.com", district: "Lilongwe", homeVillage: "Area 18", employerName: "Malawi Revenue Authority", monthlySalary: 650000, witnessName: "John Kamwendo", witnessContact: "+265999345678" },
    { id: 3, firstName: "Mphatso", lastName: "Chirwa", fullName: "Mphatso Chirwa", nationalId: "MWI003456789", phoneNumber: "+265888345678", email: "mphatso.chirwa@email.com", district: "Lilongwe", homeVillage: "Area 47", employerName: "Reserve Bank of Malawi", monthlySalary: 850000, witnessName: "Mercy Banda", witnessContact: "+265999456789" },
    { id: 4, firstName: "Kondwani", lastName: "Phiri", fullName: "Kondwani Phiri", nationalId: "MWI004567890", phoneNumber: "+265888456789", email: "kondwani.phiri@email.com", district: "Lilongwe", homeVillage: "Area 36", employerName: "Airtel Malawi", monthlySalary: 550000, witnessName: "Esther Nyirenda", witnessContact: "+265999567890" },
    { id: 5, firstName: "Tamanda", lastName: "Nyirenda", fullName: "Tamanda Nyirenda", nationalId: "MWI005678901", phoneNumber: "+265888567890", email: "tamanda.nyirenda@email.com", district: "Lilongwe", homeVillage: "Area 49", employerName: "TNM Plc", monthlySalary: 480000, witnessName: "Patrick Mbewe", witnessContact: "+265999678901" },
    
    // East Branch Clients
    { id: 6, firstName: "Chimwemwe", lastName: "Kachingwe", fullName: "Chimwemwe Kachingwe", nationalId: "MWI006789012", phoneNumber: "+265888678901", email: "chimwemwe.k@email.com", district: "Blantyre", homeVillage: "Ndirande", employerName: "Blantyre City Council", monthlySalary: 420000, witnessName: "Linda Banda", witnessContact: "+265999789012" },
    { id: 7, firstName: "Pemphero", lastName: "Gondwe", fullName: "Pemphero Gondwe", nationalId: "MWI007890123", phoneNumber: "+265888789012", email: "pemphero.g@email.com", district: "Blantyre", homeVillage: "Chilomoni", employerName: "Malawi Posts Corporation", monthlySalary: 380000, witnessName: "Moses Phiri", witnessContact: "+265999890123" },
    { id: 8, firstName: "Alinafe", lastName: "Mkandawire", fullName: "Alinafe Mkandawire", nationalId: "MWI008901234", phoneNumber: "+265888890123", email: "alinafe.m@email.com", district: "Blantyre", homeVillage: "Zingwangwa", employerName: "ESCOM", monthlySalary: 520000, witnessName: "Ruth Kamwendo", witnessContact: "+265999901234" },
    
    // North Branch Clients
    { id: 9, firstName: "Dalitso", lastName: "Tembo", fullName: "Dalitso Tembo", nationalId: "MWI009012345", phoneNumber: "+265888901234", email: "dalitso.t@email.com", district: "Mzuzu", homeVillage: "Chibavi", employerName: "Mzuzu University", monthlySalary: 720000, witnessName: "Sarah Nyirongo", witnessContact: "+265999012345" },
    { id: 10, firstName: "Wongani", lastName: "Lungu", fullName: "Wongani Lungu", nationalId: "MWI010123456", phoneNumber: "+265888012345", email: "wongani.l@email.com", district: "Mzuzu", homeVillage: "Katoto", employerName: "Northern Region Water Board", monthlySalary: 460000, witnessName: "James Mhango", witnessContact: "+265999123456" },
    
    // Central Branch Clients
    { id: 11, firstName: "Tawonga", lastName: "Zimba", fullName: "Tawonga Zimba", nationalId: "MWI011234567", phoneNumber: "+265888112345", email: "tawonga.z@email.com", district: "Dedza", homeVillage: "Dedza Boma", employerName: "Ministry of Education", monthlySalary: 410000, witnessName: "Agnes Phiri", witnessContact: "+265999212345" },
    { id: 12, firstName: "Limbani", lastName: "Sakala", fullName: "Limbani Sakala", nationalId: "MWI012345678", phoneNumber: "+265888212345", email: "limbani.s@email.com", district: "Dedza", homeVillage: "Mtakataka", employerName: "Agricultural Development Division", monthlySalary: 390000, witnessName: "Peter Banda", witnessContact: "+265999312345" }
];

const mockLoans = [
    // Main Branch Loans
    { id: 1, loanNumber: "LN001", clientName: "Chisomo Banda", clientId: 1, requestedAmount: 2500000, repaymentPeriodMonths: 12, loanPurpose: "Business expansion - grocery shop", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 2500000, collectedAmount: 1800000, defaultAmount: 0, disbursedDate: "2024-01-15" },
    { id: 2, loanNumber: "LN002", clientName: "Thoko Mwale", clientId: 2, requestedAmount: 3500000, repaymentPeriodMonths: 18, loanPurpose: "Home renovation", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 3500000, collectedAmount: 3500000, defaultAmount: 0, disbursedDate: "2023-12-01" },
    { id: 3, loanNumber: "LN003", clientName: "Mphatso Chirwa", clientId: 3, requestedAmount: 5000000, repaymentPeriodMonths: 24, loanPurpose: "Vehicle purchase", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 5000000, collectedAmount: 3200000, defaultAmount: 800000, disbursedDate: "2023-10-10" },
    { id: 4, loanNumber: "LN004", clientName: "Kondwani Phiri", clientId: 4, requestedAmount: 1800000, repaymentPeriodMonths: 12, loanPurpose: "Education - university fees", status: "PENDING", branchName: "Main Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 },
    { id: 5, loanNumber: "LN005", clientName: "Tamanda Nyirenda", clientId: 5, requestedAmount: 2200000, repaymentPeriodMonths: 15, loanPurpose: "Small business startup", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 2200000, collectedAmount: 1500000, defaultAmount: 0, disbursedDate: "2024-02-01" },
    
    // East Branch Loans
    { id: 6, loanNumber: "LN006", clientName: "Chimwemwe Kachingwe", clientId: 6, requestedAmount: 1500000, repaymentPeriodMonths: 12, loanPurpose: "Agricultural inputs", status: "APPROVED", branchName: "East Branch", disbursedAmount: 1500000, collectedAmount: 800000, defaultAmount: 400000, disbursedDate: "2024-01-20" },
    { id: 7, loanNumber: "LN007", clientName: "Pemphero Gondwe", clientId: 7, requestedAmount: 2800000, repaymentPeriodMonths: 18, loanPurpose: "Tailoring business equipment", status: "PENDING", branchName: "East Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 },
    { id: 8, loanNumber: "LN008", clientName: "Alinafe Mkandawire", clientId: 8, requestedAmount: 3200000, repaymentPeriodMonths: 24, loanPurpose: "House construction", status: "APPROVED", branchName: "East Branch", disbursedAmount: 3200000, collectedAmount: 2100000, defaultAmount: 0, disbursedDate: "2023-11-15" },
    
    // North Branch Loans
    { id: 9, loanNumber: "LN009", clientName: "Dalitso Tembo", clientId: 9, requestedAmount: 4500000, repaymentPeriodMonths: 24, loanPurpose: "Rental property investment", status: "APPROVED", branchName: "North Branch", disbursedAmount: 4500000, collectedAmount: 2800000, defaultAmount: 0, disbursedDate: "2023-09-01" },
    { id: 10, loanNumber: "LN010", clientName: "Wongani Lungu", clientId: 10, requestedAmount: 1900000, repaymentPeriodMonths: 12, loanPurpose: "Livestock farming", status: "PENDING", branchName: "North Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 },
    
    // Central Branch Loans
    { id: 11, loanNumber: "LN011", clientName: "Tawonga Zimba", clientId: 11, requestedAmount: 2600000, repaymentPeriodMonths: 18, loanPurpose: "Motorcycle purchase for transport business", status: "APPROVED", branchName: "Central Branch", disbursedAmount: 2600000, collectedAmount: 1400000, defaultAmount: 600000, disbursedDate: "2024-01-05" },
    { id: 12, loanNumber: "LN012", clientName: "Limbani Sakala", clientId: 12, requestedAmount: 3100000, repaymentPeriodMonths: 24, loanPurpose: "Farm equipment and seeds", status: "PENDING", branchName: "Central Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 }
];

const recentActivities = [
    { type: 'payment', client: 'Chisomo Banda - LN001', amount: 250000, time: '2 hours ago' },
    { type: 'payment', client: 'Alinafe Mkandawire - LN008', amount: 180000, time: '4 hours ago' },
    { type: 'payment', client: 'Tamanda Nyirenda - LN005', amount: 200000, time: '6 hours ago' },
    { type: 'payment', client: 'Dalitso Tembo - LN009', amount: 350000, time: '1 day ago' },
    { type: 'payment', client: 'Mphatso Chirwa - LN003', amount: 280000, time: '1 day ago' }
];

// Branch users storage
const branchUsers = [
    { username: 'branch1', password: 'branch123', fullName: 'Grace Phiri', branchName: 'Main Branch', email: 'grace.phiri@uprise.com' },
    { username: 'branch2', password: 'branch123', fullName: 'Moses Banda', branchName: 'East Branch', email: 'moses.banda@uprise.com' },
    { username: 'branch3', password: 'branch123', fullName: 'Sarah Mwale', branchName: 'North Branch', email: 'sarah.mwale@uprise.com' },
    { username: 'branch4', password: 'branch123', fullName: 'Patrick Chirwa', branchName: 'Central Branch', email: 'patrick.chirwa@uprise.com' }
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

function showAdminTab(tabName) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'overview') {
        loadSystemOverview();
    } else if (tabName === 'branches') {
        loadBranchAnalytics();
    } else if (tabName === 'defaults') {
        loadDefaultsList();
    } else if (tabName === 'loans') {
        loadPendingLoans();
    } else if (tabName === 'users') {
        loadBranchUsersList();
    }
}

// Authentication
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    // Check admin
    if (username === 'admin' && password === 'admin123') {
        currentUser = { username: 'admin', role: 'ADMIN', fullName: 'System Admin' };
        showScreen('adminDashboard');
        loadSystemOverview();
        return;
    }
    
    // Check branch users
    const branchUser = branchUsers.find(u => u.username === username && u.password === password);
    if (branchUser) {
        currentUser = { ...branchUser, role: 'BRANCH_USER' };
        document.getElementById('branchUserName').textContent = branchUser.fullName;
        showScreen('branchDashboard');
        loadClients();
        return;
    }
    
    errorDiv.textContent = 'Invalid credentials. Please try again.';
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

function loadPendingLoans() {
    const pendingLoans = mockLoans.filter(loan => loan.status === 'PENDING');
    const pendingLoansDiv = document.getElementById('pendingLoans');
    pendingLoansDiv.innerHTML = '';
    
    if (pendingLoans.length === 0) {
        pendingLoansDiv.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No pending loan applications</p>';
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
                    <button class="btn btn-success" onclick="approveLoan(${loan.id})">✓ Approve</button>
                    <button class="btn btn-danger" onclick="rejectLoan(${loan.id})">✗ Reject</button>
                </div>
            `;
            pendingLoansDiv.appendChild(loanCard);
        });
    }
    
    // Also load approved loans
    loadApprovedLoans();
}

function loadApprovedLoans() {
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    const approvedLoansDiv = document.getElementById('approvedLoans');
    
    if (!approvedLoansDiv) return; // Only load if on admin loans tab
    
    approvedLoansDiv.innerHTML = '';
    
    if (approvedLoans.length === 0) {
        approvedLoansDiv.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No approved loans yet</p>';
    } else {
        approvedLoans.forEach(loan => {
            const loanCard = document.createElement('div');
            loanCard.className = 'loan-card approved-loan-card';
            loanCard.innerHTML = `
                <div class="loan-info">
                    <h3>Loan #${loan.loanNumber}</h3>
                    <p><strong>Client:</strong> ${loan.clientName}</p>
                    <p><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                    <p><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</p>
                    <p><strong>Purpose:</strong> ${loan.loanPurpose}</p>
                    <p><strong>Branch:</strong> ${loan.branchName}</p>
                    ${loan.disbursedAmount ? `<p><strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}</p>` : ''}
                    ${loan.collectedAmount ? `<p><strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}</p>` : ''}
                    ${loan.disbursedDate ? `<p><strong>Disbursed Date:</strong> ${loan.disbursedDate}</p>` : ''}
                    <span class="badge badge-approved">Approved</span>
                </div>
                <div class="loan-stats">
                    <div class="loan-stat-item">
                        <div class="loan-stat-label">Progress</div>
                        <div class="loan-stat-value">${loan.disbursedAmount > 0 ? ((loan.collectedAmount / loan.disbursedAmount) * 100).toFixed(1) : 0}%</div>
                    </div>
                    ${loan.defaultAmount > 0 ? `
                    <div class="loan-stat-item default-stat">
                        <div class="loan-stat-label">Default</div>
                        <div class="loan-stat-value">${formatCurrency(loan.defaultAmount)}</div>
                    </div>
                    ` : ''}
                </div>
            `;
            approvedLoansDiv.appendChild(loanCard);
        });
    }
}

function approveLoan(loanId) {
    const loan = mockLoans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'APPROVED';
        // Set disbursed amount and date when approved
        if (!loan.disbursedAmount) {
            loan.disbursedAmount = loan.requestedAmount;
            loan.disbursedDate = new Date().toISOString().split('T')[0];
            loan.collectedAmount = 0;
            loan.defaultAmount = 0;
        }
        showNotification('success', `Loan #${loan.loanNumber} approved successfully! Amount: ${formatCurrency(loan.requestedAmount)}`);
        loadPendingLoans(); // This will also reload approved loans
        loadSystemOverview(); // Update overview stats
    }
}

function rejectLoan(loanId) {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    const loan = mockLoans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'REJECTED';
        loan.rejectionReason = reason;
        showNotification('error', `Loan #${loan.loanNumber} has been rejected. Reason: ${reason}`);
        loadPendingLoans(); // This will also reload approved loans
        loadSystemOverview(); // Update overview stats
    }
}

// User Management
function loadBranchUsersList() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    branchUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-info">
                <h3>${user.fullName}</h3>
                <p><strong>Branch:</strong> ${user.branchName}</p>
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
            </div>
        `;
        usersList.appendChild(userCard);
    });
}

document.getElementById('createUserForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('createUserMessage');
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    
    // Check if username already exists
    if (branchUsers.find(u => u.username === username)) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Username already exists!';
        return;
    }
    
    if (password.length < 6) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Password must be at least 6 characters!';
        return;
    }
    
    const newUser = {
        username: username,
        password: password,
        fullName: document.getElementById('userFullName').value,
        branchName: document.getElementById('branchName').value,
        email: document.getElementById('userEmail').value
    };
    
    branchUsers.push(newUser);
    
    messageDiv.className = 'message success';
    messageDiv.textContent = `Branch user "${username}" created successfully! They can now login.`;
    document.getElementById('createUserForm').reset();
    
    loadBranchUsersList();
    
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 5000);
});

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
            <h3>
                <span class="client-name-link" onclick="viewClientDetail(${client.id})">
                    ${client.fullName || client.firstName + ' ' + client.lastName}
                </span>
            </h3>
            <div class="client-details-grid">
                <div>
                    <p><strong>National ID:</strong> ${client.nationalId}</p>
                    <p><strong>Phone:</strong> ${client.phoneNumber}</p>
                    <p><strong>Email:</strong> ${client.email || 'N/A'}</p>
                    <p><strong>District:</strong> ${client.district || client.address || 'N/A'}</p>
                </div>
                ${client.employerName ? `
                <div>
                    <p><strong>Employer:</strong> ${client.employerName}</p>
                    <p><strong>Monthly Salary:</strong> MK ${client.monthlySalary || 'N/A'}</p>
                    <p><strong>Witness:</strong> ${client.witnessName || 'N/A'}</p>
                    <p><strong>Witness Phone:</strong> ${client.witnessContact || 'N/A'}</p>
                </div>
                ` : ''}
            </div>
            <button class="btn btn-primary" onclick="viewClientDetail(${client.id})" style="margin-top: 10px; padding: 8px 16px; font-size: 13px;">
                View Full Details
            </button>
        `;
        clientsList.appendChild(clientItem);
    });
}

function viewIdImage(imageSrc, title) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.image-modal').remove()">✕</button>
            </div>
            <img src="${imageSrc}" alt="${title}" class="modal-image">
        </div>
    `;
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    document.body.appendChild(modal);
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

// ID Image handling
let idFrontImage = null;
let idBackImage = null;
let cameraStreamFront = null;
let cameraStreamBack = null;
let barcodeScanner = null;
let barcodeScannerStream = null;

// Barcode Scanner Functions
async function startBarcodeScanner() {
    const modal = document.getElementById('barcodeScannerModal');
    const video = document.getElementById('barcodeVideo');
    const statusDiv = document.getElementById('scannerStatus');
    
    modal.style.display = 'flex';
    statusDiv.textContent = 'Initializing scanner...';
    statusDiv.className = 'scanner-status';
    
    try {
        // Request camera access
        barcodeScannerStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        video.srcObject = barcodeScannerStream;
        statusDiv.textContent = 'Ready to scan. Position barcode within the frame.';
        
        // Initialize ZXing barcode reader
        const codeReader = new ZXing.BrowserMultiFormatReader();
        
        // Start continuous scanning
        codeReader.decodeFromVideoDevice(null, 'barcodeVideo', (result, err) => {
            if (result) {
                // Barcode detected!
                const barcodeData = result.text;
                statusDiv.textContent = '✓ Barcode detected! Processing...';
                statusDiv.className = 'scanner-status success';
                
                // Parse and fill form
                parseMalawiIDBarcode(barcodeData);
                
                // Stop scanner after successful scan
                setTimeout(() => {
                    stopBarcodeScanner();
                    codeReader.reset();
                }, 1500);
            }
            
            if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error('Barcode scan error:', err);
            }
        });
        
    } catch (error) {
        statusDiv.textContent = '✗ Unable to access camera. Please check permissions.';
        statusDiv.className = 'scanner-status error';
        console.error('Camera error:', error);
    }
}

function stopBarcodeScanner() {
    const modal = document.getElementById('barcodeScannerModal');
    const video = document.getElementById('barcodeVideo');
    
    // Stop camera stream
    if (barcodeScannerStream) {
        barcodeScannerStream.getTracks().forEach(track => track.stop());
        barcodeScannerStream = null;
    }
    
    video.srcObject = null;
    modal.style.display = 'none';
    
    // Reset status
    document.getElementById('scannerStatus').textContent = '';
    document.getElementById('scannerStatus').className = 'scanner-status';
}

function parseMalawiIDBarcode(barcodeData) {
    // Malawi National ID barcodes typically contain data in a specific format
    // Log the raw barcode data for debugging
    console.log('Raw Barcode Data:', barcodeData);
    console.log('Barcode Length:', barcodeData.length);
    
    try {
        let parsedData = {};
        
        // Method 1: Try parsing as delimited data (pipe or comma separated)
        if (barcodeData.includes('|') || barcodeData.includes(',')) {
            const delimiter = barcodeData.includes('|') ? '|' : ',';
            const parts = barcodeData.split(delimiter);
            
            console.log('Parsed as delimited data:', parts);
            
            // Common Malawi ID format: ID|SURNAME|FIRSTNAME|DOB|GENDER|DISTRICT|VILLAGE
            parsedData = {
                nationalId: parts[0]?.trim() || '',
                surname: parts[1]?.trim() || '',
                firstName: parts[2]?.trim() || '',
                dob: parts[3]?.trim() || '',
                gender: parts[4]?.trim() || '',
                district: parts[5]?.trim() || '',
                village: parts[6]?.trim() || ''
            };
        } 
        // Method 2: Try parsing as semicolon separated (alternative format)
        else if (barcodeData.includes(';')) {
            const parts = barcodeData.split(';');
            console.log('Parsed as semicolon-delimited data:', parts);
            
            parsedData = {
                nationalId: parts[0]?.trim() || '',
                surname: parts[1]?.trim() || '',
                firstName: parts[2]?.trim() || '',
                dob: parts[3]?.trim() || '',
                gender: parts[4]?.trim() || '',
                district: parts[5]?.trim() || '',
                village: parts[6]?.trim() || ''
            };
        }
        // Method 3: Try parsing as fixed-width format
        else if (barcodeData.length >= 50) {
            console.log('Parsing as fixed-width format');
            
            parsedData = {
                nationalId: barcodeData.substring(0, 13).trim(),
                surname: barcodeData.substring(13, 33).trim(),
                firstName: barcodeData.substring(33, 53).trim(),
                dob: barcodeData.substring(53, 61).trim(),
                gender: barcodeData.substring(61, 62).trim(),
                district: barcodeData.substring(62).trim()
            };
        }
        // Method 4: If it's just a number, treat it as ID only
        else {
            console.log('Treating as ID number only');
            parsedData = {
                nationalId: barcodeData.trim()
            };
        }
        
        console.log('Parsed Data:', parsedData);
        
        console.log('Parsed Data:', parsedData);
        
        // Auto-fill form fields with parsed data
        let fieldsFilledCount = 0;
        
        if (parsedData.nationalId) {
            document.getElementById('nationalId').value = parsedData.nationalId;
            fieldsFilledCount++;
        }
        
        if (parsedData.firstName) {
            document.getElementById('clientFirstName').value = parsedData.firstName;
            fieldsFilledCount++;
        }
        
        if (parsedData.surname) {
            document.getElementById('clientLastName').value = parsedData.surname;
            fieldsFilledCount++;
        }
        
        if (parsedData.gender) {
            // Normalize gender values
            const genderValue = parsedData.gender.toUpperCase();
            if (genderValue === 'M' || genderValue === 'MALE') {
                document.getElementById('gender').value = 'Male';
                fieldsFilledCount++;
            } else if (genderValue === 'F' || genderValue === 'FEMALE') {
                document.getElementById('gender').value = 'Female';
                fieldsFilledCount++;
            }
        }
        
        if (parsedData.district) {
            document.getElementById('district').value = parsedData.district;
            fieldsFilledCount++;
        }
        
        if (parsedData.village) {
            document.getElementById('homeVillage').value = parsedData.village;
            fieldsFilledCount++;
        }
        
        if (parsedData.dob) {
            // Convert DOB format if needed (e.g., DDMMYYYY to YYYY-MM-DD)
            const formattedDob = formatDateOfBirth(parsedData.dob);
            if (formattedDob) {
                document.getElementById('dob').value = formattedDob;
                fieldsFilledCount++;
            }
        }
        
        // Show success notification with details
        if (fieldsFilledCount > 0) {
            showNotification('success', `✓ Scanned successfully! ${fieldsFilledCount} fields auto-filled. Please verify and complete remaining fields.`);
            
            // Move to step 2 (Personal Information) to show filled data
            currentStep = 2;
            showStep(2);
        } else {
            showNotification('error', 'Barcode scanned but no data could be extracted. Please enter information manually.');
        }
        
    } catch (error) {
        console.error('Error parsing barcode:', error);
        showNotification('error', 'Could not parse barcode data. Please enter information manually.');
    }
}

function formatDateOfBirth(dobString) {
    // Handle different date formats
    // DDMMYYYY -> YYYY-MM-DD
    // YYYYMMDD -> YYYY-MM-DD
    
    try {
        if (dobString.length === 8) {
            // Check if it's DDMMYYYY or YYYYMMDD
            const firstPart = dobString.substring(0, 4);
            
            if (parseInt(firstPart) > 1900) {
                // Likely YYYYMMDD
                const year = dobString.substring(0, 4);
                const month = dobString.substring(4, 6);
                const day = dobString.substring(6, 8);
                return `${year}-${month}-${day}`;
            } else {
                // Likely DDMMYYYY
                const day = dobString.substring(0, 2);
                const month = dobString.substring(2, 4);
                const year = dobString.substring(4, 8);
                return `${year}-${month}-${day}`;
            }
        }
    } catch (error) {
        console.error('Date format error:', error);
    }
    
    return null;
}

// Open camera for live capture
async function openCamera(side) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment', // Use back camera on mobile
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            } 
        });
        
        if (side === 'front') {
            cameraStreamFront = stream;
            const video = document.getElementById('cameraFront');
            video.srcObject = stream;
            video.style.display = 'block';
            document.getElementById('idFrontPlaceholder').style.display = 'none';
            document.getElementById('cameraControlsFront').style.display = 'flex';
        } else {
            cameraStreamBack = stream;
            const video = document.getElementById('cameraBack');
            video.srcObject = stream;
            video.style.display = 'block';
            document.getElementById('idBackPlaceholder').style.display = 'none';
            document.getElementById('cameraControlsBack').style.display = 'flex';
        }
    } catch (error) {
        alert('Unable to access camera. Please check permissions or use the upload file option.');
        console.error('Camera error:', error);
    }
}

// Capture photo from camera stream
function capturePhoto(side) {
    if (side === 'front') {
        const video = document.getElementById('cameraFront');
        const canvas = document.getElementById('canvasFront');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        idFrontImage = canvas.toDataURL('image/jpeg', 0.9);
        document.getElementById('idFrontPreview').src = idFrontImage;
        document.getElementById('idFrontPreview').style.display = 'block';
        document.getElementById('removeIdFront').style.display = 'block';
        
        closeCamera('front');
    } else {
        const video = document.getElementById('cameraBack');
        const canvas = document.getElementById('canvasBack');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        idBackImage = canvas.toDataURL('image/jpeg', 0.9);
        document.getElementById('idBackPreview').src = idBackImage;
        document.getElementById('idBackPreview').style.display = 'block';
        document.getElementById('removeIdBack').style.display = 'block';
        
        closeCamera('back');
    }
}

// Close camera stream
function closeCamera(side) {
    if (side === 'front') {
        if (cameraStreamFront) {
            cameraStreamFront.getTracks().forEach(track => track.stop());
            cameraStreamFront = null;
        }
        document.getElementById('cameraFront').style.display = 'none';
        document.getElementById('cameraControlsFront').style.display = 'none';
        document.getElementById('idFrontPlaceholder').style.display = 'block';
    } else {
        if (cameraStreamBack) {
            cameraStreamBack.getTracks().forEach(track => track.stop());
            cameraStreamBack = null;
        }
        document.getElementById('cameraBack').style.display = 'none';
        document.getElementById('cameraControlsBack').style.display = 'none';
        document.getElementById('idBackPlaceholder').style.display = 'block';
    }
}

document.getElementById('idFront').addEventListener('change', function(e) {
    handleIdImageUpload(e, 'front');
});

document.getElementById('idBack').addEventListener('change', function(e) {
    handleIdImageUpload(e, 'back');
});

function handleIdImageUpload(event, side) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            
            if (side === 'front') {
                idFrontImage = imageData;
                document.getElementById('idFrontPreview').src = imageData;
                document.getElementById('idFrontPreview').style.display = 'block';
                document.getElementById('removeIdFront').style.display = 'block';
                document.querySelector('#idFrontArea .upload-placeholder').style.display = 'none';
            } else {
                idBackImage = imageData;
                document.getElementById('idBackPreview').src = imageData;
                document.getElementById('idBackPreview').style.display = 'block';
                document.getElementById('removeIdBack').style.display = 'block';
                document.querySelector('#idBackArea .upload-placeholder').style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

function removeIdImage(side) {
    if (side === 'front') {
        // Close camera if open
        if (cameraStreamFront) {
            closeCamera('front');
        }
        
        idFrontImage = null;
        document.getElementById('idFront').value = '';
        document.getElementById('idFrontPreview').style.display = 'none';
        document.getElementById('removeIdFront').style.display = 'none';
        document.getElementById('idFrontPlaceholder').style.display = 'block';
    } else {
        // Close camera if open
        if (cameraStreamBack) {
            closeCamera('back');
        }
        
        idBackImage = null;
        document.getElementById('idBack').value = '';
        document.getElementById('idBackPreview').style.display = 'none';
        document.getElementById('removeIdBack').style.display = 'none';
        document.getElementById('idBackPlaceholder').style.display = 'block';
    }
}

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('registerMessage');
    
    // Validate ID images
    if (!idFrontImage || !idBackImage) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Please capture both ID front and back images!';
        return;
    }
    
    // Collect all form data
    const firstName = document.getElementById('clientFirstName').value;
    const lastName = document.getElementById('clientLastName').value;
    
    const newClient = {
        id: mockClients.length + 1,
        // Personal Information
        firstName: firstName,
        lastName: lastName,
        fullName: `${firstName} ${lastName}`,
        title: document.getElementById('clientTitle').value,
        gender: document.getElementById('gender').value,
        dateOfBirth: document.getElementById('dob').value,
        maritalStatus: document.getElementById('maritalStatus').value,
        idType: document.getElementById('idType').value,
        nationalId: document.getElementById('nationalId').value,
        phoneNumber: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        // Location
        district: document.getElementById('district').value,
        traditionalAuthority: document.getElementById('traditionalAuthority').value,
        homeVillage: document.getElementById('homeVillage').value,
        address: document.getElementById('address').value,
        // Spouse (if married)
        spouseName: document.getElementById('spouseName').value,
        spouseContact: document.getElementById('spouseContact').value,
        // Employment
        employerName: document.getElementById('employerName').value,
        department: document.getElementById('department').value,
        employmentNumber: document.getElementById('employmentNumber').value,
        monthlySalary: document.getElementById('monthlySalary').value,
        fullEmployment: document.getElementById('fullEmployment').value,
        lengthOfService: document.getElementById('lengthOfService').value,
        workAddress: document.getElementById('workAddress').value,
        // Bank Details
        bankName: document.getElementById('bankName').value,
        accountNumber: document.getElementById('accountNumber').value,
        accountType: document.getElementById('accountType').value,
        bankBranch: document.getElementById('bankBranch').value,
        // Witness/Guarantor
        witnessName: document.getElementById('witnessName').value,
        witnessContact: document.getElementById('witnessContact').value,
        witnessRelationship: document.getElementById('witnessRelationship').value,
        witnessOccupation: document.getElementById('witnessOccupation').value,
        witnessIncome: document.getElementById('witnessIncome').value,
        // ID Images
        idFrontImage: idFrontImage,
        idBackImage: idBackImage,
        // Registration Date
        registrationDate: new Date().toISOString()
    };
    
    mockClients.push(newClient);
    
    messageDiv.className = 'message success';
    messageDiv.textContent = '✓ Client registered successfully with all documents!';
    document.getElementById('registerForm').reset();
    
    // Reset ID images
    idFrontImage = null;
    idBackImage = null;
    document.getElementById('idFrontPreview').style.display = 'none';
    document.getElementById('idBackPreview').style.display = 'none';
    document.getElementById('removeIdFront').style.display = 'none';
    document.getElementById('removeIdBack').style.display = 'none';
    document.getElementById('idFrontPlaceholder').style.display = 'block';
    document.getElementById('idBackPlaceholder').style.display = 'block';
    
    // Reset to first step
    currentStep = 1;
    showStep(1);
    
    // Show success and redirect to clients list
    setTimeout(() => {
        messageDiv.textContent = '';
        showTab('clients');
    }, 2000);
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
        branchName: currentUser.branchName || 'Main Branch'
    };
    
    mockLoans.push(newLoan);
    
    messageDiv.className = 'message success';
    messageDiv.textContent = 'Loan application submitted successfully!';
    document.getElementById('loanForm').reset();
    
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 3000);
});

function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease;
    `;
    notification.innerHTML = `
        <strong>${type === 'success' ? '✓ Success!' : '✗ Error'}</strong><br>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function formatCurrency(amount) {
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(0) + 'k';
    }
    return '$' + amount.toFixed(0);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showScreen('loginScreen');
});


// Multi-Step Form Navigation
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.progress-steps .step').forEach(s => s.classList.remove('active'));
    
    // Show current step
    const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const progressStep = document.querySelector(`.progress-steps .step[data-step="${step}"]`);
    
    if (stepElement) stepElement.classList.add('active');
    if (progressStep) progressStep.classList.add('active');
    
    // Mark completed steps
    for (let i = 1; i < step; i++) {
        const completedStep = document.querySelector(`.progress-steps .step[data-step="${i}"]`);
        if (completedStep) completedStep.classList.add('completed');
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'block';
    if (nextBtn) nextBtn.style.display = step === totalSteps ? 'none' : 'block';
    if (submitBtn) submitBtn.style.display = step === totalSteps ? 'block' : 'none';
    
    // Scroll to top of form
    document.querySelector('.multi-step-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step before moving forward
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function validateStep(step) {
    const stepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepElement) return true;
    
    // Get all required inputs in current step
    const requiredInputs = stepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
            
            // Reset border color on input
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
    });
    
    if (!isValid) {
        showNotification('error', 'Please fill in all required fields before continuing');
    }
    
    return isValid;
}

// Show/hide spouse section based on marital status
document.addEventListener('DOMContentLoaded', function() {
    const maritalStatusSelect = document.getElementById('maritalStatus');
    if (maritalStatusSelect) {
        maritalStatusSelect.addEventListener('change', function() {
            const spouseSection = document.getElementById('spouseSection');
            if (spouseSection) {
                spouseSection.style.display = this.value === 'Married' ? 'block' : 'none';
            }
        });
    }
    
    // Initialize first step
    showStep(1);
});


// Enhanced Admin Functions with Branch Analytics

// Update mock data to include loan status and payments - replace the existing mockLoans
mockLoans.length = 0; // Clear existing array
mockLoans.push(
    { id: 1, loanNumber: "LN001", clientName: "John Doe", clientId: 1, requestedAmount: 5000000, repaymentPeriodMonths: 12, loanPurpose: "Business expansion", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 5000000, collectedAmount: 2000000, defaultAmount: 0, disbursedDate: "2024-01-15" },
    { id: 2, loanNumber: "LN002", clientName: "Jane Smith", clientId: 2, requestedAmount: 3000000, repaymentPeriodMonths: 6, loanPurpose: "Education", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 3000000, collectedAmount: 3000000, defaultAmount: 0, disbursedDate: "2024-02-01" },
    { id: 3, loanNumber: "LN003", clientName: "Bob Johnson", clientId: 3, requestedAmount: 2000000, repaymentPeriodMonths: 24, loanPurpose: "Home improvement", status: "PENDING", branchName: "East Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 },
    { id: 4, loanNumber: "LN004", clientName: "Alice Williams", clientId: 4, requestedAmount: 7500000, repaymentPeriodMonths: 18, loanPurpose: "Agriculture", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 7500000, collectedAmount: 5000000, defaultAmount: 1500000, disbursedDate: "2023-12-10" },
    { id: 5, loanNumber: "LN005", clientName: "Charlie Brown", clientId: 5, requestedAmount: 1500000, repaymentPeriodMonths: 12, loanPurpose: "Small business", status: "APPROVED", branchName: "East Branch", disbursedAmount: 1500000, collectedAmount: 500000, defaultAmount: 500000, disbursedDate: "2024-01-20" }
);

function loadSystemOverview() {
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    const totalDisbursed = approvedLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
    const totalCollected = approvedLoans.reduce((sum, loan) => sum + loan.collectedAmount, 0);
    const totalDefaults = approvedLoans.reduce((sum, loan) => sum + loan.defaultAmount, 0);
    const defaultCount = approvedLoans.filter(loan => loan.defaultAmount > 0).length;
    
    // Get unique branches
    const branches = [...new Set(mockLoans.map(loan => loan.branchName))];
    
    document.getElementById('systemClientCount').textContent = mockClients.length;
    document.getElementById('systemDisbursed').textContent = formatCurrency(totalDisbursed);
    document.getElementById('systemCollected').textContent = formatCurrency(totalCollected);
    document.getElementById('systemDefaults').textContent = defaultCount;
    document.getElementById('systemActiveLoans').textContent = approvedLoans.length;
    document.getElementById('systemBranches').textContent = branches.length;
    
    // Load recent activity
    loadRecentActivity();
    
    // Add click handlers to stat cards
    addStatCardClickHandlers();
}

function addStatCardClickHandlers() {
    // Total Clients card - show client breakdown by branch
    const clientCountCard = document.getElementById('systemClientCount').closest('.stat-card');
    if (clientCountCard) {
        clientCountCard.style.cursor = 'pointer';
        clientCountCard.onclick = function() {
            showClientBreakdownModal();
        };
    }
    
    // Active Loans card - show all active loans
    const activeLoansCard = document.getElementById('systemActiveLoans').closest('.stat-card');
    if (activeLoansCard) {
        activeLoansCard.style.cursor = 'pointer';
        activeLoansCard.onclick = function() {
            showActiveLoansModal();
        };
    }
    
    // Total Disbursed card - show disbursement breakdown
    const disbursedCard = document.getElementById('systemDisbursed').closest('.stat-card');
    if (disbursedCard) {
        disbursedCard.style.cursor = 'pointer';
        disbursedCard.onclick = function() {
            showDisbursedBreakdownModal();
        };
    }
    
    // Default Rate card - show clients with defaults
    const defaultsCard = document.getElementById('systemDefaults').closest('.stat-card');
    if (defaultsCard) {
        defaultsCard.style.cursor = 'pointer';
        defaultsCard.onclick = function() {
            showDefaultsModal();
        };
    }
    
    // Pending Loans card - show pending applications
    const pendingCard = document.getElementById('systemCollected').closest('.stat-card');
    if (pendingCard) {
        pendingCard.style.cursor = 'pointer';
        pendingCard.onclick = function() {
            showCollectedBreakdownModal();
        };
    }
    
    // Total Branches card - show branch list
    const branchesCard = document.getElementById('systemBranches').closest('.stat-card');
    if (branchesCard) {
        branchesCard.style.cursor = 'pointer';
        branchesCard.onclick = function() {
            showAdminTab('branches');
        };
    }
}

function loadBranchAnalytics() {
    const branchAnalyticsDiv = document.getElementById('branchAnalytics');
    branchAnalyticsDiv.innerHTML = '';
    
    // Get unique branches
    const branches = [...new Set(mockLoans.map(loan => loan.branchName))];
    
    branches.forEach(branchName => {
        const branchLoans = mockLoans.filter(loan => loan.branchName === branchName && loan.status === 'APPROVED');
        const branchClients = mockClients.filter(client => {
            return mockLoans.some(loan => loan.clientId === client.id && loan.branchName === branchName);
        });
        
        const totalDisbursed = branchLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
        const totalCollected = branchLoans.reduce((sum, loan) => sum + loan.collectedAmount, 0);
        const totalDefaults = branchLoans.reduce((sum, loan) => sum + loan.defaultAmount, 0);
        const defaultCount = branchLoans.filter(loan => loan.defaultAmount > 0).length;
        
        const branchCard = document.createElement('div');
        branchCard.className = 'branch-card';
        branchCard.innerHTML = `
            <h3>🏢 ${branchName}</h3>
            <div class="branch-stats-grid">
                <div class="branch-stat">
                    <div class="branch-stat-label">Clients</div>
                    <div class="branch-stat-value">${branchClients.length}</div>
                </div>
                <div class="branch-stat">
                    <div class="branch-stat-label">Active Loans</div>
                    <div class="branch-stat-value">${branchLoans.length}</div>
                </div>
                <div class="branch-stat">
                    <div class="branch-stat-label">Disbursed</div>
                    <div class="branch-stat-value">${formatCurrency(totalDisbursed)}</div>
                </div>
                <div class="branch-stat">
                    <div class="branch-stat-label">Collected</div>
                    <div class="branch-stat-value">${formatCurrency(totalCollected)}</div>
                </div>
                <div class="branch-stat">
                    <div class="branch-stat-label">Defaults</div>
                    <div class="branch-stat-value" style="color: #dc3545;">${defaultCount}</div>
                </div>
                <div class="branch-stat">
                    <div class="branch-stat-label">Default Amount</div>
                    <div class="branch-stat-value" style="color: #dc3545;">${formatCurrency(totalDefaults)}</div>
                </div>
            </div>
        `;
        branchAnalyticsDiv.appendChild(branchCard);
    });
}

function loadDefaultsList() {
    const defaultsListDiv = document.getElementById('defaultsList');
    const branchFilter = document.getElementById('defaultBranchFilter');
    
    // Populate branch filter
    const branches = [...new Set(mockLoans.map(loan => loan.branchName))];
    branchFilter.innerHTML = '<option value="all">All Branches</option>';
    branches.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = branch;
        branchFilter.appendChild(option);
    });
    
    filterDefaults();
}

function filterDefaults() {
    const defaultsListDiv = document.getElementById('defaultsList');
    const branchFilter = document.getElementById('defaultBranchFilter').value;
    
    defaultsListDiv.innerHTML = '';
    
    // Get loans with defaults
    let defaultLoans = mockLoans.filter(loan => loan.defaultAmount > 0);
    
    if (branchFilter !== 'all') {
        defaultLoans = defaultLoans.filter(loan => loan.branchName === branchFilter);
    }
    
    if (defaultLoans.length === 0) {
        defaultsListDiv.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No defaults found</p>';
        return;
    }
    
    defaultLoans.forEach(loan => {
        const client = mockClients.find(c => c.id === loan.clientId);
        if (!client) return;
        
        const defaultCard = document.createElement('div');
        defaultCard.className = 'default-card';
        defaultCard.innerHTML = `
            <div class="default-card-header">
                <h4>
                    <span class="client-name-link" onclick="viewClientDetail(${client.id})">
                        ${client.fullName || client.firstName + ' ' + client.lastName}
                    </span>
                </h4>
                <span class="default-badge">DEFAULT</span>
            </div>
            <div class="default-details">
                <div class="default-detail-item">
                    <strong>Loan #:</strong> ${loan.loanNumber}
                </div>
                <div class="default-detail-item">
                    <strong>Branch:</strong> ${loan.branchName}
                </div>
                <div class="default-detail-item">
                    <strong>Phone:</strong> ${client.phoneNumber}
                </div>
                <div class="default-detail-item">
                    <strong>ID Number:</strong> ${client.nationalId}
                </div>
                <div class="default-detail-item">
                    <strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}
                </div>
                <div class="default-detail-item">
                    <strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}
                </div>
                <div class="default-detail-item">
                    <strong>Default Amount:</strong> <span style="color: #dc3545; font-weight: bold;">${formatCurrency(loan.defaultAmount)}</span>
                </div>
                <div class="default-detail-item">
                    <strong>District:</strong> ${client.district || 'N/A'}
                </div>
                <div class="default-detail-item">
                    <strong>Village:</strong> ${client.homeVillage || 'N/A'}
                </div>
                <div class="default-detail-item">
                    <strong>Employer:</strong> ${client.employerName || 'N/A'}
                </div>
                <div class="default-detail-item">
                    <strong>Witness:</strong> ${client.witnessName || 'N/A'}
                </div>
                <div class="default-detail-item">
                    <strong>Witness Phone:</strong> ${client.witnessContact || 'N/A'}
                </div>
            </div>
            <button class="btn btn-primary" onclick="viewClientDetail(${client.id})" style="margin-top: 15px;">
                View Full Details
            </button>
        `;
        defaultsListDiv.appendChild(defaultCard);
    });
}

function loadRecentActivity() {
    const activityDiv = document.getElementById('recentActivity');
    activityDiv.innerHTML = '';
    
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">✓</div>
            <div class="activity-details">
                <h4>Loan Repayment Received - ${activity.amount}</h4>
                <p>${activity.client} • ${activity.time}</p>
            </div>
        `;
        activityDiv.appendChild(activityItem);
    });
}

// Client Detail Modal Functions
function viewClientDetail(clientId) {
    const client = mockClients.find(c => c.id === clientId);
    if (!client) return;
    
    const modal = document.getElementById('clientDetailModal');
    const body = document.getElementById('clientDetailBody');
    
    // Get client's loans
    const clientLoans = mockLoans.filter(loan => loan.clientId === clientId);
    
    body.innerHTML = `
        <div class="client-info-section">
            <h3>Personal Information</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Full Name</div>
                    <div class="client-info-value">${client.fullName || client.firstName + ' ' + client.lastName}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Title</div>
                    <div class="client-info-value">${client.title || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Gender</div>
                    <div class="client-info-value">${client.gender || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Date of Birth</div>
                    <div class="client-info-value">${client.dateOfBirth || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Marital Status</div>
                    <div class="client-info-value">${client.maritalStatus || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">ID Type</div>
                    <div class="client-info-value">${client.idType || 'National ID'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">ID Number</div>
                    <div class="client-info-value">${client.nationalId}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Phone Number</div>
                    <div class="client-info-value">${client.phoneNumber}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Email</div>
                    <div class="client-info-value">${client.email || 'N/A'}</div>
                </div>
            </div>
        </div>
        
        <div class="client-info-section">
            <h3>Location Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">District</div>
                    <div class="client-info-value">${client.district || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Traditional Authority</div>
                    <div class="client-info-value">${client.traditionalAuthority || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Home Village</div>
                    <div class="client-info-value">${client.homeVillage || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Physical Address</div>
                    <div class="client-info-value">${client.address || 'N/A'}</div>
                </div>
            </div>
        </div>
        
        ${client.spouseName ? `
        <div class="client-info-section">
            <h3>Spouse Information</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Spouse Name</div>
                    <div class="client-info-value">${client.spouseName}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Spouse Contact</div>
                    <div class="client-info-value">${client.spouseContact || 'N/A'}</div>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="client-info-section">
            <h3>Employment Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Employer/Ministry</div>
                    <div class="client-info-value">${client.employerName || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Department</div>
                    <div class="client-info-value">${client.department || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Employment Number</div>
                    <div class="client-info-value">${client.employmentNumber || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Monthly Salary</div>
                    <div class="client-info-value">MK ${client.monthlySalary || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Employment Status</div>
                    <div class="client-info-value">${client.fullEmployment || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Length of Service</div>
                    <div class="client-info-value">${client.lengthOfService || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Work Address</div>
                    <div class="client-info-value">${client.workAddress || 'N/A'}</div>
                </div>
            </div>
        </div>
        
        <div class="client-info-section">
            <h3>Bank Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Bank Name</div>
                    <div class="client-info-value">${client.bankName || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Account Number</div>
                    <div class="client-info-value">${client.accountNumber || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Account Type</div>
                    <div class="client-info-value">${client.accountType || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Branch</div>
                    <div class="client-info-value">${client.bankBranch || 'N/A'}</div>
                </div>
            </div>
        </div>
        
        <div class="client-info-section">
            <h3>Witness/Guarantor Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Witness Name</div>
                    <div class="client-info-value">${client.witnessName || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Witness Contact</div>
                    <div class="client-info-value">${client.witnessContact || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Relationship</div>
                    <div class="client-info-value">${client.witnessRelationship || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Witness Occupation</div>
                    <div class="client-info-value">${client.witnessOccupation || 'N/A'}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Witness Income</div>
                    <div class="client-info-value">MK ${client.witnessIncome || 'N/A'}</div>
                </div>
            </div>
        </div>
        
        ${clientLoans.length > 0 ? `
        <div class="client-info-section">
            <h3>Loan History</h3>
            ${clientLoans.map(loan => `
                <div class="loan-history-item" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong>Loan #${loan.loanNumber}</strong>
                        <span class="badge badge-${loan.status.toLowerCase()}">${loan.status}</span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 14px;">
                        <div><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</div>
                        <div><strong>Purpose:</strong> ${loan.loanPurpose}</div>
                        <div><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</div>
                        ${loan.disbursedAmount ? `<div><strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}</div>` : ''}
                        ${loan.collectedAmount ? `<div><strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}</div>` : ''}
                        ${loan.defaultAmount > 0 ? `<div style="color: #dc3545;"><strong>Default:</strong> ${formatCurrency(loan.defaultAmount)}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${client.idFrontImage || client.idBackImage ? `
        <div class="client-info-section">
            <h3>ID Documents</h3>
            <div class="client-id-images-modal">
                ${client.idFrontImage ? `
                <div class="client-id-image-container">
                    <img src="${client.idFrontImage}" alt="ID Front" onclick="viewIdImage('${client.idFrontImage}', 'ID Front')">
                    <p>ID Front Side</p>
                </div>
                ` : ''}
                ${client.idBackImage ? `
                <div class="client-id-image-container">
                    <img src="${client.idBackImage}" alt="ID Back" onclick="viewIdImage('${client.idBackImage}', 'ID Back')">
                    <p>ID Back Side</p>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}
    `;
    
    modal.style.display = 'flex';
}

function closeClientModal() {
    document.getElementById('clientDetailModal').style.display = 'none';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('clientDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeClientModal();
            }
        });
    }
});

// Show client breakdown by branch modal
function showClientBreakdownModal() {
    // Get unique branches
    const branches = [...new Set(mockLoans.map(loan => loan.branchName))];
    
    // Calculate clients per branch
    const branchClientData = branches.map(branchName => {
        const branchClients = mockClients.filter(client => {
            return mockLoans.some(loan => loan.clientId === client.id && loan.branchName === branchName);
        });
        return {
            branchName: branchName,
            clientCount: branchClients.length,
            clients: branchClients
        };
    });
    
    // Sort by client count descending
    branchClientData.sort((a, b) => b.clientCount - a.clientCount);
    
    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'clientBreakdownModal';
    modal.innerHTML = `
        <div class="client-modal-content">
            <div class="client-modal-header">
                <h2>📊 Total Clients by Branch</h2>
                <button class="modal-close" onclick="closeClientBreakdownModal()">✕</button>
            </div>
            <div class="client-modal-body">
                <div class="branch-breakdown-summary">
                    <div class="breakdown-total">
                        <h3>Total Clients: ${mockClients.length}</h3>
                        <p>Across ${branches.length} branches</p>
                    </div>
                </div>
                
                <div class="branch-breakdown-list">
                    ${branchClientData.map(branch => `
                        <div class="branch-breakdown-card">
                            <div class="branch-breakdown-header">
                                <h3>🏢 ${branch.branchName}</h3>
                                <div class="branch-breakdown-count">${branch.clientCount} ${branch.clientCount === 1 ? 'Client' : 'Clients'}</div>
                            </div>
                            <div class="branch-breakdown-percentage">
                                <div class="percentage-bar">
                                    <div class="percentage-fill" style="width: ${(branch.clientCount / mockClients.length * 100).toFixed(1)}%"></div>
                                </div>
                                <span class="percentage-text">${(branch.clientCount / mockClients.length * 100).toFixed(1)}% of total</span>
                            </div>
                            ${branch.clients.length > 0 ? `
                                <div class="branch-client-list">
                                    <p><strong>Clients:</strong></p>
                                    <ul>
                                        ${branch.clients.slice(0, 5).map(client => `
                                            <li>
                                                <span class="client-name-link" onclick="closeClientBreakdownModal(); viewClientDetail(${client.id});">
                                                    ${client.fullName || client.firstName + ' ' + client.lastName}
                                                </span>
                                            </li>
                                        `).join('')}
                                        ${branch.clients.length > 5 ? `<li class="more-clients">... and ${branch.clients.length - 5} more</li>` : ''}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeClientBreakdownModal();
        }
    };
    
    document.body.appendChild(modal);
}

function closeClientBreakdownModal() {
    const modal = document.getElementById('clientBreakdownModal');
    if (modal) {
        modal.remove();
    }
}

// Show Active Loans Modal
function showActiveLoansModal() {
    const activeLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    
    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'activeLoansModal';
    modal.innerHTML = `
        <div class="client-modal-content" style="max-width: 1000px;">
            <div class="client-modal-header">
                <h2>✓ Active Loans</h2>
                <button class="modal-close" onclick="closeModal('activeLoansModal')">✕</button>
            </div>
            <div class="client-modal-body">
                <div class="branch-breakdown-summary">
                    <div class="breakdown-total">
                        <h3>Total Active Loans: ${activeLoans.length}</h3>
                        <p>Total Amount: ${formatCurrency(activeLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0))}</p>
                    </div>
                </div>
                
                <div class="loans-list" style="margin-top: 20px;">
                    ${activeLoans.map(loan => `
                        <div class="loan-card approved-loan-card" style="margin-bottom: 15px;">
                            <div class="loan-info">
                                <h3>Loan #${loan.loanNumber}</h3>
                                <p><strong>Client:</strong> <span class="client-name-link" onclick="closeModal('activeLoansModal'); viewClientDetail(${loan.clientId});">${loan.clientName}</span></p>
                                <p><strong>Branch:</strong> ${loan.branchName}</p>
                                <p><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                                <p><strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}</p>
                                <p><strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}</p>
                                <p><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</p>
                                ${loan.disbursedDate ? `<p><strong>Date:</strong> ${loan.disbursedDate}</p>` : ''}
                                <span class="badge badge-approved">Active</span>
                            </div>
                            <div class="loan-stats">
                                <div class="loan-stat-item">
                                    <div class="loan-stat-label">Progress</div>
                                    <div class="loan-stat-value">${loan.disbursedAmount > 0 ? ((loan.collectedAmount / loan.disbursedAmount) * 100).toFixed(1) : 0}%</div>
                                </div>
                                ${loan.defaultAmount > 0 ? `
                                <div class="loan-stat-item default-stat">
                                    <div class="loan-stat-label">Default</div>
                                    <div class="loan-stat-value">${formatCurrency(loan.defaultAmount)}</div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal('activeLoansModal');
        }
    };
    
    document.body.appendChild(modal);
}

// Show Disbursed Breakdown Modal
function showDisbursedBreakdownModal() {
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    const totalDisbursed = approvedLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
    
    // Group by branch
    const branches = [...new Set(mockLoans.map(loan => loan.branchName))];
    const branchData = branches.map(branchName => {
        const branchLoans = approvedLoans.filter(loan => loan.branchName === branchName);
        const disbursed = branchLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
        return {
            branchName,
            disbursed,
            loanCount: branchLoans.length
        };
    }).sort((a, b) => b.disbursed - a.disbursed);
    
    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'disbursedModal';
    modal.innerHTML = `
        <div class="client-modal-content">
            <div class="client-modal-header">
                <h2>💰 Total Disbursed</h2>
                <button class="modal-close" onclick="closeModal('disbursedModal')">✕</button>
            </div>
            <div class="client-modal-body">
                <div class="branch-breakdown-summary">
                    <div class="breakdown-total">
                        <h3>${formatCurrency(totalDisbursed)}</h3>
                        <p>Across ${approvedLoans.length} active loans</p>
                    </div>
                </div>
                
                <div class="branch-breakdown-list">
                    ${branchData.map(branch => `
                        <div class="branch-breakdown-card">
                            <div class="branch-breakdown-header">
                                <h3>🏢 ${branch.branchName}</h3>
                                <div class="branch-breakdown-count">${formatCurrency(branch.disbursed)}</div>
                            </div>
                            <div class="branch-breakdown-percentage">
                                <div class="percentage-bar">
                                    <div class="percentage-fill" style="width: ${(branch.disbursed / totalDisbursed * 100).toFixed(1)}%"></div>
                                </div>
                                <span class="percentage-text">${(branch.disbursed / totalDisbursed * 100).toFixed(1)}% of total • ${branch.loanCount} loans</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal('disbursedModal');
        }
    };
    
    document.body.appendChild(modal);
}

// Show Collected Breakdown Modal
function showCollectedBreakdownModal() {
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    const totalCollected = approvedLoans.reduce((sum, loan) => sum + loan.collectedAmount, 0);
    const totalDisbursed = approvedLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
    
    // Group by branch
    const branches = [...new Set(mockLoans.map(loan => loan.branchName))];
    const branchData = branches.map(branchName => {
        const branchLoans = approvedLoans.filter(loan => loan.branchName === branchName);
        const collected = branchLoans.reduce((sum, loan) => sum + loan.collectedAmount, 0);
        const disbursed = branchLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
        return {
            branchName,
            collected,
            disbursed,
            loanCount: branchLoans.length
        };
    }).sort((a, b) => b.collected - a.collected);
    
    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'collectedModal';
    modal.innerHTML = `
        <div class="client-modal-content">
            <div class="client-modal-header">
                <h2>✅ Loans Collected</h2>
                <button class="modal-close" onclick="closeModal('collectedModal')">✕</button>
            </div>
            <div class="client-modal-body">
                <div class="branch-breakdown-summary">
                    <div class="breakdown-total">
                        <h3>${formatCurrency(totalCollected)}</h3>
                        <p>Collection Rate: ${totalDisbursed > 0 ? ((totalCollected / totalDisbursed) * 100).toFixed(1) : 0}%</p>
                    </div>
                </div>
                
                <div class="branch-breakdown-list">
                    ${branchData.map(branch => `
                        <div class="branch-breakdown-card">
                            <div class="branch-breakdown-header">
                                <h3>🏢 ${branch.branchName}</h3>
                                <div class="branch-breakdown-count">${formatCurrency(branch.collected)}</div>
                            </div>
                            <div class="branch-breakdown-percentage">
                                <div class="percentage-bar">
                                    <div class="percentage-fill" style="width: ${branch.disbursed > 0 ? (branch.collected / branch.disbursed * 100).toFixed(1) : 0}%; background: linear-gradient(90deg, #28a745 0%, #20c997 100%);"></div>
                                </div>
                                <span class="percentage-text">${branch.disbursed > 0 ? ((branch.collected / branch.disbursed) * 100).toFixed(1) : 0}% collected • ${branch.loanCount} loans</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal('collectedModal');
        }
    };
    
    document.body.appendChild(modal);
}

// Show Defaults Modal
function showDefaultsModal() {
    const defaultLoans = mockLoans.filter(loan => loan.defaultAmount > 0);
    const totalDefaults = defaultLoans.reduce((sum, loan) => sum + loan.defaultAmount, 0);
    
    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'defaultsModal';
    modal.innerHTML = `
        <div class="client-modal-content" style="max-width: 1000px;">
            <div class="client-modal-header" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);">
                <h2>⚠️ Clients with Defaults</h2>
                <button class="modal-close" onclick="closeModal('defaultsModal')">✕</button>
            </div>
            <div class="client-modal-body">
                <div class="branch-breakdown-summary" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);">
                    <div class="breakdown-total">
                        <h3>Total Defaults: ${formatCurrency(totalDefaults)}</h3>
                        <p>${defaultLoans.length} clients with outstanding defaults</p>
                    </div>
                </div>
                
                <div class="defaults-list" style="margin-top: 20px;">
                    ${defaultLoans.map(loan => {
                        const client = mockClients.find(c => c.id === loan.clientId);
                        if (!client) return '';
                        
                        return `
                            <div class="default-card" style="margin-bottom: 15px;">
                                <div class="default-card-header">
                                    <h4>
                                        <span class="client-name-link" onclick="closeModal('defaultsModal'); viewClientDetail(${client.id});">
                                            ${client.fullName || client.firstName + ' ' + client.lastName}
                                        </span>
                                    </h4>
                                    <span class="default-badge">DEFAULT</span>
                                </div>
                                <div class="default-details">
                                    <div class="default-detail-item">
                                        <strong>Loan #:</strong> ${loan.loanNumber}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Branch:</strong> ${loan.branchName}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Phone:</strong> ${client.phoneNumber}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>ID Number:</strong> ${client.nationalId}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Default Amount:</strong> <span style="color: #dc3545; font-weight: bold;">${formatCurrency(loan.defaultAmount)}</span>
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>District:</strong> ${client.district || 'N/A'}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Village:</strong> ${client.homeVillage || 'N/A'}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Employer:</strong> ${client.employerName || 'N/A'}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Witness:</strong> ${client.witnessName || 'N/A'}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Witness Phone:</strong> ${client.witnessContact || 'N/A'}
                                    </div>
                                </div>
                                <button class="btn btn-primary" onclick="closeModal('defaultsModal'); viewClientDetail(${client.id});" style="margin-top: 15px;">
                                    View Full Details
                                </button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal('defaultsModal');
        }
    };
    
    document.body.appendChild(modal);
}

// Generic close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}
