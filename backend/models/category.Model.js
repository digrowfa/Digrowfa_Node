import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required: [true, "Please enter the category name"]
    },
    description:{
        type:String,
        default:null
    },
    status:{
        type:String,
        required:true,
        enum: ["active", "pending", "inactive"], 
        default: "active" 
    },
    image:{}
  },
  { timestamps: true }
);

export default mongoose.model("Categories", categorySchema);