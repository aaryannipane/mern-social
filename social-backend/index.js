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
const multer = require("multer")
const path = require("path")

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

app.use("/images", express.static(path.join(__dirname, "public/images")))

// middleware
// for acceptiing json responses
app.use(express.json());
// helmet for secure headers in request
app.use(helmet());
// morgan for logger
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "public/images")
  },
  filename: (req, file, cb)=>{
    cb(null, req.body.name)
  }
})

const upload = multer({storage:storage})
app.post("/api/upload", upload.single("file"), (req, res)=>{
  try {
    return res.status(200).json("file uploaded success")
  } catch (error) {
    console.log(error);
  }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("server running on port 8800");
});
