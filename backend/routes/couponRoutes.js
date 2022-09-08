import express from "express";
const router=express.Router()
import {getAllCoupons,postCoupon} from '../controllers/coupon.Controller.js'

router.get('/',getAllCoupons)
router.post('/',postCoupon)

export default router