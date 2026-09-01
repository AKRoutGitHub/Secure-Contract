const {
  createAuditService,
  getAuditService,
} = require("../services/audit.service");

const createAudit = async (req, res) => {
  try {
    const address = req.body.address || null;

    const chainId = req.body.chain_id ? Number(req.body.chain_id) : 1;

    const result = await createAuditService({
      address,
      chainId,
      file: req.file,
    });

    return res.status(202).json({
      audit_id: result.audit.audit_id,
      status: result.audit.status,
    });
  } catch (error) {
    console.error("Error creating audit:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

const getAudit = async (req, res) => {
  try {
    const result = await getAuditService(req.params.auditId);

    if (!result) {
      return res.status(404).json({
        error: "Audit not found",
      });
    }

    return res.status(200).json({
      audit: result.audit,
      engines: result.engineRuns,
    });
  } catch (error) {
    console.error("Error retrieving audit:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  createAudit,
  getAudit,
};
