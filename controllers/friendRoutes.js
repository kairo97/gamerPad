//loop in dependencies
const express = require("express");
const { User, UserGame, Game, Platform, Account } = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");

//Add friend route
router.post("/addFriend", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to add a friend!" });
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const friendData = await User.findOne({where:{username:req.body.username}});

        if(!friendData) {
            return res.status(404).json({ message: "no such user"})
        }

        const userData = await User.findByPk(tokenData.id);
        
        if (!userData) {
            return res.status(404).json({ message: "token user wrong" });
        }

        if (friendData.friendCode != req.body.friendCode) {
            return res.status(404).json({ message: "User Friend Code is not a match" });
        }

        const addFriend1 = await userData.addUser(friendData.id)
        const addFriend2 = await friendData.addUser(tokenData.id)
        
        return res.json({ message: "friend added"})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding friend!" });
    }
})

// TODO: Remove friend route
router.delete("/:friendId", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to add a friend!" });
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const userData = await User.findByPk(tokenData.id);
        const friendData = await User.findByPk(req.params.friendId);
        
        if (!userData) {
            return res.status(404).json({ message: "token user wrong" });
        }

        if (!friendData) {
            return res.status(404).json({ message: "No such User" });
        }

        const removeFriend1 = await userData.removeUser(req.params.friendId)
        const removeFriend2 = await friendData.removeUser(tokenData.id)
        
        return res.json({msg:"Friend Removed"})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing friend!" });
    }
})

//See all friends for current logged in user
router.get("/currentUserFriends", async (req, res) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "you must be logged in to get current users friends!" });
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        const results = await User.findByPk(tokenData.id,{include:
            {
                model:User, 
                as: 'Friends', 
                foreignKey: 'FriendId', 
                attributes:["id", "username", "profilePicture"],
                include:[
                    {model:UserGame, 
                    // where:{favorite:true}, 
                    // limit:3,
                    attributes:["GameId", "favorite", "lookingForMore", "content", "value", "replay"],
                    include:[
                        {model:Game, attributes:["id", "title", "publisher", "releaseDate", ]},
                        {model:Platform, attributes:["id", "platform"]}
                    ]},
                    {model:Account, attributes:["id", "account", "type", "username", "gamerTag"]}
                ]
            }, 
            attributes:["id", "username", "profilePicture"] });

        if (results) {
            return res.json(results);
        } else {
            res.status(404).json({
                message: "No such User exists!"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting friend data" });
    }
})

module.exports = router;