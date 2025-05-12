import fs from "fs/promises";
import path from "path";

const targetFolder = path.join(process.cwd(), "src");
let totalCount = 0;
let fileMatchCount = 0;

// Function to recursively walk through directories
async function walk(dir, fileCallback) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await walk(fullPath, fileCallback);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      await fileCallback(fullPath);
    }
  }
}

// Function to replace the imports in a given file
async function replaceImportsInFile(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  let updatedContent = content;
  let count = 0;

  // Regex to find @mui/icons-material imports
  const iconImportRegex =
    /from\s+['"]@mui\/icons-material\/([a-zA-Z0-9]+)['"]/g;
  let match;

  while ((match = iconImportRegex.exec(content)) !== null) {
    const iconName = match[1];
    const replacement = `@material-ui/icons/${iconName}`;
    updatedContent = updatedContent.replace(match[0], `from '${replacement}'`);
    count++;
  }

  if (count > 0) {
    fileMatchCount++;
    totalCount += count;
    await fs.writeFile(filePath, updatedContent, "utf-8");
    console.log(`Replaced ${count} imports in: ${filePath}`);
  }
}

// Main function to replace imports in all files
async function replaceImports() {
  try {
    await walk(targetFolder, replaceImportsInFile);

    console.log(`Total files modified: ${fileMatchCount}`);
    console.log(`Total replacements made: ${totalCount}`);
  } catch (error) {
    console.error("Error during processing:", error);
  }
}

// Execute the replacement
replaceImports();
