import connectDB from "../../../lib/db";
import Transaction from "../../../models/Transaction";
import Partner from "../../../models/Partner";
import Car from "../../../models/Cars";
import Invoice from "../../../models/Invoice";
import { Types as mongooseTypes } from "mongoose";
import { NextResponse } from "next/server";

// POST: Create a new transaction record
export async function POST(req, res) {
  await connectDB();
  const { type, date, amount, description, partners, carId } = await req.json();
  try {
    // Validate existence of partners and car in the database
    const existingPartners = await Partner.find({
      _id: { $in: partners },
    }).sort({ createdAt: -1 });
    const car = await Car.findById(carId);
    if (
      !existingPartners ||
      existingPartners.length !== partners.length ||
      !car
    ) {
      throw new Error("Invalid partners or car");
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

// GET: Fetch all invoice records with pagination and optional filters
export async function GET(req, res) {
  await connectDB();
  try {
    // Parse query parameters
    const searchParams = new URL(req.url).searchParams;
    let {
      page = 1,
      perPage = 10,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      transactionId,
    } = Object.fromEntries(searchParams.entries());

    // Convert page and perPage to integers
    page = parseInt(page);
    perPage = parseInt(perPage);

    // Define the filter object
    const filter = {};
    if (startDate)
      filter.invoiceDate = { ...filter.invoiceDate, $gte: new Date(startDate) };
    if (endDate)
      filter.invoiceDate = { ...filter.invoiceDate, $lte: new Date(endDate) };
    if (minAmount)
      filter.totalAmount = {
        ...filter.totalAmount,
        $gte: parseFloat(minAmount),
      };
    if (maxAmount)
      filter.totalAmount = {
        ...filter.totalAmount,
        $lte: parseFloat(maxAmount),
      };
    if (transactionId && mongooseTypes.ObjectId.isValid(transactionId)) {
      transactionId = mongooseTypes.ObjectId(transactionId);
      filter.transaction = transactionId;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * perPage;

    // Query invoices with pagination and filters
    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .populate("transaction") // Populate transaction details
      .populate("customer") // Populate customer details
      .skip(skip)
      .limit(perPage);

    // Get total count of invoices (without pagination)
    const totalCount = await Invoice.countDocuments(filter);

    return NextResponse.json({ invoices, totalCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve invoice records: " + error.message },
      { status: 500 }
    );
  }
}
