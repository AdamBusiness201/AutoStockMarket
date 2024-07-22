import connectDB from "../../../../lib/db";
import Admin from "../../../../models/Admin";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDB();

  const { username, email, password } = await req.json();

  try {
    // Check if an admin with the given email or username already exists
    const adminExists = await Admin.findOne({ $or: [{ email }, { username }] }).sort({ createdAt: -1 });

    if (adminExists) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 }
      );
    }
console.log("refs",username, email, password)
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();

    return NextResponse.json({ message: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not create admin: " + error.message },
      { status: 500 }
    );
  }
}
