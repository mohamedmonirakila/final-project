// multerConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.resolve(__dirname, "images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Define storage configuration
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir); // Save files to 'images' folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Generate unique filename
  },
});

export { fileStorage };
// Define file filter (only allow specific file types)
/* const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jfif"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(null, false); // Reject file
  }
};
 */
// Export the configuration
