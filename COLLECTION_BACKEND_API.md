# Collection Backend API Documentation

## Base URL
```
http://localhost:5000/api/collections
```

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all collections with optional filters |
| GET | `/:id` | Get single collection by ID |
| POST | `/` | Create new collection request |
| PUT | `/:id` | Update collection details |
| DELETE | `/:id` | Delete collection |
| POST | `/:id/schedule` | Schedule collection pickup |
| PUT | `/:id/status` | Update collection status |
| GET | `/status/:status` | Get collections by status |
| GET | `/type/:type` | Get collections by waste type |
| GET | `/stats/overview` | Get collection statistics |

---

## Detailed Endpoint Documentation

### 1. List All Collections
**GET** `/api/collections`

Query Parameters (all optional):
- `city` (string) - Filter by city name
- `type` (string) - Filter by waste type (recycling, organic, hazardous, general)
- `status` (string) - Filter by status (pending, scheduled, in-progress, completed, cancelled)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
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
  ]
}
```

**Example Requests:**
```bash
# Get all collections
curl http://localhost:5000/api/collections

# Filter by city
curl "http://localhost:5000/api/collections?city=Eco%20City"

# Filter by type
curl "http://localhost:5000/api/collections?type=recycling"

# Filter by status
curl "http://localhost:5000/api/collections?status=pending"

# Multiple filters
curl "http://localhost:5000/api/collections?city=Eco%20City&type=recycling&status=scheduled"
```

---

### 2. Get Single Collection
**GET** `/api/collections/:id`

Parameters:
- `id` (integer) - Collection ID

**Response:**
```json
{
  "success": true,
  "data": {
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
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Collection not found"
}
```

**Example:**
```bash
curl http://localhost:5000/api/collections/1
```

---

### 3. Create New Collection Request
**POST** `/api/collections`

**Request Body (JSON):**
```json
{
  "address": "123 Main Street",
  "city": "Eco City",
  "postalCode": "12345",
  "contactName": "John Doe",
  "contactPhone": "555-0123",
  "type": "recycling",
  "notes": "Plastic and paper only"
}
```

**Required Fields:**
- address
- city
- contactName
- contactPhone
- type (one of: recycling, organic, hazardous, general)

**Optional Fields:**
- postalCode
- notes

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Collection request created",
  "data": {
    "id": 1,
    "address": "123 Main Street",
    "city": "Eco City",
    "postalCode": "12345",
    "contactName": "John Doe",
    "contactPhone": "555-0123",
    "type": "recycling",
    "notes": "Plastic and paper only",
    "status": "pending",
    "createdAt": "2025-01-20T10:30:00Z",
    "scheduledAt": null
  }
}
```

**Error Response (400 - Validation):**
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

**Example:**
```bash
curl -X POST http://localhost:5000/api/collections \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main Street",
    "city": "Eco City",
    "contactName": "John Doe",
    "contactPhone": "555-0123",
    "type": "recycling",
    "notes": "Plastic and paper"
  }'
```

---

### 4. Update Collection
**PUT** `/api/collections/:id`

**Request Body (JSON):**
```json
{
  "status": "in-progress",
  "notes": "Updated notes",
  "type": "recycling"
}
```

**Updatable Fields:**
- status
- notes
- type

**Response:**
```json
{
  "success": true,
  "message": "Collection updated",
  "data": {
    "id": 1,
    "address": "123 Main Street",
    "city": "Eco City",
    "postalCode": "12345",
    "contactName": "John Doe",
    "contactPhone": "555-0123",
    "type": "recycling",
    "notes": "Updated notes",
    "status": "in-progress",
    "createdAt": "2025-01-20T10:30:00Z",
    "scheduledAt": null,
    "updatedAt": "2025-01-20T11:00:00Z"
  }
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/collections/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "notes": "Driver en route"
  }'
```

---

### 5. Delete Collection
**DELETE** `/api/collections/:id`

**Response:**
```json
{
  "success": true,
  "message": "Collection deleted",
  "data": {
    "id": 1,
    "address": "123 Main Street",
    "city": "Eco City",
    "contactName": "John Doe",
    "type": "recycling",
    "status": "pending"
  }
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/collections/1
```

---

### 6. Schedule Collection Pickup
**POST** `/api/collections/:id/schedule`

**Request Body (JSON):**
```json
{
  "scheduledAt": "2025-01-25 14:00"
}
```

**Parameters:**
- `scheduledAt` (required) - Date and time for pickup (ISO format or YYYY-MM-DD HH:MM)

**Response:**
```json
{
  "success": true,
  "message": "Collection scheduled",
  "data": {
    "id": 1,
    "address": "123 Main Street",
    "city": "Eco City",
    "contactName": "John Doe",
    "type": "recycling",
    "status": "scheduled",
    "scheduledAt": "2025-01-25T14:00:00Z",
    "updatedAt": "2025-01-20T10:35:00Z"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/collections/1/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledAt": "2025-01-25 14:00"
  }'
```

---

### 7. Update Collection Status
**PUT** `/api/collections/:id/status`

**Request Body (JSON):**
```json
{
  "status": "in-progress"
}
```

**Valid Statuses:**
- `pending` - New collection request
- `scheduled` - Pickup scheduled
- `in-progress` - Pickup in progress
- `completed` - Pickup completed (sets completedAt timestamp)
- `cancelled` - Pickup cancelled

**Response:**
```json
{
  "success": true,
  "message": "Status updated",
  "data": {
    "id": 1,
    "address": "123 Main Street",
    "status": "in-progress",
    "updatedAt": "2025-01-25T14:00:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid status. Valid statuses: pending, scheduled, in-progress, completed, cancelled"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/collections/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

---

### 8. Get Collections by Status
**GET** `/api/collections/status/:status`

Parameters:
- `status` (string) - Status filter (pending, scheduled, in-progress, completed, cancelled)

**Response:**
```json
{
  "success": true,
  "status": "pending",
  "count": 3,
  "data": [
    {
      "id": 1,
      "address": "123 Main Street",
      "city": "Eco City",
      "type": "recycling",
      "status": "pending",
      "createdAt": "2025-01-20T10:30:00Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/collections/status/pending
curl http://localhost:5000/api/collections/status/scheduled
curl http://localhost:5000/api/collections/status/completed
```

---

### 9. Get Collections by Waste Type
**GET** `/api/collections/type/:type`

Parameters:
- `type` (string) - Waste type (recycling, organic, hazardous, general)

**Response:**
```json
{
  "success": true,
  "type": "recycling",
  "count": 5,
  "data": [
    {
      "id": 1,
      "address": "123 Main Street",
      "type": "recycling",
      "status": "pending"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/collections/type/recycling
curl http://localhost:5000/api/collections/type/organic
curl http://localhost:5000/api/collections/type/hazardous
curl http://localhost:5000/api/collections/type/general
```

---

### 10. Get Collection Statistics
**GET** `/api/collections/stats/overview`

**Response:**
```json
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
    "byStatus": {
      "pending": 4,
      "scheduled": 2,
      "in-progress": 1,
      "completed": 3,
      "cancelled": 0
    },
    "byType": {
      "recycling": 5,
      "organic": 3,
      "hazardous": 1,
      "general": 1
    }
  }
}
```

**Example:**
```bash
curl http://localhost:5000/api/collections/stats/overview
```

---

## Error Handling

All endpoints follow a consistent error response format:

**400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fieldName": "Error message"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Collection not found"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Collection Object Structure

```json
{
  "id": 1,
  "address": "123 Main Street",
  "city": "Eco City",
  "postalCode": "12345",
  "contactName": "John Doe",
  "contactPhone": "555-0123",
  "type": "recycling",
  "notes": "Optional notes",
  "status": "pending",
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T10:30:00Z",
  "scheduledAt": null,
  "completedAt": null
}
```

**Fields:**
- `id` (integer) - Unique collection ID
- `address` (string) - Collection address
- `city` (string) - City name
- `postalCode` (string) - Postal/ZIP code
- `contactName` (string) - Contact person name
- `contactPhone` (string) - Contact phone number
- `type` (string) - Waste type (recycling, organic, hazardous, general)
- `notes` (string) - Additional notes
- `status` (string) - Current status
- `createdAt` (ISO string) - Creation timestamp
- `updatedAt` (ISO string) - Last update timestamp
- `scheduledAt` (ISO string) - Scheduled pickup time
- `completedAt` (ISO string) - Completion timestamp

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Data Persistence

All collections are persisted to:
```
data/collections.json
```

The file is automatically created in the data directory on first run.

---

## Usage Example (JavaScript/Fetch)

```javascript
// Create collection
const response = await fetch('http://localhost:5000/api/collections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    address: '123 Main St',
    city: 'Eco City',
    contactName: 'John Doe',
    contactPhone: '555-0123',
    type: 'recycling'
  })
});
const data = await response.json();
console.log('Created:', data.data.id);

// Get all collections
const allResponse = await fetch('http://localhost:5000/api/collections');
const allData = await allResponse.json();
console.log('Total collections:', allData.count);

// Schedule pickup
const scheduleResponse = await fetch('http://localhost:5000/api/collections/1/schedule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    scheduledAt: '2025-01-25 14:00'
  })
});

// Get statistics
const statsResponse = await fetch('http://localhost:5000/api/collections/stats/overview');
const stats = await statsResponse.json();
console.log('Completion rate:', stats.data.completionRate + '%');
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install express cors body-parser
```

### 2. Start Server
```bash
node server.js
```

Server will run on: `http://localhost:5000`

### 3. Test Endpoints
Use curl, Postman, or your frontend to test the endpoints above.

---

**Status**: ✅ Complete Backend API
**Version**: 1.0
**Last Updated**: 2025-01-14

