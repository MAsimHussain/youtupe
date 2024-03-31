
import { Router } from "express";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
const router = Router();

import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
  } from "../Controllers/tweet.controller.js";
  


/******** Tweet Routs  *********** */
router.post("/post-tweet", verifyJwt, createTweet);
router.get("/get-tweet/:id", verifyJwt, getUserTweets);
router.patch("/update-tweet/:id", verifyJwt, updateTweet);
router.delete("/delete-tweet/:id", verifyJwt, deleteTweet);

export default router;