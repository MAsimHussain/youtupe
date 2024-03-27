import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../Models/Video.model.js";
import { User } from "../Models/User.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import {
  uploadFileCloudinaryStore as uploadOnCloudinary,
  cloudinaryDelete,
} from "../Utils/Cloudinary.js";
import asyncHandler from "../Utils/asycHendler.js";
import { videoDuration } from "@numairawan/video-duration";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { title, description, isPublished } = req.body;
  if (!title || !description || !isPublished) {
    throw new ApiError(401, "All field are requird!");
  }
  // console.log(username)
  const ownerId = await User.findOne({ username: username }).select(
    "-password -coverImage -updatedAt -createdAt -email -refreshToken -__v"
  );
  // console.log(ownerId)
  if (!ownerId) {
    throw new ApiError(401, "User Id is missing");
  }

  const uploadThumbnail = req.files?.thumbnail[0].path;
  const uploadVideo = req.files?.videoFile[0].path;

  if (!uploadThumbnail || !uploadVideo) {
    throw new ApiError(401, "Thumbnail or Video are missing");
  }

  const thumbnailCloudinary = await uploadOnCloudinary(uploadThumbnail);
  const videoCloudinary = await uploadOnCloudinary(uploadVideo);
  if (!thumbnailCloudinary || !videoCloudinary) {
    throw new ApiError(
      401,
      "Thumbnail or Video Error while uploading  to cloudinary store"
    );
  }

  // Using a video URL
  const videoUrl = videoCloudinary.url;
  const duration = await videoDuration(videoUrl);
  const newVideo = new Video({
    videoFile: videoCloudinary?.url,
    thumbnail: thumbnailCloudinary?.url,
    title,
    description,
    isPublished: isPublished,
    duration: duration.seconds, // Assign the correct duration value
    owner: ownerId,
  });
  const video = await newVideo.save();
  console.log("New video saved successfully.");
  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "video has been published successfully!")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(404, "Video ID not found");
  }

  const video = await Video.findById({ _id: id });

  if (!video) {
    throw new ApiError(404, "Video  not found at this time");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Current video available successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(404, "video ID not found");
  }
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(404, "Title and description are required");
  }

  const video = await Video.findByIdAndUpdate(
    { _id: id },
    { $set: { title, description } },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video  not found at this time");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video update successfully"));
});

const updateThumbnail = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const localThumbnail = req.file?.path;

  if (!id) {
    throw new ApiError(401, "Video file ID is missing");
  }

  if (!localThumbnail) {
    throw new ApiError(401, "Thumbnail file is missing");
  }
  const thumbnail = await uploadOnCloudinary(localThumbnail);

  const video = await Video.findById({ _id: id });
  if (!thumbnail?.url) {
    throw new ApiError(401, "Thumbnail URL is missing from Cloudinary");
  } else {
    if (video?.thumbnail) {
      const prevThumbnail = video.thumbnail.split("/").pop().split(".")[0];
      console.log("Previous Thumbnail Public ID:", prevThumbnail); // Add this line for debugging
      await cloudinaryDelete(prevThumbnail);
      console.log("Previous Thumbnail Deleted from Cloudinary"); // Add this line for debugging
    }
  }

  const newThumbnail = await Video.findByIdAndUpdate(
    video?._id,
    { $set: { thumbnail: thumbnail.url } },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, newThumbnail, "Thumbnail file uploaded successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(401, "Error Video Id is missing");
  }

  const del = await Video.findByIdAndDelete({ _id: id });
  if (!del) {
    throw new ApiError(401, " Video Not delete");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, del, "Video file Delete successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(401, "Publish Status Id is missing");
  }

  try {
    const video = await Video.findById({ _id: id });
    if (!video) {
      throw new ApiError(401, "Video Id not match ");
    }

    if (video.isPublished == false) {
      video.isPublished = true; // Toggle to true
    }
    const publishStatusUpdate = await video.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, publishStatusUpdate, "Video Publish successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "SErver Error ");
  }
});

export {
  getAllVideos,
  publishAVideo,
  updateThumbnail,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
