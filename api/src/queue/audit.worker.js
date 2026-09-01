const { Worker } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
};

const { runSlither } = require("../engines/slither/slither.worker");
const { parseSlitherOutput } = require("../engines/slither/slither.parser");
const { createFinding } = require("../models/finding.model");

const worker = new Worker(
  "audit-analysis",
  async (job) => {
    const { auditId, artifactPath } = job.data;

    console.log("=================================");
    console.log("Starting Slither");
    console.log("Audit ID:", auditId);
    console.log("Artifact:", artifactPath);
    console.log("=================================");

    const slitherOutput = await runSlither(artifactPath);

    const findings = parseSlitherOutput(slitherOutput);

    for (const finding of findings) {
      await createFinding({
        auditId,
        engine: "slither",
        type: finding.type,
        severity: finding.severity,
        confidence: finding.confidence,
        title: finding.title,
        description: finding.description,
        location: finding.location,
        evidence: finding.evidence,
        recommendation: finding.recommendation,
      });
    }

    console.log(`Slither completed: ${findings.length} findings`);

    return {
      auditId,
      engine: "slither",
      findingCount: findings.length,
    };
  },
  {
    connection,
  },
);

worker.on("completed", (job, result) => {
  console.log(`Audit job completed: ${job.id}`);
  console.log(result);
});

worker.on("failed", (job, error) => {
  console.error(`Audit job failed: ${job?.id}`, error);
});
