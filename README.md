# Uprise Micro-Finance Portal

A comprehensive microfinance management system with admin and branch user dashboards, client registration, loan management, and analytics.

## Features

### Admin Dashboard
- **System Overview**: View system-wide statistics across all branches
  - Total clients, disbursed loans, collected amounts, defaults
  - Active loans and branch count
  - Recent activity feed

- **Branch Analytics**: Performance metrics for each branch
  - Client count per branch
  - Active loans and disbursed amounts
  - Collections and defaults tracking

- **Defaults Management**: Track clients with loan defaults
  - Filter by branch
  - View complete client details
  - Contact information and guarantor details

- **Loan Management**: Approve or reject pending loan applications

- **User Management**: Create and manage branch users

### Branch User Dashboard
- **Client Management**: View and register clients
  - Multi-step registration form with progress indicator
  - Barcode scanner for Malawi National ID
  - Camera integration for ID document capture
  - Complete client information collection

- **Loan Applications**: Submit and track loan applications

- **Client Details**: Click on any client name to view complete information
  - Personal information
  - Employment details
  - Bank account information
  - Witness/Guarantor details
  - Loan history
  - ID document images

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- ZXing library for barcode scanning
- Responsive design with animations

### Backend
- Spring Boot
- Spring Security with JWT authentication
- H2 in-memory database
- JPA/Hibernate

## Getting Started

### Prerequisites
- Java 11 or higher
- Maven
- Modern web browser (Chrome, Firefox, Edge)

### Running the Application

#### Option 1: Frontend Only (Demo Mode)
1. Navigate to the `web` folder
2. Open `index.html` in your browser
3. Login with demo credentials:
   - Admin: `admin` / `admin123`
   - Branch User: `branch1` / `branch123`

#### Option 2: Full Stack
1. Start the backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
   Backend will run on `http://localhost:8081`

2. Open the frontend:
   ```bash
   cd web
   start index.html
   ```

## Project Structure

```
UPRISE/
├── backend/              # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   └── pom.xml
├── web/                  # Frontend application
│   ├── index.html       # Main application
│   ├── app-enhanced.js  # JavaScript logic
│   ├── styles.css       # Styling
│   └── images/          # Logo and assets
├── database/            # Database scripts
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

## Features in Detail

### Multi-Step Client Registration
1. **Scan ID**: Quick registration using Malawi National ID barcode
2. **Personal Info**: Name, gender, DOB, marital status, contact details
3. **Employment**: Employer, salary, employment status
4. **Bank & Witness**: Bank account and guarantor information
5. **ID Capture**: Photo capture of ID front and back

### Analytics Dashboard
- Real-time statistics
- Branch performance comparison
- Default tracking and management
- Loan disbursement and collection metrics

### Security
- JWT-based authentication
- Role-based access control (Admin, Branch User)
- Secure password storage

## Demo Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

### Branch User Account
- Username: `branch1`
- Password: `branch123`

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Edge
- Safari

## License
This project is licensed under the MIT License.

## Author
Uprise Financial Services

## Support
For support, please contact your system administrator.
