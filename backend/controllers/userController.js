import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
import User from '../models/user.Model.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.helper.js';
import { sendMail } from '../utils/sendMail.helper.js';
import { sendOTPSMS } from '../utils/sms.helper.js';
import { getRandomDigits } from '../utils/utility.helper.js';

export const signIn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { email, password } = req.body
        let user = await User.findOne({ email: email })
        if (!user) return res.status(200).json({ errorcode: 2, status: false, msg: "User doesn't Exist", data: null });
        const cmpPass = await comparePassword(password, user.password);
        if (!cmpPass) {
            res.status(200).json({ errorcode: 3, status: false, msg: "Incorrect Password.", data: null });
        } else {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "300d" });
            user = { ...user._doc, password: null, token };
            //await insertNotifcation({ userid: user._id, title: "Logged In", message: "Login Successfull" });
            return res.status(200).json({ errorcode: 0, status: true, msg: "Logged In successfully.", data: user });
        }
        // res.status(200).json({ errorcode: 0, status: false, msg: "User signup succesffull", data: null });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e, data: e });
    }
};

export const signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) return res.status(200).json({ errorcode: 2, status: false, msg: "Fill all the fields", data: null })

        const existingUser=await User.findOne({email:email})
        console.log(existingUser);
        if (existingUser) return res.status(200).json({ errorcode: 3, status: false, msg: "User already Present.Please Login", data: null })

        let newUser = await User.create({
            name, email, phone, password
        })
        if (newUser) {
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "300d" });
            newUser = { ...newUser._doc, password: null, token };
            return res.status(200).json({ errorcode: 0, status: false, msg: "User SignUp Successfull", data: newUser });
        }
    } catch (e) {
        return res.status(400).json({ status: false, msg: e.message, data: null });
    }
}

// export const emailSignUpStep1 = async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             let errs = [];
//             let err_msgs = { ...errors };
//             err_msgs.errors.forEach(err => errs.push(err.msg));
//             return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
//         }
//         const { email } = req.body
//         const userExist = await User.findOne({ email })
//         if (userExist) return res.status(200).json({ errorcode: 2, status: false, msg: "User Already Exist", data: userExist });
//         let user = new User({
//             email,
//         })
//         user = await user.save()
//         res.status(200).json({ errorcode: 0, status: false, msg: "Succesffully enrolled Email", data: user });
//     } catch (e) {
//         return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
//     }
// };

// export const SignUp = async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             let errs = [];
//             let err_msgs = { ...errors };
//             err_msgs.errors.forEach(err => errs.push(err.msg));
//             return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
//         }
//         const { email, password } = req.body
//         const userExist = await User.findOne({ email })
//         if (userExist && userExist.signUpStatus === "completed") {
//             return res.status(200).json({ errorcode: 2, status: false, msg: "User Already SignedUp", data: null })
//         }
//         if (!userExist) return res.status(200).json({ errorcode: 3, status: false, msg: "Email not present", data: null });
//         const hashedPassword = await hashPassword(password)
//         let otp = getRandomDigits();
//         userExist.password = hashedPassword,
//             userExist.signUpStatus = "completed",
//             userExist.emailOtp = otp
//         let user = await userExist.save()
//         const token = jwt.sign({ userId: userExist._id }, process.env.JWT_SECRET, {
//             expiresIn: "300d",
//         });
//         user = { ...user._doc, password: null, token };
//         let html = `
//             <p>Your Email OTP: ${otp} </p>
//         `;
//         await sendMail({ email: "abdulmanafp1996@gmail.com", name: "manaf", subject: "Change Email OTP", html });
//         res.status(200).json({ errorcode: 0, status: false, msg: "User SignUp Successfull.", data: user });
//     } catch (e) {
//         return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
//     }
// };


// export const verifyOtp = async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             let errs = [];
//             let err_msgs = { ...errors };
//             err_msgs.errors.forEach((err) => errs.push(err.msg));
//             return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
//         }
//         const { email, otp } = req.body;
//         let user = await User.findOne({ email: email, phoneOtp: otp });
//         if (!user) return res.status(200).json({ errorcode: 2, status: true, msg: "OTP not valid.", data: null });
//         if (user.emailOtp != otp) return res.status(200).json({ errorcode: 3, status: true, msg: "OTP not valid.", data: null });

//         if (user.emailOtp == otp) {
//             user.emailOtp = 0;
//             user.isEmailVerified = true;
//         }
//         user = await user.save();

//         // console.log("SEND: ", JSON.stringify(user));

//         return res.status(200).json({ errorcode: 0, status: true, msg: "OTP verified successfully.", data: { ...user._doc } });
//     } catch (e) {
//         return res.status(200).json({ errorcode: 4, status: false, msg: e.message, data: null });
//     }
// };

// export const SignUpOrLogin = async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             let errs = [];
//             let err_msgs = { ...errors };
//             err_msgs.errors.forEach(err => errs.push(err.msg));
//             return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
//         }
//         const { mobile } = req.body;

//         const user = await User.findOne({ phone: mobile })
//         let otp = getRandomDigits();
//         if (user) {
//             user.phoneOtp = otp;
//             await user.save()
//             const resp = await sendOTPSMS({ otp, numbers: mobile });
//             console.log("resp1111", resp);
//             return res.status(200).json({ errorcode: 0, status: true, msg: user, data: null });
//         } else {
//             let newUser = new User({
//                 phone: mobile,
//                 phoneOtp: otp
//             })
//             await newUser.save()
//             const resp = await sendOTPSMS({ otp, numbers: mobile });
//             console.log("resp2222", resp)
//             return res.status(200).json({ errorcode: 0, status: true, msg: user, data: null });
//         }
//     } catch (e) {
//         console.log(e)
//         return res.status(200).json({ errorcode: 5, status: false, msg: e, data: e });
//     }
// }


// export const verifyMobOtp = async (req, res) => {
//     console.log(" verifyMobOtp req.body", req.body)
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             let errs = [];
//             let err_msgs = { ...errors };
//             err_msgs.errors.forEach((err) => errs.push(err.msg));
//             return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
//         }
//         const { mobile, otp } = req.body;
//         let user = await User.findOne({ mobile: mobile, phoneOtp: otp });
//         if (!user) return res.status(200).json({ errorcode: 2, status: false, msg: "OTP not valid.", data: null });
//         // if (user.emailOtp != otp) return res.status(200).json({ errorcode: 3, status: true, msg: "OTP not valid.", data: null });
//         if (user.phoneOtp !== otp) return res.status(200).json({ errorcode: 3, status: false, msg: "OTP not valid.", data: null });
//         if (user.phoneOtp == otp) {
//             user.phoneOtp = 0;
//             user.isPhoneVerified = true;
//         }
//         user = await user.save();

//         console.log("SEND: ", JSON.stringify(user));

//         return res.status(200).json({ errorcode: 0, status: true, msg: "OTP verified successfully.", data: { ...user._doc } });
//     } catch (e) {
//         return res.status(200).json({ errorcode: 4, status: false, msg: e.message, data: null });
//     }
// };
