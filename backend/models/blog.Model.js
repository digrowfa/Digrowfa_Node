import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const blogModel = new mongoose.Schema(
  {
    title:{
        type:String,
        required: [true, "Please enter the title"]
    },
    image:{
      type:{},
      required: [true, "Media file is required"]
    },
    text:{
        type:String,
        minlength: [40, "Your text must be longer than 40 characters"],
        required: [true, "Please enter the text"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogModel);