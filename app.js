import express from "express"
    
const app = express()

   
app.use(express.json({limit:"16kb"}))


app.use('/',(req,res)=>{
res.send('Welcome to book Store')
})

 export default app