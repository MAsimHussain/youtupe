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
import { healthcheck } from "../Controllers/healthCheck.contorller.js";
import {
  publishAVideo,
  getVideoById,
  updateVideo,
  updateThumbnail,
  deleteVideo,
  togglePublishStatus,
  getAllVideos,
} from "../Controllers/video.controller.js";
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

/*************  Secured Routes publish AVideo ***************************/
router.post(
  "/publish-video/:username",
  verifyJwt,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

router.get("/get-video/:id", verifyJwt, getVideoById);
router.patch("/update-video/:id", verifyJwt, updateVideo);
router.patch(
  "/update-thumbnail/:id",
  verifyJwt,
  upload.single("thumbnail"),
  updateThumbnail
);
router.delete("/delete-video/:id", verifyJwt, deleteVideo);
router.patch("/publish-status/:id", verifyJwt, togglePublishStatus);
router.get("/all-video", verifyJwt, getAllVideos);

/******** Export router *********** */
export default router;
