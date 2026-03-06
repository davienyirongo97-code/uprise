# Admin Dashboard Update Instructions

## To make your admin dashboard look EXACTLY like the screenshot:

### Step 1: The CSS has already been updated
The new styles have been appended to `web/styles.css` - these will automatically apply.

### Step 2: Update the HTML structure

Find the admin dashboard stats section in `web/index.html` (around line 240-290) and replace the stats cards with this EXACT structure:

```html
<div class="stats">
    <div class="stat-card">
        <div class="stat-icon stat-icon-blue"><i class="fas fa-users"></i></div>
        <div class="stat-content">
            <p class="stat-label">Total Clients</p>
            <h3 id="systemClientCount" class="stat-number">12</h3>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon-green"><i class="fas fa-chart-line"></i></div>
        <div class="stat-content">
            <p class="stat-label">Active Loans</p>
            <h3 id="systemActiveLoans" class="stat-number">8</h3>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon-yellow"><i class="fas fa-wallet"></i></div>
        <div class="stat-content">
            <p class="stat-label">Total Disbursed</p>
            <h3 id="systemDisbursed" class="stat-number">MK 25.0M</h3>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon-orange"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="stat-content">
            <p class="stat-label">Default Rate</p>
            <h3 id="systemDefaults" class="stat-number">15%</h3>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon-lightblue"><i class="fas fa-clock"></i></div>
        <div class="stat-content">
            <p class="stat-label">Pending Review</p>
            <h3 id="systemPendingReview" class="stat-number">4</h3>
        </div>
    </div>
    <div class="stat-card">
        <div class="stat-icon stat-icon-purple"><i class="fas fa-check-circle"></i></div>
        <div class="stat-content">
            <p class="stat-label">Approved Total</p>
            <h3 id="systemApprovedTotal" class="stat-number">8</h3>
        </div>
    </div>
</div>
```

### Step 3: Update the admin tabs

Find the admin-tabs section and replace with:

```html
<div class="admin-tabs">
    <button class="admin-tab-btn active" onclick="showAdminTab('overview')">
        <i class="fas fa-chart-pie"></i> Overview
    </button>
    <button class="admin-tab-btn" onclick="showAdminTab('loans')">
        <i class="fas fa-file-invoice-dollar"></i> Loans
    </button>
    <button class="admin-tab-btn" onclick="showAdminTab('branches')">
        <i class="fas fa-code-branch"></i> Manage Branches
    </button>
    <button class="admin-tab-btn" onclick="showAdminTab('settings')">
        <i class="fas fa-cog"></i> Settings
    </button>
</div>
```

### Step 4: Update the overview section header

Replace the overview section header with:

```html
<div class="overview-section">
    <h3>System Analytics & Performance</h3>
</div>
```

### Step 5: Update Recent Activity header

Replace the Recent Activity h2 with:

```html
<h2><i class="fas fa-history"></i> Recent Activity</h2>
```

## Key Changes Made:

1. **Icon Colors**: Each stat card now has a specific color class (blue, green, yellow, orange, lightblue, purple)
2. **Icon Sizes**: Icons are now 56px x 56px with 24px font-awesome icons inside
3. **Layout**: Label is above the number (not below)
4. **Tab Icons**: Using Font Awesome icons instead of emojis
5. **Exact Colors**: Matching the screenshot's color palette
6. **Border Radius**: 16px for cards, 14px for icons
7. **Spacing**: Exact padding and gaps from screenshot

The dashboard will now look EXACTLY like your screenshot!
