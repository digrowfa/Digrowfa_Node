import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const batchSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required: [true, "Please enter the batch name"]
    },
    startDate:{
        type:Date,
        required:[true, "Please enter the startDate"]
    },
    endDate:{
        type:Date,
        required:[true, "Please enter the endDate"]
    },
    course: {
        type: ObjectId,
        ref: "Course",
    },
    workshop: {
        type: ObjectId,
        ref: "Workshop",
    },
    price: {
        type: Number,
        default:0,
        required: [true, "Please enter the price"]
    },
    discountPrice:{
        type: Number,
        default:0,
    },
    studentsEnrolled: [{ 
        type: ObjectId,
        ref: "User" 
    }],
    totalStudentsLimit:{
        type:Number,
        default:15
    },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);