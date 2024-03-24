import { Jwt } from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError";
import asyncHendler from "../Utils/asycHendler";
import fs from "fs";
import { User } from "../Models/User.model";
const publicKey = fs.readFileSync("../public.key");
export const verifyJwt = asyncHendler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header?.("Authorization").replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "UnAuthorize User");
    }

    const decodedValue = Jwt.verify(token, publicKey);

    const user = await User.findById(decodedValue?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access User");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid Access Token");
  }
});
