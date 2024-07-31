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

export async function GET(req, { params }) {
  await connectDB();

  let startDate, endDate;
  const startDateParam = req.nextUrl.searchParams.get("startDate");
  const endDateParam = req.nextUrl.searchParams.get("endDate");
  const timeRange = req.nextUrl.searchParams.get("timeRange");

  console.log("Received timeRange:", timeRange);
  console.log("Received startDateParam:", startDateParam);
  console.log("Received endDateParam:", endDateParam);

  try {
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

    console.log("Computed startDate:", startDate);
    console.log("Computed endDate:", endDate);

    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: startDate, $lt: endDate };
    } else if (startDate) {
      filter.createdAt = { $gte: startDate };
    } else if (endDate) {
      filter.createdAt = { $lt: endDate };
    }

    console.log("Filter:", filter);

    const carCategory = req.nextUrl.searchParams.get("carCategory");
    const transactionCategory = req.nextUrl.searchParams.get("transactionCategory");
    const customerCategory = req.nextUrl.searchParams.get("customerCategory");

    const carFilter = { ...filter };
    if (carCategory) {
      carFilter.category = carCategory;
    }

    const transactionFilter = { ...filter };
    if (transactionCategory) {
      transactionFilter.category = transactionCategory;
    }

    const customerFilter = { ...filter };
    if (customerCategory) {
      customerFilter.category = customerCategory;
    }

    console.log("Filters applied: ", {
      carFilter,
      transactionFilter,
      customerFilter
    });

    const [
      cars,
      transactions,
      customers,
      soldCars,
      totalMaintenanceCosts,
      totalCustomerDebt,
      carDetails,
      maintenanceTasks,
      recentTransactions,
      totalSellingPrices,
    ] = await Promise.all([
      Car.find(carFilter),
      Transaction.find(transactionFilter),
      Customer.find(customerFilter).sort({ createdAt: -1 }),
      SoldCar.find(carFilter).sort({ createdAt: -1 }),
      MaintenanceTask.aggregate([
        { $match: filter },
        { $group: { _id: null, totalCost: { $sum: "$taskCost" } } },
      ]),
      Customer.aggregate([
        { $match: filter },
        { $group: { _id: null, totalDebt: { $sum: "$debts" } } },
      ]),
      CarDetails.find(carFilter),
      MaintenanceTask.find(),
      Transaction.find(transactionFilter).sort({ createdAt: -1 }).limit(5),
      SoldCar.aggregate([
        { $match: filter },
        { $group: { _id: null, totalSellingPrices: { $sum: "$purchasePrice" } } },
      ]),
    ]);

    console.log("Data fetched: ", {
      cars,
      transactions,
      customers,
      soldCars,
      totalMaintenanceCosts,
      totalCustomerDebt,
      carDetails,
      maintenanceTasks,
      recentTransactions,
      totalSellingPrices
    });

    let totalReceived = 0;
    let totalExpenses = 0;
    const transactionAmounts = transactions.map((transaction) => {
      if (transaction.type === "income") {
        totalReceived += transaction.amount;
        return transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpenses += transaction.amount;
        return transaction.amount;
      }
    });

    const partners = await Partner.find({}).sort({ createdAt: -1 });
    const totalPartners = partners.length;
    const totalPartnerPercentage = partners.reduce(
      (acc, partner) => acc + partner.partnershipPercentage,
      0
    );

    const carValues = carDetails.map((car) => car.value);
    const carValuesAmount = carDetails
      .map((car) => car.value)
      .reduce((partialSum, a) => partialSum + a, 0);

    const monthlyTransactions = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          earnings: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expenses: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formatChartData = (data, type) => {
      if (type === "pie") {
        return {
          labels: data.map((item) => item.label),
          series: data.map((item) => item.value),
        };
      } else if (type === "column" || type === "line") {
        return {
          categories: data.map((item) => item.category),
          series: [
            {
              name: "Data",
              data: data.map((item) => item.value),
            },
          ],
        };
      }
      return {};
    };

    const carValueChartData = formatChartData(
      carDetails.map((car) => ({
        category: new Date(car.createdAt).toLocaleDateString(),
        value: car.value,
      })),
      "line"
    );
    const maintenanceAmountsChartData = formatChartData(
      maintenanceTasks.map((task) => ({
        category: new Date(task.createdAt).toLocaleDateString(),
        value: task.taskCost,
      })),
      "line"
    );
    const totalSellingPricesChartData = formatChartData(
      soldCars.map((car) => ({ category: car.name, value: car.purchasePrice })),
      "column"
    );

    const transactionAmountsChartData = formatChartData(
      transactions.map((transaction) => ({
        category: new Date(transaction.createdAt).toLocaleDateString(),
        value: transaction.amount,
      })),
      "line"
    );

    const response = {
      totalCars: cars.length,
      cars,
      totalTransactions: transactions.length,
      transactions,
      totalCustomers: customers.length,
      customers,
      totalMaintenanceCosts: totalMaintenanceCosts[0]?.totalCost || 0,
      totalCustomerDebt: totalCustomerDebt[0]?.totalDebt || 0,
      carDetails: carDetails[0] || {},
      carValues,
      carValuesAmount,
      totalSellingPrices: totalSellingPrices[0]?.totalSellingPrices,
      maintenanceAmountsChartData,
      totalSoldCars: soldCars.length,
      soldCars,
      recentTransactions,
      totalReceived,
      totalExpenses,
      totalPartners,
      totalPartnerPercentage,
      earnings: recentTransactions
        .filter((tr) => tr.type === "income")
        .map((tr) => tr.amount),
      expenses: recentTransactions
        .filter((tr) => tr.type === "expense")
        .map((tr) => tr.amount),
      transactionAmounts,
      monthlyTransactions,
      carValueChartData,
      totalSellingPricesChartData,
      transactionAmountsChartData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error retrieving dashboard data:", error);
    return NextResponse.json(
      { error: "Could not retrieve dashboard data: " + error.message },
      { status: 500 }
    );
  }
}
