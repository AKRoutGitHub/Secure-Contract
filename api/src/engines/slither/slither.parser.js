const normalizeSeverity = (impact) => {
  switch ((impact || "").toLowerCase()) {
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    case "informational":
      return "informational";
    default:
      return "informational";
  }
};

const normalizeConfidence = (confidence) => {
  switch ((confidence || "").toLowerCase()) {
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "low";
  }
};

const parseSlitherOutput = (output) => {
  const detectors = output?.results?.detectors || [];

  return detectors.map((detector) => ({
    type: detector.check || "unknown",
    severity: normalizeSeverity(detector.impact),
    confidence: normalizeConfidence(detector.confidence),
    title: detector.check || "Slither finding",
    description: detector.description || "",
    location: {
      source: detector.elements?.[0]?.source_mapping || null,
    },
    evidence: {
      detector: detector.check || null,
      markdown: detector.markdown || null,
    },
    recommendation: null,
  }));
};

module.exports = {
  parseSlitherOutput,
};
