import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

export const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minlength: 200,
    },
    lessonSummary:
      [{
        type: String,
      }]
    ,
    video: {},
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const whoIs = new mongoose.Schema(
  {
    _id: {
      type: String
    },
    description: {
      type: String
    }
  },
  { timestamps: false }
);

export const carrier = new mongoose.Schema(
  {
    _id: {
      type: String
    },
    question: {
      type: String
    },
    answer: {
      type: String
    }
  },
  { timestamps: false }
);

export const bonusSchema = new mongoose.Schema(
  {
    _id:{
      type: String
    },
    title: {
      type: String
    },
    price: {
      type: Number
    },
  },
  { timestamps: false }
);

export const faqSchema = new mongoose.Schema(
  {
    _id:{
      type:String
    },
    question: { 
      type: String 
    },
    answer: { 
      type: String 
    }
  },
  { timestamps: false }
)

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    duration: {
      type: String,
      required: true,
    },
    description: {
      type: {},
      minlength: 200,
      required: true,
    },
    image: {},
    introVideo: {},
    category: {
      type: ObjectId,
      ref: "Categories",
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    image: {
      type: {},
      default: null,
    },
    language: [{
      type: ObjectId,
      ref: "Language",
      required: true,
    }],
    lessons: [lessonSchema],
    fieldWhy: {
      title: { type: String },
      description: { type: String },
      image: { type: String }
    },
    fieldWho: [whoIs],
    carrierOpps: [carrier],
    totalBonus:{type:String},
    bonuses: [bonusSchema],
    mentor: {
      name: { type: String },
      image: { type: String }
    },
    faq: [faqSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
