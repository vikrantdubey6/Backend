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

    if(req.user?._id.toString() !== userId.toString()){
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

    const playlist =  await Playlist.findById(playlistId).populate("videos")

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "playlist fetched successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
     if(!playlistId || !name?.trim() || !description?.trim()){
        throw new ApiError(400,"All fields are required")
    }

     if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId format")
    }

     const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404,"Playlist is not found");
        
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "You are not authorized to update playlist");
    }

    const updatedplaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $set:{
            name, description
        }
    },
    {
        new: true
    }  )

    if (!updatedplaylist) {
        throw new ApiError(500, "Failed to update playlist")
    }

    return res.status(200).json(new ApiResponse(
        200,
        updatedplaylist,
        "Playlist updated successfully"
    ))



})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId){
        throw new ApiError(400, "playlistId and videoId is missing")
    }

    if(isValidObjectId(playlistId) || isValidObjectId(videoId)){
        throw new ApiError(400, "invalid Id format")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "you are not authorized to add video")
    }

    const added = await Playlist.findByIdAndUpdate(playlistId,{
        $addToSet:{
            videos: videoId
        },
    },
    {
        new:true
    }
    )

    if(!added){
        throw new ApiError(500, "Failed to addd")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            added,
            "video added successfully"
        )
    )

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!playlistId || !videoId){
        throw new ApiError(400, "PlaylistId and videoId is missing")
    }

    if(!isValidObjectId(playlistId) || (!isValidObjectId(videoId))){
        throw new ApiError(403, "invalid Id format")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "you are not authorized to remove video")
    }
    
    const removed = await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{videos: videoId}
    },
    {
        new:true
    })

    if(!removed){
        throw new ApiError(500, "Failed to remove")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            removed,
            "video removed successfully"
        )
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new ApiError(400, "PlaylistId is missing")
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "invalid playlilst id")
    }

    const playlist
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