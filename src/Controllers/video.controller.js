import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../Models/Video.model.js";
import { User } from "../Models/User.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import {
  uploadFileCloudinaryStore as uploadOnCloudinary,
  cloudinaryDelete,
} from "../Utils/Cloudinary.js";
import asyncHandler from "../Utils/asycHandler.js";
import { videoDuration } from "@numairawan/video-duration";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType } = req.query;

  try {
    // Parse page and limit parameters to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    // Create an empty filter object initially
    let filter = {};

    // Apply query filter if query parameter is provided
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      };
    }

    // Create sort options if sortBy and sortType parameters are provided
    let sort = {};
    if (sortBy && sortType) {
      sort[sortBy] = sortType === "asc" ? 1 : -1;
    }

    // Build the aggregation pipeline
    const pipeline = [];

    // Add match stage to filter documents
    pipeline.push({ $match: filter });

    // Add sort stage to sort documents
    if (Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }

    // Add group stage to group videos by owner
    pipeline.push({ $group: { _id: "$owner", videos: { $push: "$$ROOT" } } });

    // Add pagination stage
    pipeline.push({ $skip: (pageNumber - 1) * pageSize });
    pipeline.push({ $limit: pageSize });

    // Execute the aggregation pipeline
    const videoGroups = await Video.aggregate(pipeline);
    // Flatten the array of video groups into a single array of videos
    // console.log(videoGroups[0]);
    const videos = videoGroups.reduce(
      (acc, curr) => acc.concat(curr.videos),
      []
    );
    // Filter videos based on owner ObjectId
    const filteredVideos = videos.filter(
      (video) => video.owner.toString() === req.user?._id.toString()
    );
    res.status(200).json(
      new ApiResponse(
        200,
        {
          filteredVideos,
          totalVideos: filteredVideos.length,
          totalPages: Math.ceil(filteredVideos.length / pageSize),
          currentPage: pageNumber,
        },
        "here a list of current user all videos"
      )
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos" });
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { title, description, isPublished } = req.body;
  if (!title || !description || !isPublished) {
    throw new ApiError(401, "All field are requird!");
  }
  // console.log(username)
  // const ownerId = await User.findOne({ username: username });
  // // console.log(ownerId)
  // if (!ownerId) {
  //   throw new ApiError(401, "User Id is missing");
  // }
  const owner = await User.aggregate([
    {
      $match: { username: username },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "username",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $arrayElemAt: ["$owner", 0],
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
  ]);
  const owners = owner[0];
  if (!owners) {
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
    owner: owners,
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
