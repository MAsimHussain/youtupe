import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../Models/Tweet.model.js";
import { User } from "../Models/User.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asycHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const user = req.user;
  try {
    if (!content || !user) {
      throw new ApiError(401, "Tweet content must be required");
    }

    const tweet = await Tweet.create({
      content,
      owner: user,
    });
    if (!tweet) {
      throw new ApiError(401, "Tweet content must be required");
    }

    //   const getTweet = await tweet.save()

    //   console.log(tweet.owner._id.toString())
    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet post successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(401, "User tweet not exist ");
  }
  const tweet = await Tweet.findOne({ _id: id });

  if (!tweet) {
    throw new ApiError(401, "User tweet not exist ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "get user tweet successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { content } = req.body;
  if (!id) {
    throw new ApiError(401, "id must be required");
  }

  const updatePost = await Tweet.findByIdAndUpdate(
    { _id: id },
    { $set: { content } },
    { new: true }
  );

  if (!updatePost) {
    throw new ApiError(401, "User tweet not exist ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatePost, "User Tweet Update  successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(404, "User id not found ");
  }
  const delete_tweet_id = await Tweet.findByIdAndDelete({ _id: id });

  if (!delete_tweet_id) {
    throw new ApiError(404, "User id not found ");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, delete_tweet_id, "User Tweet delete successfully")
    );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
