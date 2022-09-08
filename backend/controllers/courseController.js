import slugify from "slugify";
import { validationResult } from 'express-validator';
import courseModel, { lessonSchema } from "../models/course.Model.js";
import User from '../models/user.Model.js'

export const getCourses = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        let courses = await courseModel.find()
            .populate([
                { path: "category", select: "name" },
                { path: "language", select: "name" }
            ])
        return res.status(200).json({ errorcode: 0, status: true, msg: "Courses Found.", data: courses });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const getEnrolledCourses = async (req, res) => {
    console.log("getEnrolledCourses");
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const {id}=req.params;
        let userData = await User.findById(id).populate([{path:"batches",populate:{path:"course",model:"Course"}}])
           
        return res.status(200).json({ errorcode: 0, status: true, msg: "Courses Found.", data: userData });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const getCoursdetails = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params
        let course = await courseModel.findById(id).populate([
            { path: "category", select: "name" },
            { path: "language", select: "name" }
        ])
        if (!course) return res.status(200).json({ errorcode: 2, status: true, msg: "Course Not Found.", data: null });
        return res.status(200).json({ errorcode: 0, status: true, msg: "Courses Found.", data: course });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const createCourse = async (req, res) => {
    // console.log("createCourse ")
    console.log("req.file", req.file)
    console.log("req.files", req.files)
    console.log("req.body", req.body)

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { name, description, category_id, mentor,totalBonus, language_id, lessons, duration, price, whyDescription, whyTitile,bonus,people,who,career } = req.body
       console.log(people);
        let lang = req.body?.language_id?.split(',')
        if (!name) return res.status(200).json({ errorcode: 2, status: false, msg: "Name is required", data: null })
        let course = await courseModel.findOne({ slug: slugify(name) })
        if (course) return res.status(200).json({ errorcode: 3, status: false, msg: "Name is already Used", data: null })
        let newCourse = new courseModel({
            name,
            slug: slugify(name),
            description,
            duration,
            price,
            lessons: lessons ? lessons : [],
            category: category_id,
            mentor: {
                name: mentor,
                image: req.files && req.files["mentorimage"] ? req.files["mentorimage"][0].location : null,
            },
            language: lang ? lang : [],
            image: req.files && req.files["image"] ? req.files["image"][0] : null,
            introVideo: req.files && req.files["video"] ? req.files["video"][0] : null,
            fieldWhy: {
                title: whyTitile,
                description: whyDescription,
                image: req.files && req.files["whyimage"] ? req.files["whyimage"][0].location : null,
            },
            faq:people ? JSON.parse(people) : [],
            fieldWho:who && who.length !==0 ? JSON.parse(who):[],
            carrierOpps:career && career.length !==0 ? JSON.parse(career):[],
            totalBonus:totalBonus?totalBonus:null,
            bonus:bonus? JSON.parse(bonus):[]
        })
        course = await newCourse.save()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Course Created Succesffully.", data: course });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};


export const editCourse = async (req, res) => {
    console.log("editCourse ")
    console.log("req.file 2222222222222222222", req.file)
    console.log("req.files", req.files)
    console.log("req.body", req.body)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params;
        const { name, description, category_id, instructor_id, language_id, lessons,who,totalBonus,bonus, duration,career, price,people } = req.body;
        let lang = req.body?.language_id?.split(',');
        if (lang[0].length < 5) lang.shift();
        let course = await courseModel.findById(id);
        if (!course) return res.status(200).json({ errorcode: 3, status: false, msg: "Course is Not Present", data: null })
        course.name = name ? name : course.name;
        course.description = description ? description : course.description;
        course.category = category_id ? category_id : course.category_id;
        course.price = price ? price : course.price;
        // course.instructor = instructor_id ? instructor_id : course.instructor;
        course.language = lang ? lang : course.language;
        course.duration = duration ? duration : course.duration;
        course.image = req.files && req.files["image"] ? req.files["image"][0] : course.image;
        course.introVideo = req.files && req.files["video"] ? req.files["video"][0] : course.introVideo;
        course.faq=people ? JSON.parse(people) : course.faq;
        course.fieldWho=who && who.lenth !==0 ? JSON.parse(who):course.fieldWho;
        course.carrierOpps=career && career.length !==0 ? JSON.parse(career):course.carrierOpps;
        course.bonuses.totalBonus=totalBonus?totalBonus: course.bonuses.totalBonus,
        course.bonuses=bonus && bonus.length !== 0 ? JSON.parse(bonus):course.bonuses
        course.totalBonus=totalBonus?totalBonus:course.totalBonus;
        course = await course.save()
        const a=await courseModel.findOneAndUpdate({_id:id},{$set:{"bonuses.bonus":bonus}})
        console.log("a",a);
        return res.status(200).json({ errorcode: 0, status: true, msg: "Course Updated Succesffully.", data: course });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const editCourseFaq = async (req, res) => {
    console.log("editCourse ")
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params;
        const { people } = req.body;
        let course = await courseModel.findById(id);
        if (!course) return res.status(200).json({ errorcode: 3, status: false, msg: "Course is Not Present", data: null })
        course.faq=people
        course = await course.save()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Course Updated Succesffully.", data: course });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params
        if (!id) return res.status(200).json({ errorcode: 2, status: true, msg: "Course Id is Required.", data: null });
        let courses = await courseModel.findById(req.params.id)
        if (!courses) return res.status(200).json({ errorcode: 2, status: true, msg: "Course Not Found.", data: null });
        await courseModel.deleteOne({ _id: req.params.id })
        return res.status(200).json({ errorcode: 0, status: true, msg: "Course deleted Successfully.", data: null });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const createLesson = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        // if (!req.file) return res.status(200).json({ errorcode: 3, status: false, msg: "Media File is required for creating a lesson", data: null });
        const { title, lessonSummary, content, course_id, video_url, freePreview } = req.body
        console.log(req.body)
        if (!title || !lessonSummary) return res.status(200).json({ errorcode: 2, status: false, msg: "title and lesson summary should not be empty", data: null });
        let summary = lessonSummary.reduce((acc, item) => {
            acc = acc.concat(item.service)
            return acc;
        }, [])
        console.log("summary", summary);
        let courseFound = await courseModel.findById(course_id)
        if (!courseFound) return res.status(200).json({ errorcode: 3, status: false, msg: "No course Found", data: null });
        // let sum=lessonSummary.slice(0)
        // console.log( sum);
        let lesson = {
            title,
            slug: slugify(title),
            content: content,
            lessonSummary: summary,
            video: video_url ? video_url : req.file ? req.file : {},
            free_preview: freePreview
        }
        let course = await courseModel.updateOne({ _id: course_id }, { $push: { lessons: lesson } }, { new: true });
        return res.status(200).json({ errorcode: 0, status: true, msg: "Lessons Added Succesffully.", data: null });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const editLesson = async (req, res) => {
    // console.log("req.body", req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params
        const { lessonSummary, title } = req.body
        // console.log("lessonSummary", lessonSummary);
        // console.log("lessonSummary", typeof lessonSummary)
        const summary = lessonSummary.splice(5)
        // const me=lessonSummary.toArray()
        console.log("1111", summary);
        if (!lessonSummary || !title) return res.status(200).json({ errorcode: 2, status: false, msg: "text field should not be empty", data: null });
        // if (!req.file) return res.status(200).json({ errorcode: 3, status: false, msg: "Media File is required for creating a lesson", data: null });
        // await Shouts.findOne( { results: { $Match: { _id: lesson } } })
        let lessondata = await courseModel.findOne({ lessons: { $elemMatch: { _id: id } } })

        let lessondatas = await courseModel.updateOne(
            { "lessons._id": id },
            {
                $set: {
                    "lessons.$.title": title,
                    "lessons.$.lessonSummary": lessonSummary,
                    "lessons.$.slug": slugify(title),
                },
            },
            { new: true }
        ).exec()
        // if (!courseFound) return res.status(200).json({ errorcode: 2, status: false, msg: "No course Found", data: null });
        // let course = await courseModel.updateOne({ _id: course_id }, { $push: { lessons: lesson } }, { new: true });
        return res.status(200).json({ errorcode: 0, status: true, msg: "Lessons Added Succesffully.", data: lessondatas });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { course, lesson } = req.body
        if (!course || !lesson) return res.status(200).json({ errorcode: 2, status: false, msg: "corse and lesson ids are needed", data: null });
        let lessondata = await courseModel.updateOne({ _id: course }, { $pull: { lessons: { _id: lesson } } })
        return res.status(200).json({ errorcode: 0, status: true, msg: "Lesson Deleted Succesffully.", data: null });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};


export const updateLessonArrangmaent = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        if (!req.file) return res.status(200).json({ errorcode: 3, status: false, msg: "Media File is required for creating a lesson", data: null });
        const { title, description, category_id, instructor_id, course_id } = req.body
        let courseFound = await courseModel.findById(course_id)
        console.log("courseFound", courseFound)
        if (!courseFound) return res.status(200).json({ errorcode: 2, status: false, msg: "No course Found", data: null });
        let course = await courseModel.findOneAndUpdate({ _id: course_id }, req.body, { new: true });
        return res.status(200).json({ errorcode: 0, status: true, msg: "Lessons Added Succesffully.", data: course });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e, data: e });
    }
};


export const getCategoryCourses = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { id } = req.params
        let courses = await courseModel.find({ category: id })
            .populate([
                { path: "category", select: "name" },
                { path: "language", select: "name" }
            ])
        return res.status(200).json({ errorcode: 0, status: true, msg: "Course Found.", data: courses });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
};

