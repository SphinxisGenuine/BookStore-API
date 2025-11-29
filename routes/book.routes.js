
import { Router} from "express";
import { validate } from "../midlleware/validator.middleware.js";
import { VErifyjwt } from "../midlleware/auth.middleware.js";
import { BookPostValidator, GetBook } from "../validators/bookvalidator.js";
import { getBook, getBookWithId, uploadBook } from "../controller/book.controller.js";
const router=Router() 

router.route('/UploadBook').post(VErifyjwt,BookPostValidator(),validate,uploadBook)
router.route('/getBooks').get(VErifyjwt,GetBook(),validate,getBook)
router.route('/getBook/:_id').get(VErifyjwt,GetBook(),validate,getBookWithId)


export default router