import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
const router = Router();
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
  } from "../Controllers/like.controller.js";
  



/******** Likes Routes  *********** */
router.post("/videos/:id/like", verifyJwt, toggleVideoLike);
router.post("/comments/:id/like", verifyJwt, toggleCommentLike);
router.post("/tweets/:id/like", verifyJwt, toggleTweetLike);
router.get("/liked-videos", verifyJwt, getLikedVideos);

export default router;