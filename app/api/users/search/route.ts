import { clerkClient } from "@clerk/clerk-sdk-node";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ users: [] });
  }

  try {
    const users = await clerkClient.users.getUserList({
      limit: 100,
    });
    
    const filteredUsers = {
      data: users.data.filter(user => 
        user.emailAddresses[0].emailAddress.toLowerCase().includes(email.toLowerCase())
      )
    };

    if (!filteredUsers.data.length) {
      return NextResponse.json({ users: [] });
    }

    return NextResponse.json({
      users: filteredUsers.data.map((user) => ({
        userId: user.id,
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.emailAddresses[0].emailAddress,
        email: user.emailAddresses[0].emailAddress,
       
      }))
    });

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Lỗi tìm kiếm người dùng' },
      { status: 500 }
    );
  }
} 