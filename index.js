import dotenv from "dotenv";
import { connectDb } from "./db/index.js";
import app from "./app.js"
dotenv.config({
    path:"./.env"
})
const port = process.env.PORT||3000
connectDb()
.then(()=>{
    app.listen(port,()=>{console.log(`Server is listening on ${port} `)})
})
.catch((err)=>{
    console.log("There was error While Connecting to db")
})

