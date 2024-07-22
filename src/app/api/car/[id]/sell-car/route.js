import connectDB from "../../../../../lib/db";
import Car from "../../../../../models/Cars";
import CarDetails from "../../../../../models/CarDetails";
import Transaction from "../../../../../models/Transaction";
import SoldCar from "../../../../../models/SoldCars";
import Invoice from "../../../../../models/Invoice";
import { NextResponse } from "next/server";

// Sell car by ID
export async function POST(req, { params }) {
  const { id } = params;
  const carDetailsData = await req.json(); // Received car details updates from the request body

  try {
    // Connect to the database
    await connectDB();

    // Find the car by ID
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Update the existing car details
    const updatedCarDetails = await CarDetails.findOneAndUpdate(
      { car: car._id },
      { $set: carDetailsData },
      { new: true }
    );
    if (!updatedCarDetails) {
      return NextResponse.json(
        { error: "Car details not found" },
        { status: 404 }
      );
    }

    // Create or update the transaction
    const transaction = new Transaction({
      type: "income",
      date: new Date(),
      amount: updatedCarDetails.sellingPrice,
      description: `Sale of ${car.name}`,
      partners: [],
      car: car._id,
    });
    await transaction.save();

    // Create an invoice
    const invoice = new Invoice({
      transaction: transaction._id,
      customer: carDetailsData.purchaser, // Assuming purchaser is a customer ID
      invoiceDate: new Date(),
      totalAmount: updatedCarDetails.sellingPrice,
    });
    await invoice.save();

    // Create a new document in the "sold cars" collection
    const soldCar = new SoldCar({
      car: car._id,
      previousOwner: car.owner, // Set the previousOwner to the current owner of the car
      purchaser: carDetailsData.purchaser, // Set the purchaser to the buyer provided in the request
      purchaseDate: new Date(), // Set the purchaseDate to the current date
      purchasePrice: updatedCarDetails.sellingPrice, // Set the purchasePrice to the selling price of the car
      salesMember: carDetailsData.salesMember,
      source: carDetailsData.source,
    });
    await soldCar.save();

    // Update car's status, e.g., owner to null and location to "Sold"
    const updatedCar = await Car.findByIdAndUpdate(
      car._id,
      {
        owner: null,
        currentLocation: "Sold",
      },
      { new: true }
    );

    console.log("Car sold and details updated successfully:", updatedCar);

    // Send success response
    return NextResponse.json({
      message: "Car sold and details updated successfully",
      car: updatedCar,
      carDetails: updatedCarDetails,
      invoice: invoice,
    });
  } catch (error) {
    console.error("Error selling car:", error);
    // Send error response
    return NextResponse.json(
      { error: "Could not sell car: " + error.message },
      { status: 500 }
    );
  }
}
