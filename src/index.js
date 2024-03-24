// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";
import Db_connection from "./Database/Connection.js";
dotenv.config({ path: "./env" });
import app from "../src/app.js";

// Database Connection Function
Db_connection()
  .then(() => {
    app.on("error", (error) => {
      console.log("DB connection error", error);
      throw error;
    });
    app.listen(process.env.PORT , () => {
      console.log("Server Connected Successfully!");
    });
  })
  .catch((error) => {
    console.log("Database Connection Faild...", error);
  });







  
//BETTER APPROACH IS DATABASE IN ANOTHERS FILE
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("DB connection error", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`Database Connected Successfully! ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Database Connection Failed!", error);
//     throw error;
//   }
// })();
