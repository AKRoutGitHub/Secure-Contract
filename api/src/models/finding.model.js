const { randomUUID } = require("crypto");
const db = require("../config/db");

const createFinding = async ({
  auditId,
  engine,
  type,
  severity,
  confidence,
  title,
  description,
  location,
  evidence,
  recommendation,
}) => {
  const findingId = randomUUID();

  const query = `
    INSERT INTO findings (
      finding_id,
      audit_id,
      engine,
      type,
      severity,
      confidence,
      title,
      description,
      location,
      evidence,
      recommendation
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
    RETURNING *;
  `;

  const values = [
    findingId,
    auditId,
    engine,
    type,
    severity,
    confidence,
    title,
    description,
    location || null,
    evidence || null,
    recommendation || null,
  ];

  const result = await db.query(query, values);

  return result.rows[0];
};

module.exports = {
  createFinding,
};
