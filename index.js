const express = require ('express')
const {loggermidlleware}=require('./midlleware/logger') 
const bookrouter=require('./routes/book.routes')    
const app = express()
const port =  8000;

   
app.use(express.json())
app.use(loggermidlleware)
//middleware plugin // many exist 

// removed all the routes and transfer to route folfder and insed of app changed thsa to router and exported it 
 
//routes access
app.use('/books',bookrouter)
app.listen(port,()=>{
    console.log(`server is tening on ${port}`)
})
 