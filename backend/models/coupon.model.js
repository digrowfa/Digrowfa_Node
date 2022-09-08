import mongoose from 'mongoose'

const couponSchema=mongoose.Schema(
    {
        couponCode:{
            type:String,
            req:[true,"Please enter the coupon code"]
        },
        discountPercentage:{
            type:Number,
            maxlength: [2, "Percentage should be less than 100"],
        }
    }
);

export default mongoose.model("Coupon",couponSchema) 