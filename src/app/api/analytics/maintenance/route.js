import connectDB from "../../../../lib/db";
import MaintenanceTask from "../../../../models/MaintenanceTasks";
import Car from "../../../../models/Cars";
import Customer from "../../../../models/Customer";
import { NextResponse } from "next/server";
import moment from "moment";

export async function GET(req) {
  await connectDB();

  let startDate, endDate;
  const startDateParam = req.nextUrl.searchParams.get("startDate");
  const endDateParam = req.nextUrl.searchParams.get("endDate");
  const timeRange = req.nextUrl.searchParams.get("timeRange");

  try {
    // Determine date range based on timeRange or startDate/endDate parameters
    if (timeRange) {
      const now = moment();
      if (timeRange === "thisWeek") {
        startDate = now.startOf("week").toDate();
        endDate = now.endOf("week").toDate();
      } else if (timeRange === "thisMonth") {
        startDate = now.startOf("month").toDate();
        endDate = now.endOf("month").toDate();
      } else if (timeRange === "lastWeek") {
        startDate = now.subtract(1, "week").startOf("week").toDate();
        endDate = now.subtract(1, "week").endOf("week").toDate();
      } else if (timeRange === "lastMonth") {
        startDate = now.subtract(1, "month").startOf("month").toDate();
        endDate = now.subtract(1, "month").endOf("month").toDate();
      } else if (timeRange === "lifetime") {
        startDate = new Date(0);
        endDate = now.toDate();
      }
    } else {
      if (startDateParam) {
        startDate = moment(startDateParam).startOf("day").toDate();
      }
      if (endDateParam) {
        endDate = moment(endDateParam).endOf("day").toDate();
      }
    }

    const filter = {};
    if (startDate && endDate) {
      filter.taskDate = { $gte: startDate, $lt: endDate };
    } else if (startDate) {
      filter.taskDate = { $gte: startDate };
    } else if (endDate) {
      filter.taskDate = { $lt: endDate };
    }

    // Fetch maintenance tasks data with the specified filters
    const [
      maintenanceTasks,
      totalTaskCost,
      tasksByCar,
      tasksByCustomer,
    ] = await Promise.all([
      MaintenanceTask.find(filter).populate("car externalCarDetails.owner"),
      MaintenanceTask.aggregate([
        { $match: filter },
        {
          $group: { _id: null, totalTaskCost: { $sum: "$taskCost" } },
        },
      ]),
      MaintenanceTask.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$car",
            totalCost: { $sum: "$taskCost" },
            totalTasks: { $sum: 1 },
          },
        },
        { $sort: { totalCost: -1 } }, // Sort by total cost descending
      ]),
      MaintenanceTask.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$externalCarDetails.owner",
            totalCost: { $sum: "$taskCost" },
            totalTasks: { $sum: 1 },
          },
        },
        { $sort: { totalCost: -1 } }, // Sort by total cost descending
      ]),
    ]);

    // Retrieve car and customer details
    const carDetails = await Car.find({
      _id: { $in: maintenanceTasks.map(task => task.car).filter(Boolean) },
    }).select("model color");

    const customerDetails = await Customer.find({
      _id: { $in: maintenanceTasks.map(task => task.externalCarDetails?.owner).filter(Boolean) },
    }).select("name");

    // Map detailed information to tasks
    const detailedMaintenanceTasks = maintenanceTasks.map(task => ({
      ...task._doc,
      carDetails: carDetails.find(car => car._id?.toString() === task.car?.toString()) || null,
      customerDetails: customerDetails.find(customer => customer._id?.toString() === task.externalCarDetails?.owner?.toString()) || null,
    }));

    const response = {
      totalTasks: maintenanceTasks.length,
      maintenanceTasks: detailedMaintenanceTasks,
      totalTaskCost: totalTaskCost[0]?.totalTaskCost || 0,
      tasksByCar,
      tasksByCustomer,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error retrieving maintenance tasks analysis data:", error);
    return NextResponse.json(
      { error: "Could not retrieve maintenance tasks analysis data: " + error.message },
      { status: 500 }
    );
  }
}
