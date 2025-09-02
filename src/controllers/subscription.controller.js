import mongoose, {isValidObjectId} from mongoose
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async(req, res)=> {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "channelId is required")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "invalid channelId format")
    }

    const userId = req.user?._id
    if(!userId){
        throw new ApiError(400, "Userid is required")
    }

    if(channelId.toString() === userId.toString()){
        throw new ApiError(400, "you cannot subscribe to your own channel")
    }

    const existingSubsciption = await Subscription.findOne({
        subscriber:userId,
        channel:channelId,
    })

    if(existingSubsciption){
        await Subscription.findByIdAndDelete(existingSubsciption._id)
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Unsubscribe Successfully"
            )
        )
    }

    await Subscription.create({
        subscriber:userId,
        channel:channelId
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, "subscribed successfully")
    )
})

