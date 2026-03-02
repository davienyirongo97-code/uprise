-- Sample Data for Testing

-- Insert Branches
INSERT INTO branches (branch_code, branch_name, location, contact_phone) VALUES
('BR001', 'Main Branch', 'City Center', '+250788123456'),
('BR002', 'East Branch', 'Kigali East', '+250788234567');

-- Insert Admin User (password: admin123)
INSERT INTO users (username, password, full_name, email, role, active) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'System Admin', 'admin@microfinance.com', 'ADMIN', true);

-- Insert Branch Users (password: branch123)
INSERT INTO users (username, password, full_name, email, role, branch_id, active) VALUES
('branch1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Branch User 1', 'branch1@microfinance.com', 'BRANCH_USER', 1, true),
('branch2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Branch User 2', 'branch2@microfinance.com', 'BRANCH_USER', 2, true);

-- Insert Interest Rate
INSERT INTO interest_rates (rate, description, active, set_by) VALUES
(12.00, 'Standard Interest Rate', true, 1);
