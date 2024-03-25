import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
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

export default router;
