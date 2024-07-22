// Import required modules
import connectDB from "../../../lib/db";
import Admin from "../../../models/Admin"; // Import the Admin model
import { NextResponse } from "next/server";

// GET: Fetch all admin records
export async function GET(req, res) {
  await connectDB();

  try {
    // Query all admins from the database
    const admins = await Admin.find().sort({ createdAt: -1 });

    // Return the list of admins
    return NextResponse.json({ admins });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve admin records: " + error.message },
      { status: 500 }
    );
  }
}
