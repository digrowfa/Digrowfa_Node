import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const offerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"],
    },
    discount: {
        type: String,
        required: true,
    },
    batch: {
        type: ObjectId,
        ref: "Batch",
    },
}, {
    timestamps: true
})

const Offer = mongoose.model('Offer', offerSchema)
export default Offer