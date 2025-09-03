import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;
    if(!content){
        throw new ApiError(400, "content is required")
    }

    if(content.length>300){
        throw new ApiError(400, "comment must be under 300 character")
    }

    const ownerId = req.user?._id
    if(!ownerId){
        throw new ApiError(401, "please Login ")
    }

    const tweet = await Tweet.create({
        owner: ownerId,
        content: content
    })

    if(!tweet){
        throw new ApiError(400, "Something is wrong, write again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            tweet,
            "Tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params
    if(!userId){
        throw new ApiError(400, "user id is required")
    }
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userid")
    }

    if(userId.toString() !== req.user?.id.toString()){
        throw new ApiError(400, "Access Denied")
    }

    const tweets = await Tweet.find(
        {
            owner: userId,
        }
    ).sort({createdAt: -1})

    if(!tweets.length){
        throw new ApiError(404, "tweet not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "tweetId is required")
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweetId format")
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet does not exist")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "you are not authorized to access")
    }

    const {content} = req.body
    if(!content){
        throw new ApiError(400, "content is required")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,{
        $set: {content}
    },
        {new: true}
    )

    if(!updatedTweet) {
        throw new ApiError(500, "Something went wrong while updating the tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, updatedTweet, "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400, "tweetId is required")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(403, "Invalid tweetId: Access Denied")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404, "tweet does not exist")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "you are not allowed to deleted the tweet")
    }
    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(
        new ApiResponse (200, "Deletion successful !!")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}