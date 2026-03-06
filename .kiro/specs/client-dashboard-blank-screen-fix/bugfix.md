# Bugfix Requirements Document

## Introduction

After a client successfully logs in with valid credentials (e.g., username: MWI001234567, password: client123), the application calls `showScreen('clientDashboard')` followed by `renderClientView(clientUser.id)`. However, instead of displaying the client dashboard with financial overview, loan history, and quick apply form, the screen remains completely blank (white screen). 

Investigation revealed that the HTML file (web/index.html) contains severe structural corruption where the client dashboard HTML is mixed into the registration form section (around line 1007-1010). Specifically, the client dashboard navbar HTML is inserted in the middle of registration form input fields, breaking the DOM structure. Additionally, the client dashboard section lacks the required wrapper `<div id="clientDashboard" class="screen">` that the `showScreen()` function expects to find and activate.

This corruption prevents the browser from properly parsing and rendering the client dashboard, resulting in a blank screen after login.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a client logs in successfully and `showScreen('clientDashboard')` is called THEN the system displays a blank white screen because the `clientDashboard` element does not exist in the DOM

1.2 WHEN the browser parses web/index.html around lines 1007-1010 THEN the system encounters malformed HTML where client dashboard navbar elements are mixed into registration form input fields, breaking the DOM structure

1.3 WHEN `renderClientView(clientUser.id)` attempts to populate client dashboard elements THEN the system fails silently because the target DOM elements do not exist or are malformed

### Expected Behavior (Correct)

2.1 WHEN a client logs in successfully and `showScreen('clientDashboard')` is called THEN the system SHALL display the client dashboard with a properly structured `<div id="clientDashboard" class="screen">` wrapper that can be activated

2.2 WHEN the browser parses web/index.html THEN the system SHALL encounter well-formed HTML with the client dashboard section properly separated from the registration form section, with no mixed or interleaved elements

2.3 WHEN `renderClientView(clientUser.id)` attempts to populate client dashboard elements THEN the system SHALL successfully populate the client profile name, financial overview stats (balance, total repaid, loan progress), loan history cards, upcoming repayments table, and quick apply form

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user logs in as admin or branch user THEN the system SHALL CONTINUE TO display the correct dashboard (adminDashboard or branchDashboard) without any blank screen issues

3.2 WHEN the registration form is accessed THEN the system SHALL CONTINUE TO display all registration form fields (personal information, employment information, guarantor information, ID document capture) in their proper structure

3.3 WHEN the browser parses other sections of web/index.html (login screen, admin dashboard, branch dashboard) THEN the system SHALL CONTINUE TO render them correctly without any structural issues

3.4 WHEN the `showScreen()` function is called with other screen IDs THEN the system SHALL CONTINUE TO properly hide inactive screens and show the requested screen
