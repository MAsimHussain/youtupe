import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asycHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(404, "User not Found at this time");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "ok", "Health check passed"));
});

export { healthcheck };
