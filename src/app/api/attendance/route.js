import connectDB from "../../../lib/db";
import Attendance from "../../../models/Attendance";
import Employee from "../../../models/Employee";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDB();

  try {
    // Get all employees
    const employees = await Employee.find({}, "_id").sort({ createdAt: -1 });

    // Get the current date
    const currentDate = new Date().toISOString().split("T")[0]; // Extracting the date part only

    // Create unsigned attendance records for each employee
    const unsignedAttendancePromises = employees.map(async (employee) => {
      // Check if there's already an attendance record for the employee on the current day
      const existingAttendance = await Attendance.findOne({
        employee: employee._id,
        date: currentDate,
      }).sort({ createdAt: -1 });

      if (!existingAttendance) {
        // Create a new unsigned attendance instance
        const unsignedAttendance = new Attendance({
          employee: employee._id,
          date: currentDate,
          attendanceStatus: "Unsigned", // Set default attendance status to 'Unsigned'
          shift: null, // Set default shift to empty string
          timeIn: null, // Set timeIn to null initially
          timeOut: null, // Set timeOut to null initially
        });

        // Save the unsigned attendance record to the database
        await unsignedAttendance.save();
      }
    });

    // Execute all promises
    await Promise.all(unsignedAttendancePromises);

    // Return a success message
    return NextResponse.json({
      message:
        "Unsigned attendance records created successfully for all employees",
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return NextResponse.json(
      {
        error: "Could not create unsigned attendance records: " + error.message,
      },
      { status: 500 }
    );
  }
}
// Helper function to calculate value per day
const calculateValuePerDay = (salary) => salary / 30;

// Helper function to calculate number of working and absent days
const calculateAttendanceDays = (attendanceRecords, employeeId) => {
  let workingDays = 0;
  let absentDays = 0;

  attendanceRecords.forEach((record) => {
    if (record.employee._id.toString() === employeeId) {
      if (
        record.attendanceStatus === "Present" ||
        record.attendanceStatus === "Late"
      ) {
        workingDays += 1;
      } else if (record.attendanceStatus === "Absent") {
        absentDays += 1;
      }
    }
  });

  return { workingDays, absentDays };
};

export async function GET(req, res) {
  await connectDB();

  try {
    // Get all employees
    const employees = await Employee.find({}).sort({ createdAt: -1 });

    // Get all attendance records for the current month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const attendanceRecords = await Attendance.find({
      date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    }).populate("employee").sort({ createdAt: -1 });

    // Compute analytics for each employee
    const analytics = employees.map((employee) => {
      const { workingDays, absentDays } = calculateAttendanceDays(
        attendanceRecords,
        employee._id.toString()
      );
      const valuePerDay = calculateValuePerDay(employee.salary);
      const valueOfAbsences = absentDays * valuePerDay;
      const netSalary = employee.salary - valueOfAbsences;
      const commission = 0; // Assuming commission is calculated elsewhere or not applicable
      const total = netSalary + commission;

      return {
        employeeName: employee.name,
        salary: employee.salary,
        valuePerDay,
        workingDays,
        absentDays,
        valueOfAbsences,
        violations: 0, // Assuming violations are calculated elsewhere or not applicable
        advances: 0, // Assuming advances are calculated elsewhere or not applicable
        netSalary,
        commission,
        total,
      };
    });
    // Prepare the response data
    const attendanceSummary = employees.map((employee) => {
      // Filter records for the current employee and find all absence records
      const employeeAbsences = attendanceRecords.filter(
        (record) =>
          record.employee._id.toString() === employee._id.toString() &&
          record.attendanceStatus === "Absent"
      );

      // Sort absences by date to find the earliest and latest
      employeeAbsences.sort((a, b) => new Date(a.date) - new Date(b.date));
      const firstAbsence = employeeAbsences[0]
        ? employeeAbsences[0].date.toISOString().split("T")[0]
        : "No absences";
      const lastAbsence = employeeAbsences[employeeAbsences.length - 1]
        ? employeeAbsences[employeeAbsences.length - 1].date
            .toISOString()
            .split("T")[0]
        : "No absences";
      const totalAbsences = employeeAbsences.length;

      return {
        employeeName: employee.name,
        absencePeriod:
          employeeAbsences.length > 0
            ? `${firstAbsence} to ${lastAbsence}`
            : "No absences",
        totalAbsences,
      };
    });
    // Return the analytics and a unique list of all attendance records
    return NextResponse.json({
      analytics,
      attendanceRecords,
      attendanceSummary,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Could not fetch attendance analytics: " + error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, res) {
  await connectDB();

  const { _id, attendanceStatus, shift, timeIn, timeOut } = await req.json();
  const attendanceData = {
    attendanceStatus: attendanceStatus,
    shift: shift,
    timeIn: timeIn,
    timeOut: timeOut,
  };
  try {
    // Find the attendance record by ID
    const attendanceRecord = await Attendance.findOneAndUpdate(
      { _id: _id },
      { $set: attendanceData },
      { new: true }
    );

    // Return a success message
    return NextResponse.json({
      message: "Attendance record updated successfully",
      updatedAttendance: attendanceRecord,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return NextResponse.json(
      { error: "Could not update attendance record: " + error.message },
      { status: 500 }
    );
  }
}
