import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
const router = Router();

import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../Controllers/playlist.controller";

/************************ Routes or Endpoint PlayList ******************* */
router.post("/endpoint", verifyJwt, createPlaylist);

export default router;
