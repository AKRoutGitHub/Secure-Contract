const { Queue } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
};

const auditQueue = new Queue("audit-analysis", {
  connection,
});

module.exports = {
  auditQueue,
};
