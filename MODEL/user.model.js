import mongoose , { Schema } from "mongoose";

import bcrypt from "bcrypt" 
import jwt from "jsonwebtoken"
import crypto from "crypto"
const userschema = new Schema(
    {
        avatar:{
            type:{
                url:String,
                localPath:String,
            },
            default:{   
                url:`https://placehold.co/200x200`,
                localPath:""
            }

        },
        username:{
            type : String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
        },
        fullname:{
            type:String,
            trim:true
        },
        password:{
            type:String,
            required:[true,"Password is required "]

        },
        isEmailVerified: {
            type:Boolean,
            default:false,
        },
        refreshtoken:{
            type:String
        },
        forgetpasswordtoken:{
            type:String
        },
        forgotpasswordexpiry:{
            type:Date
        },
        emailverificationtoken:{
            type:String
        },
        emailverificationExpiry:{
            type:Date
        }

    },{
      //time   
    }
)

userschema.pre("save",async function (){
    if(!this.isModified("password")) 
         {return }
const hash =await bcrypt.hash(this.password,10);
this.password = hash 
    return
})
userschema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}  
userschema.methods.generateraccectoken =function (){
   return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username

        },process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
    )
}
userschema.methods.generaterefreshtokens = function (){
    return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username

        },
        process.env.REFRESH_TOKEN_SECRET
        ,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
    )
}
    userschema.methods.generatetemoprarytoken= function (){
const unhashedtoken =crypto.randomBytes(20).toString("hex")
const hashedtoken = crypto
                .createHash("sha256")
                .update(unhashedtoken)
                .digest("hex")
const tokenexpriry=Date.now()+(20*60*1000)
return {unhashedtoken,hashedtoken,tokenexpriry}

    }
export const User = mongoose.model("User",userschema)