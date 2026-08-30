require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Controller to handle fetching smart contract source code from Etherscan.
 * Satisfies US-03: Backend successfully retrieves and saves .sol files.
 */
const fetchSourceCode = async (req, res) => {
    try {
        const { address } = req.body;
        
        // Ensure the address is provided
        if (!address) {
            return res.status(400).json({ error: 'Contract address is required' });
        }

        // Use Etherscan API (replace process.env.ETHERSCAN_API_KEY in your actual environment)
        const apiKey = process.env.ETHERSCAN_API_KEY || 'Your_Fallback_API_Key';
        const etherscanUrl = `https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;
        // Fetch from Etherscan
        const response = await axios.get(etherscanUrl);

        console.log("Raw Etherscan Response:", response.data);
        console.log("Loaded API Key:", process.env.ETHERSCAN_API_KEY ? "Found" : "UNDEFINED");
        
        if (response.data.status !== '1' || !response.data.result[0].SourceCode) {
            return res.status(404).json({ 
                error: 'Failed to fetch from Etherscan',
                etherscanMessage: response.data.message,
                etherscanResult: response.data.result
            });
        }

        const sourceCode = response.data.result[0].SourceCode;

        // Define file path and save the .sol file
        const contractsDir = path.join(__dirname, '../../../contracts');
        
        // Ensure the contracts directory exists
        if (!fs.existsSync(contractsDir)){
            fs.mkdirSync(contractsDir, { recursive: true });
        }

        const filePath = path.join(contractsDir, `${address}.sol`);
        fs.writeFileSync(filePath, sourceCode, 'utf8');

        // Return success response to proceed to US-04 (Database Record)
        return res.status(200).json({ 
            message: 'Source code fetched and saved successfully',
            filePath: filePath
        });

    } catch (error) {
        console.error('Error fetching source code:', error.message);
        return res.status(500).json({ error: 'Internal Server Error while fetching contract' });
    }
};

module.exports = {
    fetchSourceCode
};