import Admin from "../models/admin.Model.js";
import generateToken from "../utils/generateToken.js";
import { validationResult } from 'express-validator';

export const adminSignIn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { user } = req.body
        const {email,password}=user
        let admin = await Admin.findOne({ email: email })
        if (!admin) return res.status(200).json({ errorcode: 2, status: false, msg: "Email Not Found", data: null });
        if (admin && (await admin.matchPassword(password))) {
            let data = {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin,
                token: generateToken(admin._id)
            }
            return res.status(200).json({ errorcode: 0, status: false, msg: "Admin SignIn Succesffull", data: data });
        }
        else return res.status(200).json({ errorcode: 3, status: false, msg: "Error", data: null });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const adminSignUp = async (req, res) => {
    console.log(req.body)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { email, password } = req.body
        if (!email || !password) return res.status(200).json({ errorcode: 2, status: false, msg: "Email or Passowrd can't be empty", data: null });
        let admin=new Admin({
            email,password
        })
        admin=await admin.save()
        console.log("admin",admin)
        if (admin){ 
            let data = {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin,
                token: generateToken(admin._id)
            }
            return res.status(200).json({ errorcode: 0, status: false, msg: "Admin SignUp Successfull", data: data });
        }else return res.status(200).json({ errorcode: 3, status: false, msg: "Error", data: null });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}
