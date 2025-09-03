import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId){
        throw new ApiError(400, "VideoId is missing")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId")
    }

    const userId = req.user?._id
    if(!userId){
        throw new ApiError("user id is missing")
    }

    const existLikedVideo = await Like.findOne({
        video: videoId,
        likedby: userId
    })
    //unlike liked video
    if(existLikedVideo){  
        await Like.findByIdAndDelete(existLikedVideo._id)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Video unliked successfully!!"
            )
        )
    }

    // liking video
    const like = await Like.create({
            video: videoId,
            likedby: userId
    })

    if(!like){
        throw new ApiError(500, "Failed to like")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            like,
            "Video is liked Successfully"
        )
    )


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if (!commentId?.trim()) {
        throw new ApiError(400,"commentId is missing");
        
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId format");
    }
    
    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400,"userId is required")
    }

    const existLikedcomment = await Like.findOne({
        comment:commentId,
        likedBy: userId
    })

     if (existLikedcomment) {
        await Like.findByIdAndDelete(existLikedcomment._id)
        return res.status(200).json(new ApiResponse(
            200,
            {},
            "Comment unliked successfully"
        ))

    }

    const commentlike  = await Like.create({
        comment:commentId,
        likedBy:userId,
        
    })

    if (!commentlike) {
        throw new ApiError(500,"Failed to like");
        
    }
     
     return res.status(200).json(new ApiResponse(
        200,
        commentlike,
        "Comment is liked successfully"
    ))
    
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}