import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const { ObjectId } = mongoose.Schema;

export const Image = new mongoose.Schema(
    {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
    {
        _id: false,
    }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // required: true,
            trim: true,
            required: [true, "Please enter the Name"],
        },
        age: {
            type: Number,
            default: null,
        },
        email: {
            type: String,
            // required: true,
            // unique: true,
            required: [true, "Please enter the Email"],
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        },
        phone: {
            type: Number,
            required: true,
            required: [true, "Please enter the Phone Number"],
        },
        emailOtp:{
            type: String,
            default: null
        },
        phoneOtp: {
            type: String,
            default: null
        },
        isEmailVerified: {
            type: Boolean,
            required: false,
            default: false
        },
        isPhoneVerified: {
            type: Boolean,
            required: false,
            default: false
        },
        password: {
            type: String,
            required: false,
            required: [true, "Please enter the Password"],
        },
        image: {
            type: Image,
            required: false,
        },
        googleId: {
            type: String,
            required: false,
            default: null
        },
        wallet: {
            type: Number,
            // required: true,
            default: 0,
        },
        withdrawedWallet: {
            type: Number,
            // required: true,
            default: 0,
        },
        referralId: {
            type: String,
            default: null
        },
        referralNum: {
            type: Number,
            // required: true,
            default: 0,
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false,
        },
        razorpay_subscription_id: {
            type: String,
            default: null,
        },
        razorpay_seller: {
            type: String,
            default: null,
        },
        isSubscribed: {
            type: Boolean,
            default: false,
        },
        role: {
            type: [String],
            default: ["Subscriber"],
            enum: ["Subscriber", "Instructor", "Admin"],
        },
        signUpStatus: {
            type: String,
            required: true,
            enum: ["notCompleted", "completed"],
            default: "notCompleted"
        },
        courses: [{ type: ObjectId, ref: "Course" }],
        batches: [{ type: ObjectId, ref: "Batch" }],
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

const User = mongoose.model('User', userSchema)

export default User