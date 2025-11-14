#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Simple CLI to export data/schedules.json to CSV
// Usage:
//   node scripts/export-schedules.js              -> writes schedules_export_<ts>.csv in project root
//   node scripts/export-schedules.js out.csv      -> writes to out.csv
//   node scripts/export-schedules.js --id 5 out.csv -> filter by collectionId

function usage() {
  console.log('Usage: node scripts/export-schedules.js [--id COLLECTION_ID] [output.csv]');
}

const args = process.argv.slice(2);
let outFile = null;
let filterId = null;

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--id' || a === '-i') {
    filterId = args[i+1];
    i++;
    continue;
  }
  if (!outFile) outFile = a;
}

const DATA_FILE = path.join(__dirname, '..', 'data', 'schedules.json');

if (!fs.existsSync(DATA_FILE)) {
  console.error('Data file not found:', DATA_FILE);
  process.exit(2);
}

let raw = fs.readFileSync(DATA_FILE, 'utf8');
let json;
try {
  json = JSON.parse(raw);
} catch (err) {
  console.error('Error parsing JSON:', err.message || err);
  process.exit(3);
}

let list = (json.schedules || []).slice();
if (filterId) {
  list = list.filter(s => String(s.collectionId) === String(filterId));
}

if (!list.length) {
  console.log('No schedules to export.');
  process.exit(0);
}

// Collect header fields (union of keys)
const headers = new Set();
list.forEach(item => {
  Object.keys(item).forEach(k => headers.add(k));
  // include meta keys if present
  if (item.meta && typeof item.meta === 'object') {
    Object.keys(item.meta).forEach(k => headers.add(k));
  }
});

const headerArr = Array.from(headers);

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (s.includes(',') || s.includes('\n') || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

const rows = [];
rows.push(headerArr.join(','));

list.forEach(item => {
  const row = headerArr.map(h => {
    if (h in item) return csvEscape(item[h]);
    if (item.meta && (h in item.meta)) return csvEscape(item.meta[h]);
    return '';
  });
  rows.push(row.join(','));
});

if (!outFile) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  outFile = path.join(process.cwd(), `schedules_export_${ts}.csv`);
} else {
  outFile = path.isAbsolute(outFile) ? outFile : path.join(process.cwd(), outFile);
}

fs.writeFileSync(outFile, rows.join('\n'), 'utf8');
console.log('Exported', list.length, 'schedules to', outFile);
