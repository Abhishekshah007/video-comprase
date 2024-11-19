const express = require("express");
const router = express.Router();
const { uploadVideo, downloadVideo } = require("../controller/videoController");
const multer = require("multer");

// Set up Multer for temporary file uploads
const upload = multer({ dest: "temp/" });

router.post("/upload", upload.single("video"), uploadVideo);
router.get("/:id/download", downloadVideo);

module.exports = router;
