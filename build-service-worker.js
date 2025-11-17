#!/usr/bin/env node

/**
 * Build script for bundling the service worker for Manifest V3
 *
 * This script creates scripts/service_worker.js by bundling:
 * - dayjs.min.js (date/time library)
 * - common.js (shared utilities)
 * - background.js (main background logic)
 */

const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');
const outputFile = path.join(scriptsDir, 'service_worker.js');

// Files to bundle in order
const filesToBundle = [
  path.join(scriptsDir, 'dayjs.min.js'),
  path.join(scriptsDir, 'common.js'),
  path.join(scriptsDir, 'background.js')
];

console.log('Building service worker...');

try {
  // Read all files
  const contents = filesToBundle.map(file => {
    console.log(`  Reading: ${path.basename(file)}`);
    const content = fs.readFileSync(file, 'utf8');
    return `// ====== ${path.basename(file)} ======\n${content}\n`;
  });

  // Combine with separators
  const bundled = contents.join('\n');

  // Write output
  fs.writeFileSync(outputFile, bundled, 'utf8');

  console.log(`✓ Service worker built: ${path.basename(outputFile)}`);
  console.log(`  Output: ${outputFile}`);
  console.log(`  Size: ${(bundled.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('Error building service worker:', error);
  process.exit(1);
}
