// require('dotenv').config

import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from './app.js'

dotenv.config()

// when we called function connectDB it will return a promise because we are using aync await in that Fn()
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})





// connectDB()
// .then(()=>{
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(`server is running at port ${process.env.PORT}`)
//     })
// })
// .catch((err) => {
//     console.log("MONGO db connection failed!!", err)
// })



































// ( async() => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error) => {
//         console.log("ERR ", error);
//         throw error
//        } )

//        app.listen(process.env.PORT, () => {
//         console.log(`App is listening on port ${process.env.PORT}`)
//        })


//     } catch (error) {
//         console.error("ERROR", error)
//         throw error
//     }
// }   )()
