import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const languageSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required: [true, "Please enter the language"]
    },
  },
  { timestamps: true }
);

export default mongoose.model("Language", languageSchema);