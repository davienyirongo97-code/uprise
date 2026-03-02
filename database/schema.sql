-- Microfinance Database Schema

CREATE TABLE branches (
    id BIGSERIAL PRIMARY KEY,
    branch_code VARCHAR(50) UNIQUE NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    contact_phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'BRANCH_USER')),
    branch_id BIGINT REFERENCES branches(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    national_id VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    national_id_image_path VARCHAR(500),
    branch_id BIGINT NOT NULL REFERENCES branches(id),
    registered_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interest_rates (
    id BIGSERIAL PRIMARY KEY,
    rate NUMERIC(5,2) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    set_by BIGINT REFERENCES users(id),
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loans (
    id BIGSERIAL PRIMARY KEY,
    loan_number VARCHAR(50) UNIQUE NOT NULL,
    client_id BIGINT NOT NULL REFERENCES clients(id),
    branch_id BIGINT NOT NULL REFERENCES branches(id),
    requested_amount NUMERIC(15,2) NOT NULL,
    repayment_period_months INTEGER NOT NULL,
    loan_purpose TEXT NOT NULL,
    interest_rate NUMERIC(5,2) NOT NULL,
    total_repayment_amount NUMERIC(15,2),
    monthly_installment NUMERIC(15,2),
    amount_paid NUMERIC(15,2) DEFAULT 0,
    outstanding_balance NUMERIC(15,2),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' 
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'PARTIALLY_REPAID', 'FULLY_REPAID', 'DEFAULTED')),
    submitted_by BIGINT REFERENCES users(id),
    approved_by BIGINT REFERENCES users(id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    disbursed_at TIMESTAMP,
    rejection_reason TEXT
);

CREATE TABLE repayments (
    id BIGSERIAL PRIMARY KEY,
    loan_id BIGINT NOT NULL REFERENCES loans(id),
    amount NUMERIC(15,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(100),
    recorded_by BIGINT REFERENCES users(id)
);

CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_branch ON loans(branch_id);
CREATE INDEX idx_clients_branch ON clients(branch_id);
CREATE INDEX idx_repayments_loan ON repayments(loan_id);
