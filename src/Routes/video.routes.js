import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = Router();
import {
    publishAVideo,
    getVideoById,
    updateVideo,
    updateThumbnail,
    deleteVideo,
    togglePublishStatus,
    getAllVideos,
  } from "../Controllers/video.controller.js";
 
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
  
export default router;