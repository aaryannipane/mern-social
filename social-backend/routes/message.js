const router = require("express").Router();
const Message = require("../models/Message");

// add
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// get
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    console.log(messages);
    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

module.exports = router;
