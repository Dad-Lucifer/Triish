// src/firebase/exampleUsage.ts
import FirestoreService from './firestoreService';
const { addDocument } = FirestoreService;

// Example function to save RSVP data to Firestore
export const saveRSVPData = async (rsvpData: {
  name: string;
  email: string;
  guests: number;
  attendance: boolean;
  guestDetails?: Array<{
    id: number;
    name: string;
    preference: "veg" | "nonveg" | "";
  }>;
  message?: string;
  timestamp: Date;
}) => {
  try {
    // Add RSVP data to 'rsvps' collection in Firestore
    const result = await addDocument('rsvps', {
      ...rsvpData,
      timestamp: rsvpData.timestamp.toISOString(), // Convert date to string for Firestore
    });
    
    console.log('RSVP saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error saving RSVP:', error);
    throw error;
  }
};

// Example function to save event responses
export const saveEventResponse = async (eventData: Record<string, unknown>) => {
  try {
    const result = await addDocument('eventResponses', eventData);
    console.log('Event response saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error saving event response:', error);
    throw error;
  }
};