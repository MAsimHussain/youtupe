import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";

const router = Router();
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
  } from "../Controllers/subscription.controller.js";

/******** toggle Subscription Routes  *********** */

router.post("/subscribed", verifyJwt, toggleSubscription);
router.get("/channel-subscriber", verifyJwt, getUserChannelSubscribers);
router.get("/subscribed-channel", verifyJwt, getSubscribedChannels);

export default router;