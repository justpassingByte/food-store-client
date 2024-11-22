import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET: Lấy danh sách người thân
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    console.log('API Route - Getting relatives for userId:', userId);

    // Truy xuất document trực tiếp bằng userId
    const userDocRef = doc(db, "userData", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log('Document not found for userId:', userId);
      return NextResponse.json({ relatives: [] });
    }

    const userData = userDoc.data();
    console.log('Found user data:', userData);
    
    return NextResponse.json({ relatives: userData?.relatives || [] });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy danh sách người thân" },
      { status: 500 }
    );
  }
}

// POST: Thêm người thân mới
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json();
    const { name, email, userId: relativeUserId } = body; // lấy userId của người thân từ clerk
    const currentUserId = params.userId;

    const userRef = doc(db, "userData", currentUserId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Kiểm tra xem người thân đã tồn tại chưa
    const relatives = userDoc.data().relatives || [];
    const existingRelative = relatives.find(
      (rel: any) => rel.userId === relativeUserId
    );

    if (existingRelative) {
      return NextResponse.json(
        { error: "Người thân đã tồn tại" },
        { status: 400 }
      );
    }

    // Thêm người thân mới với userId từ Clerk
    await updateDoc(userRef, {
      relatives: arrayUnion({
        name,
        email,
        userId: relativeUserId, // Sử dụng userId từ Clerk
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}
