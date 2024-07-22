import connectDB from "../../../../lib/db";
import Admin from "../../../../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  await connectDB();

  const { username, password } = await req.json();

  try {
    // Attempt to find the admin with the provided username
    const admin = await Admin.findOne({ username }).sort({ createdAt: -1 });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with additional payload data
    const token = jwt.sign(
      {
        userId: admin._id,
        username: admin.username,
        role: admin.role,
        isEmailVerified: admin.isEmailVerified,
      },
      "process.env.JWT_SECRET",
      { expiresIn: "1d" } // Token expiration time
    );

    // Update the last login time for the admin
    admin.lastLogin = new Date();
    await admin.save();
    cookies().set("token", token, { secure: true });
    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Login failed: " + error.message },
      { status: 500 }
    );
  }
}
