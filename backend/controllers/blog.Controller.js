import { validationResult } from 'express-validator'
import Blog from '../models/blog.Model.js'

export const createBlogPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { title, text } = req.body;
        if (!req.file) return res.status(200).json({ status: true, msg: "Media file should be present", data: null })
        // if(text.length<40) return res.status(200).json({ status: true, msg: "text should be atleast 40 characters", data: null });
        let newPost = new Blog({
            title,
            text,
            image: req.file ? req.file : null
        })
        newPost = await newPost.save()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Blog Post Created Succesffully", data: newPost });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const getBlogs = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        let data = await Blog.find()
        return res.status(200).json({ status: true, msg: "Categories Found", data: data });
    } catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}

export const getPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params
        let data = await Blog.findById(id)
        return res.status(200).json({ status: true, msg: "Blog-post Found", data: data });
    } catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}

export const deleteBlogPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params
        let data = await Blog.findById(id)
        if (!data) return res.status(200).json({ errorcode: 2, status: false, msg: "Blog-post Not Found", data: null });
        await Blog.deleteOne({_id:id})
        return res.status(200).json({ errorcode: 0, status: true, msg: "Blog-post Deleted Successfully", data: null });
    } catch (e) {
        return res.status(200).json({  errorcode: 5,status: false, msg: e.message, data: null });
    }
}