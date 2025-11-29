import {body, oneOf} from "express-validator"

const BookPostValidator= ()=>{
return [
    body("Title")
    .notEmpty()
    .withMessage("TIttle Cannot Be Empty")
    .trim()
    ,
    body("Genre")
    .notEmpty()
    .withMessage("Genre Cannot Be Empty")
    .trim(),
    body("Author")
    .notEmpty()
    .withMessage("Author Cannot Be Empty")
    .trim()
]
}
const GetBook=()=>{
return oneOf([
body("Title")
    .notEmpty()
    .withMessage("TIttle Cannot Be Empty")
    .trim()
    ,
    body("Genre")
    .notEmpty()
    .withMessage("Genre Cannot Be Empty")
    .trim(),
    body("Author")
    .notEmpty()
    .withMessage("Author Cannot Be Empty")
    .trim()
])
}

export {
    BookPostValidator,
    GetBook
}