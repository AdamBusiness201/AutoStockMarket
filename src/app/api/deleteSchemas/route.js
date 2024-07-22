import connectDB from "../../../lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// List of collections to preserve
const collectionsToPreserve = ['admins', 'employees'];

// DELETE: Delete all collections except Admin and Employee
export async function DELETE(req, res) {
  await connectDB();

  try {
    // Get all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();

    // Filter collections to delete
    const collectionsToDelete = collections
      .map(collection => collection.name)
      .filter(name => !collectionsToPreserve.includes(name));

    // Delete each collection
    for (const collectionName of collectionsToDelete) {
      await mongoose.connection.db.dropCollection(collectionName);
    }

    // Return success message
    return NextResponse.json({ message: "All collections deleted except Admin and Employee" });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return NextResponse.json(
      { error: "Could not delete collections: " + error.message },
      { status: 500 }
    );
  }
}
