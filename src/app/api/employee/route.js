// Import required modules
import connectDB from "../../../lib/db";
import Employee from "../../../models/Employee";
import { NextResponse } from "next/server";

// POST: Create a new employee record
export async function POST(req, res) {
  // Connect to the database
  await connectDB();

  try {
    // Extract employee data from the request body
    const empData = await req.json();
    if (empData.admin === "") {
      empData.admin = null;
    }
    // Create a new employee instance with admin association
    const employee = new Employee(empData);
    // Save the employee to the database
    await employee.save();

    // Return a success message along with the created employee
    return NextResponse.json({
      message: "Employee record created successfully",
      employee,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return NextResponse.json(
      { error: "Could not create employee record: " + error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all employee records
export async function GET(req, res) {
  await connectDB();

  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return NextResponse.json({ employees });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve employee records: " + error.message },
      { status: 500 }
    );
  }
}
