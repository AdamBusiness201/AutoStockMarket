// customerDetails.js

import connectDB from "../../../../lib/db";
import Customer from "../../../../models/Customer";
import { NextResponse } from "next/server";

// Add extra data to customer by ID
export async function POST(req, { params }) {
  // Connect to the database
  await connectDB();
  const { id } = params;
  const extraData = req.body;

  try {
    // Check if the customer exists
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Update customer with extra data
    await Customer.findByIdAndUpdate(id, extraData);

    return NextResponse.json({
      message: "Extra data added to customer successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not add extra data to customer: " + error.message },
      { status: 500 }
    );
  }
}

// Get customer by ID
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    await connectDB();

    // Find the customer by ID
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Prepare the response with customer details
    const responseData = {
      message: "Customer details retrieved successfully",
      customer: customer,
    };

    console.log("Retrieved customer details successfully:", responseData);

    // Send success response
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error retrieving customer details:", error);
    // Send error response
    return NextResponse.json(
      { error: "Could not retrieve customer details: " + error.message },
      { status: 500 }
    );
  }
}

// Update customer by ID
export async function PUT(req, { params }) {
  const updateData = await req.json();
  const { id } = params;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not update customer: " + error.message },
      { status: 500 }
    );
  }
}

// Delete customer by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not delete customer: " + error.message },
      { status: 500 }
    );
  }
}
