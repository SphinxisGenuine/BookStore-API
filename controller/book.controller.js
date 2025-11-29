import { Books } from "../MODEL/books.js";
import { ApiError } from "../utls/API-Error.js";
import { Apiresponse } from "../utls/API-response.js";
import { asyncHandler } from "../utls/asynchandler.js";

const uploadBook =asyncHandler(async(req,res)=>{
   const {Title,Author,Genre}= req.body;
const isBooksAvailable = await Books.findOne({Title})
if (isBooksAvailable){
      throw new ApiError(409,"Book With Same Title Available");
   }

const bookup = await Books.create({
    Title,
    Author,
    Genre
})
res.status(200).json(
    new Apiresponse(200,"Book Has Been Created")
)
})

const getBook = asyncHandler(async (req,res)=>{
    const {Title,Author,Genre} =req.body;
    if (Title||Author){
const found =await Books.findOne({$or: [{Title},{Author}]})
if (found){
const book={
    _id:found._id,
    Title:found.Title,
    Author:found.Author,
    Genre:found.Genre
}
 return res.status(200).json(
  new Apiresponse(200,book,"FEtced THe Book Succesfuly")
 ) 
}
}
if (Genre){
    const books= await Books.find({Genre})
    
    if (books.length>0){
        res.status(200).json(new Apiresponse(200,books,"Books With this Genre is Available "))
    }
}
        
throw new ApiError(404,"Couldnt Find THe Book With That Title ,Author or in that genre ")


})

const getBookWithId= asyncHandler(async (req,res)=>{
    const{_id} =req.params
    if (!_id){
        throw new ApiError(404,"Book With that id not find")
    }

    const book =await Books.findById({_id})
    if(book){
        const b={
            Title:book.Title,
            Author:book.Author,
            Genre:book.Genre
        }
        res.status(200).json(
            new Apiresponse(200,b,`Fetched The Book With This id ${_id} `)
        )
    }
})
  

export {
    uploadBook,
    getBook,
    getBookWithId
}