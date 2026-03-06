# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Client Dashboard Renders After Login
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to client login scenarios where userType is CLIENT and loginSuccessful is true
  - Test that `document.getElementById('clientDashboard')` exists and is not null
  - Test that all required child elements exist: `clientProfileName`, `clientBalance`, `clientTotalRepaid`, `loanProgressBar`, `clientNextInstallment`, `clientNextDueDate`, `clientLoanHistory`, `clientRepaymentTable`
  - Test that `showScreen('clientDashboard')` successfully displays the dashboard (element becomes visible)
  - Test that registration form section contains only form elements (no navbar corruption)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: which elements are missing, what corruption exists in registration form
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-Client Screens Remain Functional
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-client screens:
    - Admin login and dashboard display
    - Branch login and dashboard display
    - Registration form field display (ignoring corrupted navbar)
    - Login screen functionality for all user types
  - Write property-based tests capturing observed behavior patterns:
    - Test that `showScreen('adminDashboard')` displays admin dashboard correctly
    - Test that `showScreen('branchDashboard')` displays branch dashboard correctly
    - Test that registration form contains all expected input fields
    - Test that login screen accepts credentials for all user types
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [~] 3. Fix for client dashboard blank screen

  - [ ] 3.1 Remove corrupted HTML from registration form section
    - Locate the client dashboard navbar HTML incorrectly embedded in registration form (approximately lines 1007-1015)
    - Remove `<nav class="navbar client-navbar">` and all its child elements
    - Remove client profile name and welcome message elements
    - Restore proper structure of registration form input fields
    - Verify registration form section contains only form elements
    - _Bug_Condition: isBugCondition(input) where input.userType == 'CLIENT' AND input.loginSuccessful == true AND document.getElementById('clientDashboard') == null AND corruptedHTMLExists(registrationFormSection)_
    - _Expected_Behavior: Registration form section contains only form elements, no navbar corruption_
    - _Preservation: Registration form must continue to display all fields correctly_
    - _Requirements: 2.1, 3.3_

  - [ ] 3.2 Create client dashboard section with proper structure
    - Add new `<div id="clientDashboard" class="screen">` section after branch dashboard
    - Include the `screen` class for proper show/hide functionality
    - Follow same structural pattern as `adminDashboard` and `branchDashboard`
    - _Bug_Condition: document.getElementById('clientDashboard') == null_
    - _Expected_Behavior: Client dashboard wrapper element exists and can be activated by showScreen()_
    - _Preservation: All other screens must continue to work correctly_
    - _Requirements: 2.1, 3.1, 3.2, 3.4_

  - [ ] 3.3 Add client dashboard navbar
    - Create client navbar with profile information
    - Include circular avatar with "U" logo
    - Include welcome message with `<span id="clientProfileName">Customer</span>`
    - Include tagline "Your financial journey with Uprise"
    - Add logout button
    - _Expected_Behavior: renderClientView() can populate clientProfileName element_
    - _Requirements: 2.2_

  - [ ] 3.4 Add financial overview section
    - Create overview stats cards container
    - Add Current Balance card with `<span id="clientBalance">MK 0</span>`
    - Add Total Repaid card with `<span id="clientTotalRepaid">MK 0</span>`
    - Add Loan Progress card with `<div id="loanProgressBar" class="progress-fill"></div>`
    - Add Next Installment card with `<span id="clientNextInstallment">MK 0</span>` and `<span id="clientNextDueDate">--</span>`
    - _Expected_Behavior: renderClientView() can populate all financial overview elements_
    - _Requirements: 2.2, 2.3_

  - [ ] 3.5 Add loan history section
    - Create section with title "Your Loan Journey"
    - Add container `<div id="clientLoanHistory"></div>` for dynamically populated loan cards
    - _Expected_Behavior: renderClientView() can populate clientLoanHistory container_
    - _Requirements: 2.2, 2.3_

  - [ ] 3.6 Add upcoming repayments section
    - Create section with title "Upcoming Repayments"
    - Add table with headers: Due Date, Amount, Status, Action
    - Add table body `<tbody id="clientRepaymentTable"></tbody>` for dynamic content
    - _Expected_Behavior: renderClientView() can populate clientRepaymentTable_
    - _Requirements: 2.2, 2.3_

  - [ ] 3.7 Add quick apply section
    - Create section with title "Quick Apply for a Loan"
    - Add form fields: Loan Amount, Repayment Period, Loan Purpose
    - Add submit button
    - Add message display area
    - _Expected_Behavior: Client can submit quick loan application from dashboard_
    - _Requirements: 2.3_

  - [ ] 3.8 Remove duplicate HTML elements
    - Clean up any duplicate closing tags at end of file
    - Remove duplicate script tags
    - Remove duplicate modal definitions
    - Verify HTML structure is valid and well-formed
    - _Preservation: Ensure no functionality is broken by cleanup_
    - _Requirements: 2.1_

  - [ ] 3.9 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Client Dashboard Renders After Login
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify `getElementById('clientDashboard')` returns valid element
    - Verify all required child elements exist
    - Verify `showScreen('clientDashboard')` displays dashboard
    - Verify registration form has no corrupted HTML
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 3.10 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-Client Screens Remain Functional
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Verify admin dashboard still works correctly
    - Verify branch dashboard still works correctly
    - Verify registration form displays all fields correctly
    - Verify login screen works for all user types
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [~] 4. Checkpoint - Ensure all tests pass
  - Run all tests (exploration test + preservation tests)
  - Verify client dashboard displays correctly after login
  - Verify no regressions in other screens
  - Ask user if questions arise
