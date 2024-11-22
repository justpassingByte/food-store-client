// actions.ts

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp, query, where, setDoc, doc, getDoc } from "firebase/firestore";

interface UserData {
  userId: string;
  diseases: string[];
  allergies: string[];
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  calories: number;
  protein: number;
}

// Save user data to Firestore
export async function saveUserData(userId: string, userData: Omit<UserData, 'userId'>): Promise<void> {
  try {
    // Tạo document reference với ID là userId
    const userDocRef = doc(db, "userData", userId);
    
    // Sử dụng setDoc thay vì addDoc
    await setDoc(userDocRef, {
      userId,
      ...userData,
      diseases: userData.diseases || [],
      allergies: userData.allergies || [],
      createdAt: Timestamp.now(),
    });
    
    console.log("Document saved with ID:", userId);
  } catch (error) {
    console.error("Error saving document: ", error);
    throw error;
  }
}

// Get user data from Firestore (optionally filter by user ID if you want specific user data)
export async function fetchUserData(userId: string): Promise<UserData[]> {
  try {
    const userDocRef = doc(db, "userData", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return [docSnap.data() as UserData];
    }
    return [];
  } catch (error) {
    console.error("Error retrieving document: ", error);
    throw error;
  }
}
