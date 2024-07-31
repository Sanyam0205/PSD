const Signature = require("../models/signatureModel");

exports.uploadSignature = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File received:", req.file);

    const filePath = `/assets/${req.file.filename}`;

    console.log("File path:", filePath);

    const signature = new Signature({
      fileName: req.file.originalname,
      filePath: filePath,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    await signature.save();

    res.status(200).json({ filePath });
  } catch (error) {
    console.error("Error in uploadSignature:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};
