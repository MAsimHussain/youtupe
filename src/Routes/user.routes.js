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
} from "../Controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { verifyJwt } from "../Middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),

  registerUser
);
router.post("/login", loginUser);

// Secured Routes
router.post("/logout", verifyJwt, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJwt, changePassword);
router.get("/user-profile", verifyJwt, getCurrentUser);
router.patch("/update-user", verifyJwt, updateAccountDetails);
router.put(
  "/update-user-avatar",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    // { name: "coverImage", maxCount: 1 },
  ]),
  updateAvatarImage,
  // updateAvatarImage
);
// router.put(
//   "/update-user-coverImage",
//   upload.fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 },
//   ]),
//   updateAvatarImage
// );

export default router;
