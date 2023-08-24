const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new conv
router.post("/", async (req, res)=>{
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.reciverId]
    })

    try {
        const savedConversation = await newConversation.save()
        return res.status(200).json(savedConversation)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get conv of a user
router.get("/:userId", async (req, res)=>{
    try{
        const conversation = await Conversation.find({
            members: {$in:[req.params.userId]}
        })

        return res.status(200).json(conversation)
    }
    catch(err){
        return res.status(500).json(err)
    }
})


// get conversation of two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res)=>{
    try {
        const conversation = await Conversation.findOne({
            members: {$all:[req.params.firstUserId, req.params.secondUserId]}
        })

        return res.status(200).json(conversation)
    } catch (error) {
        return res.status(500).json(error)
    }
})


module.exports = router;
