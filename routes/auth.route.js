import { Router} from "express";
import { changecurrentPassword, currentuser, forgotpasswordreq, logoutuser, refreshaccestoken, registerUser, resendEmailverification, resetForgotPassword, verifyemail } from "../controller/auth.controller.js";
import { validate } from "../midlleware/validator.middleware.js";
import {userRegisterValidator,userLoginValidator, userforgotpasswordvalidator, userchangecurrentpassvalidator}from "../validators/index.js";
import { login } from "../controller/auth.controller.js";
import { VErifyjwt } from "../midlleware/auth.middleware.js";
const router=Router()   


//unsecured  route 
router.route("/register").post(userRegisterValidator(),validate,registerUser)
router.route("/login").post(userLoginValidator(),login)
router.route("/verify-email/:verificationtoken").get(verifyemail);
router.route("/refresh-token").post(refreshaccestoken);
router.route("/forgot-password").post(userforgotpasswordvalidator(),validate,forgotpasswordreq);
router.route("/reset-password/:resetToken").post(userforgotpasswordvalidator(),validate,resetForgotPassword);


//secure
router.route("/logout").post(VErifyjwt,logoutuser)
router.route("/Cureent-user").post(VErifyjwt,currentuser)
router.route("/changePasswor").post(VErifyjwt,userchangecurrentpassvalidator(),changecurrentPassword)
router.route("/resend-email-verAuthRouterification").post(VErifyjwt,resendEmailverification)

export default router;