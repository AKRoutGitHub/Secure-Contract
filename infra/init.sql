CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    contract_address VARCHAR(42),
    file_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);