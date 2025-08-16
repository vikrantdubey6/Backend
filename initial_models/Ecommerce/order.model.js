import mongoose from "mongoose"

const orderSchema = mongoose.Schema({

},{timestamps: true})

export const Order = new mongoose.model("Order", orderSchema)