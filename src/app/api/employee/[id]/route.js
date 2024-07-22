// Import required modules
import connectDB from "../../../../lib/db";
import Employee from "../../../../models/Employee";
import { NextResponse } from "next/server";

// GET: Fetch a single employee record by ID
export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params; // Extract employee ID from request parameters

    // Find the employee by ID
    const employee = await Employee.findById(id);

    // Check if the employee exists
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Return the employee record
    return NextResponse.json({ employee });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve employee record: " + error.message },
      { status: 500 }
    );
  }
}

// POST: Update a single employee record by ID
export async function PUT(req, { params }) {
  await connectDB();

  try {
    const { id } = params; // Extract employee ID from request parameters
    const updatedEmployeeData = await req.json(); // Extract updated employee data from request body

    // Find the employee by ID and update its data
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updatedEmployeeData,
      { new: true }
    );

    // Check if the employee exists
    if (!updatedEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Return the updated employee record
    return NextResponse.json({
      message: "Employee record updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not update employee record: " + error.message },
      { status: 500 }
    );
  }
}
