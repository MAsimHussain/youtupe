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
} from "../Controllers/playlist.controller.js";

/************************ Routes or Endpoint PlayList ******************* */
router.post("/creat-playlist/:id", verifyJwt, createPlaylist);
router.get("/get-playlists/:id", verifyJwt, getUserPlaylists);
router.get("/get-playlistbyId/:id", verifyJwt, getPlaylistById);
router.delete("/delete-playlist/:id", verifyJwt, deletePlaylist);
router.patch("/update-playlist/:id", verifyJwt, updatePlaylist);

export default router;
