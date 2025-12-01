import express from "express"
    import cookieParser from "cookie-parser";
const app = express()

   
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())
import AuthRouter from "./routes/auth.route.js"
import BookRouter from "./routes/book.routes.js"

app.use("/",(req,res)=>{
    res.status(200).send("Welcome to bookstore")
})
app.use("/api/v1/Auth",AuthRouter) 
app.use("/Library",BookRouter)
 export default app