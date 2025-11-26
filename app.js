import express from "express"
    import cookieParser from "cookie-parser";
const app = express()

   
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())
import AuthRouter from "./routes/auth.route.js"


app.use("/api/v1/Auth",AuthRouter) 
 export default app