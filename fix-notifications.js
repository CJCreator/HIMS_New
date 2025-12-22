const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

// Validate path is within project boundaries
function validatePath(targetPath, projectRoot) {
  const normalized = path.normalize(targetPath);
  const resolved = path.resolve(normalized);
  const normalizedRoot = path.normalize(projectRoot);
  
  // Ensure resolved path starts with project root (handles Windows paths)
  if (!resolved.startsWith(normalizedRoot)) {
    throw new Error('Path traversal attempt detected');
  }
  return resolved;
}

// Function to recursively find all TypeScript files (async)
async function findTsFiles(dir, files = [], projectRoot = path.resolve(__dirname)) {
  const validatedDir = validatePath(dir, projectRoot);
  
  try {
    const items = await fs.readdir(validatedDir);
    
    await Promise.all(items.map(async (item) => {
      try {
        const fullPath = path.join(validatedDir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
          await findTsFiles(fullPath, files, projectRoot);
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          files.push(fullPath);
        }
      } catch (err) {
        console.error(`Error processing ${item}:`, err.message);
      }
    }));
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

// Function to escape special characters for safe string interpolation
function escapeString(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

// Function to fix notification calls with improved regex
function fixNotificationCalls(content) {
  if (!content || typeof content !== 'string') {
    return content;
  }
  
  // More flexible pattern with optional whitespace
  const pattern = /dispatch\(addNotification\(\{\s*type:\s*['"]([\w]+)['"],\s*title:\s*['"`]([^'"`]+)['"`],\s*message:\s*['"`]([^'"`]+)['"`]\s*\}\)\);/g;
  
  try {
    return content.replace(pattern, (match, type, title, message) => {
      try {
        if (!type || !title || !message) {
          return match;
        }
        
        const priority = type === 'error' ? 'urgent' : 'medium';
        const category = 'system';
        
        // Escape strings to prevent syntax errors
        const safeTitle = escapeString(title);
        const safeMessage = escapeString(message);
        
        return `dispatch(addNotification({
      type: '${type}',
      title: '${safeTitle}',
      message: '${safeMessage}',
      priority: '${priority}',
      category: '${category}'
    }));`;
      } catch (error) {
        console.error('Error processing match:', error.message);
        return match;
      }
    });
  } catch (error) {
    console.error('Error in regex replacement:', error.message);
    return content;
  }
}

// Main execution (async)
(async () => {
  try {
    const projectRoot = path.resolve(__dirname);
    const srcDir = path.join(projectRoot, 'src');
    
    // Validate src directory exists
    if (!fsSync.existsSync(srcDir)) {
      console.error('Source directory not found:', srcDir);
      process.exit(1);
    }
    
    const files = await findTsFiles(srcDir, [], projectRoot);
    console.log(`Found ${files.length} TypeScript files`);

    let fixedCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const fixedContent = fixNotificationCalls(content);
        
        if (content !== fixedContent) {
          await fs.writeFile(file, fixedContent, 'utf8');
          fixedCount++;
          console.log(`✓ Fixed: ${path.relative(projectRoot, file)}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`✗ Error processing ${path.relative(projectRoot, file)}:`, error.message);
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Files processed: ${files.length}`);
    console.log(`Files fixed: ${fixedCount}`);
    console.log(`Errors: ${errorCount}`);
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
})();