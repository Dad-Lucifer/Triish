# Firebase Integration

This project is connected to Firebase for data storage and management. Here's how to use the Firebase integration:

## Environment Variables

The project uses the following environment variables (defined in `.env`):

```env
VITE_FIREBASE_API_KEY=AIzaSyCVPgjo7W845Hg6Xd36yDoa6x9pNb_kuyI
VITE_FIREBASE_AUTH_DOMAIN=triissh-3cdf5.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=triissh-3cdf5
VITE_FIREBASE_STORAGE_BUCKET=triissh-3cdf5.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=827509591063
VITE_FIREBASE_APP_ID=1:827509591063:web:ce2e247d47c3ba62c06052
VITE_FIREBASE_MEASUREMENT_ID=G-0KLZWN76WW
```

## Firebase Services Available

The following Firebase services are initialized and ready to use:

- Firestore Database (`db`)
- Realtime Database (`rtdb`)
- Storage (`storage`)
- Authentication (`auth`)
- Analytics (`analytics`)

## Usage in Components

The RSVP form is already integrated with Firebase. When a user submits their RSVP, the data is stored in the 'rsvps' collection in Firestore.

To use Firebase in other components:

```typescript
import { db } from '@/firebase'
import { saveRSVPData } from '@/firebase/exampleUsage'
import FirestoreService from '@/firebase/firestoreService'
```

## Firestore Service Methods

The `FirestoreService` provides convenient methods for common database operations:

- `getDocument(collectionName, docId)` - Get a document
- `setDocument(collectionName, docId, data)` - Set a document
- `updateDocument(collectionName, docId, data)` - Update a document
- `addDocument(collectionName, data)` - Add a new document
- `deleteDocument(collectionName, docId)` - Delete a document
- `getDocuments(collectionName, ...queryConstraints)` - Get multiple documents
- `getDocumentsByField(collectionName, field, operator, value)` - Get documents by field

## Running the Application

Make sure to install the dependencies:

```bash
npm install firebase
```

The application will automatically connect to Firebase when it starts.