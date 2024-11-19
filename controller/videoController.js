const Video = require("../model/MetaDataSchema");
const ffmpegStatic = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegStatic);

const fs = require("fs");
const path = require("path");
const { uploadToCloudinary } = require("../utils/cloudinary");

const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const uploadVideo = async (req, res) => {
  const file = req.file;

  if (!file) {
      return res.status(400).json({ success: false, message: "File not found" });
  }

  try {
      console.log("File received:", file);

      const originalFileName = file.originalname;
      const originalUrl = (await uploadToCloudinary(file.path)).url;

      const originalFileSize = fs.statSync(file.path).size;

      const compressedFileName = `${originalFileName.split(".")[0]}_compressed.mp4`;
      const compressedFilePath = `${tempDir}/${compressedFileName}`;

      await new Promise((resolve, reject) => {
          ffmpeg(file.path)
              .addOptions(["-vcodec libx264", "-crf 23", "-s 1280x720", "-b:a 128k"])
              .output(compressedFilePath)
              .on("end", resolve)
              .on("error", (err) => {
                  console.error("FFmpeg error:", err);
                  reject(err);
              })
              .run();
      });

      const compressedFileSize = fs.statSync(compressedFilePath).size;

      const compressedUrl = (await uploadToCloudinary(compressedFilePath)).url;

      fs.unlinkSync(file.path);
      fs.unlinkSync(compressedFilePath);

      const originalFileSizeMb = (originalFileSize / (1024 * 1024)).toFixed(2);
      const compressedFileSizeMb = (compressedFileSize / (1024 * 1024)).toFixed(2);

      const video = new Video({
          originalFileName,
          originalUrl,
          compressedFileName,
          compressedUrl,
          originalFileSize,
          compressedFileSize,
      });
      await video.save();

      res.status(200).json({
          success: true,
          message: "Video uploaded and compressed successfully",
          video: {
              originalFileName,
              originalUrl,
              compressedFileName,
              compressedUrl,
          },
          originalSize: `${originalFileSizeMb} MB`,
          compressedSize: `${compressedFileSizeMb} MB`,
      });
  } catch (error) {
      console.error("Error in uploadVideo:", error);
      res.status(500).json({ success: false, message: error.message });
  }
};


const downloadVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    res.redirect(video.compressedUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadVideo, downloadVideo };
