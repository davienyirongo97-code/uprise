// Backend API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081/api'
    : 'https://agile-wonder-production-b2be.up.railway.app/api';
let currentUser = null;
let authToken = null;

// LocalStorage keys
const STORAGE_KEYS = {
    CLIENTS: 'uprise_clients',
    LOANS: 'uprise_loans',
    USERS: 'uprise_users',
    SETTINGS: 'uprise_settings'
};

// Global Settings
let globalSettings = loadFromStorage(STORAGE_KEYS.SETTINGS, {
    interestRate: 15, // Default 15% annual
    currency: 'MK',
    loanFees: 2.5 // Default processing fee
});

// LocalStorage helper functions
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromStorage(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'API request failed');
    }

    return response.json();
}

// Initialize mock data - DO NOT load from localStorage yet, use defaults first
let mockClients = [
    // Main Branch Clients
    { id: 1, firstName: "Chisomo", lastName: "Banda", fullName: "Chisomo Banda", nationalId: "MWI001234567", username: "chisomo", password: "1234", phoneNumber: "+265888123456", email: "chisomo.banda@email.com", district: "Lilongwe", homeVillage: "Area 25", employerName: "Ministry of Health", monthlySalary: 450000, witnessName: "Grace Phiri", witnessContact: "+265999234567", branchName: "Main Branch" },
    { id: 2, firstName: "Thoko", lastName: "Mwale", fullName: "Thoko Mwale", nationalId: "MWI002345678", phoneNumber: "+265888234567", email: "thoko.mwale@email.com", district: "Lilongwe", homeVillage: "Area 18", employerName: "Malawi Revenue Authority", monthlySalary: 650000, witnessName: "John Kamwendo", witnessContact: "+265999345678", branchName: "Main Branch" },
    { id: 3, firstName: "Mphatso", lastName: "Chirwa", fullName: "Mphatso Chirwa", nationalId: "MWI003456789", phoneNumber: "+265888345678", email: "mphatso.chirwa@email.com", district: "Lilongwe", homeVillage: "Area 47", employerName: "Reserve Bank of Malawi", monthlySalary: 850000, witnessName: "Mercy Banda", witnessContact: "+265999456789", branchName: "Main Branch" },
    { id: 4, firstName: "Kondwani", lastName: "Phiri", fullName: "Kondwani Phiri", nationalId: "MWI004567890", phoneNumber: "+265888456789", email: "kondwani.phiri@email.com", district: "Lilongwe", homeVillage: "Area 36", employerName: "Airtel Malawi", monthlySalary: 550000, witnessName: "Esther Nyirenda", witnessContact: "+265999567890", branchName: "Main Branch" },
    { id: 5, firstName: "Tamanda", lastName: "Nyirenda", fullName: "Tamanda Nyirenda", nationalId: "MWI005678901", phoneNumber: "+265888567890", email: "tamanda.nyirenda@email.com", district: "Lilongwe", homeVillage: "Area 49", employerName: "TNM Plc", monthlySalary: 480000, witnessName: "Patrick Mbewe", witnessContact: "+265999678901", branchName: "Main Branch" },

    // Santhe Branch Clients (Kasungu)
    { id: 6, firstName: "Chimwemwe", lastName: "Kachingwe", fullName: "Chimwemwe Kachingwe", nationalId: "MWI006789012", phoneNumber: "+265888678901", email: "chimwemwe.k@email.com", district: "Kasungu", homeVillage: "Santhe", employerName: "Tobacco Commission", monthlySalary: 420000, witnessName: "Linda Banda", witnessContact: "+265999789012", branchName: "Santhe Branch" },
    { id: 7, firstName: "Pemphero", lastName: "Gondwe", fullName: "Pemphero Gondwe", nationalId: "MWI007890123", phoneNumber: "+265888789012", email: "pemphero.g@email.com", district: "Kasungu", homeVillage: "Wimbe", employerName: "Kasungu District Council", monthlySalary: 380000, witnessName: "Moses Phiri", witnessContact: "+265999890123", branchName: "Santhe Branch" },

    // Chithiba Branch Clients (Kasungu)
    { id: 8, firstName: "Alinafe", lastName: "Mkandawire", fullName: "Alinafe Mkandawire", nationalId: "MWI008901234", phoneNumber: "+265888890123", email: "alinafe.m@email.com", district: "Kasungu", homeVillage: "Chithiba", employerName: "Kasungu Inn", monthlySalary: 520000, witnessName: "Ruth Kamwendo", witnessContact: "+265999901234", branchName: "Chithiba Branch" },
    { id: 9, firstName: "Dalitso", lastName: "Tembo", fullName: "Dalitso Tembo", nationalId: "MWI009012345", phoneNumber: "+265888901234", email: "dalitso.t@email.com", district: "Kasungu", homeVillage: "Lisasadzi", employerName: "Ministry of Agriculture", monthlySalary: 720000, witnessName: "Sarah Nyirongo", witnessContact: "+265999012345", branchName: "Chithiba Branch" },

    // Jenda Branch Clients (Mzimba)
    { id: 10, firstName: "Wongani", lastName: "Lungu", fullName: "Wongani Lungu", nationalId: "MWI010123456", phoneNumber: "+265888012345", email: "wongani.l@email.com", district: "Mzimba", homeVillage: "Jenda", employerName: "Mzimba District Council", monthlySalary: 460000, witnessName: "James Mhango", witnessContact: "+265999123456", branchName: "Jenda Branch" },
    { id: 11, firstName: "Tawonga", lastName: "Zimba", fullName: "Tawonga Zimba", nationalId: "MWI011234567", phoneNumber: "+265888112345", email: "tawonga.z@email.com", district: "Mzimba", homeVillage: "Ekwendeni", employerName: "Ministry of Education", monthlySalary: 410000, witnessName: "Agnes Phiri", witnessContact: "+265999212345", branchName: "Jenda Branch" },
    { id: 12, firstName: "Limbani", lastName: "Sakala", fullName: "Limbani Sakala", nationalId: "MWI012345678", phoneNumber: "+265888212345", email: "limbani.s@email.com", district: "Mzimba", homeVillage: "Mzimba Boma", employerName: "Agricultural Development Division", monthlySalary: 390000, witnessName: "Peter Banda", witnessContact: "+265999312345", branchName: "Jenda Branch" }
];

let mockLoans = [
    // Main Branch Loans (Lilongwe)
    { id: 1, loanNumber: "LN001", clientName: "Chisomo Banda", clientId: 1, requestedAmount: 2500000, repaymentPeriodMonths: 12, loanPurpose: "Business expansion - grocery shop", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 2500000, collectedAmount: 1800000, defaultAmount: 0, disbursedDate: "2024-01-15" },
    { id: 2, loanNumber: "LN002", clientName: "Thoko Mwale", clientId: 2, requestedAmount: 3500000, repaymentPeriodMonths: 18, loanPurpose: "Home renovation", status: "APPROVED", branchName: "Main Branch", disbursedAmount: 3500000, collectedAmount: 3500000, defaultAmount: 0, disbursedDate: "2023-12-01" },
    { id: 4, loanNumber: "LN004", clientName: "Kondwani Phiri", clientId: 4, requestedAmount: 1800000, repaymentPeriodMonths: 12, loanPurpose: "Education - university fees", status: "PENDING", branchName: "Main Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 },
    { id: 13, loanNumber: "LN013", clientName: "Gift Phiri", clientId: 1, requestedAmount: 500000, repaymentPeriodMonths: 12, loanPurpose: "Business Expansion - small tuckshop", status: "REJECTED", branchName: "Main Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 },

    // Santhe Branch Loans (Kasungu)
    { id: 6, loanNumber: "LN006", clientName: "Chimwemwe Kachingwe", clientId: 6, requestedAmount: 1500000, repaymentPeriodMonths: 12, loanPurpose: "Agricultural inputs", status: "APPROVED", branchName: "Santhe Branch", disbursedAmount: 1500000, collectedAmount: 800000, defaultAmount: 400000, disbursedDate: "2024-01-20" },
    { id: 7, loanNumber: "LN007", clientName: "Pemphero Gondwe", clientId: 7, requestedAmount: 2800000, repaymentPeriodMonths: 18, loanPurpose: "Tailoring business equipment", status: "PENDING", branchName: "Santhe Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 },

    // Chithiba Branch Loans (Kasungu)
    { id: 8, loanNumber: "LN008", clientName: "Alinafe Mkandawire", clientId: 8, requestedAmount: 3200000, repaymentPeriodMonths: 24, loanPurpose: "House construction", status: "APPROVED", branchName: "Chithiba Branch", disbursedAmount: 3200000, collectedAmount: 2100000, defaultAmount: 0, disbursedDate: "2023-11-15" },
    { id: 9, loanNumber: "LN009", clientName: "Dalitso Tembo", clientId: 9, requestedAmount: 4500000, repaymentPeriodMonths: 24, loanPurpose: "Rental property investment", status: "APPROVED", branchName: "Chithiba Branch", disbursedAmount: 4500000, collectedAmount: 2800000, defaultAmount: 0, disbursedDate: "2023-09-01" },

    // Jenda Branch Loans (Mzimba)
    { id: 11, loanNumber: "LN011", clientName: "Tawonga Zimba", clientId: 11, requestedAmount: 2600000, repaymentPeriodMonths: 18, loanPurpose: "Motorcycle purchase for transport business", status: "APPROVED", branchName: "Jenda Branch", disbursedAmount: 2600000, collectedAmount: 1400000, defaultAmount: 600000, disbursedDate: "2024-01-05" },
    { id: 12, loanNumber: "LN012", clientName: "Limbani Sakala", clientId: 12, requestedAmount: 3100000, repaymentPeriodMonths: 24, loanPurpose: "Farm equipment and seeds", status: "PENDING", branchName: "Jenda Branch", disbursedAmount: 0, collectedAmount: 0, defaultAmount: 0 }
];

// Branch users storage - also use localStorage
let branchUsers = [
    { username: 'branch1', password: 'branch123', fullName: 'Grace Phiri', branchName: 'Main Branch', district: 'Lilongwe', email: 'grace.phiri@uprise.com', role: 'Branch Manager', isActive: true },
    { username: 'branch2', password: 'branch123', fullName: 'Santhe Manager', branchName: 'Santhe Branch', district: 'Kasungu', email: 'santhe@uprise.com', role: 'Branch Manager', isActive: true },
    { username: 'branch3', password: 'branch123', fullName: 'Chithiba Manager', branchName: 'Chithiba Branch', district: 'Kasungu', email: 'chithiba@uprise.com', role: 'Branch Manager', isActive: true },
    { username: 'branch4', password: 'branch123', fullName: 'Jenda Manager', branchName: 'Jenda Branch', district: 'Mzimba', email: 'jenda@uprise.com', role: 'Branch Manager', isActive: true },
    { username: 'officer1', password: 'officer123', fullName: 'Mercy Nyirenda', branchName: 'Main Branch', district: 'Lilongwe', email: 'mercy.nyirenda@uprise.com', role: 'Loan Officer', isActive: true }
];

const recentActivities = [
    { type: 'payment', client: 'Chisomo Banda - LN001', amount: 'MK 250,000', time: '2 hours ago', branch: 'Main Branch' },
    { type: 'payment', client: 'Alinafe Mkandawire - LN008', amount: 'MK 180,000', time: '4 hours ago', branch: 'Chithiba Branch' },
    { type: 'payment', client: 'Tamanda Nyirenda - LN005', amount: 'MK 200,000', time: '6 hours ago', branch: 'Main Branch' },
    { type: 'approval', client: 'Thoko Mwale - LN002', amount: 'MK 3,500,000', time: '8 hours ago', branch: 'Main Branch' },
    { type: 'payment', client: 'Dalitso Tembo - LN009', amount: 'MK 350,000', time: '1 day ago', branch: 'Chithiba Branch' },
    { type: 'payment', client: 'Mphatso Chirwa - LN003', amount: 'MK 280,000', time: '1 day ago', branch: 'Main Branch' },
    { type: 'payment', client: 'Tawonga Zimba - LN011', amount: 'MK 150,000', time: '2 days ago', branch: 'Jenda Branch' },
    { type: 'approval', client: 'Chimwemwe Kachingwe - LN006', amount: 'MK 1,500,000', time: '2 days ago', branch: 'Santhe Branch' }
];

// Utility Functions
function toggleLoading(show, message = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = overlay.querySelector('.loading-text');
    if (show) {
        text.textContent = message;
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showTab(tabName) {
    toggleLoading(true, 'Updating view...');

    setTimeout(() => {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetBtn = event && event.target ? event.target : Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(`'${tabName}'`));
        if (targetBtn) targetBtn.classList.add('active');

        document.getElementById(tabName + 'Tab').classList.add('active');

        if (tabName === 'overview') {
            loadBranchOverview();
        } else if (tabName === 'clients') {
            loadClients();
        } else if (tabName === 'loans') {
            showBranchLoanSubTab('pending');
        } else if (tabName === 'apply') {
            loadClientsForLoan();
            const rateInput = document.getElementById('appliedInterestRate');
            if (rateInput) rateInput.value = (globalSettings.interestRate || 15) + '%';

            const amountInput = document.getElementById('loanAmount');
            const periodInput = document.getElementById('repaymentPeriod');
            const triggerUpdate = () => updateRepaymentEstimate();

            if (amountInput) {
                amountInput.addEventListener('input', triggerUpdate);
                amountInput.addEventListener('keyup', triggerUpdate);
            }
            if (periodInput) {
                periodInput.addEventListener('input', triggerUpdate);
                periodInput.addEventListener('change', triggerUpdate);
            }
        }

        toggleLoading(false);
    }, 400);
}

function showAdminTab(tabName, subTabName) {
    toggleLoading(true, 'Accessing data...');

    setTimeout(() => {
        document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));

        const activeTab = document.getElementById(tabName + 'Tab');
        if (activeTab) {
            activeTab.classList.add('active');
            const activeBtn = Array.from(document.querySelectorAll('.admin-tab-btn')).find(btn => btn.getAttribute('onclick').includes(`'${tabName}'`));
            if (activeBtn) activeBtn.classList.add('active');

            if (tabName === 'overview') {
                loadAdminData();
            } else if (tabName === 'adminLoans') {
                // Use subTabName if provided, otherwise default to 'pending'
                showLoanSubTab(subTabName || 'pending');
            } else if (tabName === 'users') {
                showBranchSubTab('branches');
            } else if (tabName === 'settings') {
                loadSettingsPage();
            }
        }
        toggleLoading(false);
    }, 400);
}

// Authentication - Using only mock data (no backend)
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        toggleLoading(true, 'Authenticating...');

        setTimeout(() => {
            const admin = branchUsers.find(u => u.username === user && u.password === pass && u.role === 'Admin');
            const branch = branchUsers.find(u => u.username === user && u.password === pass && (u.role === 'Branch Manager' || u.role === 'Loan Officer'));
            const client = mockClients.find(u => {
                const clientUsername = u.username || u.nationalId;
                const clientPassword = u.password || '1234';
                return clientUsername.toLowerCase() === user.toLowerCase() && pass === clientPassword;
            });

            if (admin) {
                currentUser = admin;
                showScreen('adminDashboard');
                showAdminTab('overview');
                const welcomeText = document.querySelector('#adminDashboard .welcome-text span');
                if (welcomeText) welcomeText.textContent = admin.fullName;
            } else if (branch) {
                if (branch.isActive === false) {
                    errorDiv.textContent = 'This account is disabled.';
                    toggleLoading(false);
                    return;
                }
                currentUser = branch;
                showScreen('branchDashboard');
                showTab('clients');
                const welcomeText = document.querySelector('#branchDashboard .welcome-text span');
                if (welcomeText) welcomeText.textContent = branch.fullName;
            } else if (client) {
                currentUser = client;
                showScreen('clientDashboard');
                renderClientView(client.id);
                const welcomeText = document.querySelector('#clientDashboard .welcome-text span');
                if (welcomeText) welcomeText.textContent = client.fullName;
            } else if (user === 'admin' && pass === 'admin123') { // Fallback for simple admin
                currentUser = { username: 'admin', role: 'Admin', fullName: 'System Admin' };
                showScreen('adminDashboard');
                showAdminTab('overview');
            } else {
                errorDiv.textContent = 'Invalid username or password';
            }
            toggleLoading(false);
        }, 800);
    });
}

function logout() {
    currentUser = null;
    authToken = null;
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
    document.getElementById('defaultRate').textContent = globalSettings.interestRate + '%';

    // Load recent activity
    const activityDiv = document.getElementById('recentActivity');
    activityDiv.innerHTML = '';

    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        let iconName = 'activity';
        let statusClass = '';
        if (activity.type === 'payment') {
            iconName = 'banknote';
            statusClass = 'text-success';
        } else if (activity.type === 'approval') {
            iconName = 'check-circle-2';
            statusClass = 'text-info';
        } else if (activity.type === 'registration') {
            iconName = 'user-plus';
        }

        activityItem.innerHTML = `
            <div class="activity-icon"><i data-lucide="${iconName}"></i></div>
            <div class="activity-details">
                <h4>${activity.type === 'payment' ? 'Loan Repayment Received' : (activity.type === 'approval' ? 'Loan Approved' : 'New Client Registration')} - <span class="${statusClass}">${activity.amount}</span></h4>
                <p>${activity.client} • ${activity.time}</p>
            </div>
        `;
        activityDiv.appendChild(activityItem);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function loadPendingLoans() {
    const pendingLoansDiv = document.getElementById('pendingLoans');
    if (!pendingLoansDiv) return;

    pendingLoansDiv.innerHTML = '';

    // Get pending loans from mock data
    const pendingLoans = mockLoans.filter(loan => loan.status === 'PENDING');

    if (pendingLoans.length === 0) {
        pendingLoansDiv.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No pending loan applications</p>';
    } else {
        pendingLoans.forEach(loan => {
            const client = mockClients.find(c => c.id === loan.clientId);
            const loanCard = document.createElement('div');
            loanCard.className = 'loan-card';
            loanCard.innerHTML = `
                <div class="loan-info">
                    <h3>Loan #${loan.loanNumber || loan.id}</h3>
                    <p><strong>Client:</strong> ${loan.clientName || (client ? client.fullName : '')}</p>
                    <p><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                    <p><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</p>
                    <p><strong>Purpose:</strong> ${loan.loanPurpose}</p>
                    <p><strong>Receiving:</strong> ${loan.receivingMethod || ''} 
                        ${loan.receivingMethod === 'Bank' ? `(${loan.bankName} - ${loan.accountNumber})` :
                    (loan.mobileMoneyPhone ? `(${loan.mobileMoneyPhone})` : '')}
                    </p>
                    <p><strong>Branch:</strong> ${loan.branchName || ''}</p>
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

    // Also load approved and rejected loans
    loadApprovedLoansList();
    loadRejectedLoansList();

    // Update count badges
    updateLoanCountBadges();
}

// Load approved loans list
function loadApprovedLoansList() {
    const approvedLoansDiv = document.getElementById('approvedLoans');
    if (!approvedLoansDiv) return;

    approvedLoansDiv.innerHTML = '';

    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');

    if (approvedLoans.length === 0) {
        approvedLoansDiv.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No approved loans</p>';
        return;
    }

    approvedLoans.forEach(loan => {
        const client = mockClients.find(c => c.id === loan.clientId);
        const progress = loan.disbursedAmount > 0 ? ((loan.collectedAmount / loan.disbursedAmount) * 100).toFixed(1) : 0;

        const loanCard = document.createElement('div');
        loanCard.className = 'loan-card';
        loanCard.innerHTML = `
            <div class="loan-info">
                <h3 style="color: #28a745;"><i data-lucide="check-check"></i> Loan #${loan.loanNumber || loan.id}</h3>
                <p><strong>Client:</strong> <span class="client-name-link" onclick="viewClientDetail(${loan.clientId});" style="color: #667EEA; cursor: pointer; text-decoration: underline;">${loan.clientName || (client ? client.fullName : '')}</span></p>
                <p><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                <p><strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}</p>
                <p><strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}</p>
                ${loan.defaultAmount > 0 ? `<p style="color: #dc3545;"><strong>Default:</strong> ${formatCurrency(loan.defaultAmount)}</p>` : ''}
                <p><strong>Purpose:</strong> ${loan.loanPurpose || ''}</p>
                <p><strong>Receiving:</strong> ${loan.receivingMethod || ''} 
                    ${loan.receivingMethod === 'Bank' ? `(${loan.bankName} - ${loan.accountNumber})` :
                (loan.mobileMoneyPhone ? `(${loan.mobileMoneyPhone})` : '')}
                </p>
                <p><strong>Branch:</strong> ${loan.branchName || ''}</p>
                ${loan.disbursedDate ? `<p><strong>Date:</strong> ${loan.disbursedDate}</p>` : ''}
                <div style="margin-top: 15px;">
                    <div style="background: #e2e8f0; height: 12px; border-radius: 6px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="background: linear-gradient(90deg, #28a745, #34ce57); height: 100%; width: ${progress}%;"></div>
                    </div>
                    <p style="margin: 8px 0 0; font-size: 13px; font-weight: 600; color: #64748b;">${progress}% Repaid</p>
                </div>
                <span class="badge badge-approved" style="margin-top: 10px; display: inline-flex; align-items: center; gap: 5px;"><i data-lucide="check-circle-2" style="width: 14px; height: 14px;"></i> Approved</span>
            </div>
        `;
        approvedLoansDiv.appendChild(loanCard);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Load rejected loans list
function loadRejectedLoansList() {
    const rejectedLoansDiv = document.getElementById('rejectedLoans');
    if (!rejectedLoansDiv) return;

    rejectedLoansDiv.innerHTML = '';

    const rejectedLoans = mockLoans.filter(loan => loan.status === 'REJECTED');

    if (rejectedLoans.length === 0) {
        rejectedLoansDiv.innerHTML = '<p style="color: #666; padding: 20px; text-align: center;">No rejected loans</p>';
        return;
    }

    rejectedLoans.forEach(loan => {
        const client = mockClients.find(c => c.id === loan.clientId);

        const loanCard = document.createElement('div');
        loanCard.className = 'loan-card';
        loanCard.style.borderLeft = '4px solid #dc3545';
        loanCard.innerHTML = `
            <div class="loan-info">
                <h3 style="color: #dc3545;">Loan #${loan.loanNumber || loan.id}</h3>
                <p><strong>Client:</strong> <span class="client-name-link" onclick="viewClientDetail(${loan.clientId});" style="color: #667EEA; cursor: pointer; text-decoration: underline;">${loan.clientName || (client ? client.fullName : '')}</span></p>
                <p><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                <p><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</p>
                <p><strong>Purpose:</strong> ${loan.loanPurpose}</p>
                <p><strong>Receiving:</strong> ${loan.receivingMethod || ''} 
                    ${loan.receivingMethod === 'Bank' ? `(${loan.bankName} - ${loan.accountNumber})` :
                (loan.mobileMoneyPhone ? `(${loan.mobileMoneyPhone})` : '')}
                </p>
                <p><strong>Branch:</strong> ${loan.branchName || ''}</p>
                ${loan.rejectionReason ? `<p style="color: #dc3545;"><strong>Reason:</strong> ${loan.rejectionReason}</p>` : ''}
                <span class="badge badge-rejected" style="background: #dc3545;">Rejected</span>
            </div>
        `;
        rejectedLoansDiv.appendChild(loanCard);
    });
}

// Show loan sub-tab function
function showLoanSubTab(tabName) {
    document.querySelectorAll('.loan-sub-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));

    const sectionId = tabName + 'LoansSubTab';
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        const activeBtn = Array.from(document.querySelectorAll('.sub-tab-btn')).find(btn => btn.getAttribute('onclick').includes(`'${tabName}'`));
        if (activeBtn) activeBtn.classList.add('active');

        if (tabName === 'pending') {
            loadPendingLoans();
        } else if (tabName === 'approved') {
            loadApprovedLoansList();
        } else if (tabName === 'rejected') {
            loadRejectedLoansList();
        }
    }
}

// Show branch sub-tab function
function showBranchSubTab(tabName) {
    document.querySelectorAll('.branch-sub-content').forEach(content => content.classList.remove('active'));

    const usersTab = document.getElementById('usersTab');
    if (usersTab) {
        const tabBtns = usersTab.querySelectorAll('.sub-tab-btn');
        tabBtns.forEach(btn => btn.classList.remove('active'));

        const sectionId = tabName + 'SubTab';
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
            const activeBtn = Array.from(tabBtns).find(btn => btn.getAttribute('onclick').includes(`'${tabName}'`));
            if (activeBtn) activeBtn.classList.add('active');

            if (tabName === 'branches') {
                loadBranchUsersList();
            }
        }
    }
}

// Show loan dashboard (main view with cards)
function showLoanDashboard() {
    console.log('showLoanDashboard called');
    const detailView = document.getElementById('loanDetailView');
    const statsDiv = document.querySelector('#loansTab .stats');
    const overviewSection = document.querySelector('#loansTab .overview-section');

    if (detailView) {
        detailView.style.display = 'none';
        console.log('Detail view hidden');
    }

    if (statsDiv) {
        statsDiv.style.display = 'grid';
        console.log('Stats cards shown');
    }

    if (overviewSection) {
        overviewSection.style.display = 'block';
        console.log('Overview section shown');
    }

    // Update dashboard counts
    updateDashboardCounts();
}

// Show loan detail view (specific loan list)
function showLoanDetailView(loanType) {
    const detailView = document.getElementById('loanDetailView');
    const statsDiv = document.querySelector('#loansTab .stats');
    const overviewSection = document.querySelector('#loansTab .overview-section');

    if (detailView) {
        detailView.style.display = 'block';
    }

    if (statsDiv) {
        statsDiv.style.display = 'none';
    }

    if (overviewSection) {
        overviewSection.style.display = 'none';
    }

    // Hide all sections first
    document.querySelectorAll('.loan-sub-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    const sectionId = loanType + 'LoansSection';
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
}

// Update dashboard counts
function updateDashboardCounts() {
    const pendingCount = mockLoans.filter(loan => loan.status === 'PENDING').length;
    const approvedCount = mockLoans.filter(loan => loan.status === 'APPROVED').length;
    const rejectedCount = mockLoans.filter(loan => loan.status === 'REJECTED').length;

    const pendingBadge = document.getElementById('dashboardPendingCount');
    const approvedBadge = document.getElementById('dashboardApprovedCount');
    const rejectedBadge = document.getElementById('dashboardRejectedCount');

    if (pendingBadge) pendingBadge.textContent = pendingCount;
    if (approvedBadge) approvedBadge.textContent = approvedCount;
    if (rejectedBadge) rejectedBadge.textContent = rejectedCount;
}

// Update loan count badges
function updateLoanCountBadges() {
    const pendingCount = mockLoans.filter(loan => loan.status === 'PENDING').length;
    const approvedCount = mockLoans.filter(loan => loan.status === 'APPROVED').length;
    const rejectedCount = mockLoans.filter(loan => loan.status === 'REJECTED').length;

    const pendingBadge = document.getElementById('pendingLoanCount');
    const approvedBadge = document.getElementById('approvedLoanCount');
    const rejectedBadge = document.getElementById('rejectedLoanCount');

    // Sub-tab badges
    const pendingSubBadge = document.getElementById('pendingSubCount');
    const approvedSubBadge = document.getElementById('approvedSubCount');
    const rejectedSubBadge = document.getElementById('rejectedSubCount');

    if (pendingBadge) pendingBadge.textContent = pendingCount;
    if (approvedBadge) approvedBadge.textContent = approvedCount;
    if (rejectedBadge) rejectedBadge.textContent = rejectedCount;

    if (pendingSubBadge) pendingSubBadge.textContent = pendingCount;
    if (approvedSubBadge) approvedSubBadge.textContent = approvedCount;
    if (rejectedSubBadge) rejectedSubBadge.textContent = rejectedCount;

    // Also update dashboard counts
    updateDashboardCounts();
}

function approveLoan(loanId) {
    const loan = mockLoans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'APPROVED';
        if (!loan.disbursedAmount) {
            loan.disbursedAmount = loan.requestedAmount;
            loan.disbursedDate = new Date().toISOString().split('T')[0];
            loan.collectedAmount = 0;
            loan.defaultAmount = 0;
        }
        saveToStorage(STORAGE_KEYS.LOANS, mockLoans);
        showNotification('success', `Loan #${loan.loanNumber || loan.id} approved successfully! Amount: ${formatCurrency(loan.requestedAmount)}`);

        // Refresh whichever sub-tab is currently active
        const activeSubTab = document.querySelector('.sub-tab-btn.active');
        if (activeSubTab) {
            const tabName = activeSubTab.getAttribute('onclick').match(/'([^']+)'/)[1];
            showLoanSubTab(tabName);
        } else {
            loadPendingLoans();
        }

        loadSystemOverview();
        updateLoanCountBadges();
    }
}

function rejectLoan(loanId) {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    const loan = mockLoans.find(l => l.id === loanId);
    if (loan) {
        loan.status = 'REJECTED';
        loan.rejectionReason = reason;
        saveToStorage(STORAGE_KEYS.LOANS, mockLoans);
        showNotification('error', `Loan #${loan.loanNumber || loan.id} has been rejected. Reason: ${reason}`);

        // Refresh whichever sub-tab is currently active
        const activeSubTab = document.querySelector('.sub-tab-btn.active');
        if (activeSubTab) {
            const tabName = activeSubTab.getAttribute('onclick').match(/'([^']+)'/)[1];
            showLoanSubTab(tabName);
        } else {
            loadPendingLoans();
        }

        loadSystemOverview();
        updateLoanCountBadges();
    }
}

// User Management
function loadBranchUsersList() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;

    usersList.innerHTML = '';

    const branchesBadge = document.getElementById('branchesSubCount');
    if (branchesBadge) {
        branchesBadge.textContent = branchUsers.length;
    }

    branchUsers.forEach(user => {
        const isActive = user.isActive !== false;
        const statusColor = isActive ? '#28a745' : '#dc3545';
        const statusText = isActive ? 'Active' : 'Disabled';
        const toggleBtnClass = isActive ? 'btn-danger' : 'btn-success';
        const toggleBtnText = isActive ? 'Disable Branch' : 'Enable Branch';
        const toggleIcon = isActive ? 'slash' : 'check-circle';

        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        if (!isActive) userCard.style.opacity = '0.7';

        userCard.innerHTML = `
            <div class="user-info">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="color: #1a3a52;"><i data-lucide="building-2" style="margin-right: 5px; width: 18px; height: 18px;"></i>${user.branchName}</h3>
                    <span class="badge" style="background: ${statusColor}15; color: ${statusColor}; border: 1px solid ${statusColor}; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${statusText}</span>
                </div>
                <p style="margin-top: 8px;"><strong>District:</strong> ${user.district || 'Unassigned'}</p>
                <div id="branch-detail-${user.username}" class="branch-full-details" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                    <p><strong>Admin Name:</strong> ${user.fullName}</p>
                    <p><strong>Role:</strong> ${user.role || 'Branch User'}</p>
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    
                    <button class="btn ${toggleBtnClass} btn-sm" onclick="toggleBranchStatus('${user.username}')" style="margin-top: 15px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;">
                        <i data-lucide="${toggleIcon}"></i> ${toggleBtnText}
                    </button>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="toggleBranchDetail('${user.username}')" style="margin-top: 15px; font-size: 13px; padding: 8px 16px;">
                    View Full Details
                </button>
            </div>
        `;
        usersList.appendChild(userCard);
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function toggleBranchDetail(username) {
    const detailDiv = document.getElementById('branch-detail-' + username);
    if (!detailDiv) return;

    if (detailDiv.style.display === 'none') {
        detailDiv.style.display = 'block';
    } else {
        detailDiv.style.display = 'none';
    }
}

function toggleBranchStatus(username) {
    const user = branchUsers.find(u => u.username === username);
    if (!user) return;

    // Toggle the active status
    user.isActive = user.isActive === false ? true : false;

    // Save to localStorage
    saveToStorage('uprise_users', branchUsers);

    // Reload the users list to reflect changes
    loadBranchUsersList();

    // Show success message
    const statusText = user.isActive ? 'enabled' : 'disabled';
    alert(`Branch "${user.branchName}" has been ${statusText} successfully.`);
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
        district: document.getElementById('branchDistrict').value,
        email: document.getElementById('userEmail').value,
        role: 'Branch Manager',
        isActive: true
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

// Settings Management
function loadSettingsPage() {
    const interestInput = document.getElementById('adminInterestRate');
    const feeInput = document.getElementById('adminLoanFee');

    if (interestInput) interestInput.value = globalSettings.interestRate;
    if (feeInput) feeInput.value = globalSettings.loanFees;
}

function updateGlobalSettings(e) {
    if (e) e.preventDefault();

    const interestRate = parseFloat(document.getElementById('adminInterestRate').value);
    const loanFees = parseFloat(document.getElementById('adminLoanFee').value);

    if (isNaN(interestRate) || interestRate < 0) {
        showNotification('error', 'Invalid interest rate');
        return;
    }

    globalSettings.interestRate = interestRate;
    globalSettings.loanFees = loanFees;

    saveToStorage(STORAGE_KEYS.SETTINGS, globalSettings);
    showNotification('success', 'Settings updated successfully! New Interest Rate: ' + interestRate + '%');

    loadSystemOverview();
}

// Repayment Calculator Logic
function updateRepaymentEstimate() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const months = parseInt(document.getElementById('loanPeriod').value);

    const estimateSection = document.getElementById('repaymentEstimate');
    if (!estimateSection) return;

    if (isNaN(amount) || isNaN(months) || amount <= 0 || months <= 0) {
        estimateSection.style.display = 'none';
        return;
    }

    estimateSection.style.display = 'block';

    // Simple Interest Calculation: Total = Principal + (Principal * Rate/100 * Months/12)
    const annualRate = globalSettings.interestRate / 100;
    const totalInterest = amount * annualRate * (months / 12);
    const totalRepayment = amount + totalInterest;
    const monthlyInstallment = totalRepayment / months;
    const processingFee = amount * (globalSettings.loanFees / 100);

    document.getElementById('estInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('estTotal').textContent = formatCurrency(totalRepayment);
    document.getElementById('estMonthly').textContent = formatCurrency(monthlyInstallment);
    document.getElementById('estProcessingFee').textContent = formatCurrency(processingFee);
}

// Branch Functions - Using only mock data
function loadBranchOverview() {
    if (!currentUser || currentUser.role !== 'BRANCH_USER') return;

    const branchName = currentUser.branchName;

    // Calculate stats
    const branchClients = mockClients.filter(c => c.branchName === branchName);
    const branchLoans = mockLoans.filter(l => l.branchName === branchName);

    const activeLoans = branchLoans.filter(l => l.status === 'APPROVED');
    const pendingLoans = branchLoans.filter(l => l.status === 'PENDING');
    const totalDisbursedAmount = activeLoans.reduce((sum, l) => sum + (l.disbursedAmount || 0), 0);

    const defaultLoans = branchLoans.filter(l => (l.defaultAmount || 0) > 0);
    const defaultRateValue = branchLoans.length > 0 ? (defaultLoans.length / branchLoans.length * 100).toFixed(1) : 0;

    // Update UI
    const clientCountEl = document.getElementById('branchClientCount');
    const activeLoansEl = document.getElementById('branchActiveLoansCount');
    const totalDisbursedEl = document.getElementById('branchTotalDisbursed');
    const defaultRateEl = document.getElementById('branchDefaultRate');
    const pendingCountEl = document.getElementById('branchPendingCount');
    const approvedCountEl = document.getElementById('branchApprovedCount');

    if (clientCountEl) clientCountEl.textContent = branchClients.length;
    if (activeLoansEl) activeLoansEl.textContent = activeLoans.length;
    if (totalDisbursedEl) totalDisbursedEl.textContent = formatCurrency(totalDisbursedAmount);
    if (defaultRateEl) defaultRateEl.textContent = `${defaultRateValue}%`;
    if (pendingCountEl) pendingCountEl.textContent = pendingLoans.length;
    if (approvedCountEl) approvedCountEl.textContent = activeLoans.length;

    loadBranchRecentActivity(branchName);

    if (window.lucide) window.lucide.createIcons();
}

function loadBranchRecentActivity(branchName) {
    const activityList = document.getElementById('branchRecentActivity');
    if (!activityList) return;

    activityList.innerHTML = '';

    // Filter recent activities for this branch
    const branchActivities = recentActivities.filter(a => a.branch === branchName).slice(0, 10);

    if (branchActivities.length === 0) {
        activityList.innerHTML = '<p style="color: #64748b; padding: 20px; text-align: center;">No recent activities for this branch.</p>';
        return;
    }

    branchActivities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';

        let icon = 'info';
        if (activity.type === 'payment') icon = 'banknote';
        if (activity.type === 'approval') icon = 'check-circle';

        item.innerHTML = `
            <div class="activity-icon"><i data-lucide="${icon}"></i></div>
            <div class="activity-content">
                <p><strong>${activity.type === 'payment' ? 'Loan Repayment Received' : 'Activity'} - ${activity.amount || ''}</strong></p>
                <p class="activity-details">${activity.client} • ${activity.time}</p>
            </div>
        `;
        activityList.appendChild(item);
    });
}

function loadClients() {
    const clientsList = document.getElementById('clientsList');
    if (!clientsList) return;
    clientsList.innerHTML = '';

    if (mockClients.length === 0) {
        clientsList.innerHTML = '<div class="empty-state"><i data-lucide="users"></i><p>No clients registered yet</p></div>';
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
            <div class="item-details">
                <p><strong>National ID</strong>${client.nationalId}</p>
                <p><strong>Phone</strong>${client.phoneNumber}</p>
                <p><strong>Email</strong>${client.email || 'N/A'}</p>
                <p><strong>Occupation</strong>${client.employerName || 'N/A'}</p>
                <p><strong>Monthly Salary</strong>MK ${client.monthlySalary || '0'}</p>
                <div>
                    <strong>Action</strong>
                    <button class="active-badge" onclick="viewClientDetail(${client.id})" style="border:none; cursor:pointer;">
                        View Profile
                    </button>
                </div>
            </div>
        `;
        clientsList.appendChild(clientItem);
    });
    if (window.lucide) window.lucide.createIcons();
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
    modal.onclick = function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    document.body.appendChild(modal);
}

function loadBranchLoans() {
    const loansList = document.getElementById('branchPendingLoansList');
    if (!loansList) return;

    loansList.innerHTML = '';

    // Filter loans for current branch and PENDING status only
    let loans = mockLoans.filter(loan =>
        loan.branchName === currentUser.branchName && loan.status === 'PENDING'
    );

    // Update badge count
    const badge = document.getElementById('branchPendingSubCount');
    if (badge) badge.textContent = loans.length;

    if (loans.length === 0) {
        loansList.innerHTML = '<div class="empty-state"><i data-lucide="inbox"></i><p>No pending loan applications</p></div>';
        return;
    }

    loans.forEach(loan => {
        const loanItem = document.createElement('div');
        loanItem.className = 'list-item';
        loanItem.innerHTML = `
            <h3>Loan #${loan.loanNumber || loan.id}</h3>
            <div class="item-details">
                <p><strong>Client</strong>${loan.clientName || ''}</p>
                <p><strong>Amount</strong>${formatCurrency(loan.requestedAmount)}</p>
                <p><strong>Period</strong>${loan.repaymentPeriodMonths} months</p>
                <p><strong>Purpose</strong>${loan.loanPurpose}</p>
                <p><strong>Receiving</strong>${loan.receivingMethod || ''} 
                    ${loan.receivingMethod === 'Bank' ? `(${loan.bankName})` :
                (loan.mobileMoneyPhone ? `(${loan.mobileMoneyPhone})` : '')}
                </p>
                <div>
                    <strong>Status</strong>
                    <span class="pending-badge">Pending</span>
                </div>
            </div>
        `;
        loansList.appendChild(loanItem);
    });
    if (window.lucide) window.lucide.createIcons();
}

function loadApprovedBranchLoans() {
    const approvedLoansList = document.getElementById('branchApprovedLoansList');
    if (!approvedLoansList) return;

    approvedLoansList.innerHTML = '';

    // Filter loans for current branch and APPROVED status
    const approvedLoans = mockLoans.filter(loan =>
        loan.branchName === currentUser.branchName && loan.status === 'APPROVED'
    );

    // Update badge count
    const badge = document.getElementById('branchApprovedSubCount');
    if (badge) badge.textContent = approvedLoans.length;

    if (approvedLoans.length === 0) {
        approvedLoansList.innerHTML = '<div class="empty-state"><i data-lucide="inbox"></i><p>No approved loans yet</p></div>';
        return;
    }

    approvedLoans.forEach(loan => {
        const loanItem = document.createElement('div');
        loanItem.className = 'list-item';
        loanItem.innerHTML = `
            <h3>Loan #${loan.loanNumber || loan.id}</h3>
            <div class="item-details">
                <p><strong>Client</strong>${loan.clientName || ''}</p>
                <p><strong>Amount</strong>${formatCurrency(loan.requestedAmount)}</p>
                <p><strong>Period</strong>${loan.repaymentPeriodMonths} months</p>
                <p><strong>Purpose</strong>${loan.loanPurpose}</p>
                <p><strong>Receiving</strong>${loan.receivingMethod || ''} 
                    ${loan.receivingMethod === 'Bank' ? `(${loan.bankName})` :
                (loan.mobileMoneyPhone ? `(${loan.mobileMoneyPhone})` : '')}
                </p>
                <div>
                    <strong>Status</strong>
                    <span class="active-badge">Approved</span>
                </div>
            </div>
        `;
        approvedLoansList.appendChild(loanItem);
    });
    if (window.lucide) window.lucide.createIcons();
}

function loadRejectedBranchLoans() {
    const rejectedLoansList = document.getElementById('branchRejectedLoansList');
    if (!rejectedLoansList) return;

    rejectedLoansList.innerHTML = '';

    // Filter loans for current branch and REJECTED status
    const rejectedLoans = mockLoans.filter(loan =>
        loan.branchName === currentUser.branchName && loan.status === 'REJECTED'
    );

    // Update badge count
    const badge = document.getElementById('branchRejectedSubCount');
    if (badge) badge.textContent = rejectedLoans.length;

    if (rejectedLoans.length === 0) {
        rejectedLoansList.innerHTML = '<div class="empty-state"><i data-lucide="inbox"></i><p>No rejected loans</p></div>';
        return;
    }

    rejectedLoans.forEach(loan => {
        const loanItem = document.createElement('div');
        loanItem.className = 'list-item';
        loanItem.innerHTML = `
            <h3>Loan #${loan.loanNumber || loan.id}</h3>
            <div class="item-details">
                <p><strong>Client</strong>${loan.clientName || ''}</p>
                <p><strong>Amount</strong>${formatCurrency(loan.requestedAmount)}</p>
                <p><strong>Period</strong>${loan.repaymentPeriodMonths} months</p>
                <p><strong>Purpose</strong>${loan.loanPurpose}</p>
                <p><strong>Receiving</strong>${loan.receivingMethod || ''} 
                    ${loan.receivingMethod === 'Bank' ? `(${loan.bankName})` :
                (loan.mobileMoneyPhone ? `(${loan.mobileMoneyPhone})` : '')}
                </p>
                <div>
                    <strong>Status</strong>
                    <span class="rejected-badge">Rejected</span>
                </div>
            </div>
        `;
        rejectedLoansList.appendChild(loanItem);
    });
    if (window.lucide) window.lucide.createIcons();
}

function showBranchLoanSubTab(tabName) {
    // Update sub-tab buttons inside the branch loans tab only
    const subTabBtns = document.querySelectorAll('.branch-loan-sub-tabs .sub-tab-btn');
    subTabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // Mark the clicked button active
    let activeBtnId = 'branchPendingTabBtn';
    if (tabName === 'approved') activeBtnId = 'branchApprovedTabBtn';
    if (tabName === 'rejected') activeBtnId = 'branchRejectedTabBtn';

    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) activeBtn.classList.add('active');

    // Hide all sub-content
    const pendingPane = document.getElementById('branchPendingLoansSubTab');
    const approvedPane = document.getElementById('branchApprovedLoansSubTab');
    const rejectedPane = document.getElementById('branchRejectedLoansSubTab');

    if (pendingPane) pendingPane.classList.remove('active');
    if (approvedPane) approvedPane.classList.remove('active');
    if (rejectedPane) rejectedPane.classList.remove('active');

    // Show selected sub-content and load data
    if (tabName === 'pending') {
        if (pendingPane) pendingPane.classList.add('active');
        loadBranchLoans();
    } else if (tabName === 'approved') {
        if (approvedPane) approvedPane.classList.add('active');
        loadApprovedBranchLoans();
    } else if (tabName === 'rejected') {
        if (rejectedPane) rejectedPane.classList.add('active');
        loadRejectedBranchLoans();
    }

    // Always update counts for all sub-tabs
    updateBranchLoanCounts();

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function updateBranchLoanCounts() {
    if (!currentUser || currentUser.role !== 'BRANCH_USER') return;

    const pendingLoans = mockLoans.filter(loan =>
        loan.branchName === currentUser.branchName && loan.status === 'PENDING'
    );
    const approvedLoans = mockLoans.filter(loan =>
        loan.branchName === currentUser.branchName && loan.status === 'APPROVED'
    );
    const rejectedLoans = mockLoans.filter(loan =>
        loan.branchName === currentUser.branchName && loan.status === 'REJECTED'
    );

    const pendingBadge = document.getElementById('branchPendingSubCount');
    const approvedBadge = document.getElementById('branchApprovedSubCount');
    const rejectedBadge = document.getElementById('branchRejectedSubCount');

    if (pendingBadge) pendingBadge.textContent = pendingLoans.length;
    if (approvedBadge) approvedBadge.textContent = approvedLoans.length;
    if (rejectedBadge) rejectedBadge.textContent = rejectedLoans.length;
}

function loadClientsForLoan() {
    const select = document.getElementById('loanClient');
    select.innerHTML = '<option value="">-- Select Client --</option>';

    mockClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.firstName || client.fullName} ${client.lastName || ''} (${client.nationalId})`;
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

document.getElementById('idFront').addEventListener('change', function (e) {
    handleIdImageUpload(e, 'front');
});

document.getElementById('idBack').addEventListener('change', function (e) {
    handleIdImageUpload(e, 'back');
});

function handleIdImageUpload(event, side) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
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

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const messageDiv = document.getElementById('registerMessage');

    // Validate ID images
    if (!idFrontImage || !idBackImage) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Please capture both ID front and back images!';
        return;
    }

    // Show loading message
    messageDiv.className = 'message';
    messageDiv.textContent = 'Registering client...';

    try {
        // Collect all form data
        const firstName = document.getElementById('clientFirstName').value;
        const lastName = document.getElementById('clientLastName').value;

        const clientData = {
            // Personal Information
            firstName: firstName,
            lastName: lastName,
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
            monthlySalary: parseFloat(document.getElementById('monthlySalary').value),
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
            witnessIncome: parseFloat(document.getElementById('witnessIncome').value) || 0
        };

        // Add to localStorage directly (no backend)
        const newClient = {
            id: mockClients.length + 1,
            fullName: `${clientData.firstName} ${clientData.lastName}`,
            ...clientData,
            idFrontImage: idFrontImage,
            idBackImage: idBackImage,
            registrationDate: new Date().toISOString(),
            branchName: currentUser.branchName || 'Main Branch'
        };

        mockClients.push(newClient);
        saveToStorage(STORAGE_KEYS.CLIENTS, mockClients);

        messageDiv.className = 'message success';
        messageDiv.textContent = '✓ Client registered successfully with all documents!';

        // Reset form
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
            loadClients(); // Reload clients list
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error registering client. Please try again.';
    }
});

// Real-time interest calculation for loan application
function calculateLoanInterest() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const repaymentPeriod = parseInt(document.getElementById('repaymentPeriod').value) || 12;
    const interestRateInput = document.getElementById('appliedInterestRate');
    const totalInterestInput = document.getElementById('totalInterest');
    const totalRepaymentInput = document.getElementById('totalRepayment');

    // Get interest rate from global settings (default 15% if not set)
    const annualInterestRate = globalSettings.interestRate || globalSettings.defaultInterestRate || 15;
    if (interestRateInput) interestRateInput.value = annualInterestRate + '%';

    if (loanAmount > 0) {
        // Simple interest: Interest = Principal * MonthlyRate/100 * Months
        const totalInterest = loanAmount * (annualInterestRate / 100) * repaymentPeriod;
        const totalRepayment = loanAmount + totalInterest;

        // Update the form fields with formatted values
        if (totalInterestInput) {
            totalInterestInput.value = 'MK ' + totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        if (totalRepaymentInput) {
            totalRepaymentInput.value = 'MK ' + totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Also sync with the repayment estimate box if visible
        const estInterest = document.getElementById('estInterest');
        const estTotal = document.getElementById('estTotal');
        const estMonthly = document.getElementById('estMonthly');
        const processingFee = loanAmount * ((globalSettings.loanFees || 0) / 100);
        const estProcessingFee = document.getElementById('estProcessingFee');

        if (estInterest) estInterest.textContent = 'MK ' + totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (estTotal) estTotal.textContent = 'MK ' + totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (estMonthly) estMonthly.textContent = 'MK ' + (totalRepayment / repaymentPeriod).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (estProcessingFee) estProcessingFee.textContent = 'MK ' + processingFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const estimateSection = document.getElementById('repaymentEstimate');
        if (estimateSection) estimateSection.style.display = 'block';
    } else {
        // Reset fields if no amount
        if (totalInterestInput) totalInterestInput.value = 'MK 0';
        if (totalRepaymentInput) totalRepaymentInput.value = 'MK 0';
        const estimateSection = document.getElementById('repaymentEstimate');
        if (estimateSection) estimateSection.style.display = 'none';
    }
}

// Add event listeners for real-time calculation
document.addEventListener('DOMContentLoaded', function () {
    const loanAmountInput = document.getElementById('loanAmount');
    const repaymentPeriodInput = document.getElementById('repaymentPeriod');

    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', calculateLoanInterest);
        loanAmountInput.addEventListener('change', calculateLoanInterest);
    }

    if (repaymentPeriodInput) {
        repaymentPeriodInput.addEventListener('input', calculateLoanInterest);
        repaymentPeriodInput.addEventListener('change', calculateLoanInterest);
    }
});

function toggleReceivingMethod() {
    const method = document.getElementById('receivingMethod').value;
    const bankSection = document.getElementById('bankDetails');
    const mobileSection = document.getElementById('mobileMoneyDetails');

    if (method === 'Bank') {
        bankSection.style.display = 'block';
        mobileSection.style.display = 'none';
        document.getElementById('bankName').required = true;
        document.getElementById('accountNumber').required = true;
        document.getElementById('mobileMoneyPhone').required = false;
    } else if (method === 'Airtel Money' || method === 'TNM Mpamba') {
        bankSection.style.display = 'none';
        mobileSection.style.display = 'block';
        document.getElementById('bankName').required = false;
        document.getElementById('accountNumber').required = false;
        document.getElementById('mobileMoneyPhone').required = true;
    } else {
        bankSection.style.display = 'none';
        mobileSection.style.display = 'none';
        document.getElementById('bankName').required = false;
        document.getElementById('accountNumber').required = false;
        document.getElementById('mobileMoneyPhone').required = false;
    }
}

document.getElementById('loanForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const messageDiv = document.getElementById('loanMessage');

    const clientId = parseInt(document.getElementById('loanClient').value);

    if (!clientId) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Please select a client';
        return;
    }

    // Show loading message
    messageDiv.className = 'message';
    messageDiv.textContent = 'Submitting loan application...';

    // Add to localStorage directly
    const client = mockClients.find(c => c.id === clientId);
    const newLoan = {
        id: mockLoans.length + 1,
        loanNumber: 'LN' + String(mockLoans.length + 1).padStart(3, '0'),
        clientName: client ? client.fullName : 'Unknown',
        clientId: clientId,
        requestedAmount: parseFloat(document.getElementById('loanAmount').value),
        repaymentPeriodMonths: parseInt(document.getElementById('repaymentPeriod').value),
        loanPurpose: document.getElementById('loanPurpose').value,
        status: 'PENDING',
        branchName: currentUser.branchName || 'Main Branch',
        receivingMethod: document.getElementById('receivingMethod').value,
        bankName: document.getElementById('bankName').value,
        accountNumber: document.getElementById('accountNumber').value,
        mobileMoneyPhone: document.getElementById('mobileMoneyPhone').value,
        disbursedAmount: 0,
        collectedAmount: 0,
        defaultAmount: 0
    };

    mockLoans.push(newLoan);
    saveToStorage(STORAGE_KEYS.LOANS, mockLoans);

    messageDiv.className = 'message success';
    messageDiv.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
            <i data-lucide="check-circle-2" style="width:24px;height:24px;color:#28a745;"></i>
            <div>
                <strong>your loan application has been submitted successfully, and its being verified by the admin.</strong>
            </div>
        </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    document.getElementById('loanForm').reset();

    // Reset the interest calculation and dynamic fields
    document.getElementById('totalInterest').value = 'MK 0';
    document.getElementById('totalRepayment').value = 'MK 0';
    document.getElementById('bankDetails').style.display = 'none';
    document.getElementById('mobileMoneyDetails').style.display = 'none';

    // Update branch counts
    updateBranchLoanCounts();

    setTimeout(() => {
        messageDiv.textContent = '';
        showTab('loans');
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
    const symbol = globalSettings.currency ? globalSettings.currency + ' ' : 'MK ';
    if (amount >= 1000000) {
        return symbol + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return symbol + (amount / 1000).toFixed(0) + 'k';
    }
    return symbol + amount.toFixed(0);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');

    // Show loading status
    const loadingStatus = document.querySelector('.loading-status');
    if (loadingStatus) {
        loadingStatus.textContent = 'Initializing system...';
    }

    // Initialize localStorage with default data if empty
    initializeStorage();

    if (loadingStatus) {
        loadingStatus.textContent = 'Setting up authentication...';
    }

    // Setup login form
    setupLoginForm();
    initStoriesCarousel(); // Add stories rotation
    showScreen('landingPage');

    // Hide loading screen after a short delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            if (loadingStatus) {
                loadingStatus.textContent = 'Ready!';
            }
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 300);
        }
    }, 1500); // Show loading screen for 1.5 seconds
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
            input.addEventListener('input', function () {
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
document.addEventListener('DOMContentLoaded', function () {
    const maritalStatusSelect = document.getElementById('maritalStatus');
    if (maritalStatusSelect) {
        maritalStatusSelect.addEventListener('change', function () {
            const spouseSection = document.getElementById('spouseSection');
            if (spouseSection) {
                spouseSection.style.display = this.value === 'Married' ? 'block' : 'none';
            }
        });
    }

    // Initialize first step
    showStep(1);

    // Initialize localStorage with default data if empty
    initializeStorage();
});

// Initialize localStorage with default data on first load
function initializeStorage() {
    // FORCE CLEAR AND REINITIALIZE - Remove this after first load if needed
    console.log('Force initializing with demo data...');

    // Clear old data first
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.LOANS);
    localStorage.removeItem(STORAGE_KEYS.USERS);

    // Always save the default mock data to ensure it's there
    saveToStorage(STORAGE_KEYS.CLIENTS, mockClients);
    saveToStorage(STORAGE_KEYS.LOANS, mockLoans);
    saveToStorage(STORAGE_KEYS.USERS, branchUsers);

    console.log('Initialized with:', {
        clients: mockClients.length,
        loans: mockLoans.length,
        users: branchUsers.length
    });
}

// Enhanced Admin Functions with Branch Analytics

function loadSystemOverview() {
    console.log('Loading system overview...');
    console.log('mockClients:', mockClients.length);
    console.log('mockLoans:', mockLoans.length);

    const pendingLoans = mockLoans.filter(loan => loan.status === 'PENDING');
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    const totalDisbursed = approvedLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
    const totalDefaults = approvedLoans.reduce((sum, loan) => sum + loan.defaultAmount, 0);
    const defaultCount = approvedLoans.filter(loan => loan.defaultAmount > 0).length;

    // Calculate default rate
    const defaultRate = approvedLoans.length > 0 ? ((defaultCount / approvedLoans.length) * 100).toFixed(1) + '%' : '0%';

    console.log('Stats:', {
        clients: mockClients.length,
        activeLoans: approvedLoans.length,
        pendingLoans: pendingLoans.length,
        disbursed: totalDisbursed,
        defaultRate: defaultRate
    });

    // Update the stats with correct IDs from HTML
    document.getElementById('clientCount').textContent = mockClients.length;
    document.getElementById('activeLoansCount').textContent = approvedLoans.length;
    document.getElementById('totalDisbursed').textContent = formatCurrency(totalDisbursed);
    document.getElementById('defaultRate').textContent = defaultRate;
    document.getElementById('pendingCount').textContent = pendingLoans.length;
    document.getElementById('approvedCount').textContent = approvedLoans.length;

    // Load recent activity
    loadRecentActivity();

    // Make stat cards clickable
    makeStatsClickable();
}

// Make stat cards clickable
function makeStatsClickable() {
    // Total Clients - show all clients
    const clientCard = document.getElementById('clientCount').closest('.stat-card');
    if (clientCard) {
        clientCard.style.cursor = 'pointer';
        clientCard.onclick = () => showAllClientsModal();
    }

    // Active Loans - show active loans
    const activeLoansCard = document.getElementById('activeLoansCount').closest('.stat-card');
    if (activeLoansCard) {
        activeLoansCard.style.cursor = 'pointer';
        activeLoansCard.onclick = () => showActiveLoansModal();
    }

    // Total Disbursed - show disbursement breakdown
    const disbursedCard = document.getElementById('totalDisbursed').closest('.stat-card');
    if (disbursedCard) {
        disbursedCard.style.cursor = 'pointer';
        disbursedCard.onclick = () => showDisbursedBreakdownModal();
    }

    // Default Rate - show clients with defaults
    const defaultCard = document.getElementById('defaultRate').closest('.stat-card');
    if (defaultCard) {
        defaultCard.style.cursor = 'pointer';
        defaultCard.onclick = () => showDefaultsModal();
    }

    // Pending Loans - show pending loans for approval
    const pendingCard = document.getElementById('pendingCount').closest('.stat-card');
    if (pendingCard) {
        pendingCard.style.cursor = 'pointer';
        pendingCard.onclick = () => showAdminTab('loans');
    }

    // Approved Loans - show approved loans
    const approvedCard = document.getElementById('approvedCount').closest('.stat-card');
    if (approvedCard) {
        approvedCard.style.cursor = 'pointer';
        approvedCard.onclick = () => showApprovedLoansModal();
    }
}

// Show approved loans modal
function showApprovedLoansModal() {
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');

    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'approvedLoansModal';
    modal.innerHTML = `
        <div class="client-modal-content" style="max-width: 1200px;">
            <div class="client-modal-header">
                <h2>✅ Approved Loans (${approvedLoans.length})</h2>
                <button class="modal-close" onclick="closeModal('approvedLoansModal')">✕</button>
            </div>
            <div class="client-modal-body">
                <div class="loans-list" style="display: grid; gap: 15px;">
                    ${approvedLoans.map(loan => {
        const client = mockClients.find(c => c.id === loan.clientId);
        const progress = loan.disbursedAmount > 0 ? ((loan.collectedAmount / loan.disbursedAmount) * 100).toFixed(1) : 0;
        return `
                        <div class="loan-card-modal" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                            <div>
                                <h3 style="margin: 0 0 10px 0; color: #28a745;">Loan #${loan.loanNumber}</h3>
                                <p style="margin: 5px 0;"><strong>Client:</strong> <span class="client-name-link" onclick="closeModal('approvedLoansModal'); viewClientDetail(${loan.clientId});" style="color: #667EEA; cursor: pointer; text-decoration: underline;">${loan.clientName}</span></p>
                                <p style="margin: 5px 0;"><strong>Branch:</strong> ${loan.branchName}</p>
                                <p style="margin: 5px 0;"><strong>Purpose:</strong> ${loan.loanPurpose}</p>
                                <p style="margin: 5px 0;"><strong>Period:</strong> ${loan.repaymentPeriodMonths} months</p>
                                ${loan.disbursedDate ? `<p style="margin: 5px 0;"><strong>Disbursed:</strong> ${loan.disbursedDate}</p>` : ''}
                            </div>
                            <div>
                                <p style="margin: 5px 0;"><strong>Amount:</strong> ${formatCurrency(loan.requestedAmount)}</p>
                                <p style="margin: 5px 0;"><strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}</p>
                                <p style="margin: 5px 0;"><strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}</p>
                                ${loan.defaultAmount > 0 ? `<p style="margin: 5px 0; color: #dc3545;"><strong>Default:</strong> ${formatCurrency(loan.defaultAmount)}</p>` : ''}
                                <div style="margin-top: 10px;">
                                    <div style="background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden;">
                                        <div style="background: #28a745; height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                                    </div>
                                    <p style="margin: 5px 0; font-size: 12px; text-align: center;">${progress}% Repaid</p>
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
            </div>
        </div>
    `;

    modal.onclick = function (e) {
        if (e.target === modal) {
            closeModal('approvedLoansModal');
        }
    };

    document.body.appendChild(modal);
}

// Show disbursed breakdown modal
function showDisbursedBreakdownModal() {
    const approvedLoans = mockLoans.filter(loan => loan.status === 'APPROVED');
    const totalDisbursed = approvedLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
    const totalCollected = approvedLoans.reduce((sum, loan) => sum + loan.collectedAmount, 0);
    const totalOutstanding = totalDisbursed - totalCollected;

    // Get branches
    const branches = [...new Set(mockLoans.map(loan => loan.branchName))];
    const branchData = branches.map(branchName => {
        const branchLoans = approvedLoans.filter(loan => loan.branchName === branchName);
        const disbursed = branchLoans.reduce((sum, loan) => sum + loan.disbursedAmount, 0);
        const collected = branchLoans.reduce((sum, loan) => sum + loan.collectedAmount, 0);
        return { branchName, disbursed, collected, outstanding: disbursed - collected };
    });

    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'disbursedModal';
    modal.innerHTML = `
        <div class="client-modal-content" style="max-width: 900px;">
            <div class="client-modal-header">
                <h2>💰 Total Disbursed Breakdown</h2>
                <button class="modal-close" onclick="closeModal('disbursedModal')">✕</button>
            </div>
            <div class="client-modal-body">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center;">
                        <div>
                            <h4 style="margin: 0; color: #667EEA;">Total Disbursed</h4>
                            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${formatCurrency(totalDisbursed)}</p>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #28a745;">Total Collected</h4>
                            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${formatCurrency(totalCollected)}</p>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #ffc107;">Outstanding</h4>
                            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${formatCurrency(totalOutstanding)}</p>
                        </div>
                    </div>
                </div>
                
                <h3>By Branch</h3>
                <div style="display: grid; gap: 15px;">
                    ${branchData.map(branch => `
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h4 style="margin: 0 0 10px 0;">🏢 ${branch.branchName}</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                <div>
                                    <p style="margin: 0; font-size: 12px; color: #666;">Disbursed</p>
                                    <p style="margin: 5px 0; font-weight: bold;">${formatCurrency(branch.disbursed)}</p>
                                </div>
                                <div>
                                    <p style="margin: 0; font-size: 12px; color: #666;">Collected</p>
                                    <p style="margin: 5px 0; font-weight: bold; color: #28a745;">${formatCurrency(branch.collected)}</p>
                                </div>
                                <div>
                                    <p style="margin: 0; font-size: 12px; color: #666;">Outstanding</p>
                                    <p style="margin: 5px 0; font-weight: bold; color: #ffc107;">${formatCurrency(branch.outstanding)}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    modal.onclick = function (e) {
        if (e.target === modal) {
            closeModal('disbursedModal');
        }
    };

    document.body.appendChild(modal);
}

// Show defaults modal
function showDefaultsModal() {
    const defaultLoans = mockLoans.filter(loan => loan.defaultAmount > 0);

    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'defaultsModal';
    modal.innerHTML = `
        <div class="client-modal-content" style="max-width: 1200px;">
            <div class="client-modal-header">
                <h2>⚠️ Loans with Defaults (${defaultLoans.length})</h2>
                <button class="modal-close" onclick="closeModal('defaultsModal')">✕</button>
            </div>
            <div class="client-modal-body">
                ${defaultLoans.length === 0 ? '<p style="text-align: center; color: #666;">No defaults found</p>' : `
                <div style="display: grid; gap: 15px;">
                    ${defaultLoans.map(loan => {
        const client = mockClients.find(c => c.id === loan.clientId);
        return `
                        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; border-left: 4px solid #dc3545;">
                            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                                <div>
                                    <h3 style="margin: 0 0 10px 0; color: #dc3545;">Loan #${loan.loanNumber}</h3>
                                    <p style="margin: 5px 0;"><strong>Client:</strong> <span class="client-name-link" onclick="closeModal('defaultsModal'); viewClientDetail(${loan.clientId});" style="color: #667EEA; cursor: pointer; text-decoration: underline;">${loan.clientName}</span></p>
                                    <p style="margin: 5px 0;"><strong>Phone:</strong> ${client ? client.phoneNumber : ''}</p>
                                    <p style="margin: 5px 0;"><strong>Branch:</strong> ${loan.branchName}</p>
                                    <p style="margin: 5px 0;"><strong>District:</strong> ${client ? client.district : ''}</p>
                                    <p style="margin: 5px 0;"><strong>Witness:</strong> ${client ? client.witnessName : ''} (${client ? client.witnessContact : ''})</p>
                                </div>
                                <div>
                                    <p style="margin: 5px 0;"><strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}</p>
                                    <p style="margin: 5px 0;"><strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}</p>
                                    <p style="margin: 5px 0; color: #dc3545; font-size: 18px;"><strong>Default:</strong> ${formatCurrency(loan.defaultAmount)}</p>
                                </div>
                            </div>
                        </div>
                    `}).join('')}
                </div>
                `}
            </div>
        </div>
    `;

    modal.onclick = function (e) {
        if (e.target === modal) {
            closeModal('defaultsModal');
        }
    };

    document.body.appendChild(modal);
}

// Show all clients in a modal
function showAllClientsModal() {
    // Group clients by branch
    const clientsByBranch = {};

    mockClients.forEach(client => {
        // Find which branch this client belongs to by checking their loans
        const clientLoan = mockLoans.find(loan => loan.clientId === client.id);
        const branchName = clientLoan ? clientLoan.branchName : 'Unassigned';

        if (!clientsByBranch[branchName]) {
            clientsByBranch[branchName] = [];
        }
        clientsByBranch[branchName].push(client);
    });

    const modal = document.createElement('div');
    modal.className = 'client-modal';
    modal.id = 'allClientsModal';
    modal.innerHTML = `
        <div class="client-modal-content" style="max-width: 1000px;">
            <div class="client-modal-header">
                <h2>📋 All Clients (${mockClients.length}) - By Branch</h2>
                <button class="modal-close" onclick="closeModal('allClientsModal')">✕</button>
            </div>
            <div class="client-modal-body">
                ${Object.keys(clientsByBranch).sort().map(branchName => `
                    <div style="margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #667EEA; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #667EEA;">
                            🏢 ${branchName} <span style="font-size: 16px; color: #666;">(${clientsByBranch[branchName].length} clients)</span>
                        </h3>
                        <div style="display: grid; gap: 10px;">
                            ${clientsByBranch[branchName].map((client, index) => `
                                <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                    <div style="flex: 1;">
                                        <span style="font-weight: bold; color: #333; font-size: 16px;">
                                            ${index + 1}. ${client.fullName || client.firstName + ' ' + client.lastName}
                                        </span>
                                        <span style="color: #666; font-size: 14px; margin-left: 15px;">
                                            📞 ${client.phoneNumber}
                                        </span>
                                        <span style="color: #666; font-size: 14px; margin-left: 15px;">
                                            📍 ${client.district || ''}
                                        </span>
                                    </div>
                                    <button 
                                        onclick="closeModal('allClientsModal'); viewClientDetail(${client.id});" 
                                        style="background: #667EEA; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: background 0.2s;"
                                        onmouseover="this.style.background='#5568d3'"
                                        onmouseout="this.style.background='#667EEA'">
                                        View Details →
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    modal.onclick = function (e) {
        if (e.target === modal) {
            closeModal('allClientsModal');
        }
    };

    // Hide admin dashboard to prevent z-index conflicts
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) {
        adminDashboard.style.visibility = 'hidden';
    }

    document.body.appendChild(modal);
}

function addStatCardClickHandlers() {
    // Total Clients card - show client breakdown by branch
    const clientCountCard = document.getElementById('clientCount');
    if (clientCountCard) {
        const statCard = clientCountCard.closest('.stat-card');
        if (statCard) {
            statCard.style.cursor = 'pointer';
            statCard.onclick = function () {
                showClientBreakdownModal();
            };
        }
    }

    // Active Loans card - show all active loans
    const activeLoansCard = document.getElementById('activeLoansCount');
    if (activeLoansCard) {
        const statCard = activeLoansCard.closest('.stat-card');
        if (statCard) {
            statCard.style.cursor = 'pointer';
            statCard.onclick = function () {
                showActiveLoansModal();
            };
        }
    }

    // Total Disbursed card - show disbursement breakdown
    const disbursedCard = document.getElementById('totalDisbursed');
    if (disbursedCard) {
        const statCard = disbursedCard.closest('.stat-card');
        if (statCard) {
            statCard.style.cursor = 'pointer';
            statCard.onclick = function () {
                showDisbursedBreakdownModal();
            };
        }
    }

    // Default Rate card - show clients with defaults
    const defaultsCard = document.getElementById('defaultRate');
    if (defaultsCard) {
        const statCard = defaultsCard.closest('.stat-card');
        if (statCard) {
            statCard.style.cursor = 'pointer';
            statCard.onclick = function () {
                showDefaultsModal();
            };
        }
    }

    // Pending Loans card - show pending applications
    const pendingCard = document.getElementById('pendingCount');
    if (pendingCard) {
        const statCard = pendingCard.closest('.stat-card');
        if (statCard) {
            statCard.style.cursor = 'pointer';
            statCard.onclick = function () {
                showLoanSubTab('pending');
            };
        }
    }

    // Approved Total card - show approved loans
    const approvedCard = document.getElementById('approvedCount');
    if (approvedCard) {
        const statCard = approvedCard.closest('.stat-card');
        if (statCard) {
            statCard.style.cursor = 'pointer';
            statCard.onclick = function () {
                showLoanSubTab('approved');
            };
        }
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
                    <strong>District:</strong> ${client.district || ''}
                </div>
                <div class="default-detail-item">
                    <strong>Village:</strong> ${client.homeVillage || ''}
                </div>
                <div class="default-detail-item">
                    <strong>Employer:</strong> ${client.employerName || ''}
                </div>
                <div class="default-detail-item">
                    <strong>Witness:</strong> ${client.witnessName || ''}
                </div>
                <div class="default-detail-item">
                    <strong>Witness Phone:</strong> ${client.witnessContact || ''}
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

        let icon = '✓';
        let title = '';

        if (activity.type === 'payment') {
            icon = '💰';
            title = `Loan Repayment Received - ${activity.amount}`;
        } else if (activity.type === 'approval') {
            icon = '✅';
            title = `Loan Approved - ${activity.amount}`;
        } else if (activity.type === 'registration') {
            icon = '👤';
            title = `New Client Registered`;
        }

        activityItem.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-details">
                <h4>${title}</h4>
                <p>${activity.client} • ${activity.branch} • ${activity.time}</p>
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
                    <div class="client-info-value">${client.title || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Gender</div>
                    <div class="client-info-value">${client.gender || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Date of Birth</div>
                    <div class="client-info-value">${client.dateOfBirth || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Marital Status</div>
                    <div class="client-info-value">${client.maritalStatus || ''}</div>
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
                    <div class="client-info-value">${client.email || ''}</div>
                </div>
            </div>
        </div>
        
        <div class="client-info-section">
            <h3>Location Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">District</div>
                    <div class="client-info-value">${client.district || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Traditional Authority</div>
                    <div class="client-info-value">${client.traditionalAuthority || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Home Village</div>
                    <div class="client-info-value">${client.homeVillage || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Physical Address</div>
                    <div class="client-info-value">${client.address || ''}</div>
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
                    <div class="client-info-value">${client.spouseContact || ''}</div>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="client-info-section">
            <h3>Employment Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Employer/Ministry</div>
                    <div class="client-info-value">${client.employerName || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Department</div>
                    <div class="client-info-value">${client.department || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Employment Number</div>
                    <div class="client-info-value">${client.employmentNumber || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Monthly Salary</div>
                    <div class="client-info-value">MK ${client.monthlySalary || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Employment Status</div>
                    <div class="client-info-value">${client.fullEmployment || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Length of Service</div>
                    <div class="client-info-value">${client.lengthOfService || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Work Address</div>
                    <div class="client-info-value">${client.workAddress || ''}</div>
                </div>
            </div>
        </div>
        
        <div class="client-info-section">
            <h3>Bank Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Bank Name</div>
                    <div class="client-info-value">${client.bankName || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Account Number</div>
                    <div class="client-info-value">${client.accountNumber || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Account Type</div>
                    <div class="client-info-value">${client.accountType || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Branch</div>
                    <div class="client-info-value">${client.bankBranch || ''}</div>
                </div>
            </div>
        </div>
        
        <div class="client-info-section">
            <h3>Witness/Guarantor Details</h3>
            <div class="client-info-grid">
                <div class="client-info-item">
                    <div class="client-info-label">Witness Name</div>
                    <div class="client-info-value">${client.witnessName || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Witness Contact</div>
                    <div class="client-info-value">${client.witnessContact || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Relationship</div>
                    <div class="client-info-value">${client.witnessRelationship || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Witness Occupation</div>
                    <div class="client-info-value">${client.witnessOccupation || ''}</div>
                </div>
                <div class="client-info-item">
                    <div class="client-info-label">Witness Income</div>
                    <div class="client-info-value">MK ${client.witnessIncome || ''}</div>
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
                        <div><strong>Receiving:</strong> ${loan.receivingMethod || ''} 
                            ${loan.receivingMethod === 'Bank' ? `(${loan.bankName} - ${loan.accountNumber})` :
            (loan.mobileMoneyPhone ? `(${loan.mobileMoneyPhone})` : '')}
                        </div>
                        ${loan.disbursedAmount ? `<div><strong>Disbursed:</strong> ${formatCurrency(loan.disbursedAmount)}</div>` : ''}
                        ${loan.collectedAmount ? `<div><strong>Collected:</strong> ${formatCurrency(loan.collectedAmount)}</div>` : ''}
                        ${loan.defaultAmount > 0 ? `<div style="color: #dc3545;"><strong>Default:</strong> ${formatCurrency(loan.defaultAmount)}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="client-info-section">
            <h3><i data-lucide="calculator"></i> Quick Loan Eligibility Calculator</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 10px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label>Prospective Loan Amount (MK)</label>
                        <input type="number" id="quickLoanAmount" min="1000" placeholder="e.g., 500,000" style="width: 100%;">
                    </div>
                    <div class="form-group">
                        <label>Repayment Term (months)</label>
                        <input type="number" id="quickRepaymentPeriod" min="1" max="60" value="12" style="width: 100%;">
                    </div>
                </div>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
                    <h4 style="margin: 0 0 10px 0; color: #475569; font-size: 0.9rem;">Estimated Repayment Breakdown (at ${globalSettings.interestRate}% Interest)</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div>
                            <span style="font-size: 0.8rem; color: #64748b;">Interest:</span>
                            <div style="font-weight: 600; font-size: 1.1rem; color: #667eea;" id="quickEstInterest">0</div>
                        </div>
                        <div>
                            <span style="font-size: 0.8rem; color: #64748b;">Processing Fee:</span>
                            <div style="font-weight: 600; font-size: 1.1rem;" id="quickEstFee">0</div>
                        </div>
                        <div>
                            <span style="font-size: 0.8rem; color: #64748b;">Total Repayment:</span>
                            <div style="font-weight: 700; font-size: 1.2rem; color: #28a745;" id="quickEstTotal">0</div>
                        </div>
                        <div>
                            <span style="font-size: 0.8rem; color: #64748b;">Monthly Installment:</span>
                            <div style="font-weight: 600; font-size: 1.1rem; color: #667eea;" id="quickEstMonthly">0</div>
                        </div>
                    </div>
                </div>
                <!-- Action link to proceed to formal application with pre-filled ID if needed -->
                <div style="margin-top: 15px; text-align: right;">
                    <button class="btn btn-primary" onclick="closeClientModal(); showTab('apply'); setTimeout(() => { document.getElementById('loanClient').value = '${client.id}'; }, 100);">Proceed to Application &rarr;</button>
                </div>
            </div>
        </div>

        
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

    // Initialize Lucide icons specifically for the modal if present
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Wire up the Quick Calculator event listeners immediately after insertion
    setTimeout(() => {
        const qAmount = document.getElementById('quickLoanAmount');
        const qPeriod = document.getElementById('quickRepaymentPeriod');

        const updateQuickEst = () => {
            const principal = parseFloat(qAmount.value) || 0;
            const months = parseInt(qPeriod.value) || 12;

            if (principal > 0) {
                // Same logic as branch calculator
                const interestRate = parseFloat(globalSettings.interestRate) / 100;
                const processingFeeRate = parseFloat(globalSettings.loanFees) / 100;

                const totalInterest = principal * interestRate * (months / 12);
                const processingFee = principal * processingFeeRate;
                const totalRepayment = principal + totalInterest + processingFee;
                const monthlyInstallment = totalRepayment / months;

                document.getElementById('quickEstInterest').textContent = formatCurrency(totalInterest).replace('$', 'MK ');
                document.getElementById('quickEstFee').textContent = formatCurrency(processingFee).replace('$', 'MK ');
                document.getElementById('quickEstTotal').textContent = formatCurrency(totalRepayment).replace('$', 'MK ');
                document.getElementById('quickEstMonthly').textContent = formatCurrency(monthlyInstallment).replace('$', 'MK ');
            } else {
                // Reset text
                document.getElementById('quickEstInterest').textContent = '0';
                document.getElementById('quickEstFee').textContent = '0';
                document.getElementById('quickEstTotal').textContent = '0';
                document.getElementById('quickEstMonthly').textContent = '0';
            }
        };

        if (qAmount && qPeriod) {
            qAmount.addEventListener('input', updateQuickEst);
            qPeriod.addEventListener('input', updateQuickEst);
        }
    }, 100);
}

function closeClientModal() {
    document.getElementById('clientDetailModal').style.display = 'none';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('clientDetailModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
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

    modal.onclick = function (e) {
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

    modal.onclick = function (e) {
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

    modal.onclick = function (e) {
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

    modal.onclick = function (e) {
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
                                        <strong>District:</strong> ${client.district || ''}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Village:</strong> ${client.homeVillage || ''}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Employer:</strong> ${client.employerName || ''}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Witness:</strong> ${client.witnessName || ''}
                                    </div>
                                    <div class="default-detail-item">
                                        <strong>Witness Phone:</strong> ${client.witnessContact || ''}
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

    modal.onclick = function (e) {
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

    // Restore admin dashboard visibility
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) {
        adminDashboard.style.visibility = 'visible';
    }
}

function initStoriesCarousel() {
    const track = document.getElementById('storiesCarousel');
    if (!track) return;

    const items = track.querySelectorAll('.story-item');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    function updateCarousel(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        items.forEach((item, i) => item.classList.toggle('active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    // Auto rotate every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel(currentIndex);
    }, 5000);

    // Allow manual selection via dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
        });
    });
}


// ==========================================
// CLIENT DASHBOARD SPECIFIC LOGIC
// ==========================================

function renderClientView(clientId) {
    const client = mockClients.find(c => c.id === clientId);
    if (!client) return;

    // Filter loans for this client
    const clientLoans = mockLoans.filter(l => l.clientId === clientId);
    const approvedLoans = clientLoans.filter(l => l.status === 'APPROVED');

    // Calculate totals
    const totalApproved = approvedLoans.reduce((sum, l) => sum + l.requestedAmount, 0);
    const totalBalance = approvedLoans.reduce((sum, l) => sum + (l.disbursedAmount - l.collectedAmount), 0);
    const totalRepaid = approvedLoans.reduce((sum, l) => sum + l.collectedAmount, 0);
    const totalDefault = clientLoans.reduce((sum, l) => sum + (l.defaultAmount || 0), 0);

    // Update Dashboard UI
    const approvedEl = document.getElementById('clientTotalApproved');
    const balanceEl = document.getElementById('clientBalance');
    const repaidEl = document.getElementById('clientTotalRepaid');
    const defaultEl = document.getElementById('clientDefaultAmount');

    if (approvedEl) approvedEl.textContent = formatCurrency(totalApproved);
    if (balanceEl) balanceEl.textContent = formatCurrency(totalBalance);
    if (repaidEl) repaidEl.textContent = formatCurrency(totalRepaid);
    if (defaultEl) defaultEl.textContent = formatCurrency(totalDefault);

    // Progress Bar
    const progressBar = document.getElementById('loanProgressBar');
    if (progressBar) {
        const totalDisbursed = approvedLoans.reduce((sum, l) => sum + l.disbursedAmount, 0);
        const percentage = totalDisbursed > 0 ? (totalRepaid / totalDisbursed) * 100 : 0;
        progressBar.style.width = percentage + '%';
    }

    // Next Repayment
    const nextInstallmentEl = document.getElementById('clientNextInstallment');
    const nextDueDateEl = document.getElementById('clientNextDueDate');
    const notificationBanner = document.getElementById('clientDueNotification');
    const notifAmountEl = document.getElementById('notifAmount');
    const notifDateEl = document.getElementById('notifDate');

    if (nextInstallmentEl || nextDueDateEl) {
        if (approvedLoans.length > 0) {
            const nextPymt = (approvedLoans[0].disbursedAmount * 1.15) / approvedLoans[0].repaymentPeriodMonths;
            const dueDateText = "March 25, 2026"; // Mock date

            if (nextInstallmentEl) nextInstallmentEl.textContent = formatCurrency(nextPymt);
            if (nextDueDateEl) nextDueDateEl.textContent = dueDateText;

            // Show and update notification banner
            if (notificationBanner) {
                notificationBanner.style.display = 'flex';
                if (notifAmountEl) notifAmountEl.textContent = formatCurrency(nextPymt);
                if (notifDateEl) notifDateEl.textContent = dueDateText;
            }
        } else {
            if (nextInstallmentEl) nextInstallmentEl.textContent = "MK 0";
            if (nextDueDateEl) nextDueDateEl.textContent = "No active loans";
            if (notificationBanner) notificationBanner.style.display = 'none';
        }
    }

    // Load History
    const historyList = document.getElementById('clientLoanHistory');
    if (historyList) {
        historyList.innerHTML = '';
        if (clientLoans.length === 0) {
            historyList.innerHTML = '<div class="empty-state">No loan applications yet.</div>';
        } else {
            clientLoans.slice(0, 5).forEach(loan => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.innerHTML = `
                    <div class="history-main">
                        <span class="loan-id">#${loan.loanNumber || 'Pending'}</span>
                        <span class="loan-purpose">${loan.loanPurpose}</span>
                    </div>
                    <div class="history-side">
                        <span class="loan-amount">${formatCurrency(loan.requestedAmount)}</span>
                        <span class="status-badge ${loan.status.toLowerCase()}">${loan.status}</span>
                    </div>
                `;
                historyList.appendChild(item);
            });
        }
    }

    // Initialize Calculator listeners
    const quickAmount = document.getElementById('quickAmount');
    const quickTerm = document.getElementById('quickTerm');
    const quickInterestRate = document.getElementById('quickInterestRate');

    if (quickInterestRate) {
        quickInterestRate.value = (globalSettings.interestRate || 15) + '%';
    }

    if (quickAmount && quickTerm) {
        quickAmount.addEventListener('input', updateQuickApplyEstimate);
        quickTerm.addEventListener('input', updateQuickApplyEstimate);
    }
}

/**
 * Real-time interest calculator for Quick Apply form
 */
function updateQuickApplyEstimate() {
    const amountVal = document.getElementById('quickAmount').value;
    const termVal = document.getElementById('quickTerm').value;

    const amount = parseFloat(amountVal);
    const term = parseInt(termVal);

    if (!amount || amount <= 0 || !term || term <= 0) {
        return;
    }

    const annualRate = (globalSettings.interestRate || 15) / 100;
    const totalInterest = amount * annualRate * (term / 12);
    const totalRepay = amount + totalInterest;

    const interestAmountEl = document.getElementById('quickInterestAmount');
    const totalAmountEl = document.getElementById('quickTotalAmount');

    if (interestAmountEl) interestAmountEl.value = formatCurrency(totalInterest);
    if (totalAmountEl) totalAmountEl.value = formatCurrency(totalRepay);
}

// Client Quick Apply Submission
document.addEventListener('DOMContentLoaded', () => {
    const quickApplyForm = document.getElementById('clientQuickApply');
    if (quickApplyForm) {
        quickApplyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const amount = document.getElementById('quickAmount').value;
            const term = document.getElementById('quickTerm').value;
            const method = document.getElementById('quickReceivingMethod').value;
            const purpose = document.getElementById('quickPurpose').value;
            const message = document.getElementById('quickApplyMessage');

            toggleLoading(true, 'Submitting Request...');

            setTimeout(() => {
                // Create new mock loan
                const newLoan = {
                    id: mockLoans.length + 1,
                    loanNumber: "QLN" + Math.floor(1000 + Math.random() * 9000),
                    clientName: currentUser.fullName,
                    clientId: currentUser.id,
                    requestedAmount: parseFloat(amount),
                    repaymentPeriodMonths: parseInt(term),
                    receivingMethod: method,
                    loanPurpose: purpose,
                    status: "PENDING",
                    branchName: (currentUser.district || 'Main') + " Branch",
                    disbursedAmount: 0,
                    collectedAmount: 0,
                    defaultAmount: 0
                };

                mockLoans.push(newLoan);
                saveToStorage(STORAGE_KEYS.LOANS, mockLoans);

                if (message) {
                    message.className = 'message success';
                    message.textContent = "Your loan application has been submitted successfully, and its being verified by the admin.";
                    message.style.display = 'block';
                }

                quickApplyForm.reset();

                // Reset interest rate value after form reset
                const quickInterestRate = document.getElementById('quickInterestRate');
                if (quickInterestRate) {
                    quickInterestRate.value = (globalSettings.interestRate || 15) + '%';
                }

                // Refresh view
                if (currentUser) renderClientView(currentUser.id);

                toggleLoading(false);

                setTimeout(() => {
                    if (message) message.textContent = "";
                }, 5000);
            }, 1000);
        });
    }
});
