import connectDB from "../../../lib/db";
import Transaction from "../../../models/Transaction";
import Partner from "../../../models/Partner";
import Car from "../../../models/Cars";
import { NextResponse } from "next/server";

// POST: Create a new transaction record
export async function POST(req, res) {
  await connectDB();
  const { type, date, amount, description, partners, carId } = await req.json();
  try {
    if (carId) {
      const car = await Car.findById(carId);
      if (!car) {
        throw new Error("Invalid car");
      }
    }

    // Create a new transaction instance
    const transaction = new Transaction({
      type,
      date,
      amount,
      description,
      partners,
      car: carId,
    });

    // Save the transaction to the database
    await transaction.save();

    // Return a success message
    return NextResponse.json({
      message: "Transaction record created successfully",
      transaction,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return NextResponse.json(
      { error: "Could not create transaction record: " + error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all transaction records with pagination and optional filters
export async function GET(req, res) {
  await connectDB();
  try {
    // Parse query parameters
    const searchParams = new URL(req.url).searchParams;
    let {
      page = 1,
      perPage = 10,
      type,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      carId,
    } = Object.fromEntries(searchParams.entries());

    // Convert page and perPage to integers
    page = parseInt(page);
    perPage = parseInt(perPage);

    // Define the filter object
    const filter = {};
    if (type) filter.type = type;
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
    if (minAmount) filter.amount = { $gte: parseFloat(minAmount) };
    if (maxAmount)
      filter.amount = { ...filter.amount, $lte: parseFloat(maxAmount) };
    if (carId) filter.car = carId; // Corrected this line to use the correct property name

    // Calculate skip value for pagination
    const skip = (page - 1) * perPage;
    console.log(filter);
    // Query transactions with pagination and filters
    const transactions = await Transaction.find(filter).sort({ createdAt: -1 })
      .populate("partners") // Populate partner details
      .populate("car") // Populate car details
      .skip(skip)
      .limit(perPage);

    // Get total count of transactions (without pagination)
    const totalCount = await Transaction.countDocuments(filter);

    return NextResponse.json({ transactions, totalCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve transaction records: " + error.message },
      { status: 500 }
    );
  }
}
