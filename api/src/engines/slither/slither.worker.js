const { execFile } = require("child_process");
const { promisify } = require("util");
const fs = require("fs/promises");
const path = require("path");

const execFileAsync = promisify(execFile);

const runSlither = async (artifactPath) => {
  const artifactDirectory = path.dirname(artifactPath);
  const artifactName = path.basename(artifactPath);

  const outputPath = path.join(artifactDirectory, "slither-output.json");

  await fs.rm(outputPath, { force: true });

  try {
    try {
      await execFileAsync("docker", [
        "run",
        "--rm",
        "-v",
        `${artifactDirectory}:/workspace`,
        "secure-contract-slither",
        `/workspace/${artifactName}`,
        "--json",
        "/workspace/slither-output.json",
      ]);
    } catch (error) {
      // Slither may return a non-zero exit code when findings are detected.
      // The JSON output is what we actually need.
      console.log("Slither analysis completed with output.");
    }

    const output = await fs.readFile(outputPath, "utf8");

    return JSON.parse(output);
  } finally {
    await fs.rm(outputPath, { force: true });
  }
};

module.exports = {
  runSlither,
};
