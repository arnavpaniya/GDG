import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';

/**
 * Nyaya AI - Chat Firestore Service
 * Handles persistence for analysis sessions.
 */

// --- LOCAL IN-MEMORY STORE (Fallback when Firebase is missing) ---
let localChats = [];
let localMessages = {}; // chatId -> array of messages
let chatSubscribers = [];
let messageSubscribers = {}; // chatId -> array of callbacks

const notifyChatSubs = () => chatSubscribers.forEach(cb => cb([...localChats]));
const notifyMsgSubs = (chatId) => {
  if (messageSubscribers[chatId]) {
    messageSubscribers[chatId].forEach(cb => cb([...(localMessages[chatId] || [])]));
  }
};

// --- API ---

export const subscribeToChats = (userId, callback) => {
  if (!db) {
    chatSubscribers.push(callback);
    callback([...localChats]);
    return () => { chatSubscribers = chatSubscribers.filter(cb => cb !== callback); };
  }
  
  if (!userId) return () => {};
  
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
  if (!db) {
    const id = 'local-chat-' + Date.now();
    localChats.unshift({ id, title, createdAt: new Date() });
    localMessages[id] = [];
    notifyChatSubs();
    return id;
  }
  
  if (!userId) throw new Error('User ID required');
  
  const docRef = await addDoc(collection(db, `users/${userId}/chats`), {
    title,
    createdAt: serverTimestamp(),
    messages: []
  });
  
  return docRef.id;
};

export const deleteChat = async (userId, chatId) => {
  if (!db) {
    localChats = localChats.filter(c => c.id !== chatId);
    delete localMessages[chatId];
    notifyChatSubs();
    return;
  }
  
  if (!userId || !chatId) return;
  
  try {
    const messagesQuery = query(collection(db, `users/${userId}/chats/${chatId}/messages`));
    const messagesSnapshot = await getDocs(messagesQuery);
    
    const batch = writeBatch(db);
    messagesSnapshot.forEach((msgDoc) => {
      batch.delete(msgDoc.ref);
    });
    
    batch.delete(doc(db, `users/${userId}/chats`, chatId));
    await batch.commit();
  } catch (error) {
    console.error("Firestore deleteChat error:", error);
    throw error;
  }
};

export const subscribeToMessages = (userId, chatId, callback) => {
  if (!db) {
    if (!messageSubscribers[chatId]) messageSubscribers[chatId] = [];
    messageSubscribers[chatId].push(callback);
    callback([...(localMessages[chatId] || [])]);
    return () => { 
      messageSubscribers[chatId] = messageSubscribers[chatId].filter(cb => cb !== callback);
    };
  }
  
  if (!userId || !chatId) return () => {};
  
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
  if (!db) {
    if (!localMessages[chatId]) localMessages[chatId] = [];
    localMessages[chatId].push({
      id: 'local-msg-' + Date.now() + Math.random(),
      ...message,
      createdAt: new Date()
    });
    notifyMsgSubs(chatId);
    return;
  }
  
  if (!userId || !chatId) return;
  
  await addDoc(collection(db, `users/${userId}/chats/${chatId}/messages`), {
    ...message,
    createdAt: serverTimestamp()
  });
};

export const updateChatMessages = async (userId, chatId, messages) => {
  // Deprecated
};

export const clearAllHistory = async (userId) => {
  if (!db) {
    localChats = [];
    localMessages = {};
    notifyChatSubs();
    return;
  }
  
  if (!userId) return;
  
  const chatsQuery = query(collection(db, `users/${userId}/chats`));
  const chatsSnapshot = await getDocs(chatsQuery);
  
  const batch = writeBatch(db);
  
  for (const chatDoc of chatsSnapshot.docs) {
    const messagesQuery = query(collection(db, `users/${userId}/chats/${chatDoc.id}/messages`));
    const messagesSnapshot = await getDocs(messagesQuery);
    messagesSnapshot.forEach((msgDoc) => {
      batch.delete(msgDoc.ref);
    });
    batch.delete(chatDoc.ref);
  }
  
  await batch.commit();
};

export const updateUserProfile = async (displayName) => {
  if (!auth || !auth.currentUser) return;
  await updateProfile(auth.currentUser, { displayName });
};
