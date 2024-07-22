import connectDB from "../../../lib/db";
import MaintenanceTask from "../../../models/MaintenanceTasks";
import { NextResponse } from "next/server";


// GET: Get all maintenance tasks along with individual task details
export async function GET(req, res) {
  await connectDB();
  try {
    // Find all maintenance tasks
    const maintenanceTasks = await MaintenanceTask.find({}).sort({ createdAt: -1 });

    // Calculate total maintenance cost
    let totalMaintenanceCost = 0;
    for (const task of maintenanceTasks) {
      totalMaintenanceCost += task.taskCost;
    }

    // Additional maintenance details
    const maintenanceDetails = {
      totalMaintenanceCost,
      totalTasks: maintenanceTasks.length,
      tasksDetails: maintenanceTasks
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
