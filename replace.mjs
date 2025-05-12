import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory to start searching from (relative to script location)
const rootDir = path.join(__dirname, "src");

// Define the replacements for withRouter
const replacements = [
  // Remove the withRouter import
  {
    from: /import\s*{\s*withRouter\s*}\s*from\s*['"]react-router-dom['"];\s*/g,
    to: "",
  },
  // Remove withRouter from multiple imports
  {
    from: /import\s*{([^}]*)withRouter,([^}]*)}\s*from\s*['"]react-router-dom['"];\s*/g,
    to: 'import {$1$2} from "react-router-dom";\n',
  },
  // Remove withRouter when it wraps an exported component
  {
    from: /export\s+default\s+withRouter\s*\(\s*(\w+)\s*\)\s*;/g,
    to: "export default $1;",
  },
  // Remove withRouter when it's the last item in an import list
  {
    from: /import\s*{([^}]*),\s*withRouter\s*}\s*from\s*['"]react-router-dom['"];\s*/g,
    to: 'import {$1} from "react-router-dom";\n',
  },
  // Handle case where withRouter might be used inline with export
  {
    from: /export\s+default\s+withRouter\s*\(\s*/g,
    to: "export default (",
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
  console.log(`Starting withRouter removal in ${rootDir}`);
  console.log("This will remove withRouter imports and usages from all files");

  try {
    await walkDir(rootDir);
    console.log("withRouter removal completed successfully!");
  } catch (error) {
    console.error("withRouter removal failed:", error);
    process.exit(1);
  }
}

// Execute the main function
main();
