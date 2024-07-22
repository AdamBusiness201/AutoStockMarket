import connectDB from "../../../../../lib/db";
import Invoice from "../../../../../models/Invoice";
import Transaction from "../../../../../models/Transaction";
import { NextResponse } from "next/server";

// GET: Fetch all invoices for a specific car
export async function GET(req, res) {
  await connectDB();
  try {
    // Parse query parameters
    const searchParams = new URL(req.url).searchParams;
    let { page = 1, perPage = 10, carId } = Object.fromEntries(searchParams.entries());

    // Convert page and perPage to integers
    page = parseInt(page);
    perPage = parseInt(perPage);

    if (!carId) {
      return NextResponse.json({
        error: "Car ID must be provided"
      }, { status: 400 });
    }

    // Find transactions linked to the specified car
    const transactions = await Transaction.find({ car: carId });

    // Extract transaction IDs to filter invoices
    const transactionIds = transactions.map(transaction => transaction._id);

    // Define the filter object for invoices
    const filter = { transaction: { $in: transactionIds } };

    // Calculate skip value for pagination
    const skip = (page - 1) * perPage;

    // Query invoices with pagination and based on filter
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 })
      .populate('transaction') // Optionally populate transaction details
      .populate('customer', 'name') // Populate customer details, like name
      .skip(skip)
      .limit(perPage);

    // Get total count of invoices (without pagination)
    const totalCount = await Invoice.countDocuments(filter);

    return NextResponse.json({
      invoices,
      totalCount
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve invoices: " + error.message },
      { status: 500 }
    );
  }
}
