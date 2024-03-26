import mongoose, { Schema } from "mongoose";
import  Jwt  from "jsonwebtoken";
import  bcrypt  from "bcrypt";
import fs from "fs";
const privateKey = fs.readFileSync("./private.key");
/**************** User Schema   **************/
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      lowercase: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },

  { timestamps: true }
);
/**************** Bcrypt Password Field **************/
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
/**************** Passwor field save to database**************/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password =  await bcrypt.hash(this.password, 10);
    next()
  } catch (error) {
    console.log(error)
  }
});
/**************** generateAccessToken  **************/
userSchema.methods.generateAccessToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    privateKey,
    { algorithm: "RS256" },
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
/**************** generateRefreshToken  **************/
userSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
    },
    privateKey,
    { algorithm: "RS256" },
    {
      expiresIn: process.env.REFERSH_TOKEN_EXPIRY,
    }
  );
};
/**************** Export User  **************/
export const User = mongoose.model("User", userSchema);
