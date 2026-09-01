const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require("../config/env");

const auditsDirectory = path.resolve(__dirname, "../../../contracts/audits");

const ensureAuditsDirectory = () => {
  if (!fs.existsSync(auditsDirectory)) {
    fs.mkdirSync(auditsDirectory, {
      recursive: true,
    });
  }
};

const saveUploadedContract = async ({ auditId, file }) => {
  ensureAuditsDirectory();

  const auditDirectory = path.join(auditsDirectory, auditId);

  fs.mkdirSync(auditDirectory, {
    recursive: true,
  });

  const destination = path.join(auditDirectory, file.originalname);

  fs.copyFileSync(file.path, destination);

  return {
    artifactPath: destination,
    contractName: file.originalname,
    contractAddress: null,
    chainId: null,
  };
};

const fetchContractFromAddress = async ({ auditId, address, chainId = 1 }) => {
  if (!config.ETHERSCAN_API_KEY) {
    throw new Error("ETHERSCAN_API_KEY is not configured");
  }

  const etherscanUrl =
    `https://api.etherscan.io/v2/api` +
    `?chainid=${chainId}` +
    `&module=contract` +
    `&action=getsourcecode` +
    `&address=${address}` +
    `&apikey=${config.ETHERSCAN_API_KEY}`;

  const response = await axios.get(etherscanUrl);

  if (response.data.status !== "1" || !response.data.result?.[0]?.SourceCode) {
    throw new Error("Failed to fetch contract source from Etherscan");
  }

  const sourceCode = response.data.result[0].SourceCode;
  const contractName = response.data.result[0].ContractName || null;

  ensureAuditsDirectory();

  const auditDirectory = path.join(auditsDirectory, auditId);

  fs.mkdirSync(auditDirectory, {
    recursive: true,
  });

  const destination = path.join(auditDirectory, "Contract.sol");

  fs.writeFileSync(destination, sourceCode, "utf8");

  return {
    artifactPath: destination,
    contractName,
    contractAddress: address,
    chainId,
  };
};

module.exports = {
  saveUploadedContract,
  fetchContractFromAddress,
};
