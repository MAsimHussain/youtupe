import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

/************************ core middleware ********************************** */
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
//body parser middleware
app.use(express.json({ limit: "16kb" }));
// ulencoded middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// static public file middleware
app.use(express.static("public"));
// store data to client brower cookieParser  middleware
app.use(cookieParser());

/************************ Import Routers ***********************************/
import userRouters from "./Routes/user.routes.js";
import commentRouters from "./Routes/comments.routes.js";
import tweetRouters from "./Routes/tweet.routes.js";
import healthRouters from "./Routes/healthCheck.routes.js";
import likeRouters from "./Routes/like.routes.js";
import videoRoutes from "./Routes/video.routes.js";
import subscriptionRoutes from "./Routes/subscriptions.routes.js";

/************  ALL ROUTS ************************ */
app.use("/api/v1/users", userRouters);
app.use("/api/v1/c", commentRouters);
app.use("/api/v1/t", tweetRouters);
app.use("/api/v1/h", healthRouters);
app.use("/api/v1/l", likeRouters);
app.use("/api/v1/v", videoRoutes);
app.use("/api/v1/s", subscriptionRoutes);

export default app;
