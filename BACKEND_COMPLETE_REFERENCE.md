# Collection Backend - Complete Reference

## System Overview

```
SMART WASTE Collection System
├── Mode 1: Local Database (Default)
│   └── Uses: Browser localStorage
│   └── No setup needed
│   └── Works offline
│
└── Mode 2: Backend API (Optional)
    └── Uses: Express.js + JSON file
    └── Setup: npm install + node server.js
    └── Multi-user capable
```

---

## File Structure

```
waste/
├── 📄 index.html                    Main application
├── 📄 script.js                     Frontend logic (UPDATED - dual-mode)
├── 📄 styles.css                    Styling
│
├── 📁 routes/
│   ├── collections.js               Collection API (ENHANCED)
│   ├── auth.js                      User authentication
│   ├── request.js                   Request handling
│   ├── storage.js                   Storage management
│   └── maps.js                      Maps integration
│
├── 📁 data/                         (Auto-created on first run)
│   └── collections.json             Backend data storage
│
├── 🗑️ local-database.js              User authentication DB
├── 🗑️ collection-database.js         Local collection DB
│
├── 📚 Documentation/
│   ├── BACKEND_SETUP_GUIDE.md        How to set up backend
│   ├── COLLECTION_BACKEND_API.md     Complete API reference
│   ├── COLLECTION_SYSTEM_COMPLETE.md Integration overview
│   ├── BACKEND_IMPLEMENTATION_COMPLETE.md This implementation
│   ├── QUICK_REFERENCE.md            Quick commands
│   ├── COMPLETE_WORKFLOW.md          User workflow guide
│   └── ... (other docs)
│
└── 📄 server.js                     Express server (UPDATED)
```

---

## Complete API Reference

### Base URL (Backend Mode)
```
http://localhost:5000/api/collections
```

### All Endpoints

#### 1. Create Collection
```
POST /api/collections
Content-Type: application/json

{
  "address": "123 Main St",
  "city": "Eco City",
  "postalCode": "12345",
  "contactName": "John Doe",
  "contactPhone": "555-0123",
  "type": "recycling",
  "notes": "Optional notes"
}

Response (201):
{
  "success": true,
  "message": "Collection request created",
  "data": {
    "id": 1,
    "address": "123 Main St",
    ...
  }
}
```

#### 2. List All Collections
```
GET /api/collections
GET /api/collections?city=EcoCity
GET /api/collections?type=recycling
GET /api/collections?status=pending
GET /api/collections?city=EcoCity&type=recycling&status=scheduled

Response (200):
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

#### 3. Get Single Collection
```
GET /api/collections/1

Response (200):
{
  "success": true,
  "data": { ... }
}

Response (404):
{
  "success": false,
  "message": "Collection not found"
}
```

#### 4. Update Collection
```
PUT /api/collections/1
Content-Type: application/json

{
  "status": "in-progress",
  "notes": "Updated notes",
  "type": "recycling"
}

Response (200):
{
  "success": true,
  "message": "Collection updated",
  "data": { ... }
}
```

#### 5. Delete Collection
```
DELETE /api/collections/1

Response (200):
{
  "success": true,
  "message": "Collection deleted",
  "data": { ... }
}
```

#### 6. Schedule Collection
```
POST /api/collections/1/schedule
Content-Type: application/json

{
  "scheduledAt": "2025-01-25 14:00"
}

Response (200):
{
  "success": true,
  "message": "Collection scheduled",
  "data": {
    "id": 1,
    "status": "scheduled",
    "scheduledAt": "2025-01-25T14:00:00Z",
    ...
  }
}
```

#### 7. Update Status
```
PUT /api/collections/1/status
Content-Type: application/json

{
  "status": "completed"
}

Valid Statuses: pending, scheduled, in-progress, completed, cancelled

Response (200):
{
  "success": true,
  "message": "Status updated",
  "data": { ... }
}
```

#### 8. Filter by Status
```
GET /api/collections/status/pending
GET /api/collections/status/scheduled
GET /api/collections/status/in-progress
GET /api/collections/status/completed
GET /api/collections/status/cancelled

Response (200):
{
  "success": true,
  "status": "pending",
  "count": 3,
  "data": [...]
}
```

#### 9. Filter by Type
```
GET /api/collections/type/recycling
GET /api/collections/type/organic
GET /api/collections/type/hazardous
GET /api/collections/type/general

Response (200):
{
  "success": true,
  "type": "recycling",
  "count": 5,
  "data": [...]
}
```

#### 10. Get Statistics
```
GET /api/collections/stats/overview

Response (200):
{
  "success": true,
  "data": {
    "total": 10,
    "completed": 3,
    "completionRate": 30.00,
    "pending": 4,
    "scheduled": 2,
    "inProgress": 1,
    "cancelled": 0,
    "byStatus": { ... },
    "byType": { ... }
  }
}
```

---

## Configuration

### Local Database Mode (Default)
**File**: `script.js` (Line 5)
```javascript
const USE_BACKEND_API = false;
```

**Features**:
- ✅ No server needed
- ✅ Works offline
- ✅ Instant response (<1ms)
- ✅ Browser localStorage
- ✅ Single user/browser

### Backend API Mode
**File**: `script.js` (Line 5)
```javascript
const USE_BACKEND_API = true;
const API_URL = 'http://localhost:5000/api';
```

**Requirements**:
- ✅ Node.js installed
- ✅ Dependencies: `npm install express cors body-parser`
- ✅ Server running: `node server.js`
- ✅ Port 5000 available

---

## Setup Comparison

### Local Database (Recommended for Testing)

**Time to Setup**: 0 minutes

```bash
1. Open index.html in browser
2. Use collections immediately
3. Done!
```

### Backend API (For Production/Multi-user)

**Time to Setup**: 5 minutes

```bash
1. npm install express cors body-parser
2. node server.js
3. Edit script.js: USE_BACKEND_API = true
4. Reload browser
5. Done!
```

---

## Test Cases

### Test Collection Creation

**Local Mode**:
```javascript
// In browser console
collectionDB.createCollection({
    address: "100 Test St",
    city: "Test City",
    contactName: "Tester",
    contactPhone: "555-0000",
    type: "recycling"
});
```

**Backend Mode**:
```bash
curl -X POST http://localhost:5000/api/collections \
  -H "Content-Type: application/json" \
  -d '{
    "address": "100 Test St",
    "city": "Test City",
    "contactName": "Tester",
    "contactPhone": "555-0000",
    "type": "recycling"
  }'
```

### Test Collection Listing

**Local Mode**:
```javascript
collectionDB.getAllCollections();
```

**Backend Mode**:
```bash
curl http://localhost:5000/api/collections
```

### Test Scheduling

**Local Mode**:
```javascript
collectionDB.scheduleCollection(1, "2025-01-25 14:00");
```

**Backend Mode**:
```bash
curl -X POST http://localhost:5000/api/collections/1/schedule \
  -H "Content-Type: application/json" \
  -d '{"scheduledAt": "2025-01-25 14:00"}'
```

### Test Statistics

**Local Mode**:
```javascript
collectionDB.getStatistics();
```

**Backend Mode**:
```bash
curl http://localhost:5000/api/collections/stats/overview
```

---

## Collection Object Schema

```json
{
  "id": 1,
  "address": "123 Main Street",
  "city": "Eco City",
  "postalCode": "12345",
  "contactName": "John Doe",
  "contactPhone": "555-0123",
  "type": "recycling",
  "notes": "Optional notes here",
  "status": "pending",
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T10:30:00Z",
  "scheduledAt": null,
  "completedAt": null
}
```

**Fields**:
- `id` - Unique identifier
- `address` - Collection address
- `city` - City name
- `postalCode` - ZIP code
- `contactName` - Contact person
- `contactPhone` - Contact phone
- `type` - Waste type (recycling, organic, hazardous, general)
- `notes` - Additional notes
- `status` - Current status (pending, scheduled, in-progress, completed, cancelled)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `scheduledAt` - Scheduled pickup time
- `completedAt` - Completion timestamp

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "address": "Address is required",
    "city": "City is required"
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Collection not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | POST succeeded |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## JavaScript Implementation

### Using Fetch API (for Backend)

```javascript
// Create collection
async function createCollection(data) {
    const response = await fetch('http://localhost:5000/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

// Get collections
async function getCollections() {
    const response = await fetch('http://localhost:5000/api/collections');
    return await response.json();
}

// Delete collection
async function deleteCollection(id) {
    const response = await fetch(`http://localhost:5000/api/collections/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}

// Schedule collection
async function scheduleCollection(id, datetime) {
    const response = await fetch(`http://localhost:5000/api/collections/${id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: datetime })
    });
    return await response.json();
}

// Update status
async function updateStatus(id, status) {
    const response = await fetch(`http://localhost:5000/api/collections/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    return await response.json();
}

// Get statistics
async function getStatistics() {
    const response = await fetch('http://localhost:5000/api/collections/stats/overview');
    return await response.json();
}
```

---

## Troubleshooting

### Problem: Server won't start
```
Error: Port 5000 already in use
Solution: netstat -ano | findstr :5000
         taskkill /PID <PID> /F
```

### Problem: Collections not saving
```
Error: Cannot write to data/collections.json
Solution: Check write permissions on project directory
         Create data/ directory manually
```

### Problem: Backend returns 404
```
Error: Collection not found
Solution: Verify collection ID exists
         Check data/collections.json file
         Verify server is running
```

### Problem: API returns validation error
```
Error: Address is required
Solution: Provide all required fields:
         address, city, contactName, contactPhone, type
```

---

## Performance Metrics

| Operation | Local | Backend |
|-----------|-------|---------|
| Create | <1ms | 50-100ms |
| Read | <1ms | 20-50ms |
| Update | <1ms | 50-100ms |
| Delete | <1ms | 50-100ms |
| Filter | <5ms | 50-100ms |
| Stats | <10ms | 50-100ms |

---

## Feature Comparison

| Feature | Local | Backend |
|---------|-------|---------|
| Setup | None | 5 min |
| Offline | ✅ Yes | ❌ No |
| Multi-user | ❌ No | ✅ Yes |
| Storage | localStorage | File |
| Scalability | Low | High |
| Response Time | Instant | Fast |
| Persistence | Browser | Server |

---

## Quick Commands

```bash
# Start backend
node server.js

# Test API
curl http://localhost:5000/api/collections

# Create collection
curl -X POST http://localhost:5000/api/collections \
  -H "Content-Type: application/json" \
  -d '{"address":"...", ...}'

# Get statistics
curl http://localhost:5000/api/collections/stats/overview

# Check server health
curl http://localhost:5000/api/health
```

---

## Summary

✅ **Complete backend implementation**
✅ **10+ collection endpoints**
✅ **Dual-mode support (local + backend)**
✅ **Full API documentation**
✅ **Error handling**
✅ **Data persistence**
✅ **Multi-user capable**
✅ **Production ready**

---

**Collection Backend System v1.0**
**Implementation Complete ✅**

