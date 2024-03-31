import { Comment } from "../Models/Comments.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/asycHandler.js";
import { User } from "../Models/User.model.js";
import { Video } from "../Models/Video.model.js";
const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const videoId = req.params.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    const comment = await Comment.find({ video: videoId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("owner", "username email fullName")
      .sort({ createdAt: -1 });

    const totalComments = await Comment.countDocuments({ video: videoId });

    if (!comment || !totalComments) {
      throw new ApiError(404, "Video Comment not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { comment, totalComments },
          "Comment posted successfully"
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(404, "Error  found");
  }
});

const addComment = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { content } = req.body;

  try {
    if (!content) {
      throw new ApiError(401, "Comments are required");
    }

    const comment = await Comment.create({
      content,
      video: req.params.id,
      owner: user,
    });
    if (!comment) {
      throw new ApiError(401, "Comments are not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment posted successfully"));
  } catch (error) {}
});

const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const id = req.params.id;
  console.log(id);

  if (!id || !content) {
    throw new ApiError(401, "comments are required");
  }

  const updateComments = await Comment.findByIdAndUpdate(
    { _id: id },
    { $set: { content } },
    { new: true }
  );

  if (!updateComments) {
    throw new ApiError(401, "Comments not Found");
  }
  return res
    .status(200)
    .json(new ApiError(200, updateComments, "Comments update successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(401, "this Comments not found at this time");
  }

  const delete_comment = await Comment.findByIdAndDelete({ _id: id });
  if (!delete_comment) {
    throw new ApiError(401, "this Comments not found at this time");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        delete_comment,
        "Comments has  been delete successfully "
      )
    );
});

export { getVideoComments, addComment, updateComment, deleteComment };

// Aggregation Pipline for comments video and owner

// const aggregateComments = await Comment.aggregate([
//   {
//     $match: { _id: commentsObj._id } // Match the comment by its ID
//   },
//   {
//     $lookup: {
//       from: "videos",
//       localField: "video",
//       foreignField: "_id",
//       as: "videoData"
//     }
//   },
//   {
//     $unwind: "$videoData"
//   },
//   {
//     $lookup: {
//       from: "users",
//       localField: "owner",
//       foreignField: "_id",
//       as: "ownerData"
//     }
//   },
//   {
//     $unwind: "$ownerData"
//   },
//   {
//     $project: {
//       _id: 1,
//       content: 1,
//       createdAt: 1,
//       updatedAt: 1,
//       "videoData._id": 1,
//       "videoData.title": 1,
//       "videoData.description": 1,
//       "videoData.thumbnail": 1,
//       "ownerData._id": 1,
//       "ownerData.username": 1,
//       "ownerData.fullName": 1,
//       "ownerData.avatar": 1,
//     }
//   }
// ]);

// const populatedComment = await Comment.populate(commentsObj, {
//   path: "owner",
//   model: User,
//   select:
//     "-password -coverImage -refreshToken -createdAt -__v -updatedAt -avatar",
// });
