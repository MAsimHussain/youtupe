import asycHendler from "../Utils/asycHendler.js";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/User.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import CircularJSON from "circular-json";
import { uploadFileCloudinaryStore as cloudinary } from "../Utils/Cloudinary.js";
const registerUser = asycHendler(async (req, res) => {
  //user details for frontend
  // validate - user or empty
  // check user if exist or not ( emial and username)
  // check images for avatar
  // upload to image to cloudinary success
  // create user to store db
  // remove passwor and access token to
  // check user creation
  // return response if success fully user registerd

  // desturcture the req.body

  const { username, email, fullName, password } = req.body;

  if (
    ![username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    new ApiError(400, "All field are required");
  } else {
    await User.findOne({
      $or: [{ username }, { email }],
    });
    console.log("userEmal", email);

    if (User) {
      throw new ApiError(
        409,
        "Email and User Name already exist! Try another one"
      );
    }
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImagelocal;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage > 0
  ) {
    coverImagelocal = req.files.coverImage[0];
  }
  if (!avatarLocalPath) {
    throw new ApiError(401, "Avatar Image are required!");
  }

  const avatar = await cloudinary(avatarLocalPath);
  const coverImage = await cloudinary(coverImagelocal);
  if (!avatar) {
    throw new ApiError(401, "Avatar File are required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const creatUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!creatUser) {
    throw new ApiError(500, "Server Error ");
  } else {
    return res
      .status(201)
      .json(new ApiResponse(200, creatUser, "user Register Successfully"));
  }
});

const AccessToken_RefreshToke = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error occurs in AccessToken and Refresh Token");
  }
};

const loginUser = asycHendler(async (req, res) => {
  // req .body -> data
  // check username or emial
  // find user
  // Access or refresh user
  // send cookie and res
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "User not Exist at this time");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(401, "User not Exist at this time");
  } else {
    const isPasswordValid = user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
  }

  const { accessToken, refreshToken } = await AccessToken_RefreshToke(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );


  const options = {
    httpOnly: true,
    secure: true,
  };
  const response = new ApiResponse(
    200,
    {
      user: loggedInUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
      success: true,
    },
    "User Login Successfully!"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(response);
});

const logoutUser = asycHendler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const opetions = {
    httpOnly: true,
    secure,
  };

  return res
    .status(200)
    .clearCookie("accessToke", accessToken, opetions)
    .cookie("refreshToken", refreshToken, opetions)
    .json(new ApiResponse(200, {}, "user Logout Successfully!"));
});

export { registerUser, loginUser, logoutUser };
