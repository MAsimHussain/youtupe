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
import {healthcheck} from "../Controllers/healthCheck.contorller.js"
/**************   Imports ************************ */
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

/*************  Secured Routes For Users  ***************************/
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changePassword);
router.get("/get-user", verifyJwt, getCurrentUser);
router.patch("/update-user", verifyJwt, updateAccountDetails);
router.patch(
  "/update-avatar",
  verifyJwt,
  upload.single("avatar"),
  updateAvatarImage
);
router.patch(
  "/update-cover-image",
  verifyJwt,
  upload.single("coverImage"),
  updateCoverImage
);
router.get("/channel/:username", verifyJwt, getUserChannelProfile);
router.get("/watch-hitory", verifyJwt, getWatchHistory);

/*************  Secured Routes Heath checking ***************************/

router.get("/health-check", verifyJwt, healthcheck);








/******** Export router *********** */
export default router;
