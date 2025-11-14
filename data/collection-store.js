const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'collections.json');
const LOCK_FILE = path.join(__dirname, 'collections.lock');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { collections: [], nextId: 1, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

function readData() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('collection-store: read error', err);
    return { collections: [], nextId: 1, lastUpdated: new Date().toISOString() };
  }
}

function writeData(obj) {
  try {
    obj.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
    return true;
  } catch (err) {
    console.error('collection-store: write error', err);
    return false;
  }
}

function getAllCollections({ city, type, status } = {}) {
  const data = readData();
  let list = data.collections || [];
  if (city) list = list.filter(c => (c.city || '').toLowerCase().includes(String(city).toLowerCase()));
  if (type) list = list.filter(c => (c.type || '').toLowerCase() === String(type).toLowerCase());
  if (status) list = list.filter(c => (c.status || '') === status);
  return list;
}

function getCollectionById(id) {
  const data = readData();
  return (data.collections || []).find(c => Number(c.id) === Number(id));
}

function createCollection(payload) {
  const data = readData();
  const id = data.nextId || 1;
  const confirmationNumber = `WM-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(id).padStart(5,'0')}`;
  const now = new Date().toISOString();
  const newCollection = Object.assign({
    id: id,
    confirmationNumber,
    address: '',
    city: '',
    postalCode: '',
    contactName: '',
    contactPhone: '',
    type: 'general',
    notes: '',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    scheduledAt: null,
    completedAt: null
  }, payload || {});

  data.collections = data.collections || [];
  data.collections.push(newCollection);
  data.nextId = id + 1;
  writeData(data);
  return newCollection;
}

function updateCollection(id, changes) {
  const data = readData();
  const idx = (data.collections || []).findIndex(c => Number(c.id) === Number(id));
  if (idx === -1) return null;
  const collection = data.collections[idx];
  Object.assign(collection, changes);
  collection.updatedAt = new Date().toISOString();
  if (changes.status === 'completed') collection.completedAt = new Date().toISOString();
  data.collections[idx] = collection;
  writeData(data);
  return collection;
}

function deleteCollection(id) {
  const data = readData();
  const idx = (data.collections || []).findIndex(c => Number(c.id) === Number(id));
  if (idx === -1) return null;
  const deleted = data.collections.splice(idx, 1)[0];
  writeData(data);
  return deleted;
}

function scheduleCollection(id, scheduledAt) {
  return updateCollection(id, { scheduledAt, status: 'scheduled' });
}

function getCollectionsByStatus(status) {
  return getAllCollections({ status });
}

function getCollectionsByType(type) {
  return getAllCollections({ type });
}

function getStatsOverview() {
  const data = readData();
  const collections = data.collections || [];
  const total = collections.length;
  const byStatus = {};
  const byType = {};
  collections.forEach(c => {
    const s = c.status || 'pending';
    const t = c.type || 'general';
    byStatus[s] = (byStatus[s] || 0) + 1;
    byType[t] = (byType[t] || 0) + 1;
  });
  const completed = byStatus.completed || 0;
  const completionRate = total > 0 ? (completed / total * 100) : 0;
  return {
    total,
    byStatus,
    byType,
    completed,
    completionRate: parseFloat(completionRate.toFixed(2)),
    pending: byStatus.pending || 0,
    scheduled: byStatus.scheduled || 0,
    inProgress: byStatus['in-progress'] || 0,
    cancelled: byStatus.cancelled || 0
  };
}

module.exports = {
  ensureDataFile,
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  scheduleCollection,
  getCollectionsByStatus,
  getCollectionsByType,
  getStatsOverview
};
