const db = require("../config/db");

const createEngineRun = async ({ engineRunId, auditId, engine }) => {
  const query = `
        INSERT INTO engine_runs (
            engine_run_id,
            audit_id,
            engine,
            status
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

  const result = await db.query(query, [
    engineRunId,
    auditId,
    engine,
    "queued",
  ]);

  return result.rows[0];
};

const getEngineRunsByAuditId = async (auditId) => {
  const query = `
        SELECT *
        FROM engine_runs
        WHERE audit_id = $1
        ORDER BY id ASC;
    `;

  const result = await db.query(query, [auditId]);

  return result.rows;
};

module.exports = {
  createEngineRun,
  getEngineRunsByAuditId,
};
