import mongoose from "mongoose";
import { Subscription } from "../Models/Subscriptions.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asycHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.user?._id.toString();
  const userId = req.user?._id.toString();

  try {
    if (
      !mongoose.isValidObjectId(channelId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      throw new ApiError(400, "User ID and Channel ID are invalid");
    }

    const existingSubscription = await Subscription.findOne({
      channel: channelId,
      subscriber: userId,
    });

    if (existingSubscription) {
      await Subscription.deleteOne({ channel: channelId, subscriber: userId });
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existingSubscription,
            "Unsubscribed successfully"
          )
        );
    } else {
      const subscribed = new Subscription({
        channel: channelId,
        subscriber: userId,
      });

      await subscribed.save();
      return res
        .status(200)
        .json(new ApiResponse(200, subscribed, "Subscribed successfully"));
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "User ID and Channel ID are invalid");
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const channelId = req.user?._id.toString();
  try {
    if (!mongoose.isValidObjectId(channelId)) {
      throw new ApiError(400, "Channel ID is invalid");
    }

    const subscribers = await Subscription.find({
      channel: channelId,
    }).populate("channel", "username");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribers,
          "All subscribers fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Channel ID is invalid");
  }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId = req.user?._id.toString();

  try {
    if (!mongoose.isValidObjectId(subscriberId)) {
      throw new ApiError(400, "Channel ID is invalid");
    }
    const subscriber = await Subscription.find({
      subscriber: subscriberId,
    }).populate("subscriber", "username");

    return res
      .status(200)
      .json(new ApiError(200, subscriber, "fetch all subscriber successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Subscriber ID is invalid");
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
