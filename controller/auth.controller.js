import {User} from "../MODEL/user.model.js"
import { Apiresponse } from "../utls/API-response.js"
import { ApiError } from "../utls/API-Error.js"
import { asyncHandler } from "../utls/asynchandler.js"
import {emailverificationgencoontent, forgertpasssgencoontent, sendemail} from "../utls/email.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const generateaccesandreferesh=async(userId)=>{ 
   try {
    const user =await User.findById(userId);
    const accesToken = user.generateraccectoken();
    const refreshToken = user.generaterefreshtokens();
user.refreshtoken=refreshToken;
await  user.save({validateBeforeSave:false})
return {accesToken,refreshToken}
   } catch (error) {
    
    console.log(error);
    
    throw new ApiError(
        500,
        "Something Went Wrong While generating Acces token ",[error]
    )
   } 
}
const registerUser = asyncHandler(async (req,res)=>{
    const {email,username,password,role}=req.body;
const existedUser = await User.findOne({
    $or:[{username},{email}]
})
if (existedUser){
    throw new ApiError(409,"User with same email ot=r username already exists ",[])
}
const user = await User.create({
    email,
    password,
    username,
    isEmailVerified:false
})

const {unhashedtoken,hashedtoken,tokenexpriry} =user.generatetemoprarytoken()

user.emailverificationtoken=hashedtoken
user.emailverificationExpiry=tokenexpriry
await user.save({validateBeforeSave:false})
console.log("console reaches till here")
await sendemail(
    {
        email: user.email,
        subject:"Please Verify Your Email",
        mailgencontent:emailverificationgencoontent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/vi/user/verify-email/${unhashedtoken}`
        ),

    });
    const createduser=await User.findById(user._id).select(
        "-password -refreshtoken -emailverificationtoken -emailverificationExpiry"
    )

    if (!createduser){
        throw new ApiError (500,"Something Wentwrong while registring the usser")
        
        
    }
    res
        .status(201)
        .json(
            new Apiresponse(200,{user:createduser},"User Registered Succesfully and  email verification has been sent")
        )
    



})

const login =asyncHandler(async (req,res,next)=>{
const {email,password,username}=req.body
if(!username&&!email){
    throw new ApiError(400,"Username or email is required ")
}
const user = await User.findOne({email})
if(!user){
    throw new ApiError(400,"User does not exist ")
} 

const isPasswordValid =await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(400,"INvalid Credential")
    }
    
    const {accesToken,refreshToken } = await generateaccesandreferesh(user._id)

    const loginuser=await User.findById(user._id).select(
        "-password -refreshtoken -emailverificationtoken -emailverificationExpiry"
    )

   const option ={
    httpOnly:true,
    secure:true
   }
   return res.status(200)
   .cookie("accessToken",accesToken,option)
   .cookie("refreshToken",refreshToken,option)
   .json(
    new Apiresponse(200,{
        user:loginuser,
        accesToken,
        refreshToken

    },"User logged Succefuly")
   )
})
const logoutuser=asyncHandler(async (req,res,next)=>{
 
 await User.findByIdAndUpdate(
    req.user._id,
    {
        refreshtoken:""
    },
    {
        new:true
    },
)
 const option ={
    httpOnly:true,
    secure:true
 }
 return res
 .status(200)
 .clearCookie("accessToken",option)
 .clearCookie("refreshToken",option)
 .json(
    new Apiresponse(200,"User logged out ")
 )

})
const currentuser = asyncHandler(async(req,res)=>{
   return res
   .status(200)
   .json(
    new Apiresponse(200,req.user,"CUrrent User Succefuly fetched ")
   ) 
})
const verifyemail = asyncHandler(async(req,res)=>{
    const {verificationtoken}=req.params
if  (!verificationtoken){
    throw new ApiError(400,"Email verification is missing ")
}
const hashedtoken=crypto
.createHash("sha256")
.update(verificationtoken)
.digest("hex")
const user =await User.findOne(
    {
        emailverificationtoken:hashedtoken,
        emailverificationExpiry:{$gt:Date.now()}
    }
)
if(!user){
    throw new ApiError(400,"token invalid or missing ")    

}
user.emailverificationtoken=undefined
user.emailverificationExpiry=undefined
user.isEmailVerified=true,

await user.save({validateBeforeSave:false})
return   res
   .status(200)
   .json(
    new Apiresponse(200,{
        isEmailVerified :true
    },"Email is Verified  ")
   ) 
})
const resendEmailverification = asyncHandler(async(req,res)=>{
const user =await User.findById(req.user._id)
if(!user){
    throw new ApiError(404,"User Not Found")
}
if (user.isEmailVerified){
    throw new ApiError(409,"Email is Already Verified  ")

}
const {unhashedtoken,hashedtoken,tokenexpriry} =user.generatetemoprarytoken()

user.emailverificationtoken=hashedtoken
user.emailverificationExpiry=tokenexpriry
await user.save({validateBeforeSave:false})
console.log("console reaches till here")
await sendemail(
    {
        email: user.email,
        subject:"Please Verify Your Email",
        mailgencontent:emailverificationgencoontent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/vi/user/verify-email/${unhashedtoken}`
        ),

    });
    return res
    .status(200)
    .json (
        new Apiresponse(200,{},"Mail Has Been Sent to You")
    )
    



})
const refreshaccestoken =asyncHandler(async (req,res )=>{
const incomingrefreshtoken = req.cookie.refreshToken||req.body.refreshToken
if(!incomingrefreshtoken){
    throw new ApiError(401,"Unauthorize access")

} 


try {
    const decoded=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET )
    const user =await User.findById(decoded._id)
    if(!user){
        throw new ApiError (401,"Invalid refreshtoken ")
    }
    if(incomingrefreshtoken!==user.refreshtoken){
        throw new ApiError (401," refreshtoken is Expired  ")
    }
    const option ={
        httpOnly:true,
        secure:true
    }
    const {accesToken,refreshToken:newREfreshtoken}=await generateaccesandreferesh(user._id)
    user.refreshtoken=newREfreshtoken;
    await user.save()
    return res
    .status(200)
    .cookie("accesToken",accesToken,option)
    .cookie("refreshToken",newREfreshtoken,option)
    .json (
        new Apiresponse(200,{
            accesToken,refreshToken:newREfreshtoken

        },"Acces token refreshed ")
    )

} catch (error) {
    throw new ApiError(401,"Invalidd refresh token ")
    console.log (error)
}
})
const forgotpasswordreq  =asyncHandler(async (req,res )=>{
    const {email}=req.email
  const user = await User.findOne({email});
  if(!user){
    throw new ApiError(404,"User Not Found With That Email")
  }
  const {unhashedtoken,hashedtoken,tokenexpriry}=user.generatetemoprarytoken()
  user.forgetpasswordtoken=hashedtoken;
  user.forgotpasswordexpiry=tokenexpriry;
  
  await User.save({validateBeforeSave:false})
  sendemail(({
     email: user.email,
        subject:"Password reset",
        mailgencontent:forgertpasssgencoontent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedtoken}`
        ),
 
  }))
  res.status(200).json(
    new Apiresponse(200,{},"Password reset email has been sent to email id ")
  )
})
const resetForgotPassword =asyncHandler(async (req,res )=>{
    const{resetToken}=req.param
    const {newpassword}=req.body

    const hashedToken=  crypto.createHash("sha256").update(resetToken).digest("hex")
    const user =await User.findOne({
        forgetpasswordtoken:hashedToken,
        forgotpasswordexpiry:{$gt:Date.now( )}
    })
    if(!user){
        throw new ApiError(489,"Token is invalid or expired " )
    }
    user.forgetpasswordtoken=undefined,
    user.forgotpasswordexpiry=undefined;
    user.password=newpassword;
    await user.save({validateBeforeSave:false})
    res.send(200).json(
        new Apiresponse (200,{},"password reset  is done")
    )
})
const changecurrentPassword =asyncHandler(async (req,res )=>{
    const {oldpassword,newpassword}=req.body;
    const user =await User.findById(req.user._id)
const ispasswordValid=await user.isPasswordCorrect(oldpassword)
if(!ispasswordValid){
    throw new ApiError(400,"Old Password is Wrong")

}
user.password=newpassword
await  user.save({validateBeforeSave:false})
res.status(200).json(
    new  Apiresponse(200,{},"Password Change SussceFully")
)
    })
export {
 registerUser,
 login,
 logoutuser,
 currentuser,
 verifyemail,
 resendEmailverification,
 forgotpasswordreq,
 changecurrentPassword,
 resetForgotPassword,
 refreshaccestoken
}