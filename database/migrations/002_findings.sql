CREATE TABLE IF NOT EXISTS findings (
    finding_id UUID PRIMARY KEY,
    audit_id VARCHAR(64) NOT NULL REFERENCES audits(audit_id) ON DELETE CASCADE,
    engine VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    confidence VARCHAR(20),
    title TEXT NOT NULL,
    description TEXT,
    location JSONB,
    evidence JSONB,
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_findings_audit_id
    ON findings(audit_id);

CREATE INDEX IF NOT EXISTS idx_findings_engine
    ON findings(engine);