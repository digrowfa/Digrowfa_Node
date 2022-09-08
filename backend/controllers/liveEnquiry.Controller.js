import { validationResult } from 'express-validator';
import batchModel from '../models/batch.Model.js';
import Enquiry from '../models/liveEnquiry.Model.js'
import { sendMail } from '../utils/sendMail.helper.js';

export const getAllEnquiries = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const data = await Enquiry.find({}).populate("batch", 'name startDate')
        return res.status(200).json({ errorcode: 0, status: false, msg: "Enquiry Data Found", data: data })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const createNewEnquiry = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { name, batch, mobile } = req.body
        const batchPresent = await batchModel.findById(batch)
        if (!batchPresent) return res.status(200).json({ errorcode: 0, status: false, msg: "Batch Not Found Found", data: null })
        let enquiry = new Enquiry({
            name,
            batch,
            mobile,
        })
        enquiry = await enquiry.save()
        //     let html = `
        //     <h3>NEW LIVE DEMO ENQUIRY</h3>
        //     <p>Name  : <b>${name}</b> </p>
        //     <p>Batch : <b>${enquiry.batch.name} - ${enquiry.batch.startDate}</b> </p>
        //     <p>Mobile: <b>${mobile}</b> </p>
        // `;
        // const resp=await sendMail({ email: "digrowfa@gmail.com", name: "manaf", subject: "LIVE DEMO ENQUIRY", html });
        // console.log("Email::resp:::",resp)
        return res.status(200).json({ errorcode: 0, status: true, msg: "Successfully submitted enquiry", data: enquiry })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const updateEnquiry = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { status } = req.body;
        console.log(req.body)
        const {id}=req.params;
        console.log("sattus",status)
        let enquiryPresent = await Enquiry.findById(id)
        if (!enquiryPresent) return res.status(200).json({ errorcode: 2, status: false, msg: "Enquiry Not Found", data: null })
        enquiryPresent.status = status ? status : enquiryPresent.status;
        enquiryPresent = await enquiryPresent.save()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Successfully updated enquiry", data: enquiryPresent })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}