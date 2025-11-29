
import mongoose ,{Schema} from "mongoose";

const bookschema = new Schema(
  {
    Title:{
      type:String,
      trim:true,
      unique:true
    },
    Author:{
      type:String,
      trim:true,
      unique:true
    },
    Genre:{
      type:String,
      trim:true,
      unique:true
    }
  }
)

export const Books = mongoose.model("Books",bookschema)