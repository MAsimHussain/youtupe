import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "../Utils/ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFileCloudinaryStore = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Cover image not uploaded");
    } else {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      console.log("File upload successfully");
      fs.unlinkSync(localFilePath);
      return response;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the file tamporary file if upload if faliled
    return null;
  }
};

const cloudinaryDelete = async (deletedImage) => {
  try {
    const result = await cloudinary.uploader.destroy(deletedImage);
    return result;
  } catch (error) {
    throw new ApiError(402, "Error deleting image from Cloudinary");
  }
};

export { uploadFileCloudinaryStore, cloudinaryDelete };
