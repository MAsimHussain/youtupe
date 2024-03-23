import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//core middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
//body parser middleware
app.use(express.json({ limit: "16kb" }));
// ulencoded middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// static public file middleware
app.use(express.static("public"));
// store data to client brower cookieParser  middleware
app.use(cookieParser());

export default app;
