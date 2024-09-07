import connectDB from "../../../lib/db";
import Transaction from "../../../models/Transaction";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  try {
    const query = { type: "income" }; // Ensure only 'income' transactions are retrieved

    if (fromDate) {
      query.date = { $gte: new Date(fromDate) };
    }

    if (toDate) {
      query.date = {
        ...query.date,
        $lte: new Date(toDate),
      };
    }

    // Find all income transactions with populated 'car' and 'customer' fields
    const transactions = await Transaction.find(query)
      .populate('car')
      .populate('partners') // Populate customer field
      .sort({ date: -1 });

    // Calculate total income
    const totalIncome = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const incomeDetails = {
      totalIncome,
      totalTransactions: transactions.length,
      soldCarsDetails: transactions
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
