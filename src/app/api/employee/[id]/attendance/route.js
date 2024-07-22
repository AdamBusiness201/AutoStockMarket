// Import required modules
import connectDB from '../../../../../lib/db';
import Attendance from '../../../../../models/Attendance';
import { NextResponse } from "next/server";

// GET: Fetch attendances for a single employee by ID
export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params; // Extract employee ID from request parameters

    // Find the attendances for the employee by ID
    const employeeAttendances = await Attendance.find({ employee: id }).sort({ createdAt: -1 });

    // Return the employee's attendances
    return NextResponse.json({ attendances: employeeAttendances });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve employee attendances: " + error.message },
      { status: 500 }
    );
  }
}
