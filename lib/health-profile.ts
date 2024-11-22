import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { HealthProfile } from "@/type-db";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const getHealthProfile = async (userId: string) => {
  const docRef = doc(db, "userData", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as HealthProfile;
  }
  return null;
};

// export const findUserByEmail = async (email: string) => {
//   const clerkUsers = await clerkClient.users.getUserList({
//     emailAddress: [email]
//   });
  
//   if (clerkUsers.length === 0) return [];

//   // Lấy userId từ Clerk user đầu tiên tìm được
//   const clerkUser = clerkUsers[0];
  
//   // Dùng userId để query Firebase
//   const docRef = doc(db, "userData", clerkUser.id);
//   const docSnap = await getDoc(docRef);
  
//   if (docSnap.exists()) {
//     return [{
//       id: clerkUser.id,
//       name: `${docSnap.data().weight}kg - ${docSnap.data().height}cm`,
//       ...docSnap.data()
//     }];
//   }
  
//   return [];
// };