const cloudinary = require("../config/cloudinary");

// @desc   Upload an image to Cloudinary
// @route  POST /api/upload   (admin, multipart/form-data with field "image")
const uploadImage = async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res
        .status(500)
        .json({ message: "Image upload is not configured (missing Cloudinary keys)." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Convert the in-memory buffer into a data URI Cloudinary accepts
    const b64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "kayease-themes",
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage };
