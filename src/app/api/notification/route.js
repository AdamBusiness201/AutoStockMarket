import connectDB from "../../../lib/db";
import Car from "../../../models/Cars";
import { NextResponse } from "next/server";
import moment from "moment"; // Import moment.js library for date manipulation

export async function GET(req) {
  await connectDB();

  try {
    const twoMonthsAgo = moment().subtract(2, 'months').startOf('day').toDate();
    
    // Filter to find cars stored for more than two months
    const filter = {
      entryDate: { $lte: twoMonthsAgo }  // Adjust the field name according to your database schema
    };

    const carsExceedingTwoMonths = await Car.find(filter).lean(); // .lean() for faster read-only results

    // Generate notifications for each car exceeding the storage limit
    const notifications = carsExceedingTwoMonths.map(car => ({
      title: 'Car Inventory Notification',
      date: moment().format('YYYY-MM-DD'),
      message: `Car with ID: ${car._id} has been in the inventory for over two months.`,
      carDetails: car
    }));

    const response = {
      count: notifications.length,
      notifications: notifications
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve data for cars stored for more than two months: " + error.message },
      { status: 500 }
    );
  }
}
