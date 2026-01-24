// src/firebase/index.ts
import { app } from './config';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

// Initialize Firebase services
const db: Firestore = getFirestore(app);
const rtdb: Database = getDatabase(app); // Realtime Database
const storage: FirebaseStorage = getStorage(app);
const auth: Auth = getAuth(app);

export { 
  db, 
  rtdb, 
  storage, 
  auth 
};