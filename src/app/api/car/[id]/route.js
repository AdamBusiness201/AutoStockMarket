import connectDB from "../../../../lib/db";
import Car from "../../../../models/Cars";
import CarDetails from "../../../../models/CarDetails";
import Customer from "../../../../models/Customer";
import Employee from "../../../../models/Employee";
import Partner from "../../../../models/Partner";
import Transaction from "../../../../models/Transaction"; // Make sure to import the Transaction model
import Installment from "../../../../models/Installment";

import { NextResponse } from "next/server";

// Add extra data to car by ID
export async function POST(req, { params }) {
  // Connect to the database
  await connectDB();
  const { id } = params;
  const extraData = req.body;

  try {
    // Check if the car exists
    const car = await Car.findById(id).sort({ createdAt: -1 });
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Create new car details with extra data
    const newCarDetails = new CarDetails({
      car: id,
      ...extraData,
    });

    // Save the new car details
    await newCarDetails.save();

    return NextResponse.json({
      message: "Extra data added to car successfully",
      carDetails: newCarDetails,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not add extra data to car: " + error.message },
      { status: 500 }
    );
  }
}

// Retrieve car and customers details by their IDs
export async function GET(req, { params }) {
  const { id } = params;
// Connect to the database
await connectDB();
  try {
    

    // Find the customers
    let customers;
    if (!params.CustomersOnly) {
      customers = await Customer.find({}).sort({ createdAt: -1 });
      
    }
    if (!params.TransactionsOnly) {
      try {
        const transactions = await Transaction.find({}).sort({ createdAt: -1 });
        
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
          { error: "Could not retrieve transactions: " + error.message },
          { status: 500 }
        );
      }
    }

    if (!params.CustomersOnly) {
      // Find the car by ID
      const car = await Car.findById(id).populate('owner').sort({ createdAt: -1 });
      if (!car) {
        return NextResponse.json({ error: "Car not found" }, { status: 404 });
      }

      // Find the car details associated with the car
      const carDetails = await CarDetails.findOne({ car: car._id }).sort({ createdAt: -1 });
      

      // Find the employees
      const employees = await Employee.find({}).sort({ createdAt: -1 });
      

      // Find the partners associated with the car
      const partners = await Partner.find({ cars: car._id }).sort({ createdAt: -1 });
      // Fetch the transactions related to the car
      const transactions = await Transaction.find({ car: car._id }).populate(
        "partners"
      ).sort({ createdAt: -1 });
      const installments = await Installment.find({ car: car._id }).sort({ createdAt: -1 });
      // Prepare the response with car, car details, and customers
      const responseData = {
        message: "Car and customers details retrieved successfully",
        car: car || { message: "No car details were retrieved" },
        carDetails: carDetails || { message: "No car details were retrieved" },
        customers: customers || { message: "No customer details were retrieved" },
        employees: employees || { message: "No employee details were retrieved" },
        partners: partners || { message: "No partner details were retrieved" },
        transactions: transactions || { message: "No transaction details were retrieved" },
        installments: installments || { message: "No installment details were retrieved" },
    };
    
      // Send success response
      return NextResponse.json(responseData);
    } else {
      // Prepare the response with only customers
      const responseData = {
        message: "Customers retrieved successfully",
        customers: customers,
      };

      // Send success response
      return NextResponse.json(responseData);
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    // Send error response
    return NextResponse.json(
      {
        error: `Could not retrieve data: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

// Update car by ID
export async function PUT(req, { params }) {
  const updateData = await req.json();
  const { id } = params;
  try {
    const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not update car: " + error.message },
      { status: 500 }
    );
  }
}

// Delete car by ID
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const deletedCar = await Car.findByIdAndDelete(id);
    if (!deletedCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    // Also delete the corresponding car details
    await CarDetails.deleteOne({ car: id });
    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not delete car: " + error.message },
      { status: 500 }
    );
  }
}
