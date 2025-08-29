import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log("file is uploaded in Cloudinary", response.url);
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
     console.error("Cloudinary upload error:", error.message);
    fs.unlinkSync(localFilePath); //it will remove the locally saved temp file as the upload
    return null;
  }
};
export { uploadOnCloudinary };
