import {User} from "../MODEL/user.model.js"
import { ApiError} from"../utls/API-Error.js"
import {asyncHandler} from "../utls/asynchandler.js"
import jwt from "jsonwebtoken"

export const VErifyjwt= asyncHandler(async (req,res,next)=>{

const token =req.cookies?.accessToken||req.header("Authoroization")?.replace("Bearer ","")    
if(!token){
throw new ApiError(401,"Unathorized request ")
}
try {
    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
const user =await User.findById(decodedToken?._id).select( "-password -refreshtoken -emailverificationtoken -emailverificationExpiry")
 if(!user){
throw new ApiError(401,"Invalid acces Token ")
}   
req.user=user
next()
} catch (error) {
    throw new ApiError(401,"Invalid acces Token ")
    
}






})