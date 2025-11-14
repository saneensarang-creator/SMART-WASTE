# Collection Database Integration Guide

## Overview
The collection system has been fully migrated to use a **local JSON database** stored in browser localStorage. No backend server is required.

## What Changed

### Before (API-Based)
- Used fetch calls to backend API endpoints: `/api/collect`, `/api/request`, etc.
- Fallback storage to localStorage if backend failed
- Required running Node.js backend server on port 5000

### After (Local Database)
- All collection data stored directly in localStorage key `smartwaste_collections`
- No API calls needed
- Completely client-side, offline-capable
- No backend server required

## Integration Points

### 1. Collection Form Submission
**File**: `script.js` (lines 269-300)

```javascript
function submitCollectionForm(e) {
    // Collects form data and calls:
    const result = collectionDB.createCollection(payload);
    // Returns: { id, confirmationNumber, status, createdAt }
}
```

**Data Stored**:
- address, city, postalCode
- contactName, contactPhone
- type (recycling, organic, hazardous, general)
- notes
- Auto-generated: id, confirmationNumber, status, createdAt, updatedAt

### 2. Loading Collections
**File**: `script.js` (lines 302-312)

```javascript
function loadCollections() {
    const collections = collectionDB.getAllCollections();
    renderCollections(collections);
}
```

**Returns**: Array of all non-deleted collection objects

### 3. Deleting Collections
**File**: `script.js` (lines 334-343)

```javascript
function deleteCollection(id) {
    collectionDB.deleteCollection(id);
    loadCollections();
}
```

**Behavior**: Soft delete (marks as inactive, doesn't remove from storage)

### 4. Scheduling Collections
**File**: `script.js` (lines 345-358)

```javascript
function scheduleCollection(id) {
    const datetime = prompt(...);
    collectionDB.scheduleCollection(id, datetime);
    loadCollections();
}
```

**Behavior**: Updates status to "scheduled" and stores scheduledAt timestamp

## Database API Reference

### Core Methods

#### `createCollection(data)`
Creates a new collection request.

**Parameters**:
```javascript
{
    address: string (required),
    city: string (required),
    postalCode: string,
    contactName: string (required),
    contactPhone: string (required),
    type: string (required) - one of: recycling, organic, hazardous, general
    notes: string
}
```

**Returns**:
```javascript
{
    id: string (UUID),
    confirmationNumber: string,
    status: "pending",
    createdAt: ISO string,
    updatedAt: ISO string
}
```

#### `getAllCollections()`
Gets all active (non-deleted) collections.

**Returns**: Array of collection objects

#### `getCollectionsByStatus(status)`
Filter collections by status.

**Valid Statuses**: pending, scheduled, in-progress, completed, cancelled

#### `getCollectionsByType(type)`
Filter collections by waste type.

**Valid Types**: recycling, organic, hazardous, general

#### `updateCollectionStatus(id, status)`
Update collection status.

**Example**:
```javascript
collectionDB.updateCollectionStatus(collectionId, "in-progress");
```

#### `scheduleCollection(id, datetime)`
Schedule a collection for a specific date/time.

**Parameters**: 
- `id`: Collection ID
- `datetime`: ISO string or YYYY-MM-DD HH:MM format

**Result**: Status changes to "scheduled", scheduledAt is set

#### `deleteCollection(id)`
Delete a collection (soft delete).

**Result**: Marked as inactive, not removed from storage

#### `searchCollections(query)`
Search collections by address or contactName.

**Example**:
```javascript
const results = collectionDB.searchCollections("Main Street");
```

#### `getStatistics()`
Get aggregated statistics.

**Returns**:
```javascript
{
    total: number,
    byStatus: { pending, scheduled, in-progress, completed, cancelled },
    byType: { recycling, organic, hazardous, general },
    avgResponseTime: number (ms),
    completionRate: number (0-1)
}
```

#### `exportData()`
Export all collections as JSON.

#### `importData(jsonString)`
Import collections from JSON.

## Data Storage

**Storage Location**: Browser localStorage
**Storage Key**: `smartwaste_collections`
**Data Format**: JSON array of collection objects
**Max Size**: ~5-10MB (browser limit)
**Persistence**: Data persists across page reloads and browser sessions

### Sample Stored Data
```json
{
    "id": "uuid-string",
    "confirmationNumber": "WM-20250101-12345",
    "address": "123 Main Street",
    "city": "Eco City",
    "postalCode": "12345",
    "contactName": "John Doe",
    "contactPhone": "555-0123",
    "type": "recycling",
    "notes": "Please take plastic and paper",
    "status": "pending",
    "scheduledAt": null,
    "completedAt": null,
    "cancelledAt": null,
    "cancellationReason": null,
    "active": true,
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z"
}
```

## Status Flow

```
pending → scheduled → in-progress → completed
   ↓        ↓             ↓              ↓
pending → cancelled    cancelled     cancelled
```

## Error Handling

All methods throw errors which are caught in script.js:

```javascript
try {
    const result = collectionDB.createCollection(payload);
    // Success
} catch (err) {
    console.error(err);
    alert('Error: ' + err.message);
}
```

**Common Errors**:
- Missing required fields
- Invalid collection type
- Collection not found
- Invalid status transition

## Testing

### In Browser Console
```javascript
// Create a test collection
collectionDB.createCollection({
    address: "456 Oak Ave",
    city: "Green Valley",
    contactName: "Jane Smith",
    contactPhone: "555-9876",
    type: "recycling"
});

// View all collections
console.log(collectionDB.getAllCollections());

// Get statistics
console.log(collectionDB.getStatistics());

// Export data
const backup = collectionDB.exportData();
console.log(backup);
```

## Migration Notes

- **No backend server needed** - Application is completely client-side
- **Offline capable** - All features work without internet connection
- **Data isolation** - Each browser/device has separate data storage
- **No account required** - Anyone can submit collection requests
- **Soft deletes** - Deleted items can be recovered by filtering `active: false`

## Files Involved

- `local-database.js` - User authentication database
- `collection-database.js` - **Collection management database** (NEW)
- `script.js` - Event handlers for collection forms (UPDATED)
- `index.html` - Includes both database modules
- `styles.css` - Styling for collection forms and lists

## Browser Compatibility

Works in all modern browsers that support:
- localStorage (IE8+)
- ES6 classes (Chrome 42+, Firefox 45+, Safari 9+, Edge 12+)
- JSON (all modern browsers)

## Next Steps

1. ✅ Test collection form submission
2. ✅ Test collection display/rendering
3. ✅ Test collection scheduling
4. ✅ Test collection deletion
5. Test data persistence across page reloads
6. Test offline functionality
7. Add collection statistics display page
8. Add collection history/analytics features

