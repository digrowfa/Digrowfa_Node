import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema;

const enquirySchema = new mongoose.Schema(
    {
        batch: {
            type: ObjectId,
            ref: "Batch",
            required: [true, "Please enter the batch"]
        },
        name: {
            type: String,
            required: [true, "name is Required"]
        },
        mobile: {
            type: String,
            required: [true, "mobile number is Required"]
        },
        status: {
            type: String,
            required: true,
            enum: ["enquired", "onProcessing","completed"],
            default: "enquired"
        },
    },
    { timestamps: true }
)

export default mongoose.model("LiveEnquiry", enquirySchema)