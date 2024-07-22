import connectDB from "../../../lib/db";
import SoldCar from "../../../models/SoldCars";
import Car from "../../../models/Cars";
import Customer from "../../../models/Customer";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect to the database

// POST: Create a new sold car record
export async function POST(req, res) {
  await connectDB();
  const { carId, previousOwner, purchaserId, purchaseDate, purchasePrice } = await req.json();
  try {
    // Validate existence of car and purchaser in the database
    const car = await Car.findById(carId);
    const purchaser = await Customer.findById(purchaserId);
    if (!car || !purchaser) {
      throw new Error("Car or Customer not found");
    }

    // Create a new sold car instance
    const soldCar = new SoldCar({
      car: carId,
      previousOwner,
      purchaser: purchaserId,
      purchaseDate,
      purchasePrice,
    });

    // Save the sold car to the database
    await soldCar.save();

    // Return a success message
    return NextResponse.json({
      message: "Sold car record created successfully",
      soldCar,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return NextResponse.json(
      { error: "Could not create sold car record: " + error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch all sold car records with pagination and optional filters
export async function GET(req, res) {
  await connectDB();
  try {
    // Parse query parameters
    const searchParams = new URL(req.url).searchParams;
    let {
      page = 1,
      perPage = 10,
      searchQuery,
      previousOwner,
      minPrice,
      maxPrice,
      startDate,
      endDate,
    } = Object.fromEntries(searchParams.entries());

    // Convert page and perPage to integers
    page = parseInt(page);
    perPage = parseInt(perPage);

    // Define the filter object
    const filter = {};

    // Handle search query for multiple fields
    if (searchQuery) {
      const purchaser = await Customer.find({ name: { $regex: searchQuery, $options: "i" } }).select('_id');
      const purchaserIds = purchaser.map(p => p._id);
      
      const car = await Car.find({ name: { $regex: searchQuery, $options: "i" } }).select('_id');
      const carIds = car.map(c => c._id);

      const dateQuery = new Date(searchQuery);
      
      filter.$or = [
        { car: { $in: carIds } },
        { purchaser: { $in: purchaserIds } },
        { previousOwner: { $regex: searchQuery, $options: "i" } },
        { purchaseDate: !isNaN(dateQuery) ? dateQuery : null }, // If searchQuery is a valid date
        { purchasePrice: !isNaN(parseFloat(searchQuery)) ? parseFloat(searchQuery) : null } // If searchQuery is a valid number
      ];
    }

    if (previousOwner) {
      filter.previousOwner = { $regex: previousOwner, $options: "i" }; // Case-insensitive regex search
    }
    if (minPrice) {
      filter.purchasePrice = { ...filter.purchasePrice, $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      filter.purchasePrice = { ...filter.purchasePrice, $lte: parseFloat(maxPrice) };
    }
    if (startDate) {
      filter.purchaseDate = { ...filter.purchaseDate, $gte: new Date(startDate) };
    }
    if (endDate) {
      filter.purchaseDate = { ...filter.purchaseDate, $lte: new Date(endDate) };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * perPage;

    // Query sold cars with pagination and filters
    const soldCars = await SoldCar.find(filter).sort({ createdAt: -1 })
      .populate("car") // Populate car details
      .populate("purchaser") // Populate purchaser details
      .skip(skip)
      .limit(perPage);

    // Get total count of sold cars (without pagination)
    const totalCount = await SoldCar.countDocuments(filter);

    return NextResponse.json({ soldCars, totalCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve sold car records: " + error.message },
      { status: 500 }
    );
  }
}
