CREATE TABLE IF NOT EXISTS audits (
    id BIGSERIAL PRIMARY KEY,
    audit_id VARCHAR(64) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'queued',
    contract_address VARCHAR(42),
    chain_id INTEGER,
    contract_name VARCHAR(255),
    artifact_path TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS engine_runs (
    id BIGSERIAL PRIMARY KEY,
    engine_run_id VARCHAR(64) UNIQUE NOT NULL,
    audit_id VARCHAR(64) NOT NULL,
    engine VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'queued',
    attempt INTEGER NOT NULL DEFAULT 0,
    error TEXT NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,

    CONSTRAINT fk_engine_runs_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits(audit_id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_engine_runs_audit_id
    ON engine_runs(audit_id);

CREATE INDEX IF NOT EXISTS idx_engine_runs_engine
    ON engine_runs(engine);