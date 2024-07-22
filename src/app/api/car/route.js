import connectDB from "../../../lib/db";
import mongoose from "mongoose"; // Import mongoose to use transactions
import Car from "../../../models/Cars";
import CarDetails from "../../../models/CarDetails";
import Partner from "../../../models/Partner";
import Transaction from "../../../models/Transaction";
import Invoice from "../../../models/Invoice";
import Installment from "../../../models/Installment";
import Customer from "../../../models/Customer"; // Import the Customer model
import { NextResponse } from "next/server";

// Create a new car and its details
export async function POST(req, res) {
  await connectDB();

  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction(); // Start the transaction

  try {
    const carData = await req.json();
    const {
      name,
      color,
      model,
      chassisNumber,
      engineNumber,
      plateNumber,
      odometerNumber,
      owner,
      purchaseDetails,
      entryDate,
      maintenance,
      currentLocation,
      partners,
      ownerID,
      ownerDrivingLicense,
      finance,
    } = carData;
    console.log(carData);
    const carExists = await Car.findOne(
      { chassisNumber, location: { $ne: "Sold" } },
      null,
      { session }
    ).sort({ createdAt: -1 });

    if (carExists) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: "Car already exists", carExists },
        { status: 400 }
      );
    }
    // Inside the try block of your POST method, after extracting request body variables
    let customer = await Customer.findOne({ name: owner }, null, {
      session,
    }).sort({ createdAt: -1 });
    if (!customer) {
      customer = new Customer({
        name: owner,
        nationalID: ownerID,
        drivingLicense: ownerDrivingLicense,
        // Additional fields can be included based on the incoming request if needed
      });
      await customer.save({ session });
    }
    const car = new Car({
      name,
      color,
      model,
      chassisNumber,
      engineNumber,
      plateNumber,
      odometerNumber,
      owner: customer._id,
      purchaseDetails,
      entryDate,
      maintenance,
      currentLocation,
    });

    await car.save({ session });

    const carDetails = new CarDetails({
      car: car._id,
      value: finance.price,
      sellingPrice: 0,
      capital: 0,
      maintenanceCosts: 0,
      netProfit: 0,
      currency: finance.currency,
      amountInWords: finance.amountInWords,
    });

    await carDetails.save({ session });

    const firstInstallmentRecord = new Installment({
      amount: finance.firstInstallment || finance.price,
      description: "First Installment",
      car: car._id,
    });

    await firstInstallmentRecord.save({ session });

    const invoices = [];

    const totalAmount = finance.price;

    for (const partner of partners) {
      let existingPartner = await Partner.findOne(
        {
          "contactInfo.phone": partner.phone,
        },
        null,
        { session }
      ).sort({ createdAt: -1 });

      if (!existingPartner) {
        const newPartner = new Partner({
          name: partner.name,
          type: partner.type,
          contactInfo: {
            email: partner.email,
            phone: partner.phone,
            address: {
              street: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
          },
          partnershipPercentage: partner.percentage,
          cars: [car._id],
        });
        await newPartner.save({ session });

        const partnerAmount = (partner.percentage / 100) * totalAmount;
        const partnerTransaction = new Transaction({
          type: "income",
          amount: partnerAmount,
          description: `Payment from partner ${partner.name} for the purchase of car with chassis number ${chassisNumber}`,
          car: car._id,
          partner: newPartner._id,
        });

        await partnerTransaction.save({ session });

        const partnerInvoice = new Invoice({
          transaction: partnerTransaction._id,
          customerType: "Partner",
          customer: newPartner._id,
          invoiceDate: new Date(),
          totalAmount: partnerAmount,
        });

        await partnerInvoice.save({ session });
        invoices.push(partnerInvoice);
      } else {
        existingPartner.cars.push(car._id);
        await existingPartner.save({ session });
      }
    }

    const purchaseAmount = finance.firstInstallment
      ? Math.min(finance.firstInstallment, finance.price)
      : finance.price;
    const purchaseTransaction = new Transaction({
      type: "expense",
      amount: purchaseAmount,
      description: `Purchase of car with chassis number ${chassisNumber}`,
      car: car._id,
      remainingAmount: finance.remainingAmount,
      bank: finance.bank,
      paymentMethod: finance.paymentMethod,
      paidCashOrChequeNumber: finance.paidCashOrChequeNumber,
      currency: finance.currency,
      amountInWords: finance.amountInWords,
    });

    await purchaseTransaction.save({ session });

    const purchaseInvoice = new Invoice({
      transaction: purchaseTransaction._id,
      customerType: "Customer",
      customer: customer._id,
      invoiceDate: new Date(),
      totalAmount: purchaseAmount,
    });

    await purchaseInvoice.save({ session });
    invoices.push(purchaseInvoice);

    await session.commitTransaction(); // Commit the transaction if all operations are successful
    session.endSession();

    return NextResponse.json({
      message: "Car created successfully",
      car,
      invoices,
    });
  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction on error
    session.endSession();
    console.error(error);
    return NextResponse.json(
      { error: "Could not create car: " + error.message },
      { status: 500 }
    );
  }
}

// Get all cars with pagination and filters
export async function GET(req, res) {
  // Connect to the database
  await connectDB();
  try {
    // Parse query parameters
    const searchParams = new URL(req.url).searchParams;
    let { page = 1, perPage = 10 } = Object.fromEntries(searchParams.entries());
    const name = searchParams.get("name");
    const color = searchParams.get("color");
    const model = searchParams.get("model");
    const chassisNumber = searchParams.get("chassisNumber");
    const entryDate = searchParams.get("entryDate");
    const partner = searchParams.get("partner"); // New query parameter

    // Convert to integers
    page = parseInt(page);
    perPage = parseInt(perPage);

    // Define the filter object
    const filter = {};
    if (name) filter.name = { $regex: new RegExp(name, "i") }; // Case-insensitive search
    if (color) filter.color = { $regex: new RegExp(color, "i") };
    if (model) filter.model = { $regex: new RegExp(model, "i") };
    if (chassisNumber)
      filter.chassisNumber = { $regex: new RegExp(chassisNumber, "i") };
    if (entryDate) {
      // Assuming entryDate is in a valid date format
      filter.entryDate = { $gte: new Date(entryDate) };
    }
    if (partner) {
      const partnerData = await Partner.findOne({
        $or: [
          { name: { $regex: new RegExp(partner, "i") } },
          { "contactInfo.phone": { $regex: new RegExp(partner, "i") } },
          { "contactInfo.email": { $regex: new RegExp(partner, "i") } },
        ],
      });

      if (partnerData) {
        filter._id = { $in: partnerData.cars }; // Filter by partner's cars
      } else {
        return NextResponse.json({ cars: [], totalCount: 0 }); // If no partner found, return empty result
      }
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * perPage;

    // Query cars with pagination and filters
    const cars = await Car.find(filter)
      .sort({ createdAt: -1 })
      .populate("owner")
      .skip(skip)
      .limit(perPage);

    // Get total count of cars (without pagination)
    const totalCount = await Car.countDocuments(filter);

    return NextResponse.json({ cars, totalCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve cars: " + error.message },
      { status: 500 }
    );
  }
}
