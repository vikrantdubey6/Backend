import mongoose from "mongoose"
import { Category } from "./category.model"

const productSchema = mongoose.Schema({

    description:{
        type: String,
        required: true,
    },
    name:{
        required: true,
        type: String,
    },
    productImage:{
        type:String,
    },
    price:{
        type: Number,
        default:0
    },
    stock:{
        type: Number,
        default:0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    owner:{
        type: mongoose.schema.Types.ObjectId,
        ref:"User",
        required:true
    },

}, {timestamp: true})

export const Product = new mongoose.model("Product", productSchema )