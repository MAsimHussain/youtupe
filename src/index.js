// require('dotenv').config({path:"./env"})
import dotenv from 'dotenv'
import express from "express"
const app = express();
import Db_connection from './Database/Connection.js';
dotenv.config({path:"./env"})
Db_connection() // Database Connection Function 












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
