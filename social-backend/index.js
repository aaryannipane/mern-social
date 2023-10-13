const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const multer = require("multer");
const path = require("path");
var cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser"); // used to convert buffer image data to base64 string that is understand by cloudinary upload
const { log } = require("console");
const Post = require("./models/Post");

dotenv.config();

mongoose.set("strictQuery", true);

// database connection
mongoose.connect(
  process.env.MONGO_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log("Database connected");
  }
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
// for acceptiing json responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// helmet for secure headers in request
app.use(helmet());
// morgan for logger
app.use(morgan("common"));

// saves image to memory temporary
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const parser = new DatauriParser();
/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // console.log(req.body.name);
    // console.log(req.body);

    // convert buffer to base64 string
    const dataURI = await parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    );
    // console.log(dataURI.base64);
    const file = dataURI.content;
    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: "social-media",
      crop: "scale",
    });
    console.log(result);
    // save public url to database
    const newPost = await Post({
      userId: req.body.userId,
      desc: req.body.desc,
      image: { id: result.public_id, secure_url: result.secure_url },
    });
    const savedPost = await newPost.save();
    console.log(savedPost);
    return res.status(200).json(savedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
    console.log(error);
  }
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("server running on port 8800");
});
