import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";
const Db_connection = async () => {
  try {
    const connectionIstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    // console.log(
    //   `Database Connected... (${connectionIstance.connection.host})`
    // );
        console.log("Database Connected...")
    // console.log(`\n Database Connected ${connectionIstance.connection.host}`);
  } catch (error) {
    console.log("Database Connection Failed!", error);
    process.exit(1);
  }
};

export default Db_connection;
