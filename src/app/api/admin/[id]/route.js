import connectDB from "../../../../lib/db";
import Admin from "../../../../models/Admin";
import Employee from "../../../../models/Employee"; // Import the Employee model
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    // Connect to the database
    await connectDB();

    // Extract user ID from the request parameters
    const { id } = params;

    try {
        // Find the admin by ID
        const admin = await Admin.findById(id).sort({ createdAt: -1 });

        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        // Find associated employee by admin ID
        const employee = await Employee.findOne({ admin: id }).sort({ createdAt: -1 });
        // Merge admin and employee data into a single object
        const mergedData = { ...admin.toObject(), employee: employee ? employee.toObject() : null };

        // Return the merged data
        return NextResponse.json({ data: mergedData });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch admin and employee information: " + error.message }, { status: 500 });
    }
}
