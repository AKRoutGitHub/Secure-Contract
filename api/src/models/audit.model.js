const db = require("../config/db");

const createAudit = async ({
  auditId,
  status,
  contractAddress,
  chainId,
  contractName,
  artifactPath,
}) => {
  const query = `
        INSERT INTO audits (
            audit_id,
            status,
            contract_address,
            chain_id,
            contract_name,
            artifact_path
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

  const values = [
    auditId,
    status,
    contractAddress || null,
    chainId || null,
    contractName || null,
    artifactPath,
  ];

  const result = await db.query(query, values);

  return result.rows[0];
};

const getAuditById = async (auditId) => {
  const query = `
        SELECT *
        FROM audits
        WHERE audit_id = $1;
    `;

  const result = await db.query(query, [auditId]);

  return result.rows[0] || null;
};

module.exports = {
  createAudit,
  getAuditById,
};
