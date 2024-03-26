import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../Models/Tweet.model.js"
import {User} from "../Models/User.model.js"
import {ApiError} from "../Utils/ApiError.js"
import {ApiResponse} from "../Utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}