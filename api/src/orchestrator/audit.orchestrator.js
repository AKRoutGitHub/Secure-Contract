const { auditQueue } = require("../queue/audit.queue");

const startAudit = async ({ auditId, artifactPath }) => {
  const job = await auditQueue.add(
    "run-audit",
    {
      auditId,
      artifactPath,
    },
    {
      attempts: 2,
      removeOnComplete: true,
      removeOnFail: false,
    },
  );

  return {
    engineRuns: [],
    jobId: job.id,
  };
};

module.exports = {
  startAudit,
};
