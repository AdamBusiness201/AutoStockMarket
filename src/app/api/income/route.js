import connectDB from "../../../lib/db";
import CarDetails from "../../../models/CarDetails";
import { NextResponse } from "next/server";

// GET: Get the total income from all sold cars along with individual car details
export async function GET(req, res) {
  await connectDB();
  try {
    // Find all CarDetails with non-zero values
    const carDetails = await CarDetails.find({
      $or: [
        { value: { $ne: 0 } },
        { sellingPrice: { $ne: 0 } },
        { capital: { $ne: 0 } },
        { maintenanceCosts: { $ne: 0 } }
      ]
    }).sort({ createdAt: -1 }).populate('car'); // Populate the 'car' field with actual car details

    // Calculate total income
    let totalIncome = 0;
    for (const detail of carDetails) {
      totalIncome += detail.netProfit;
    }

    // Additional income details as per your requirement
    const incomeDetails = {
      totalIncome,
      totalCars: carDetails.length,
      soldCarsDetails: carDetails
      // Add more details here if needed
    };

    return NextResponse.json({ incomeDetails });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve income details: " + error.message },
      { status: 500 }
    );
  }
}
