import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({


        subscriber:{
            type: Schema.Types.ObjectId,  //one who gonna subscribe
            ref: User
        },

        channel:{
            type: Schema.Types.ObjectId, // to whose user gonna subscribe
            ref:User
        }




},{ timestamps:true })






export const Subscription = moongose.model("Subscription", subscriptionSchema)