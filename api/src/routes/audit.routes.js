const express = require("express");
const multer = require("multer");
const path = require("path");

const { createAudit, getAudit } = require("../controllers/audit.controller");

const router = express.Router();

const uploadDirectory = path.resolve(__dirname, "../../../contracts/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
});

router.post("/", upload.single("contractFile"), createAudit);

router.get("/:auditId", getAudit);

module.exports = router;
