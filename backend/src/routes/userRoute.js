import { getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequest, getOutGoingFriendsReqs, getRecommendedusers } from '../controller/usercontroller.js';
import protectRoute from '../middleware/authmiddleware.js';
import express from 'express'

const router = express();

router.use(protectRoute);

router.get('/',getRecommendedusers);
router.get('/friends',getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);

router.put('/friend-request/:id/accept',acceptFriendRequest);
router.get('/friend-request',getFriendRequest);

router.get('/outgoing-friend-requests',getOutGoingFriendsReqs)

export default router
