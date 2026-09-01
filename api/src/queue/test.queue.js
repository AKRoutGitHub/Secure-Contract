const auditQueue = require("./audit.queue");

async function main() {
  const job = await auditQueue.add("audit-test", {
    audit_id: "test-audit-001",
  });

  console.log(`Job added: ${job.id}`);

  await auditQueue.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
