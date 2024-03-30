import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../Models/Likes.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asycHendler.js";
import { Video } from "../Models/Video.model.js";
const toggleVideoLike = asyncHandler(async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user?._id.toString();

  try {
    if (
      !mongoose.isValidObjectId(userId) ||
      !mongoose.isValidObjectId(videoId)
    ) {
      throw new ApiError(400, "Invalid user ID or video ID");
    }

    const existingLike = await Like.findOne({
      likedBy: userId,
      video: videoId,
    });
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      res.json(
        new ApiResponse(200, existingLike, "Video unliked successfully")
      );
    } else {
      // Create a new Like instance directly
      const newLike = new Like({ likedBy: userId, video: videoId });
      await newLike.save();

      res.json(new ApiResponse(200, newLike, "Video liked successfully"));
    }
  } catch (error) {
    console.error("Error toggling video like:", error);
    throw new ApiError(400, "Invalid user ID or video ID");
  }
});
const toggleCommentLike = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user?._id.toString();

  try {
    if (
      !mongoose.isValidObjectId(commentId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      throw new ApiError(400, "Invalid user ID or Comment ID");
    }

    const exist_comments = await Like.findOne({
      likedBy: userId,
      comment: commentId,
    });

    if (exist_comments) {
      await Like.deleteOne({ _id: exist_comments._id });
      res.json(
        new ApiResponse(200, exist_comments, "Comment unliked successfully")
      );
    } else {
      const newComment = new Like({ likedBy: userId, comment: commentId });
      await newComment.save();
      res.json(
        new ApiResponse(200, newComment, "Comment unliked successfully")
      );
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Invalid user ID or Comments ID");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const tweetId = req.params.id;
  const userId = req.user?._id.toString();
  try {
    if (
      !mongoose.isValidObjectId(tweetId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      throw new ApiError(400, "User and Tweet Like not found");
    }

    const exist_tweets = await Like.findOne({
      tweet: tweetId,
      likedBy: userId,
    });

    if (exist_tweets) {
      await Like.deleteOne({ _id: exist_tweets._id });
      res
        .status(200)
        .json(new ApiResponse(200, exist_tweets, "Tweet unlike successfully"));
    } else {
      const tweet = new Like({ tweet: tweetId, likedBy: userId });
      await tweet.save();

      res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet Like successfully"));
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "User and Tweet Like not found");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  try {
    if (!userId) {
      throw new ApiError(400, "User and video Like not found");
    }

    const userLike = await Like.find({ likedBy: userId });

    if (!userLike) {
      throw new ApiError(400, "User and video Like not found");
    }

    const userLikedVideo = userLike.map((like) => like.video);
    const likedVideos = await Video.find({ _id: { $in: userLikedVideo } }); //get full details for videos
    return res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "All liked videos fetch successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Liked Video not found");
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
