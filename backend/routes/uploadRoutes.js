// backend/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const { uploadSignature } = require("../controllers/uploadController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('signature'), uploadSignature);

module.exports = router;
