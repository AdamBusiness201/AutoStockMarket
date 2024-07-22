// Import required modules
import connectDB from '../../../../../lib/db';
import SoldCar from '../../../../../models/SoldCars';
import { NextResponse } from "next/server";

// GET: Fetch sales cars for a single employee by ID
export async function GET(req, { params }) {
  await connectDB();

  try {
    const { id } = params; // Extract employee ID from request parameters

    // Find the sales cars for the employee by ID
    const employeeSalesCars = await SoldCar.find({ salesMember: id }).sort({ createdAt: -1 });

    // Return the employee's sales cars
    return NextResponse.json({ salesCars: employeeSalesCars });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve employee sales cars: " + error.message },
      { status: 500 }
    );
  }
}
