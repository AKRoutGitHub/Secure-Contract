require('dotenv').config();
const express = require('express');
const { fetchSourceCode } = require('./controllers/scan.controller');

const app = express();
app.use(express.json());

app.post('/api/scan', fetchSourceCode);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});