require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const { fetchSourceCode } = require('./controllers/scan.controller');

const app = express();

// Standard middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (assumes index.html is in the root directory)
app.use(express.static(path.join(__dirname, '../../')));

// Configure Multer storage to save uploaded files directly to the contracts folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Navigates from api/src/ to the root contracts/ directory
        cb(null, path.join(__dirname, '../../contracts'));
    },
    filename: (req, file, cb) => {
        // Appends a timestamp to prevent overwriting files with the same name
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Route wrapper using Multer middleware
app.post('/api/scan', upload.single('contractFile'), fetchSourceCode);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});