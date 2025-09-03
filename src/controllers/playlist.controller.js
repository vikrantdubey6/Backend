import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!name || !description) {
        throw new ApiError(401, "name and desecription is required")
    }

    const userId = req.user?._id
    if(!userId){
        throw new ApiError(400, "userId access denied")
    }

    const createdplaylist = await Playlist.create({
        name: name,
        description:description,
        owner: userId
    })

    if(!createdplaylist){
        throw new ApiError(500, "failed to create the playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdplaylist,
            "Playlist created successfully!!"
        )
    )




})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId){
        throw new ApiError("userId is required")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "user is not valid")
    }

    if(req.user._id.toString() !== userId.toString()){
        throw new ApiError(403, "Access Denied")
    }

    const playlists = await Playlist.find({
        owner:userId
    }).populate("videos")

    if(!playlists){
        throw new ApiError(404, "Playlists not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlists,
            "playlists fetched successfully"
        )
    )


})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId){
        throw new ApiError(400, "playlist Id is required")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "playlistId: bad request ")
    }

    const playlist =  await Playlist.findById(playlistId)
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}