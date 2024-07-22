import connectDB from "../../../../../lib/db";
import MaintenanceTask from "../../../../../models/MaintenanceTasks";
import { NextResponse } from "next/server";

// GET: Get all unique chassis numbers from maintenance tasks for external cars
export async function GET(req, res) {
  await connectDB();
  try {
    // Find all maintenance tasks with non-null externalCarDetails
    const maintenanceTasks = await MaintenanceTask.find({ "externalCarDetails": { $ne: null } }).sort({ createdAt: -1 });

    // Extract unique chassis numbers
    const chassisNumbers = maintenanceTasks.reduce((uniqueChassisNumbers, task) => {
      if (task.externalCarDetails && task.externalCarDetails.chassisNumber) {
        uniqueChassisNumbers.add(task.externalCarDetails.chassisNumber);
      }
      return uniqueChassisNumbers;
    }, new Set());

    return NextResponse.json({ chassisNumbers: Array.from(chassisNumbers) });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve chassis numbers: " + error.message },
      { status: 500 }
    );
  }
}
