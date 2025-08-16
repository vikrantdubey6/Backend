import mongoose from 'mongoose'
import { subTodo } from './sub_todo.models'


const todoSchema = new mongoose.Schema({

    content:{
        type: String,
        required: [true, "content is required"],
    },
    complete:{
        type: Boolean,
        default: false,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    subTodos:
    [
        {
            type: new mongoose.schema.Types.ObjectId,
            ref: "SubTodo"
        }

    ]


},{timestamps: true})



export const Todo = mongoose.model("Todo", todoSchema)

