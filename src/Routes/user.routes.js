import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatarImage,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../Controllers/user.controller.js";

import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
const router = Router();



/******************** ROUTER  ************************ */
router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),

  registerUser
);
router.post("/login", loginUser);



/*************  Secured Routes ***************************/
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changePassword);
router.get("/user-profile", verifyJwt, getCurrentUser);
router.patch("/update-user", verifyJwt, updateAccountDetails);
router.patch(
  "/update-avatar",
  verifyJwt,
  upload.single("avatar"),
  updateAvatarImage
);
router.patch(
  "/update-avatar",
  verifyJwt,
  upload.single("avatar"),
  updateCoverImage
);
router.get("/channel/:username", verifyJwt, getUserChannelProfile);
router.get("/watch-hitory", verifyJwt, getWatchHistory);



/******** Export router *********** */
export default router;
