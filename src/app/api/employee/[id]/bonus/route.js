// Import required modules
import connectDB from '../../../../../lib/db';
import Bonus from '../../../../../models/Bonus';
import { NextResponse } from "next/server";

// GET: Fetch bonuses for a single employee by ID
export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params; // Extract employee ID from request parameters

    // Find the bonuses for the employee by ID
    const employeeBonuses = await Bonus.find({ employee: id }).sort({ createdAt: -1 });

    // Return the employee's bonuses
    return NextResponse.json({ bonuses: employeeBonuses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve employee bonuses: " + error.message },
      { status: 500 }
    );
  }
}
