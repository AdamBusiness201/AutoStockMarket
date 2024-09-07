import connectDB from "../../../../lib/db";
import SoldCar from "../../../../models/SoldCars";
import Employee from "../../../../models/Employee"; // Import the Employee model
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
      filter.createdAt = { $gte: startDate, $lt: endDate };
    } else if (startDate) {
      filter.createdAt = { $gte: startDate };
    } else if (endDate) {
      filter.createdAt = { $lt: endDate };
    }

    // Fetch sold cars data with the specified filters
    const [
      soldCars,
      totalSellingPrices,
      sourceOfSellingStats,
      salesMemberStats,
    ] = await Promise.all([
      SoldCar.find(filter).populate("car purchaser salesMember"),
      SoldCar.aggregate([
        { $match: filter },
        {
          $group: { _id: null, totalSellingPrices: { $sum: "$purchasePrice" } },
        },
      ]),
      SoldCar.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$sourceOfSelling",
            totalPrice: { $sum: "$purchasePrice" },
            totalCars: { $sum: 1 },
          },
        },
        { $sort: { totalPrice: -1 } }, // Sort by total price descending
      ]),
      SoldCar.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$salesMember",
            totalSales: { $sum: "$purchasePrice" },
            totalCars: { $sum: 1 },
          },
        },
        { $sort: { totalSales: -1 } }, // Sort by total sales descending
      ]),
    ]);

    // Retrieve sales member details
    const salesMembersDetails = await Employee.find({
      _id: { $in: salesMemberStats.map((stat) => stat._id).filter(Boolean) }, // Filter out null or undefined IDs
    }).select("name email position");

    // Map sales member details to their stats
    const detailedSalesMemberStats = salesMemberStats.map((stat) => {
      const member = salesMembersDetails.find(
        (member) => member._id?.toString() === stat._id?.toString()
      );
      return {
        ...stat,
        name: member?.name || "Unknown",
        email: member?.email || "N/A",
        position: member?.position || "N/A",
      };
    });

    const response = {
      totalSoldCars: soldCars.length,
      soldCars,
      totalSellingPrices: totalSellingPrices[0]?.totalSellingPrices || 0,
      sourceOfSellingStats,
      salesMemberStats: detailedSalesMemberStats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error retrieving sold car analysis data:", error);
    return NextResponse.json(
      { error: "Could not retrieve sold car analysis data: " + error.message },
      { status: 500 }
    );
  }
}
