// src/app/api/employee/salary.js
import connectDB from "../../../../lib/db";
import Employee from "../../../../models/Employee";
import Deduction from "../../../../models/Deduction";
import Bonus from "../../../../models/Bonus";
import { NextResponse } from "next/server";

// GET: Fetch salaries with bonuses and deductions
export async function GET(req, res) {
  await connectDB();

  try {
    const employees = await Employee.find().select('name salary').sort({ createdAt: -1 });

    const results = await Promise.all(employees.map(async (employee) => {
      const deductions = await Deduction.aggregate([
        { $match: { employee: employee._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const bonuses = await Bonus.aggregate([
        { $match: { employee: employee._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const totalDeductions = deductions.length > 0 ? deductions[0].total : 0;
      const totalBonuses = bonuses.length > 0 ? bonuses[0].total : 0;

      const netSalary = employee.salary + totalBonuses - totalDeductions;

      return {
        _id: employee._id,
        employeeName: employee.name,
        basicSalary: employee.salary.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        additions: totalBonuses.toFixed(2),
        netSalary: netSalary.toFixed(2),
      };
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not retrieve salary data: " + error.message },
      { status: 500 }
    );
  }
}
