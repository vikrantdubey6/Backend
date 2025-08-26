import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from  "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"




const registerUser = asyncHandler( async (req, res) => {

    // details from frontend
    // validation not empty
    // check if already exist
    // check for avatar
    // upload them to cloudinary(avatar)
    // create user object create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res



  const {fullname, email, username, password}=  req.body
    console.log("email", email)


    // if (fullname == '') {
    //     throw new ApiError(400, "Full name is required")
    // }

    if(
        [fullname, email, username,password].some((field) => field ?.trim() === "" )
    ){
        throw new ApiError(400, "All field are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "user with email and username is already existed")
    }

   const avatarLocalPath = req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage[0]?.path

if (!avatarLocalPath) {
    throw new ApiError(400, "Avataar file is required")
} 

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400, "All field are required")
}


 const user = await User.create({ fullname, 
              avatar: avatar.url,
              coverImage: coverImage?.url || "",
              email, 
              password, 
              username: username.toLowerCase() , 
            })


const createdUser = await User.findById(user._id).select(`
    -password -refreshToken
    `)

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    return res.status(201).json(

        new ApiResponse(200, createdUser, "User registered Sucessfully!!")
    )





}  )

export {registerUser,}

