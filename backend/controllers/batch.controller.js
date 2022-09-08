import { validationResult } from 'express-validator';
import Batch from "../models/batch.Model.js";
import moment from "moment";

export const getAllBatches = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const batches = await Batch.find({})
        .populate([
            {
                path: "course", populate: [{ path: "language", model: "Language", select: "name" }],
                // path: "workshop", populate: [{ path: "language", model: "Language", select: "name" }],
                select: "description name category lessons createdAt updatedAt image.location introVideo.location"
            },
            {
                path: "workshop", populate: [{ path: "language", model: "Language", select: "name" }],
                // path: "workshop", populate: [{ path: "language", model: "Language", select: "name" }],
                select: "description name category lessons createdAt updatedAt image.location introVideo.location"
            },

        ])
        return res.status(200).json({ errorcode: 0, status: false, msg: "Batches Found", data: batches })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const createBatch = async (req, res) => {
    console.log(req.body)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { name, startDate, endDate, course, price, discountPrice, limit, workshop } = req.body;
        if (!course && !workshop) return res.status(200).json({ errorcode: 0, status: false, msg: "Please select the select or wprkshop", data: null })
        let batch = new Batch({
            name,
            startDate,
            endDate,
            course: course ? course : null,
            price,
            discountPrice,
            workshop: workshop ? workshop : null,
            // isPaid,
            // language,
            totalStudentsLimit: limit
        })
        batch = await batch.save();

        // .populate([
        //     { path: "course_id", model: "Course", select: "name" },
        //     { path: "instructor_id", model: "User", select: "name" }
        // ])

        return res.status(200).json({ errorcode: 0, status: false, msg: "New Batch Created Successfully", data: batch })
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const getbatchDetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params;
        if (!id) return res.status(200).json({ errorcode: 2, status: false, msg: "Batch id is Required", data: null })
        const batch = await Batch.findById(id)
        return res.status(200).json({ errorcode: 0, status: false, msg: "Batch Found", data: batch })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const getbatchDetailsOfCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params;
        if (!id) return res.status(200).json({ errorcode: 2, status: false, msg: "Batch id is Required", data: null })
        // let batch = await Batch.findOne({ $or: [{ course: id }, { workshop: id }] }).populate([
        let batch = await Batch.findOne({ course: id }).populate([
            {
                path: "course", populate: [
                    { path: "language", model: "Language", select: "name" },
                    { path: "category", model: "Categories", select: "name" }
                ]
                // ,
                // select: "description name category lessons createdAt updatedAt image.location introVideo.location duration"
            },
        ]).sort({ createdAt: -1 })
        let startDate = moment(batch.startDate).format('LL')
        let endDate = moment(batch.endDate).format('LL')
        batch = { ...batch._doc, startDate: startDate, endDate: endDate }
        return res.status(200).json({ errorcode: 0, status: false, msg: "Batch Found", data: batch })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const getbatchDetailsOfWorkShop = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params;
        if (!id) return res.status(200).json({ errorcode: 2, status: false, msg: "Batch id is Required", data: null })
        // let batch = await Batch.findOne({ $or: [{ course: id }, { workshop: id }] }).populate([
        let batch = await Batch.findOne({ course: id }).populate([
            {
                path: "workshop", populate: [
                    { path: "language", model: "Language", select: "name" },
                    { path: "category", model: "Categories", select: "name" }
                ]
                ,
                select: "description title category image video price startDate endDate Bonus discount mentor mentorImage"
            },
        ]).sort({ createdAt: -1 })
        let startDate = moment(batch.startDate).format('LL')
        let endDate = moment(batch.endDate).format('LL')
        batch = { ...batch._doc, startDate: startDate, endDate: endDate }
        return res.status(200).json({ errorcode: 0, status: false, msg: "Batch Found", data: batch })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}