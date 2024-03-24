import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFileCloudinaryStore = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("Failed To upload File");
    } else {
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });
      console.log("File upload successfully!", response.url);
      return response;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the file tamporary file if upload if faliled
    return null;
  }
};

export {uploadFileCloudinaryStore}