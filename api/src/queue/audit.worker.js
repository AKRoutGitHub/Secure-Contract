const { Worker } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
};

const worker = new Worker(
  "audit-analysis",
  async (job) => {
    console.log("=================================");
    console.log("Audit job received");
    console.log("Job ID:", job.id);
    console.log("Audit ID:", job.data.auditId);
    console.log("Artifact:", job.data.artifactPath);
    console.log("=================================");

    return {
      auditId: job.data.auditId,
      status: "received",
    };
  },
  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log(`Audit job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Audit job failed: ${job?.id}`, error);
});
