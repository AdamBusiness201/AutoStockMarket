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
    startDate = moment(startDateParam).startOf("day").toDate();
  }
  if (endDateParam) {
    endDate = moment(endDateParam).endOf("day").toDate();
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
  const schemasParam = req.nextUrl.searchParams.getAll("schema");

  // Define the schema models mapping
  const schemaModels = {
    car: Car,
    transaction: Transaction,
    customer: Customer,
    carDetails: CarDetails,
    maintenanceTask: MaintenanceTask,
    soldCar: SoldCar,
    partner: Partner,
  };

  const queries = [];

  schemasParam.forEach((schema) => {
    if (schemaModels[schema]) {
      queries.push(schemaModels[schema].find(filter).sort({ createdAt: -1 }));
    }
  });

  try {
    const results = await Promise.all(queries);

    const response = {};
    schemasParam.forEach((schema, index) => {
      response[schema] = results[index] || [];
    });
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve data: " + error.message },
      { status: 500 }
    );
  }
}
