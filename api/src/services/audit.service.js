const { randomUUID } = require("crypto");

const { createAudit, getAuditById } = require("../models/audit.model");

const { getEngineRunsByAuditId } = require("../models/engine-run.model");
const { getFindingsByAuditId } = require("../models/finding.model");
const {
  saveUploadedContract,
  fetchContractFromAddress,
} = require("./contract.service");

const { startAudit } = require("../orchestrator/audit.orchestrator");

const createAuditService = async ({ address, chainId, file }) => {
  const auditId = `audit_${randomUUID()}`;

  let artifact;

  if (file) {
    artifact = await saveUploadedContract({
      auditId,
      file,
    });
  } else if (address) {
    artifact = await fetchContractFromAddress({
      auditId,
      address,
      chainId,
    });
  } else {
    throw new Error(
      "Please provide either a contract address or upload a .sol file",
    );
  }

  const audit = await createAudit({
    auditId,
    status: "queued",
    contractAddress: artifact.contractAddress,
    chainId: artifact.chainId,
    contractName: artifact.contractName,
    artifactPath: artifact.artifactPath,
  });

  const engineRuns = await startAudit({
    auditId: audit.audit_id,
    artifactPath: artifact.artifactPath,
  });

  return {
    audit,
    engineRuns,
  };
};

const getAuditService = async (auditId) => {
  const audit = await getAuditById(auditId);

  if (!audit) {
    return null;
  }
  const engineRuns = await getEngineRunsByAuditId(auditId);
  const findings = await getFindingsByAuditId(auditId);

  return {
    audit,
    engineRuns,
    findings,
  };
};

module.exports = {
  createAuditService,
  getAuditService,
};
