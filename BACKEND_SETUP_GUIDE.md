# Backend Setup Guide for Collection System

## Overview

The SMART WASTE collection system now has a **complete Express.js backend** that can be used alongside or instead of the local JSON database.

## Two Modes of Operation

### Mode 1: Local Database Only (Default)
- ✅ **No backend required**
- ✅ All data stored in browser localStorage
- ✅ Works completely offline
- ✅ Instant operations (<1ms)
- ✅ Perfect for demos and prototypes

**Configuration in script.js:**
```javascript
const USE_BACKEND_API = false;  // Local database mode
```

### Mode 2: Backend API with Express.js
- ✅ **Server-based** collection management
- ✅ All data stored on server (data/collections.json)
- ✅ Multi-user capable
- ✅ Centralized data management
- ✅ Better for production

**Configuration in script.js:**
```javascript
const USE_BACKEND_API = true;  // Backend API mode
const API_URL = 'http://localhost:5000/api';
```

---

## Backend Setup Instructions

### Prerequisites
- Node.js (v12 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
cd c:\Users\hp\Desktop\waste
npm install express cors body-parser
```

Or install all at once:
```bash
npm install express cors body-parser twilio dotenv bcryptjs sqlite3
```

### Step 2: Start the Backend Server

```bash
node server.js
```

You should see:
```
SMART WASTE OTP Server running on http://localhost:5000
Make sure to set Twilio credentials in .env file
```

### Step 3: Enable Backend in Application

Edit `script.js` and set:
```javascript
const USE_BACKEND_API = true;  // Changed from false
```

### Step 4: Reload Application

Open `index.html` in browser and test collection features.

---

## Backend Endpoints

### Base URL
```
http://localhost:5000/api/collections
```

### Main Endpoints

#### Create Collection
```bash
POST /api/collections
Content-Type: application/json

{
  "address": "123 Main Street",
  "city": "Eco City",
  "contactName": "John Doe",
  "contactPhone": "555-0123",
  "type": "recycling",
  "notes": "Optional notes"
}
```

#### Get All Collections
```bash
GET /api/collections
GET /api/collections?city=EcoCity
GET /api/collections?type=recycling
GET /api/collections?status=pending
```

#### Get Single Collection
```bash
GET /api/collections/:id
```

#### Update Collection
```bash
PUT /api/collections/:id
Content-Type: application/json

{
  "status": "in-progress",
  "notes": "Updated notes"
}
```

#### Delete Collection
```bash
DELETE /api/collections/:id
```

#### Schedule Collection
```bash
POST /api/collections/:id/schedule
Content-Type: application/json

{
  "scheduledAt": "2025-01-25 14:00"
}
```

#### Update Status
```bash
PUT /api/collections/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

#### Get Statistics
```bash
GET /api/collections/stats/overview
```

---

## Data Storage

### Backend Storage Location
```
data/collections.json
```

This file is automatically created in the project directory on first collection.

### File Structure
```json
{
  "collections": [
    {
      "id": 1,
      "address": "123 Main Street",
      "city": "Eco City",
      "postalCode": "12345",
      "contactName": "John Doe",
      "contactPhone": "555-0123",
      "type": "recycling",
      "notes": "Plastic and paper",
      "status": "pending",
      "createdAt": "2025-01-20T10:30:00Z",
      "scheduledAt": null,
      "updatedAt": "2025-01-20T10:30:00Z"
    }
  ],
  "nextId": 2,
  "lastUpdated": "2025-01-20T10:30:00Z"
}
```

---

## Testing Backend Endpoints

### Using curl

```bash
# Create collection
curl -X POST http://localhost:5000/api/collections \
  -H "Content-Type: application/json" \
  -d '{
    "address": "456 Oak Ave",
    "city": "Green City",
    "contactName": "Jane Smith",
    "contactPhone": "555-9876",
    "type": "organic"
  }'

# Get all collections
curl http://localhost:5000/api/collections

# Get single collection
curl http://localhost:5000/api/collections/1

# Schedule collection
curl -X POST http://localhost:5000/api/collections/1/schedule \
  -H "Content-Type: application/json" \
  -d '{"scheduledAt": "2025-01-25 14:00"}'

# Update status
curl -X PUT http://localhost:5000/api/collections/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'

# Get statistics
curl http://localhost:5000/api/collections/stats/overview

# Delete collection
curl -X DELETE http://localhost:5000/api/collections/1
```

### Using Postman

1. **Import Collection**:
   - Open Postman
   - Click "Import"
   - Import from URL or file
   - Use the endpoints above

2. **Set Environment Variables**:
   - Base URL: `http://localhost:5000/api`

3. **Test Each Endpoint**:
   - Click "Send" on each request
   - View responses in the bottom panel

---

## Switching Between Modes

### Local Database Mode (Default)
**File**: `script.js` (Line 5)
```javascript
const USE_BACKEND_API = false;
```
- No server needed
- Works offline
- Instant response

### Backend API Mode
**File**: `script.js` (Line 5)
```javascript
const USE_BACKEND_API = true;
```
- Start server: `node server.js`
- Requires port 5000
- Server-based storage

---

## Collection Statuses

The system supports the following collection statuses:

| Status | Description |
|--------|-------------|
| pending | New collection request (default) |
| scheduled | Pickup scheduled for specific time |
| in-progress | Pickup currently in progress |
| completed | Pickup completed (sets completedAt) |
| cancelled | Pickup cancelled |

---

## Waste Types

Supported waste types for collections:

| Type | Description |
|------|-------------|
| recycling | Plastic, paper, metals |
| organic | Food waste, yard waste |
| hazardous | Chemicals, batteries, e-waste |
| general | General household waste |

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "address": "...",
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "fieldName": "Error message"
  }
}
```

---

## Troubleshooting

### Server Won't Start
**Error**: `Port 5000 already in use`

**Solution**: 
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual PID)
taskkill /PID <PID> /F

# Or use different port by modifying server.js
```

### Backend Connection Failed
**Error**: `Backend error. Server running?`

**Solution**:
1. Check if server is running: `node server.js`
2. Verify port 5000 is open
3. Check firewall settings
4. Verify `USE_BACKEND_API = true` in script.js

### Collections Not Saving
**Error**: `Cannot write to data/collections.json`

**Solution**:
1. Create `data/` directory manually
2. Check file permissions
3. Ensure write access to project directory

### API Returns 404
**Error**: `Collection not found`

**Solution**:
1. Verify collection ID is correct
2. Check data/collections.json file exists
3. Server may have restarted (data is persisted)

---

## Performance Comparison

| Metric | Local DB | Backend API |
|--------|----------|------------|
| Create | <1ms | 50-100ms |
| Read | <1ms | 10-50ms |
| Update | <1ms | 50-100ms |
| Delete | <1ms | 50-100ms |
| Offline Support | ✅ Yes | ❌ No |
| Multi-user | ❌ No | ✅ Yes |
| Scalability | Low | High |

---

## Production Deployment

For production use of the backend:

1. **Use a Database**:
   - Replace JSON file storage with SQLite/PostgreSQL/MongoDB
   - Modify `routes/collections.js` to use database queries

2. **Add Authentication**:
   - Implement API key authentication
   - Add JWT tokens for user sessions

3. **Add Authorization**:
   - Restrict collections to specific users
   - Role-based access control

4. **Use HTTPS**:
   - Set up SSL/TLS certificates
   - Use environment variables for secrets

5. **Deploy to Production Server**:
   - Use PM2 or systemd for process management
   - Set up reverse proxy (nginx)
   - Configure firewall rules

---

## Example: Complete Workflow with Backend

### 1. Start Server
```bash
node server.js
```

### 2. Enable Backend in Script
Edit `script.js`:
```javascript
const USE_BACKEND_API = true;
```

### 3. Open Application
```
Open index.html in browser
```

### 4. Submit Collection
- Fill form with:
  - Address: "789 Pine Road"
  - City: "Waste City"
  - Contact: "Mike Johnson"
  - Phone: "555-5555"
  - Type: "hazardous"

- Click "Submit Request"
- See confirmation with ID

### 5. View Collections
- Collections list updates automatically
- Shows all stored collections

### 6. Schedule Collection
- Click "Schedule" button
- Enter date: `2025-01-26 10:00`
- Status updates to "scheduled"

### 7. Check Backend Data
- Open: `data/collections.json`
- See persisted data

---

## Files Involved

| File | Purpose |
|------|---------|
| **server.js** | Main Express server (updated to use /api/collections) |
| **routes/collections.js** | Collection CRUD endpoints (enhanced with stats) |
| **script.js** | Frontend logic (updated to support both modes) |
| **index.html** | Frontend UI (uses both modes) |
| **data/collections.json** | Backend data storage (auto-created) |

---

## API Documentation

For complete API documentation, see:
- **[COLLECTION_BACKEND_API.md](COLLECTION_BACKEND_API.md)**

Contains:
- All endpoint details
- Request/response examples
- Error handling
- Usage examples
- HTTP status codes

---

## Summary

| Feature | Local DB | Backend |
|---------|----------|---------|
| Setup | None | `npm install`, `node server.js` |
| Data Storage | localStorage | data/collections.json |
| Configuration | `USE_BACKEND_API = false` | `USE_BACKEND_API = true` |
| Performance | Fastest | Fast |
| Offline Support | Yes | No |
| Multi-user | No | Yes |
| Scalability | Low | High |

**Choose the mode that fits your needs:**
- **Development/Testing**: Local DB mode
- **Production/Multi-user**: Backend API mode

---

**Status**: ✅ Backend Setup Complete
**Version**: 1.0
**Last Updated**: 2025-01-14

