import connectDB from "../../../lib/db";
import Car from "../../../models/Cars";
import Transaction from "../../../models/Transaction";
import Customer from "../../../models/Customer";
import CarDetails from "../../../models/CarDetails";
import MaintenanceTask from "../../../models/MaintenanceTasks";
import SoldCar from "../../../models/SoldCars";
import Partner from "../../../models/Partner";
import Attendance from "../../../models/Attendance";
import Bonus from "../../../models/Bonus";
import Deduction from "../../../models/Deduction";
import Invoice from "../../../models/Invoice";
import Installment from "../../../models/Installment";
import Employee from "../../../models/Employee";
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
    attendance: Attendance,
    bonus: Bonus,
    deduction: Deduction,
    invoice: Invoice,
    installment: Installment,
    employee: Employee,
  };

  // Define related schemas mapping for automatic inclusion
  const relatedSchemas = {
    car: ['transaction', 'customer', 'carDetails', 'maintenanceTask', 'soldCar', 'partner', 'installment'],
    customer: ['transaction', 'invoice'],
    partner: ['transaction', 'car'],
    employee: ['attendance', 'bonus', 'deduction'],
    transaction: ['car', 'customer', 'partner', 'invoice'],
    maintenanceTask: ['car'],
    invoice: ['transaction'],
    soldCar: ['car'],
  };

  // Automatically include related schemas
  schemasParam.forEach(schema => {
    if (relatedSchemas[schema]) {
      relatedSchemas[schema].forEach(related => {
        if (!schemasParam.includes(related)) {
          schemasParam.push(related);  // Add related schemas if not already included
        }
      });
    }
  });

  // Create queries for all requested schemas
  const queries = [];
  schemasParam.forEach((schema) => {
    if (schemaModels[schema]) {
      queries.push(
        schemaModels[schema]
          .find(filter)
          .sort({ createdAt: -1 })
      );
    }
  });

  try {
    const results = await Promise.all(queries);

    const response = {};
    schemasParam.forEach((schema, index) => {
      response[schema] = results[index] || [];
    });

    // Merge related data for each schema
    if (response.car) {
      response.car = response.car.map((car) => {
        const carDetails = response.carDetails?.find((detail) => detail.car.toString() === car._id.toString());
        const soldCarDetails = response.soldCar?.find((sold) => sold.car.toString() === car._id.toString());
        const transactions = response.transaction?.filter((txn) => txn.car?.toString() === car._id.toString());
        const installments = response.installment?.filter((inst) => inst.car?.toString() === car._id.toString());
        const partners = response.partner?.filter((partner) => partner.cars?.includes(car._id.toString()));

        return {
          ...car.toObject(),
          carDetails: carDetails || {},
          soldCarDetails: soldCarDetails || {},
          transactions,
          installments,
          partners,
        };
      });
    }

    if (response.customer) {
      response.customer = response.customer.map((customer) => {
        const invoices = response.invoice?.filter((inv) => inv.customer?.toString() === customer._id.toString());
        const transactions = response.transaction?.filter((txn) => txn.customer?.toString() === customer._id.toString());

        return {
          ...customer.toObject(),
          invoices,
          transactions,
        };
      });
    }

    if (response.partner) {
      response.partner = response.partner.map((partner) => {
        const cars = response.car?.filter((car) => partner.cars?.includes(car._id.toString()));
        const transactions = response.transaction?.filter((txn) => txn.partners?.includes(partner._id.toString()));

        return {
          ...partner.toObject(),
          cars,
          transactions,
        };
      });
    }

    if (response.employee) {
      response.employee = response.employee.map((employee) => {
        const attendances = response.attendance?.filter((att) => att.employee?.toString() === employee._id.toString());
        const bonuses = response.bonus?.filter((bonus) => bonus.employee?.toString() === employee._id.toString());
        const deductions = response.deduction?.filter((ded) => ded.employee?.toString() === employee._id.toString());

        return {
          ...employee.toObject(),
          attendances,
          bonuses,
          deductions,
        };
      });
    }

    if (response.transaction) {
      response.transaction = response.transaction.map((transaction) => {
        const car = response.car?.find((car) => car._id.toString() === transaction.car?.toString());
        const customer = response.customer?.find((customer) => customer._id.toString() === transaction.customer?.toString());
        const partners = response.partner?.filter((partner) => transaction.partners?.includes(partner._id.toString()));
        const invoice = response.invoice?.find((inv) => inv._id.toString() === transaction.invoice?.toString());

        return {
          ...transaction.toObject(),
          car: car || {},
          customer: customer || {},
          partners,
          invoice: invoice || {},
        };
      });
    }

    if (response.invoice) {
      response.invoice = response.invoice.map((invoice) => {
        const transaction = response.transaction?.find((txn) => txn._id.toString() === invoice.transaction?.toString());

        return {
          ...invoice.toObject(),
          transaction: transaction || {},
        };
      });
    }

    if (response.maintenanceTask) {
      response.maintenanceTask = response.maintenanceTask.map((task) => {
        const car = response.car?.find((car) => car._id.toString() === task.car?.toString());

        return {
          ...task.toObject(),
          car: car || {},
        };
      });
    }

    if (response.soldCar) {
      response.soldCar = response.soldCar.map((soldCar) => {
        const car = response.car?.find((car) => car._id.toString() === soldCar.car?.toString());

        return {
          ...soldCar.toObject(),
          car: car || {},
        };
      });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve data: " + error.message },
      { status: 500 }
    );
  }
}
