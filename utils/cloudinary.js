const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 const uploadToCloudinary = async (file) => {
  try {
    if (!file) throw new Error("File path is invalid or missing");
    const res = await cloudinary.uploader.upload(file, {
      upload_preset: "video-compressor",
      resource_type: "video",
    });
    return res;
  } catch (err) {
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
};

module.exports = { uploadToCloudinary };