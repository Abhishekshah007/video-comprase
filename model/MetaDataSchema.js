const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const metaDataSchema = new Schema(
  {
    originalFileName: { type: String, required: true },
    compressedFileName: { type: String, required: true },
    originalUrl: { type: String, required: true },
    compressedUrl: { type: String, required: true },
    originalFileSize: { type: Number, required: true },
    compressedFileSize: { type: Number, required: true },
    status: { type: String, default: "completed" },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("MetaData", metaDataSchema);
