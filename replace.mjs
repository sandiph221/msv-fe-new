import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory to start searching from (relative to script location)
const rootDir = path.join(__dirname, "src");

// Define the replacements with more comprehensive mappings
const replacements = [
  { from: /@mui\/material/g, to: "@material-ui/core" },
  { from: /@mui\/icons-material/g, to: "@material-ui/icons" },
  { from: /@mui\/styles/g, to: "@material-ui/styles" },
  { from: /@mui\/lab/g, to: "@material-ui/lab" },
  // Additional common import patterns
  {
    from: /import \{([^}]*)\} from ['"]@mui\/material['"];/g,
    to: "import {$1} from '@material-ui/core';",
  },
  {
    from: /import \{([^}]*)\} from ['"]@mui\/icons-material['"];/g,
    to: "import {$1} from '@material-ui/icons';",
  },
  // Handle specific component imports that might have changed paths
  {
    from: /import \{ styled \} from ['"]@mui\/material\/styles['"];/g,
    to: "import { styled } from '@material-ui/core/styles';",
  },
  {
    from: /import \{ ThemeProvider \} from ['"]@mui\/material\/styles['"];/g,
    to: "import { ThemeProvider } from '@material-ui/core/styles';",
  },
];

// Function to process a file with async/await
async function processFile(filePath) {
  const ext = path.extname(filePath);
  if (![".js", ".jsx", ".ts", ".tsx"].includes(ext)) return;

  try {
    let content = await fs.readFile(filePath, "utf8");
    let modified = false;

    replacements.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    if (modified) {
      console.log(`Modified: ${filePath}`);
      await fs.writeFile(filePath, content, "utf8");
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Function to walk through directories using async/await
async function walkDir(dir) {
  try {
    const files = await fs.readdir(dir);

    // Process all files in parallel for better performance
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
          await walkDir(filePath);
        } else {
          await processFile(filePath);
        }
      })
    );
  } catch (error) {
    console.error(`Error walking directory ${dir}:`, error);
  }
}

// Main function to start the process
async function main() {
  console.log(`Starting MUI v5 to v4 migration in ${rootDir}`);
  console.log("This will replace @mui/* imports with @material-ui/* imports");

  try {
    await walkDir(rootDir);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Execute the main function
main();
