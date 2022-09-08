import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const orderModel = new mongoose.Schema(
  {
    user: {
        type: ObjectId,
        ref: "User",
        required: [true, "Please enter the user"]
    },
    amount:{
        type:Number
    },
    payment_id:{
        type:String
    },
    currency:{
        type:String
    },
    course:{
        type: ObjectId,
        ref: "Course",
        required: [true, "Please enter the course"]
    },
    batch:{
        type: ObjectId,
        ref: "Batch",
        required: [true, "Please enter the batch"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order",orderModel);