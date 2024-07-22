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

  // Additional category filters
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

  try {
    const totalCarsPromise = Car.find(carFilter).sort({ createdAt: -1 });
    const totalTransactionsPromise = Transaction.find(transactionFilter).sort({ createdAt: -1 });
    const totalCustomersPromise = Customer.find(customerFilter).sort({ createdAt: -1 });
    const totalSoldCarsPromise = SoldCar.find(carFilter).sort({ createdAt: -1 });
    const totalMaintenanceCostsPromise = MaintenanceTask.aggregate([
      { $match: filter },
      { $group: { _id: null, totalCost: { $sum: "$taskCost" } } },
    ]);
    const totalCustomerDebtPromise = Customer.aggregate([
      { $match: filter },
      { $group: { _id: null, totalDebt: { $sum: "$debts" } } },
    ]);
    const carDetailsPromise = CarDetails.find(carFilter).sort({ createdAt: -1 });
    const maintenanceTasksPromise = MaintenanceTask.find().sort({ createdAt: -1 });
    const recentTransactionsPromise = Transaction.find(transactionFilter).sort({ createdAt: -1 })
      .sort({ createdAt: -1 })
      .limit(5);
    const totalSellingPricesPromise = SoldCar.aggregate([
      { $match: filter },
      { $group: { _id: null, totalSellingPrices: { $sum: "$purchasePrice" } } },
    ]);

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
      totalSellingPrices
    ] = await Promise.all([
      totalCarsPromise,
      totalTransactionsPromise,
      totalCustomersPromise,
      totalSoldCarsPromise,
      totalMaintenanceCostsPromise,
      totalCustomerDebtPromise,
      carDetailsPromise,
      maintenanceTasksPromise,
      recentTransactionsPromise,
      totalSellingPricesPromise
    ]);

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

    // Format data for charts
    const formatChartData = (data, type) => {
      if (type === 'pie') {
        return {
          labels: data.map(item => item.label),
          series: data.map(item => item.value),
        };
      } else if (type === 'column' || type === 'line') {
        return {
          categories: data.map(item => item.category),
          series: [{
            name: 'Data',
            data: data.map(item => item.value),
          }],
        };
      }
      return {};
    };

    const carValueChartData = formatChartData(
      carDetails.map(car => ({
        category: new Date(car.createdAt).toLocaleDateString(),
        value: car.value,
      })),
      'line'
    );
    const maintenanceAmountsChartData = formatChartData(
      maintenanceTasks.map(task => ({
        category: new Date(task.createdAt).toLocaleDateString(),
        value: task.taskCost,
      })),
      'line'
    );
    const totalSellingPricesChartData = formatChartData(
      soldCars.map(car => ({ category: car.name, value: car.purchasePrice })),
      'column'
    );

    const transactionAmountsChartData = formatChartData(
      transactions.map(transaction => ({
        category: new Date(transaction.createdAt).toLocaleDateString(),
        value: transaction.amount,
      })),
      'line'
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
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve dashboard data: " + error.message },
      { status: 500 }
    );
  }
}
