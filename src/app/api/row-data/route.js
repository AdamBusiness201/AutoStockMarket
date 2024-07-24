import connectDB from "../../../lib/db";
import Car from "../../../models/Cars";
import Transaction from "../../../models/Transaction";
import Customer from "../../../models/Customer";
import CarDetails from "../../../models/CarDetails";
import MaintenanceTask from "../../../models/MaintenanceTasks";
import SoldCar from "../../../models/SoldCars";
import Partner from "../../../models/Partner";
import { NextResponse } from "next/server";
import moment from "moment";

export async function GET(req) {
  await connectDB();

  let startDate, endDate;
  const startDateParam = req.nextUrl.searchParams.get("startDate");
  const endDateParam = req.nextUrl.searchParams.get("endDate");

  if (startDateParam) {
    startDate = moment(startDateParam).startOf('day').toDate();
  }
  if (endDateParam) {
    endDate = moment(endDateParam).endOf('day').toDate();
  }

  const filter = {};
  if (startDate && endDate) {
    filter.createdAt = { $gte: startDate, $lt: endDate };
  } else if (startDate) {
    filter.createdAt = { $gte: startDate };
  } else if (endDate) {
    filter.createdAt = { $lt: endDate };
  }

  // Extract selected fields from query params
  const selectedFieldsParam = req.nextUrl.searchParams.getAll("fields");
  const selectedFields = new Set(selectedFieldsParam);

  const queries = [];

  if (selectedFields.has("car")) {
    queries.push(Car.find(filter).select(selectedFieldsParam.join(' ')).sort({ createdAt: -1 }));
  }
  if (selectedFields.has("transaction")) {
    queries.push(Transaction.find(filter).select(selectedFieldsParam.join(' ')).sort({ createdAt: -1 }));
  }
  if (selectedFields.has("customer")) {
    queries.push(Customer.find(filter).select(selectedFieldsParam.join(' ')).sort({ createdAt: -1 }));
  }
  if (selectedFields.has("carDetails")) {
    queries.push(CarDetails.find(filter).select(selectedFieldsParam.join(' ')).sort({ createdAt: -1 }));
  }
  if (selectedFields.has("maintenanceTask")) {
    queries.push(MaintenanceTask.find(filter).select(selectedFieldsParam.join(' ')).sort({ createdAt: -1 }));
  }
  if (selectedFields.has("soldCar")) {
    queries.push(SoldCar.find(filter).select(selectedFieldsParam.join(' ')).sort({ createdAt: -1 }));
  }

  try {
    const results = await Promise.all(queries);

    const response = {
      cars: results[0] || [],
      transactions: results[1] || [],
      customers: results[2] || [],
      carDetails: results[3] || [],
      maintenanceTasks: results[4] || [],
      soldCars: results[5] || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve data: " + error.message },
      { status: 500 }
    );
  }
}
