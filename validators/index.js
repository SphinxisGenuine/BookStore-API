import { body } from "express-validator";


const userRegisterValidator = ()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Enter a Valid Email "),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("usernamme is required")
        .isLowercase()
        .withMessage("username must be in Lowercae")
        .isLength({min:3})
        .withMessage("username must be at least 3 chaaracter"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("password Should not be empty "),
        body("Fullname")
        .optional()
        .trim()
        .notEmpty(),        
    ]
}
const userLoginValidator=()=>{
return [
body("email")
.optional()
.isEmail()
.withMessage("Email is invalid"),
    body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    


]

}
const userchangecurrentpassvalidator=()=>{
return [
    body("oldPassword")
    .notEmpty()
    .withMessage(" oldpassword Cannot be empty"),
    body("newPassword")
    .notEmpty()
    .withMessage(" New Password Cannot be empty")

]
}
const userforgotpasswordvalidator=()=>{
return [
    body("email")
    .isEmail()
.withMessage("Email is invalid")
    .notEmpty()
    .withMessage("Email cannot be empty")
]
}
const userresetforgotpasswordvalidator=()=>{
return [
    body("NewPassword")
    .notEmpty()
    .withMessage("Password  is required ")
     

]
}
export {
    userRegisterValidator,
    userLoginValidator,
    userchangecurrentpassvalidator,
    userforgotpasswordvalidator,
userresetforgotpasswordvalidator

}