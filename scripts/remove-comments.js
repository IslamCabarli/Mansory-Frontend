#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const root = path.resolve(__dirname, '..');
const skipDirs = new Set(['node_modules', '.git', 'dist', 'out', 'build']);
const extensions = new Set(['.ts', '.js', '.tsx', '.jsx', '.scss', '.css', '.html']);

function stripHtmlComments(content) {
  return content.replace(/<!--([\s\S]*?)-->/g, '');
}

function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!extensions.has(ext)) return;

  const original = fs.readFileSync(filePath, 'utf8');
  let stripped;

  if (ext === '.html') {
    stripped = stripHtmlComments(original);
  } else {
    try {
      stripped = strip(original);
    } catch (err) {
      console.error(`⚠️  Failed to strip comments in ${filePath}:`, err.message);
      return;
    }
  }

  if (stripped !== original) {
    fs.writeFileSync(filePath, stripped, 'utf8');
    console.log(`✔️  Stripped comments: ${path.relative(root, filePath)}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
    } else if (entry.isFile()) {
      processFile(path.join(dir, entry.name));
    }
  }
}

walk(root);
console.log('✅ Comment removal complete.');
