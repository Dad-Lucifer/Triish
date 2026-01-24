// src/firebase/firestoreService.ts
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  WhereFilterOp,
  Query
} from 'firebase/firestore';
import { db } from './index';

/**
 * Firestore Service for common database operations
 */
class FirestoreService {
  /**
   * Get a document by collection and document ID
   */
  async getDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Set a document by collection and document ID
   */
  async setDocument(collectionName: string, docId: string, data: Record<string, unknown>) {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
      return { id: docId, ...data };
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }

  /**
   * Update a document by collection and document ID
   */
  async updateDocument(collectionName: string, docId: string, data: Record<string, unknown>) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docId, ...data };
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Add a new document to a collection
   */
  async addDocument(collectionName: string, data: Record<string, unknown>) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  }

  /**
   * Delete a document by collection and document ID
   */
  async deleteDocument(collectionName: string, docId: string) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get documents from a collection with optional query constraints
   */
  async getDocuments(collectionName: string) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  /**
   * Get documents with where clause
   */
  async getDocumentsByField(collectionName: string, field: string, operator: WhereFilterOp, value: unknown) {
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error('Error getting documents by field:', error);
      throw error;
    }
  }
}

export default new FirestoreService();