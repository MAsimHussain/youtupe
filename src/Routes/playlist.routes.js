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
router.post("/creat-playlist", verifyJwt, createPlaylist);
router.get("/get-playlists/:id", verifyJwt, getUserPlaylists);
router.get("/get-playlistbyId/:id", verifyJwt, getPlaylistById);
router.delete("/delete-playlist/:id", verifyJwt, deletePlaylist);
router.patch("/add-video-playlist/:videoId/:playlistId", verifyJwt, addVideoToPlaylist);
router.patch("/remove-video/:videoId/:playlistId", verifyJwt, removeVideoFromPlaylist);
router.patch("/update-playlist/:playlistId", verifyJwt, updatePlaylist);

export default router;
