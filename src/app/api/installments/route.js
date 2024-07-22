import connectDB from "../../../lib/db";
import Installment from "../../../models/Installment";
import CarDetails from "../../../models/CarDetails";
import Car from '../../../models/Cars'
import Transaction from "../../../models/Transaction";
import Invoice from "../../../models/Invoice";
import { NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function POST(req, res) {
  await connectDB();
  const { installmentDate, amount, description, paid, car, customerType, customerId } = await req.json();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch car details including selling price
    const carDetails = await CarDetails.findOne({ car: car._id }).session(session);

    if (!carDetails) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: "Car details not found" },
        { status: 404 }
      );
    }
    console.log("Car Details:", carDetails);
    // Debugging: Print car._id to ensure correct value
    console.log("Car ID:", car._id);

    // Fetch installments for the specified car
    const installments = await Installment.find({ car: car._id }).sort({ createdAt: -1 }).session(session);
    const carData = await Car.find({ _id: car._id }).session(session);

    // Calculate total installment amount for the car
    const totalAmount = installments.reduce(
      (total, installment) => total + installment.amount,
      0
    );

    console.log("Total Installments:", totalAmount);

    // Ensure that the sum of installments does not exceed the selling price
    if (+totalAmount + +amount > +carDetails.value) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        {
          error: `Total installments exceed the selling price of the car.`,
        },
        { status: 400 }
      );
    }

    // Create a new installment instance
    const installment = new Installment({
      installmentDate,
      amount,
      description,
      paid,
      car: car._id,
    });

    // Save the installment to the database
    await installment.save({ session });

    // Create a new transaction instance
    const transaction = new Transaction({
      type: "Installment Payment",
      date: installmentDate,
      amount,
      description,
      car: car._id,
    });

    // Save the transaction to the database
    await transaction.save({ session });
console.log(carData)
    // Create a new invoice instance
    const invoice = new Invoice({
      transaction: transaction._id,
      customerType: "Customer",
      customer: carData[0].owner,
      invoiceDate: new Date(),
      totalAmount: amount,
    });

    // Save the invoice to the database
    await invoice.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return a success message
    return NextResponse.json({
      message: "Installment record, transaction, and invoice created successfully",
      installment,
      transaction,
      invoice,
    });
  } catch (error) {
    // Handle any errors
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return NextResponse.json(
      { error: "Could not create transaction record: " + error.message },
      { status: 500 }
    );
  }
}
