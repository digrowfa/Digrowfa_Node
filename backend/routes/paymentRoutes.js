import express from 'express'
import { user } from '../middleware/validator.js'
import { protect } from '../middleware/jwtToken.js'
import { razorpayPayment,successPay,paymentHistory,payVerification, razorPlanDetails,createSubscription } from '../controllers/paymentController.js'
const router = express.Router()

// router.get("/plans",razorPlanDetails )
//  router.post("/subscription/:id",createSubscription)
// router.post("/verification",payVerification )

router.post("/razorpay",razorpayPayment)
router.post("/razorpay/success",successPay)
router.get("/history/:id",paymentHistory)

export default router