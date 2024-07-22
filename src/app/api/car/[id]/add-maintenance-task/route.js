import connectDB from "../../../../../lib/db";
import Car from "../../../../../models/Cars";
import MaintenanceTask from "../../../../../models/MaintenanceTasks";
import CarDetails from "../../../../../models/CarDetails";
import Transaction from "../../../../../models/Transaction"; // Import Transaction model
import { NextResponse } from "next/server";

// Endpoint to add maintenance task for a car by ID
export async function POST(req, { params }) {
  const { id } = params;
  const maintenanceTaskData = await req.json(); // Received maintenance task details from the request body

  try {
    // Connect to the database
    await connectDB();

    // Find the car by ID
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Create maintenance task using received data
    const maintenanceTask = new MaintenanceTask({
      car: car._id,
      ...maintenanceTaskData,
    });
    await maintenanceTask.save();

    // Create a transaction for the maintenance task
    const transaction = new Transaction({
      type: "expense", // Assuming maintenance task is an expense
      date: maintenanceTaskData.date,
      amount: maintenanceTaskData.taskCost,
      description: `Maintenance task for car with chassis ${car.chassisNumber}`,
      car: car._id,
    });
    await transaction.save();

    // Update maintenance costs in CarDetails
    const carDetails = await CarDetails.findOne({ car: car._id });
    if (carDetails) {
      carDetails.maintenanceCosts += maintenanceTaskData.taskCost; // Increase maintenance costs by the cost of the new task
      await carDetails.save();
    }

    // Send success response
    return NextResponse.json({
      message: "Maintenance task added successfully",
      maintenanceTask,
    });
  } catch (error) {
    console.error("Error adding maintenance task:", error);
    // Send error response
    return NextResponse.json(
      { error: "Could not add maintenance task: " + error.message },
      { status: 500 }
    );
  }
}

// Endpoint to fetch maintenance tasks for a car by ID
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    await connectDB();

    // Find maintenance tasks for the car by ID
    const maintenanceTasks = await MaintenanceTask.find({ car: id }).sort({ createdAt: -1 });

    // Send success response with maintenance tasks
    return NextResponse.json({ maintenanceTasks });
  } catch (error) {
    console.error("Error fetching maintenance tasks:", error);
    // Send error response
    return NextResponse.json(
      { error: "Could not fetch maintenance tasks: " + error.message },
      { status: 500 }
    );
  }
}
