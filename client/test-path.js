import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises"; // Use the fs/promises API for promises-based filesystem operations

// Define __filename and __dirname for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = join(__dirname, "index.html"); // Correctly join paths

// Check if the index file exists
async function checkIndexFile() {
  try {
    await fs.access(indexPath); // Check if the file exists
    console.log("Index file exists at:", indexPath);
  } catch (err) {
    console.error("Index file does not exist:", err);
  }
}

checkIndexFile();
