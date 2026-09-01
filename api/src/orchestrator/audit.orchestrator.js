const { randomUUID } = require("crypto");
const { createEngineRun } = require("../models/engine-run.model");
const { getEngines } = require("./engine.registry");

const startAudit = async ({ auditId, artifactPath }) => {
  const engines = getEngines();

  const engineRuns = [];

  for (const engine of engines) {
    const engineRun = await createEngineRun({
      engineRunId: `run_${randomUUID()}`,
      auditId,
      engine,
    });

    engineRuns.push(engineRun);
  }

  console.log(`[orchestrator] Audit ${auditId} initialized`);

  console.log(`[orchestrator] Canonical artifact: ${artifactPath}`);

  console.log(`[orchestrator] Engine runs queued: ${engines.join(", ")}`);

  return engineRuns;
};

module.exports = {
  startAudit,
};
