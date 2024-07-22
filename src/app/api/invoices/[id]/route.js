import connectDB from "../../../../lib/db";
import Invoice from "../../../../models/Invoice";
import { Types as mongooseTypes } from "mongoose";
import { NextResponse } from "next/server";

// GET: Fetch a single invoice record by ID
export async function GET(req, { params }) {
  await connectDB();

  try {
    const invoiceId = params.id;

    // Validate the invoice ID
    if (!invoiceId || !mongooseTypes.ObjectId.isValid(invoiceId)) {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 }
      );
    }

    // Fetch the invoice by ID
    const invoice = await Invoice.findById(invoiceId)
      .populate({
        path: "transaction",
        populate: {
          path: "car",
          model: "Car"
        }
      }) // Populate transaction details and car data
      .populate("customer"); // Populate customer details

    // Check if the invoice exists
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Return the invoice data
    return NextResponse.json({ invoice });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve invoice record: " + error.message },
      { status: 500 }
    );
  }
}
