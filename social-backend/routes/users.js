const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // if user tries to update password then encrypt password
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res
        .status(200)
        .json({ message: "Account has been updated", user });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can only update your account" });
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.deleteOne({ _id: req.params.id });
      return res.status(200).json({ message: "Account has been deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can only delete your account" });
  }
});

// get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username });
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );

    const friendList = await Promise.all(
      friends.map(async (friend) => {
        const { _id, username, profilePicture } = friend;
        return { _id, username, profilePicture };
      })
    );

    console.log(friendList);

    return res.status(200).json(friendList);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        // NEW THING FOR ME
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json({ message: "user is followed" });
      } else {
        return res
          .status(403)
          .json({ message: "you already follow this user" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(403).json({ message: "you can't follow your self" });
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.followers.includes(req.params.id)) {
        // NEW THING FOR ME
        await user.updateOne({ $pull: { followers: req.body.userId } });
        let data = await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });
        console.log(data);
        return res.status(200).json({ message: "user is unfollowed" });
      } else {
        return res.status(403).json({ message: "you dont follow this user" });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(403).json({ message: "you can't unfollow your self" });
  }
});

module.exports = router;
