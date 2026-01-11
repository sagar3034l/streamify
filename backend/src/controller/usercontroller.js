import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

async function getRecommendedusers(req, res) {
    try {
        const currentuserId = req.user.id;
        const currentUser = req.user;

        const recommendedusers = await User.find({
            $and: [
                { _id: { $ne: currentuserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        });
        return res.status(200).json(recommendedusers);
    } catch (error) {
        console.error("Error in getRecomended controllers", error.message);
        res.status(500).json({ message: "Enternal server error" });
    }
}

async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullname profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in get my friend controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) {
            return res.status(400).json({
                message: "You cannot send a friend request to yourself",
            });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        if (recipient.friends.includes(myId)) {
            return res.status(409).json({
                message: "User is already your friend",
            });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(409).json({
                message: "Friend request already exists",
            });
        }

        const newRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (request.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept the request" });
        }

        request.status = "accepted";
        await request.save();

        // Update both users' friend lists
        await User.findByIdAndUpdate(request.recipient, {
            $addToSet: { friends: request.sender }
        });

        await User.findByIdAndUpdate(request.sender, {
            $addToSet: { friends: request.recipient }
        });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function getFriendRequest(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullname profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recipient", "fullname profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(200).json({ message: "Internal server error" });
    }
}

async function getOutGoingFriendsReqs(req, res) {
    try {
        const outGoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending"
        }).populate("recipient", "fullname profilePic nativeLanguage learningLanguage");
        res.status(200).json(outGoingRequests);
    } catch (error) {
        console.error("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {
    getRecommendedusers,
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    getOutGoingFriendsReqs
};
