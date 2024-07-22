// Import required modules
import connectDB from '../../../../../lib/db';
import Deduction from '../../../../../models/Deduction';
import { NextResponse } from "next/server";

// GET: Fetch deductions for a single employee by ID
export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params; // Extract employee ID from request parameters

    // Find the deductions for the employee by ID
    const employeeDeductions = await Deduction.find({ employee: id }).sort({ createdAt: -1 });

    // Return the employee's deductions
    return NextResponse.json({ deductions: employeeDeductions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve employee deductions: " + error.message },
      { status: 500 }
    );
  }
}
