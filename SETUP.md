# Setup Instructions

## Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL 14+
- Flutter 3.0+
- Android Studio / VS Code

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE microfinance_db;
```

2. Run schema:
```bash
psql -U postgres -d microfinance_db -f database/schema.sql
```

3. Load sample data:
```bash
psql -U postgres -d microfinance_db -f database/seed.sql
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Update `application.yml` with your database credentials

3. Run the application:
```bash
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

## Mobile Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
flutter pub get
```

3. Update API base URL in `lib/services/api_service.dart` if needed

4. Run the app:
```bash
flutter run
```

## Default Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Branch User
- Username: `branch1`
- Password: `branch123`

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login

### Branch Endpoints
- POST `/api/branch/clients` - Register client
- GET `/api/branch/clients` - Get branch clients
- POST `/api/branch/loans` - Apply for loan
- GET `/api/branch/loans` - Get branch loans

### Admin Endpoints
- GET `/api/admin/loans/pending` - Get pending loans
- POST `/api/admin/loans/{id}/approve` - Approve loan
- POST `/api/admin/loans/{id}/reject` - Reject loan

## Project Structure

```
microfinance-app/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/microfinance/
│   │       ├── controller/     # REST controllers
│   │       ├── model/          # JPA entities
│   │       ├── repository/     # Data repositories
│   │       ├── service/        # Business logic
│   │       ├── security/       # JWT & security config
│   │       └── dto/            # Data transfer objects
│   └── pom.xml
├── mobile/                     # Flutter mobile app
│   ├── lib/
│   │   ├── screens/           # UI screens
│   │   ├── services/          # API services
│   │   └── providers/         # State management
│   └── pubspec.yaml
└── database/                   # SQL scripts
    ├── schema.sql
    └── seed.sql
```
