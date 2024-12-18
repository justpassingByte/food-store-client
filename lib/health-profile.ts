import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { HealthProfile } from "@/type-db";
import { clerkClient } from "@clerk/clerk-sdk-node";


export const getHealthProfile = async (relativeIdOrData: string | {
  userId: string;
  relativeName?: string;
  relativeId?: string;
  isRelative: boolean;
}) => {
  try {
    // Trường hợp relative đã đăng ký (truyền vào relativeId)
    if (typeof relativeIdOrData === 'string' || relativeIdOrData.relativeId) {
      const id = typeof relativeIdOrData === 'string' ? relativeIdOrData : relativeIdOrData.relativeId;
      const docRef = doc(db, "userData", id!);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        return {
          age: userData.age,
          gender: userData.gender,
          weight: userData.weight,
          height: userData.height,
          activityLevel: userData.activityLevel || "",
          diseases: userData.diseases || [],
          allergies: userData.allergies || [],
          calories: userData.calories,
          protein: userData.protein,
          createdAt: userData.createdAt,
          userId: id
        } as HealthProfile;
      }
      return null;
    }
    
    // Trường hợp relative chưa đăng ký (sử dụng relativeName)
    if (relativeIdOrData.isRelative && relativeIdOrData.relativeName) {
      const userDocRef = doc(db, "userData", relativeIdOrData.userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const relative = userData.relatives?.find((rel: any) => 
          rel.relativeName === relativeIdOrData.relativeName && rel.isRelative
        );
        
        if (relative) {
          return {
            age: relative.age,
            gender: relative.gender,
            weight: relative.weight,
            height: relative.height,
            activityLevel: relative.activityLevel || "",
            diseases: relative.diseases || [],
            allergies: relative.allergies || [],
            calories: relative.calories,
            protein: relative.protein,
            createdAt: new Date(),
            userId: relativeIdOrData.userId
          } as HealthProfile;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error in getHealthProfile:", error);
    return null;
  }
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