import Axios from "axios"
import { validationResult } from "express-validator";
import { sha256 } from "js-sha256"; "js-sha256"
import shortid from "shortid"
import Razorpay from "razorpay"
import User from '../models/user.Model.js';
import Order from '../models/order.Model.js'

var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_USERNAME,
    key_secret: process.env.RAZORPAY_PASSWORD
})

export const razorpayPayment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const payment_capture = 1
        const options = {
            amount: req.body.price * 100,
            currency: req.body.currency,
            receipt: shortid.generate(),
            payment_capture: payment_capture,
        }
        const response = await razorpay.orders.create(options)
        return res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
};

export const successPay = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const {options,orderdata}=req.body;
        const userEx = await User.findById(orderdata.user)
        if (!userEx) return res.status(200).json({ errorcode: 2, status: true, msg: "User data not found", data: null });
        await User.findByIdAndUpdate(orderdata.user, {
            $addToSet: { courses: orderdata.course }
        }).exec()
        await User.findByIdAndUpdate(orderdata.user, {
            $addToSet: { batches: orderdata.batch }
        }).exec()
        const order=new Order({
            currency:options.currency,
            amount:options.amount,
            payment_id:options.id,
            user:orderdata.user,
            course:orderdata.course,
            batch:orderdata.batch
        })
        order=await order.save()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Payment Successfull", data: null });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
};

export const paymentHistory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const {id}=req.params
        const data = await Order.find({user:id}).populate([
            { path: "course", model: "Course", select: "name image.location" },
        ])
        return res.status(200).json({ errorcode: 0, status: true, msg: "Oreder Data found", data: data });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
};

export const razorPlanDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const data = await instance.plans.all()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Plans Data found", data: data });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
};

export const createSubscription = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params;
        const { plan_id, total_count } = req.body;
        let user = await User.findById(id)
        if (!user) return res.status(200).json({ errorcode: 2, status: false, msg: "User Not Found", data: null });
        if (user.razorpay_subscription_id) {
            let paymentStatus = await instance.subscriptions.fetch(user.razorpay_subscription_id)
            if (paymentStatus.status === "active") return res.status(200).json({ errorcode: 3, status: false, msg: "Subscription Already Active", data: null });
        }
        const newSubscription = await instance.subscriptions.create({
            "plan_id": plan_id,
            "total_count": total_count,
            "quantity": 1,
            "customer_notify": 1
        })
        user.razorpay_subscription_id = newSubscription.id
        user = await user.save()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Subscribed Successfully", data: user });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e, data: null });
    }
};


export const payVerification = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body
        // let generated_signature = sha256(razorpay_payment_id + "|" + subscription_id, secret);
        // console.log("payment",generated_signature)
        // if (generated_signature == razorpay_signature) {
        //     console.log("payment is successful")
        // }
        // console.log(razorpay_signature)
        // if(razorpay_payment_id && razorpay_subscription_id && razorpay_signature){
        //     await User.find
        // }
        // const rapData=await instance.subscriptions.fetch(razorpay_subscription_id)
        const paymentSatus = await instance.payments.paymentVerification({
            'subscription_id': 'sub_ID6MOhgkcoHj9I',
            'payment_id': 'pay_IDZNwZZFtnjyym',
            'signature': '601f383334975c714c91a7d97dd723eb56520318355863dcf3821c0d07a17693'
        }, process.env.RAZORPAY_PASSWORD)
        console.log("payment", paymentSatus)
        return res.status(200).json({ errorcode: 0, status: true, msg: "Subscribed Successfully", data: null });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
};