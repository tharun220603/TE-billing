// firebaseService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  query 
} from 'firebase/firestore';
import { db } from './firebase';

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

import { auth } from './firebase';

const COLLECTION_NAME = 'bills';

// Save bill to Firebase
export const saveBill = async (billData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...billData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving bill:', error);
    return { success: false, error: error.message };
  }
};

// Get all bills from Firebase
export const getAllBills = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const bills = [];
    querySnapshot.forEach((doc) => {
      bills.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: bills };
  } catch (error) {
    console.error('Error fetching bills:', error);
    return { success: false, error: error.message };
  }
};

// Get single bill by ID
export const getBillById = async (billId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, billId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Bill not found' };
    }
  } catch (error) {
    console.error('Error fetching bill:', error);
    return { success: false, error: error.message };
  }
};

// Update bill
export const updateBill = async (billId, billData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, billId);
    await updateDoc(docRef, {
      ...billData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating bill:', error);
    return { success: false, error: error.message };
  }
};

// Delete bill
export const deleteBill = async (billId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, billId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting bill:', error);
    return { success: false, error: error.message };
  }
};


// Create new user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => auth.currentUser;