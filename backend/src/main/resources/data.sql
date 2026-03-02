-- Sample Data for Testing

-- Insert Branches
INSERT INTO branches (id, branch_code, branch_name, location, contact_phone, active, created_at) VALUES
(1, 'BR001', 'Main Branch', 'City Center', '+250788123456', true, CURRENT_TIMESTAMP),
(2, 'BR002', 'East Branch', 'Kigali East', '+250788234567', true, CURRENT_TIMESTAMP);

-- Insert Admin User (password: admin123)
INSERT INTO users (id, username, password, full_name, email, role, active, created_at, updated_at) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin', 'admin@microfinance.com', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Branch Users (password: branch123)
INSERT INTO users (id, username, password, full_name, email, role, branch_id, active, created_at, updated_at) VALUES
(2, 'branch1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Branch User 1', 'branch1@microfinance.com', 'BRANCH_USER', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'branch2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Branch User 2', 'branch2@microfinance.com', 'BRANCH_USER', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Interest Rate
INSERT INTO interest_rates (id, rate, description, active, set_by, effective_from) VALUES
(1, 12.00, 'Standard Interest Rate', true, 1, CURRENT_TIMESTAMP);
