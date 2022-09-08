import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import bodyparser from 'body-parser';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from './routes/categoryRoutes.js';
import languageRoutes from "./routes/languageRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import batchRoutes from "./routes/batchesRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import webinarRoutes from "./routes/webinarRoutes.js";
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import swaggerUI from "swagger-ui-express";
import Razorpay from 'razorpay'
import WorkshopRoutes from './routes/workshop.Routes.js'
import CouponRoutes from './routes/couponRoutes.js'
// Bring in the ability to create the 'require' method
import { createRequire } from "module";
const require = createRequire(import.meta.url); // construct the require method
const swaggerJSDocs = require("./swaggerApi.json") // use the require method}

dotenv.config();
const app = express();

connectDB()

// app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: false }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

//import fun


var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_USERNAME,
  key_secret: process.env.RAZORPAY_PASSWORD,
})

app.get('/', (req, res) => {
  res.send('API is running....');
});

app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/language', languageRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/offer', offerRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webinar', webinarRoutes);
app.use('/api/workshop', WorkshopRoutes);
app.use('/api/coupon', CouponRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);