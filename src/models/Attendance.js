const mongoose = require("mongoose");
import Employee from "./Employee";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, default: new Date },
    attendanceStatus: {
      type: String,
      enum: ["Present", "Absent", "Late", "Unsigned"],
      default: "Unsigned",
    },
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Night"],
    },
    location: String,
    notes: String,
    timeIn: { 
      type: String, 
      required: function() { return this.attendanceStatus === 'Present' || this.attendanceStatus === 'Late'; } 
    },
    timeOut: { 
      type: String, 
      required: function() { return this.attendanceStatus === 'Present' || this.attendanceStatus === 'Late'; } 
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true }); // Add index for employee and date fields

module.exports = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
