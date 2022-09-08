import Coupon from "../models/coupon.model.js";

export const postCoupon = async (req, res) => {
    try {
        const { couponCode, discountPercentage } = req.body;
        let newCoupon = new Coupon({
            couponCode,
            discountPercentage
        })
        newCoupon = newCoupon.save();
        return res.status(200).json({ errorcode: 0, status: true, msg: "Coupon Created Successfully", data: null })
    } catch (error) {
        return res.status(200).json({ errorcode: 0, status: true, msg: error.message, data: null })
    }
}

export const getAllCoupons = async (req, res) => {
    try {
        let coupons = await Coupon.find({})
        return res.status(200).json({ errorcode: 0, status: true, msg: "Coupon Data Found", data: coupons })
    } catch (error) {
        return res.status(200).json({ errorcode: 0, status: true, msg: error.message, data: null })
    }
}

// const checkCoupons = async (req, res) => {
//     try {
//         let coupons=await Coupon.find({})
//         return res.status(200).json({ errorcode: 0, status: true, msg: "Coupon Data Found", data: coupons })
//     } catch (error) {
//         return res.status(200).json({ errorcode: 0, status: true, msg:error.message, data: null })
//     }
// }


