import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
const router = Router();

import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
} from "../Controllers/comments.controller.js";

/******** Comments Routes  *********** */
router.post("/comment/:id", verifyJwt, addComment);
router.patch("/update-comment/:id", verifyJwt, updateComment);
router.delete("/delete-comment/:id", verifyJwt, deleteComment);
router.get("/get-video-comment/:id", verifyJwt, getVideoComments);

export default router;