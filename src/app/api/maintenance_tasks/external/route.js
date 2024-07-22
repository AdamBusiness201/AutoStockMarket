import connectDB from "../../../../lib/db";
import MaintenanceTask from "../../../../models/MaintenanceTasks";
import { NextResponse } from "next/server";

// Endpoint to add a new maintenance task
export async function POST(req, res) {
  const maintenanceTaskData = await req.json();
  try {
    // Connect to the database
    await connectDB();
    console.log(maintenanceTaskData);
    // Create maintenance task using received data
    const maintenanceTask = new MaintenanceTask({
      externalCarDetails: {
        owner: maintenanceTaskData.externalCarDetails.owner,
        Car: maintenanceTaskData.externalCarDetails.Car,
        RegistrationNumber:
          maintenanceTaskData.externalCarDetails.RegistrationNumber,
        ChassisNumber: maintenanceTaskData.externalCarDetails.ChassisNumber,
        EngineNumber: maintenanceTaskData.externalCarDetails.EngineNumber,
      },
      taskCost: maintenanceTaskData.taskCost,
      taskDescription: maintenanceTaskData.taskDescription,
      taskDate: maintenanceTaskData.taskDate,
    });
    await maintenanceTask.save();

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

// GET: Get all maintenance tasks for external cars along with individual task details
export async function GET(req, res) {
  await connectDB();
  try {
    // Find all maintenance tasks for external cars and populate the owner field
    const maintenanceTasks = await MaintenanceTask.find({}).populate(
      "externalCarDetails.owner"
    );

    // Filter out maintenance tasks for external cars
    const externalCarMaintenanceTasks = maintenanceTasks.filter(
      (task) => task.externalCarDetails !== null
    );

    // Calculate total maintenance cost
    let totalMaintenanceCost = 0;
    for (const task of externalCarMaintenanceTasks) {
      totalMaintenanceCost += task.taskCost;
    }

    // Additional maintenance details
    const maintenanceDetails = {
      totalMaintenanceCost,
      totalTasks: externalCarMaintenanceTasks.length,
      tasksDetails: externalCarMaintenanceTasks,
      // Add more details here if needed
    };

    return NextResponse.json({ maintenanceDetails });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve maintenance details: " + error.message },
      { status: 500 }
    );
  }
}
