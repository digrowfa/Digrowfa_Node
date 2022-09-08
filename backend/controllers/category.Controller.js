import Category from '../models/category.Model.js';
import { validationResult } from 'express-validator';

export const getCategories = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        let category = await Category.find()
        return res.status(200).json({ errorcode: 0,status: true, msg: "Categories Found", data: category });
    } catch (e) {
        return res.status(200).json({ errorcode: 5,status: false, msg: e.message, data: null });
    }
}

export const createCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { name, description, status } = req.body
        let category = await Category.findOne({ name: name })
        if (category) return res.status(200).json({errorcode: 2, status: false, msg: "Category with same name already Exist.", data: null });
        category = new Category({
            name,
            description,
            // image: req.file.location,
            image: req.file ? req.file : null
            // status: "active"
        });
        category = await category.save()
        return res.status(200).json({ errorcode: 0,status: true, msg: "Category Added Successfully", data: category });
    } catch (e) {
        return res.status(200).json({errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const editCategory = async (req, res) => {
    console.log("req.body",req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params
        const { name, description, status } = req.body
        let category = await Category.findById(id)
        if (!category) return res.status(200).json({errorcode: 2, status: false, msg: "Category not Found", data: null });
        category.name = name ? name : category.name;
        category.description = description ? description : category.description;
        category.status = status ? status : category.status;
        category.image = req.file ? req.file : category.image;
        category = await category.save()
        return res.status(200).json({ errorcode: 0,status: true, msg: "Category Updated Successfully", data: category });
    } catch (e) {
        return res.status(200).json({ errorcode: 5,status: false, msg: e.message, data: null });
    }
}