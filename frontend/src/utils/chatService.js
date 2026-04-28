import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';

/**
 * Nyaya AI - Chat Firestore Service
 * Handles persistence for analysis sessions.
 */

export const subscribeToChats = (userId, callback) => {
  if (!userId || !db) return () => {};
  
  try {
    const q = query(
      collection(db, `users/${userId}/chats`),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(chats);
    });
  } catch (error) {
    console.error("Firestore subscribeToChats error:", error);
    return () => {};
  }
};

export const createNewChat = async (userId, title = 'New Analysis') => {
  if (!userId || !db) throw new Error('User ID required or Firestore not configured');
  
  const docRef = await addDoc(collection(db, `users/${userId}/chats`), {
    title,
    createdAt: serverTimestamp(),
    messages: []
  });
  
  return docRef.id;
};

export const deleteChat = async (userId, chatId) => {
  if (!userId || !chatId || !db) return;
  
  try {
    const messagesQuery = query(collection(db, `users/${userId}/chats/${chatId}/messages`));
    const messagesSnapshot = await getDocs(messagesQuery);
    
    const batch = writeBatch(db);
    messagesSnapshot.forEach((msgDoc) => {
      batch.delete(msgDoc.ref);
    });
    
    // Delete the chat document itself
    batch.delete(doc(db, `users/${userId}/chats`, chatId));
    
    await batch.commit();
  } catch (error) {
    console.error("Firestore deleteChat error:", error);
    throw error;
  }
};

export const subscribeToMessages = (userId, chatId, callback) => {
  if (!userId || !chatId || !db) return () => {};
  
  try {
    const q = query(
      collection(db, `users/${userId}/chats/${chatId}/messages`),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  } catch (error) {
    console.error("Firestore subscribeToMessages error:", error);
    return () => {};
  }
};

export const addMessage = async (userId, chatId, message) => {
  if (!userId || !chatId || !db) return;
  
  await addDoc(collection(db, `users/${userId}/chats/${chatId}/messages`), {
    ...message,
    createdAt: serverTimestamp()
  });
};

export const updateChatMessages = async (userId, chatId, messages) => {
  // Deprecated in favor of subcollections
};

export const clearAllHistory = async (userId) => {
  if (!userId || !db) return;
  
  const chatsQuery = query(collection(db, `users/${userId}/chats`));
  const chatsSnapshot = await getDocs(chatsQuery);
  
  const batch = writeBatch(db);
  
  for (const chatDoc of chatsSnapshot.docs) {
    // Delete messages subcollection
    const messagesQuery = query(collection(db, `users/${userId}/chats/${chatDoc.id}/messages`));
    const messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.forEach((msgDoc) => {
      batch.delete(msgDoc.ref);
    });
    
    // Delete the chat itself
    batch.delete(chatDoc.ref);
  }
  
  await batch.commit();
};

export const updateUserProfile = async (displayName) => {
  if (!auth || !auth.currentUser) return;
  await updateProfile(auth.currentUser, { displayName });
};


