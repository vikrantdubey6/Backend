import mongoose, { isValidObjectId } from "mongoose";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if(!title || !description){
        throw new ApiError(400, "Title and description are required")
    }

    const videoFileLocalPath = req.files?.videoFiles[0].path
    const thumbnailLocalPath = req.files?.thumbnail[0].path

    if(!videoFileLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video and Thumbnail files are required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile.url){

        throw new ApiError(400, "Video file is required")
    }

     if(!thumbnail.url){
        throw new ApiError(400, "video file is required")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thubnail:thumbnail.url,
        title,
        description,
        duration:videoFile.duration,
    })

    if(!video){
        throw new ApiError(500, "something went wrong while uploading the video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video uploaded sucessfully")
    )

})


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!videoId?.trim()){
        throw new ApiError(400, "videoID is missing")
    }

     if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId format");
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video does not exist")
    }
     return res
     .status(200)
     .json(
        new ApiResponse(200, video, "Video fetched Successfully")
     )
})


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
        if(!userId?.trim()){
            throw new ApiError(200, "userId is required")
        }

       if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid video format")
       } 

       const existUser = await User.findById(userId)
       if(!existUser){
        throw new ApiError(400, "User does not exist")
       }

           const skip = (page - 1) * limit;
           const sortOrder = sortType === "asc" ? 1 : -1;

        const matchStage = {
            owner: mongoose.Types.ObjectId(userId),
            title: {$regex: query, $options: "i"}
        }

        const aggregationPipeline = [
            {
                $match:matchStage
            },

            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },

            { 
                $unwind: "$owner" 
            },

            {
                $project: 
                {

                title: 1,
                description: 1,
                createdAt: 1,
                views: 1,
                isPublished: 1,
                thumbnail: 1,
                duration: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1
                }

            },
            
            { 
                $sort: { [sortBy]: sortOrder } 

            },
            {

                $facet:
                {
                    data: 
                    [
                        {
                            $skip: skip
                        },
                        {
                            $limit: parseInt(limit)
                        }
                    ],
                    totalCount: [

                        {
                            $count: "count"
                        }
                        
                    ]
                }

            }

        ]

})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}