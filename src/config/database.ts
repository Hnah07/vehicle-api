import mongoose from "mongoose";
import { MONGO_URI } from "./env";

const connectToDb = async () => {
  // Database connection
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("Database connection OK");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectToDb;
