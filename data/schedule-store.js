const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'schedules.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { schedules: [], nextId: 1, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

function readData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('schedule-store: read error', err);
    return { schedules: [], nextId: 1, lastUpdated: new Date().toISOString() };
  }
}

function writeData(obj) {
  try {
    obj.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
    return true;
  } catch (err) {
    console.error('schedule-store: write error', err);
    return false;
  }
}

function addSchedule(collectionId, scheduledAt, meta = {}) {
  const data = readData();
  const id = data.nextId || 1;
  const entry = Object.assign({
    id: id,
    collectionId,
    scheduledAt,
    createdAt: new Date().toISOString()
  }, meta || {});

  data.schedules = data.schedules || [];
  data.schedules.push(entry);
  data.nextId = id + 1;
  writeData(data);
  return entry;
}

function getAllSchedules(filter = {}) {
  const data = readData();
  let list = (data.schedules || []).slice();
  if (filter.collectionId) list = list.filter(s => String(s.collectionId) === String(filter.collectionId));
  if (filter.date) list = list.filter(s => (s.scheduledAt || '').startsWith(filter.date));
  return list;
}

function deleteSchedule(id) {
  const data = readData();
  const idx = (data.schedules || []).findIndex(s => Number(s.id) === Number(id));
  if (idx === -1) return null;
  const removed = data.schedules.splice(idx, 1)[0];
  writeData(data);
  return removed;
}

module.exports = {
  ensureDataFile,
  addSchedule,
  getAllSchedules,
  deleteSchedule
};
