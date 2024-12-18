// actions.ts

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp, query, where, setDoc, doc, getDoc, arrayUnion } from "firebase/firestore";

interface UserData {
  userId: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  activityLevel: string;
  diseases: string[];
  allergies: string[];
  calories: number;
  protein: number;
  createdAt: Timestamp;
  isRelative?: boolean;
  relativeName: string;  
  relatives?: Array<{
    age: string;
    relativeName: string;
    gender: string;
    weight: string;
    height: string;
    activityLevel: string;
    diseases: string[];
    allergies: string[];
    calories: number;
    protein: number;
    createdAt: Timestamp;
  }>;
}

// Save user data to Firestore
export async function saveUserData(userId: string, userData: Omit<UserData, 'userId'>): Promise<void> {
  try {
    const userDocRef = doc(db, "userData", userId);
    
    if (userData.isRelative) {
      // Lưu vào mảng relatives
      const relativeData = {
        age: userData.age,
        gender: userData.gender,
        weight: userData.weight,
        height: userData.height,
        activityLevel: userData.activityLevel,
        diseases: userData.diseases || [],
        allergies: userData.allergies || [],
        calories: userData.calories,
        protein: userData.protein,
        relativeName: userData.relativeName,
        isRelative: true,
        createdAt: Timestamp.now()
      };

      await setDoc(userDocRef, {
        relatives: arrayUnion(relativeData)
      }, { merge: true });
    } else {
      // Lưu thông tin user chính
      await setDoc(userDocRef, {
        userId,
        age: userData.age,
        gender: userData.gender,
        weight: userData.weight,
        height: userData.height,
        activityLevel: userData.activityLevel,
        diseases: userData.diseases || [],
        allergies: userData.allergies || [],
        calories: userData.calories,
        protein: userData.protein,
        createdAt: Timestamp.now()
      }, { merge: true });
    }
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
