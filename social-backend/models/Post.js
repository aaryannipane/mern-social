const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: { type: String, max: 500 },
    image: {
      id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
    likes: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);
