import mongoose from "mongoose";
import { Playlist } from "../Models/Playlist.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asycHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const videoId = req.params.id;

  const ownerId = req.user?._id.toString();
  try {
    if (
      !mongoose.isValidObjectId(ownerId) ||
      !mongoose.isValidObjectId(videoId)
    ) {
      throw new ApiError(400, "Invalid video and Owner ID");
    }

    const createPlaylist = new Playlist({
      name,
      description,
      videos: videoId,
      owner: ownerId,
    });

    await createPlaylist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          createPlaylist,
          "Playlist has been created successfully"
        )
      );
  } catch (error) {
    throw error;
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId = req.params.id;

 try {
     if (!mongoose.isValidObjectId(userId)) {
       throw new ApiError(400, "Invalid  Owner ID");
     }
   
     const getPlaylists = await Playlist.find({ owner: userId });
     return res
       .status(200)
       .json(
         new ApiResponse(200, getPlaylists, "Fetch all user playlistsuccessfully")
       );
 } catch (error) {
     throw error
    
 }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

 try {
     if (!mongoose.isValidObjectId(playlistId)) {
       throw new ApiError(400, "Invalid  Playlist ID");
     }
     const playlistById = await Playlist.findOne({ _id: playlistId });
     return res
       .status(200)
       .json(
         new ApiResponse(
           200,
           playlistById,
           "Fetch user playlist ById successfully"
         )
       );
 } catch (error) {
    throw error
 }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

  try {
    if (!mongoose.isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid  Playlist ID");
    }
    const delete_playlistById = await Playlist.findOneAndDelete({ _id: playlistId });
    return res
      .status(200)
      .json(
        new ApiResponse(200, delete_playlistById, "user playlist deleted successfully")
      );
  } catch (error) {
    throw error
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const playlistId = req.params.id;

 try {
     if (!mongoose.isValidObjectId(playlistId) || !name || !description) {
       throw new ApiError(400, "name and description and alson valid playlist id is Required");
     }
     const updatePlaylist = await Playlist.findByIdAndUpdate(
       { _id: playlistId },
       { $set: { name, description } },
       {
         new: true,
       }
     );
     return res
       .status(200)
       .json(
         new ApiResponse(200, updatePlaylist, " playlist Update successfully")
       );
 } catch (error) {
     throw error
    
 }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
