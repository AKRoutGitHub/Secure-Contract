const axios = require("axios");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const fetchSourceCode = async (req, res) => {
  try {
    // CASE 1: User uploaded a file directly via Multer
    if (req.file) {
      const filePath = req.file.path;
      const fileName = req.file.originalname;

      const insertQuery = `
                INSERT INTO scans (file_name, status) 
                VALUES ($1, $2) 
                RETURNING *;
            `;
      const dbResult = await db.query(insertQuery, [fileName, "pending"]);

      return res.status(200).json({
        message: "File uploaded and database record created successfully",
        filePath: filePath,
        scanDetails: dbResult.rows[0],
      });
    }

    // CASE 2: User provided an Ethereum address
    const { address } = req.body;
    if (address) {
      const apiKey = process.env.ETHERSCAN_API_KEY;
      const etherscanUrl = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;

      const response = await axios.get(etherscanUrl);

      if (response.data.status !== "1" || !response.data.result[0].SourceCode) {
        return res
          .status(404)
          .json({ error: "Failed to fetch from Etherscan" });
      }

      const sourceCode = response.data.result[0].SourceCode;
      const contractsDir = path.join(__dirname, "../../../contracts");

      if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
      }

      const filePath = path.join(contractsDir, `${address}.sol`);
      fs.writeFileSync(filePath, sourceCode, "utf8");

      const insertQuery = `
                INSERT INTO scans (contract_address, status) 
                VALUES ($1, $2) 
                RETURNING *;
            `;
      const dbResult = await db.query(insertQuery, [address, "pending"]);

      return res.status(200).json({
        message: "Source code fetched and database record created successfully",
        filePath: filePath,
        scanDetails: dbResult.rows[0],
      });
    }

    // CASE 3: Neither input was provided
    return res
      .status(400)
      .json({
        error: "Please provide either a contract address or upload a .sol file",
      });
  } catch (error) {
    console.error("Error in scan pipeline:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  fetchSourceCode,
};
