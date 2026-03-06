/**
 * Preservation Property Tests
 * 
 * Purpose: Verify that non-client screens remain functional after the fix
 * Property 2: Preservation - Non-Client Screens Remain Functional
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 * 
 * Expected Outcome: All tests should PASS on current code (confirms baseline behavior to preserve)
 * 
 * These tests capture the current working behavior of:
 * - Admin dashboard display
 * - Branch dashboard display
 * - Registration form structure
 * - Login screen functionality
 */

const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// Simple DOM parser
class SimpleDOMParser {
    constructor(html) {
        this.html = html;
    }

    getElementById(id) {
        const regex = new RegExp(`id=["']${id}["']`, 'i');
        return regex.test(this.html);
    }

    hasElementWithClass(className) {
        const regex = new RegExp(`class=["'][^"']*${className}[^"']*["']`, 'i');
        return regex.test(this.html);
    }

    getElementContent(id) {
        // Extract content between element opening and its logical closing
        const startRegex = new RegExp(`<div[^>]*id=["']${id}["'][^>]*>`, 'i');
        const match = startRegex.exec(this.html);
        if (!match) return null;
        
        const startIndex = match.index;
        // Find the matching closing div (simplified - assumes proper nesting)
        let depth = 1;
        let currentIndex = startIndex + match[0].length;
        let content = '';
        
        while (depth > 0 && currentIndex < this.html.length) {
            if (this.html.substr(currentIndex, 5) === '<div ') {
                depth++;
            } else if (this.html.substr(currentIndex, 6) === '</div>') {
                depth--;
                if (depth === 0) break;
            }
            content += this.html[currentIndex];
            currentIndex++;
        }
        
        return content;
    }

    hasScreenWrapper(screenId) {
        // Check if element has both id and class="screen"
        const pattern = new RegExp(
            `<div[^>]+id=["']${screenId}["'][^>]+class=["'][^"']*screen[^"']*["']|` +
            `<div[^>]+class=["'][^"']*screen[^"']*["'][^>]+id=["']${screenId}["']`,
            'i'
        );
        return pattern.test(this.html);
    }
}

// Test results tracking
let testResults = [];
let totalTests = 0;
let passedTests = 0;

function logResult(testName, passed, message) {
    totalTests++;
    if (passed) passedTests++;
    testResults.push({ testName, passed, message });
}

// ============================================================================
// Property 1: Admin Dashboard Preservation
// ============================================================================

function testAdminDashboardExists(parser) {
    const testName = "Property 1.1: Admin Dashboard Element Exists";
    const exists = parser.getElementById('adminDashboard');
    
    logResult(
        testName,
        exists,
        exists 
            ? "PASSED: adminDashboard element exists in DOM"
            : "FAILED: adminDashboard element not found"
    );
}

function testAdminDashboardScreenWrapper(parser) {
    const testName = "Property 1.2: Admin Dashboard Has Screen Wrapper";
    const hasWrapper = parser.hasScreenWrapper('adminDashboard');
    
    logResult(
        testName,
        hasWrapper,
        hasWrapper
            ? "PASSED: adminDashboard has proper <div id='adminDashboard' class='screen'> wrapper"
            : "FAILED: adminDashboard missing screen wrapper"
    );
}

function testAdminDashboardComponents(parser) {
    const testName = "Property 1.3: Admin Dashboard Has Required Components";
    
    const requiredElements = [
        'adminName',           // Admin name display
        'clientCount',         // Total clients stat
        'activeLoansCount',    // Active loans stat
        'totalDisbursed',      // Total disbursed stat
        'defaultRate',         // Default rate stat
        'pendingCount',        // Pending review stat
        'approvedCount',       // Approved total stat
        'recentActivity'       // Recent activity list
    ];
    
    const missingElements = [];
    requiredElements.forEach(elementId => {
        if (!parser.getElementById(elementId)) {
            missingElements.push(elementId);
        }
    });
    
    const passed = missingElements.length === 0;
    logResult(
        testName,
        passed,
        passed
            ? "PASSED: All admin dashboard components exist"
            : `FAILED: Missing admin dashboard components: ${missingElements.join(', ')}`
    );
}

// ============================================================================
// Property 2: Branch Dashboard Preservation
// ============================================================================

function testBranchDashboardExists(parser) {
    const testName = "Property 2.1: Branch Dashboard Element Exists";
    const exists = parser.getElementById('branchDashboard');
    
    logResult(
        testName,
        exists,
        exists
            ? "PASSED: branchDashboard element exists in DOM"
            : "FAILED: branchDashboard element not found"
    );
}

function testBranchDashboardScreenWrapper(parser) {
    const testName = "Property 2.2: Branch Dashboard Has Screen Wrapper";
    const hasWrapper = parser.hasScreenWrapper('branchDashboard');
    
    logResult(
        testName,
        hasWrapper,
        hasWrapper
            ? "PASSED: branchDashboard has proper <div id='branchDashboard' class='screen'> wrapper"
            : "FAILED: branchDashboard missing screen wrapper"
    );
}

function testBranchDashboardComponents(parser) {
    const testName = "Property 2.3: Branch Dashboard Has Required Components";
    
    const requiredElements = [
        'branchUserName',              // Branch user name display
        'clientsList',                 // Clients list container
        'branchPendingLoansList',      // Pending loans list
        'branchApprovedLoansList'      // Approved loans list
    ];
    
    const missingElements = [];
    requiredElements.forEach(elementId => {
        if (!parser.getElementById(elementId)) {
            missingElements.push(elementId);
        }
    });
    
    const passed = missingElements.length === 0;
    logResult(
        testName,
        passed,
        passed
            ? "PASSED: All branch dashboard components exist"
            : `FAILED: Missing branch dashboard components: ${missingElements.join(', ')}`
    );
}

// ============================================================================
// Property 3: Registration Form Preservation
// ============================================================================

function testRegistrationFormExists(parser) {
    const testName = "Property 3.1: Registration Form Element Exists";
    const exists = parser.getElementById('registerForm');
    
    logResult(
        testName,
        exists,
        exists
            ? "PASSED: registerForm element exists in DOM"
            : "FAILED: registerForm element not found"
    );
}

function testRegistrationFormFields(parser) {
    const testName = "Property 3.2: Registration Form Has All Expected Fields";
    
    const requiredFields = [
        'clientFirstName',     // First Name
        'clientLastName',      // Last Name
        'dob',                 // Date of Birth
        'phone',               // Phone Number
        'email',               // Email
        'address',             // Address
        'employerName',        // Employer Name
        'monthlySalary',       // Monthly Salary
        'witnessName',         // Witness Name
        'witnessContact',      // Witness Contact
        'idFront',             // ID Front capture
        'idBack'               // ID Back capture
    ];
    
    const missingFields = [];
    requiredFields.forEach(fieldId => {
        if (!parser.getElementById(fieldId)) {
            missingFields.push(fieldId);
        }
    });
    
    const passed = missingFields.length === 0;
    logResult(
        testName,
        passed,
        passed
            ? "PASSED: All registration form fields exist"
            : `FAILED: Missing registration form fields: ${missingFields.join(', ')}`
    );
}

function testRegistrationFormNoCorruption(parser) {
    const testName = "Property 3.3: Registration Form Has No Client Dashboard Corruption";
    
    // Check that registration form section doesn't contain client dashboard elements
    const registerFormMatch = htmlContent.match(/id=["']registerForm["']/i);
    const applyTabMatch = htmlContent.match(/id=["']applyTab["']/i);
    
    if (registerFormMatch && applyTabMatch) {
        const registerFormIndex = registerFormMatch.index;
        const applyTabIndex = applyTabMatch.index;
        const betweenSection = htmlContent.substring(registerFormIndex, applyTabIndex);
        
        // Check for client dashboard elements that shouldn't be in registration form
        const hasClientNavbar = /class=["'][^"']*client-navbar[^"']*["']/i.test(betweenSection);
        const hasClientProfileName = /id=["']clientProfileName["']/i.test(betweenSection);
        const hasClientBalance = /id=["']clientBalance["']/i.test(betweenSection);
        
        const hasCorruption = hasClientNavbar || hasClientProfileName || hasClientBalance;
        const passed = !hasCorruption;
        
        logResult(
            testName,
            passed,
            passed
                ? "PASSED: Registration form contains only form elements (no client dashboard corruption)"
                : `FAILED: Registration form contains client dashboard elements: ${hasClientNavbar ? 'client-navbar ' : ''}${hasClientProfileName ? 'clientProfileName ' : ''}${hasClientBalance ? 'clientBalance' : ''}`
        );
    } else {
        logResult(
            testName,
            false,
            "FAILED: Could not locate registerForm or applyTab sections"
        );
    }
}

// ============================================================================
// Property 4: Login Screen Preservation
// ============================================================================

function testLoginScreenExists(parser) {
    const testName = "Property 4.1: Login Screen Element Exists";
    const exists = parser.getElementById('loginScreen');
    
    logResult(
        testName,
        exists,
        exists
            ? "PASSED: loginScreen element exists in DOM"
            : "FAILED: loginScreen element not found"
    );
}

function testLoginScreenComponents(parser) {
    const testName = "Property 4.2: Login Screen Has Required Components";
    
    const requiredElements = [
        'loginForm',           // Login form
        'username',            // Username input
        'password',            // Password input
        'loginError'           // Error message display
    ];
    
    const missingElements = [];
    requiredElements.forEach(elementId => {
        if (!parser.getElementById(elementId)) {
            missingElements.push(elementId);
        }
    });
    
    const passed = missingElements.length === 0;
    logResult(
        testName,
        passed,
        passed
            ? "PASSED: All login screen components exist"
            : `FAILED: Missing login screen components: ${missingElements.join(', ')}`
    );
}

function testLoginScreenAcceptsAllUserTypes(parser) {
    const testName = "Property 4.3: Login Screen Structure Supports All User Types";
    
    // Verify the login form has the basic structure to accept any credentials
    // (actual authentication logic is in JavaScript, but HTML must support it)
    const hasUsernameField = parser.getElementById('username');
    const hasPasswordField = parser.getElementById('password');
    const hasSubmitButton = /<button[^>]+type=["']submit["'][^>]*>.*?Login.*?<\/button>/is.test(htmlContent);
    
    const passed = hasUsernameField && hasPasswordField && hasSubmitButton;
    
    logResult(
        testName,
        passed,
        passed
            ? "PASSED: Login screen has proper structure to accept credentials for all user types (admin, branch, client)"
            : "FAILED: Login screen missing required elements for authentication"
    );
}

// ============================================================================
// Property 5: Screen Navigation Preservation
// ============================================================================

function testAllScreensHaveProperStructure(parser) {
    const testName = "Property 5.1: All Screens Have Proper Structure for showScreen()";
    
    const screens = [
        'landingPage',
        'loginScreen',
        'adminDashboard',
        'branchDashboard',
        'clientDashboard'
    ];
    
    const missingScreens = [];
    screens.forEach(screenId => {
        if (!parser.hasScreenWrapper(screenId)) {
            missingScreens.push(screenId);
        }
    });
    
    const passed = missingScreens.length === 0;
    logResult(
        testName,
        passed,
        passed
            ? "PASSED: All screens have proper <div id='...' class='screen'> structure"
            : `FAILED: Screens missing proper structure: ${missingScreens.join(', ')}`
    );
}

// ============================================================================
// Run All Tests
// ============================================================================

console.log('\n=================================================');
console.log('🔍 Preservation Property Tests');
console.log('=================================================\n');
console.log('Purpose: Verify non-client screens remain functional');
console.log('Property 2: Preservation - Non-Client Screens Remain Functional\n');
console.log('**Validates: Requirements 3.1, 3.2, 3.3, 3.4**\n');
console.log('Expected Outcome: All tests should PASS (confirms baseline behavior)\n');
console.log('=================================================\n');

const parser = new SimpleDOMParser(htmlContent);

// Run all property tests
console.log('📋 Property 1: Admin Dashboard Preservation\n');
testAdminDashboardExists(parser);
testAdminDashboardScreenWrapper(parser);
testAdminDashboardComponents(parser);

console.log('\n📋 Property 2: Branch Dashboard Preservation\n');
testBranchDashboardExists(parser);
testBranchDashboardScreenWrapper(parser);
testBranchDashboardComponents(parser);

console.log('\n📋 Property 3: Registration Form Preservation\n');
testRegistrationFormExists(parser);
testRegistrationFormFields(parser);
testRegistrationFormNoCorruption(parser);

console.log('\n📋 Property 4: Login Screen Preservation\n');
testLoginScreenExists(parser);
testLoginScreenComponents(parser);
testLoginScreenAcceptsAllUserTypes(parser);

console.log('\n📋 Property 5: Screen Navigation Preservation\n');
testAllScreensHaveProperStructure(parser);

// Display results
console.log('\n=================================================');
console.log('📊 Test Results');
console.log('=================================================\n');

testResults.forEach((result) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
    console.log(`   ${result.message}\n`);
});

// Summary
console.log('\n=================================================');
console.log('📈 Summary');
console.log('=================================================\n');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}\n`);

if (passedTests === totalTests) {
    console.log('✅ SUCCESS: All preservation tests passed!');
    console.log('   Non-client screens are functioning correctly.');
    console.log('   This baseline behavior must be preserved after the fix.\n');
    process.exit(0);
} else {
    console.log('❌ FAILURE: Some preservation tests failed.');
    console.log('   Review the failures above to understand what needs attention.\n');
    process.exit(1);
}
