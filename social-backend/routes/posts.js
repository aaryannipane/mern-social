const Post = require("../models/Post");
const User = require("../models/User");

const router = require("express").Router();

// create post
router.post("/", async (req, res) => {
  const newPost = await Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// update post
router.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "post not found" });

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.status(200).json({ message: "post updated success" });
    } else {
      return res
        .status(403)
        .json({ message: "you can update only your own post" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// delete post
router.delete("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "post not found" });

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json({ message: "post deleted success" });
    } else {
      return res
        .status(403)
        .json({ message: "you can delete only your own post" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// like a post
router.put("/:postId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post.likes?.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json({ message: "post is liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      return res.status(200).json({ message: "post is disliked" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get a post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "post not found" });
    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// get timeline posts of all users
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPost = await Post.find({ userId: currentUser._id });
    const followingPost = await Promise.all(
      currentUser.followings.map((followingId) => {
        // below statement is async but we cant use await inside map function thats why we use promise.all
        // we return promise in the array. promise.all solve this all promise
        return Post.find({ userId: followingId });
      })
    );

    console.log(userPost);
    return res.status(200).json(userPost.concat(...followingPost));
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    console.log(req.params.username);
    const posts = await Post.find({ userId: user._id });

    return res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// delete test posts
// router.post("/delete", async (req, res) => {
//   await Post.deleteMany({ desc: "" });
//   return res.status(200).json("post deleted");
// });

module.exports = router;
