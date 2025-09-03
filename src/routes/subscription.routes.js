import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT);

// Toggle subscription for a channel (subscribe/unsubscribe)
router.route("/toggle/:channelId").post(toggleSubscription);

// Get all subscribers of a channel (OWNER only)
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);

// Get all channels a user has subscribed to (SELF only)
router.route("/subscriptions/:subscriberId").get(getSubscribedChannels);



export default router