/**
 * Bug Condition Exploration Test
 * 
 * Purpose: Validate that the client dashboard bug exists in the UNFIXED code
 * Expected Outcome: All tests should FAIL (this confirms the bug exists)
 * Property 1: Fault Condition - Client Dashboard Renders After Login
 * 
 * IMPORTANT: This test is designed to FAIL on unfixed code. When it fails, it proves the bug exists.
 * After the fix is implemented, this same test should PASS, confirming the bug is resolved.
 */

const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlPath = path.join(__dirname, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// Simple DOM parser (without external dependencies)
class SimpleDOMParser {
    constructor(html) {
        this.html = html;
    }

    getElementById(id) {
        const regex = new RegExp(`id=["']${id}["']`, 'i');
        return regex.test(this.html);
    }

    querySelector(selector) {
        // Simple check for navbar in registration form
        if (selector.includes('registerTab')) {
            // More robust regex to find registerTab content
            const registerTabMatch = this.html.match(/id=["']registerTab["'][^>]*>([\s\S]*?)(?=<div id=["']applyTab["'])/i);
            if (registerTabMatch) {
                const registerTabContent = registerTabMatch[1];
                return registerTabContent.includes('navbar client-navbar') || registerTabContent.includes('class="client-navbar"');
            }
        }
        return false;
    }
    
    getRegisterTabContent() {
        const match = this.html.match(/id=["']registerTab["'][^>]*>([\s\S]*?)(?=<div id=["']applyTab["'])/i);
        return match ? match[1] : '';
    }
}

// Test results
let testResults = [];
let counterexamples = [];

function logResult(testName, passed, message, isCounterexample = false) {
    testResults.push({ testName, passed, message });
    if (!passed && isCounterexample) {
        counterexamples.push({ testName, message });
    }
}

function test1_ClientDashboardExists(parser) {
    const testName = "Test 1: Client Dashboard Element Exists";
    const exists = parser.getElementById('clientDashboard');
    
    if (!exists) {
        logResult(
            testName,
            false,
            "FAILED (Expected): document.getElementById('clientDashboard') returns null. The clientDashboard element does not exist in the DOM.",
            true
        );
    } else {
        logResult(
            testName,
            true,
            "PASSED (Unexpected): clientDashboard element exists. This suggests the bug may already be fixed."
        );
    }
}

function test2_RequiredChildElementsExist(parser) {
    const testName = "Test 2: Required Child Elements Exist";
    const requiredElements = [
        'clientProfileName',
        'clientBalance',
        'clientTotalRepaid',
        'loanProgressBar',
        'clientNextInstallment',
        'clientNextDueDate',
        'clientLoanHistory',
        'clientRepaymentTable'
    ];

    const missingElements = [];
    requiredElements.forEach(elementId => {
        if (!parser.getElementById(elementId)) {
            missingElements.push(elementId);
        }
    });

    if (missingElements.length > 0) {
        logResult(
            testName,
            false,
            `FAILED (Expected): ${missingElements.length} required elements are missing: ${missingElements.join(', ')}`,
            true
        );
    } else {
        logResult(
            testName,
            true,
            "PASSED (Unexpected): All required child elements exist. This suggests the bug may already be fixed."
        );
    }
}

function test3_ClientDashboardScreenWrapper(parser) {
    const testName = "Test 3: Client Dashboard Has Proper Screen Wrapper";
    
    // Check if there's a div with id="clientDashboard" and class="screen"
    const hasProperWrapper = /<div[^>]+id=["']clientDashboard["'][^>]+class=["'][^"']*screen[^"']*["']|<div[^>]+class=["'][^"']*screen[^"']*["'][^>]+id=["']clientDashboard["']/i.test(htmlContent);
    
    if (!hasProperWrapper) {
        logResult(
            testName,
            false,
            "FAILED (Expected): No <div id='clientDashboard' class='screen'> wrapper found. The showScreen() function requires this structure.",
            true
        );
    } else {
        logResult(
            testName,
            true,
            "PASSED (Unexpected): Proper screen wrapper exists. This suggests the bug may already be fixed."
        );
    }
}

function test4_RegistrationFormStructure(parser) {
    const testName = "Test 4: Registration Form Structure (No Navbar Corruption)";
    
    // Direct search for the corruption pattern: input field followed by navbar
    const corruptionPattern = /id=["']clientName["'][^>]*>\s*<nav class=["']navbar client-navbar["']/i;
    const hasCorruption = corruptionPattern.test(htmlContent);
    
    if (hasCorruption) {
        logResult(
            testName,
            false,
            "FAILED (Expected): Found navbar element immediately after clientName input field in registration form. This is the exact HTML corruption described in the bug report.",
            true
        );
    } else {
        logResult(
            testName,
            true,
            "PASSED (Unexpected): No navbar corruption found after clientName input. This suggests the bug may already be fixed."
        );
    }
}

function test5_ClientDashboardElementsInWrongPlace() {
    const testName = "Test 5: Client Dashboard Elements Not in Registration Form";
    
    // Direct pattern: look for clientProfileName before the applyTab section
    // The clientProfileName should ONLY appear in the clientDashboard section (after line 1007)
    // If it appears before applyTab but not in a proper clientDashboard wrapper, it's corruption
    
    // Find where registerForm starts and where applyTab starts
    const registerFormMatch = htmlContent.match(/id=["']registerForm["']/i);
    const applyTabMatch = htmlContent.match(/id=["']applyTab["']/i);
    const clientDashboardMatch = htmlContent.match(/<div[^>]+id=["']clientDashboard["'][^>]+class=["'][^"']*screen/i);
    
    if (registerFormMatch && applyTabMatch) {
        const registerFormIndex = registerFormMatch.index;
        const applyTabIndex = applyTabMatch.index;
        const clientDashboardIndex = clientDashboardMatch ? clientDashboardMatch.index : -1;
        
        // Check if clientProfileName appears between registerForm and applyTab
        const betweenSection = htmlContent.substring(registerFormIndex, applyTabIndex);
        const hasClientProfileName = /id=["']clientProfileName["']/i.test(betweenSection);
        const hasClientNavbar = /class=["'][^"']*client-navbar[^"']*["']/i.test(betweenSection);
        
        if (hasClientProfileName || hasClientNavbar) {
            logResult(
                testName,
                false,
                `FAILED (Expected): Found client dashboard elements between registerForm and applyTab sections. This confirms the HTML corruption.\n   Detected: ${hasClientProfileName ? 'clientProfileName element ' : ''}${hasClientNavbar ? 'client-navbar class' : ''}`,
                true
            );
        } else {
            logResult(
                testName,
                true,
                "PASSED (Unexpected): No client dashboard elements found in registration form area."
            );
        }
    } else {
        logResult(
            testName,
            false,
            "FAILED: Could not locate registerForm or applyTab sections in HTML.",
            false
        );
    }
}

// Run all tests
console.log('\n=================================================');
console.log('🔍 Bug Condition Exploration Test');
console.log('=================================================\n');
console.log('Purpose: Validate that the client dashboard bug exists in the UNFIXED code');
console.log('Expected Outcome: All tests should FAIL (this confirms the bug exists)\n');
console.log('⚠️  IMPORTANT: This test is designed to FAIL on unfixed code.');
console.log('    When it fails, it proves the bug exists.\n');
console.log('=================================================\n');

const parser = new SimpleDOMParser(htmlContent);

test1_ClientDashboardExists(parser);
test2_RequiredChildElementsExist(parser);
test3_ClientDashboardScreenWrapper(parser);
test4_RegistrationFormStructure(parser);
test5_ClientDashboardElementsInWrongPlace();

// Display results
console.log('📊 Test Results:\n');
testResults.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.testName}`);
    console.log(`   ${result.message}\n`);
});

// Display counterexamples
if (counterexamples.length > 0) {
    console.log('\n=================================================');
    console.log('🐛 Counterexamples Found (Bug Evidence)');
    console.log('=================================================\n');
    console.log('These counterexamples prove the bug exists:\n');
    counterexamples.forEach((ce, index) => {
        console.log(`${index + 1}. ${ce.testName}`);
        console.log(`   ${ce.message}\n`);
    });
}

// Summary
const totalTests = testResults.length;
const failedTests = testResults.filter(r => !r.passed).length;
const passedTests = totalTests - failedTests;

console.log('\n=================================================');
console.log('📈 Summary');
console.log('=================================================\n');
console.log(`Total Tests: ${totalTests}`);
console.log(`Failed (Expected): ${failedTests}`);
console.log(`Passed (Unexpected): ${passedTests}\n`);

if (failedTests === totalTests) {
    console.log('✅ SUCCESS: All tests failed as expected.');
    console.log('   The bug is confirmed to exist.\n');
    console.log('   These test failures are CORRECT - they prove the bug');
    console.log('   exists in the unfixed code.\n');
    process.exit(0); // Exit with success because we confirmed the bug
} else if (passedTests === totalTests) {
    console.log('⚠️  UNEXPECTED: All tests passed.');
    console.log('   The bug may already be fixed, or the tests need adjustment.\n');
    process.exit(1);
} else {
    console.log('⚠️  PARTIAL: Some tests passed unexpectedly.');
    console.log('   Review the results above.\n');
    process.exit(1);
}
