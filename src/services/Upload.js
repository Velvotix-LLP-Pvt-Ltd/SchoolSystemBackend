const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const uploadDir = path.join(__dirname, "../utils/users");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();

const upload = multer({ storage });

const compressAndSaveImage = async (req, res, next) => {
  if (!req.file) return next();

  const ext = path.extname(req.file.originalname) || ".jpg";
  const filename = Date.now() + ext;
  const outputPath = path.join(uploadDir, filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 75 })
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.path = outputPath;

    next();
  } catch (err) {
    console.error("Image compression error:", err);
    return res.status(500).json({ error: "Failed to process image" });
  }
};

module.exports = {
  upload,
  compressAndSaveImage,
};
