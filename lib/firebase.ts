// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyC9Wg8dk_kUhrntiu-jRfhK-RSF7MYMxLQ",
  authDomain: "multi-food-store.firebaseapp.com",
  projectId: "multi-food-store",
  storageBucket: "multi-food-store.appspot.com",
  messagingSenderId: "526382486760",
  appId: "1:526382486760:web:482e0072bbe5a1ae9ca55d",
  measurementId: "G-T14ZDERQ5K"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
export {db, storage}