import { validationResult } from "express-validator";
import webinarModel from "../models/webinar.Model.js";
import moment from 'moment'
import Axios from 'axios'

const addZero = num => {
    if(typeof num === "number") {
        if (num < 10) return "0"+num;
    } 
    if (typeof num === "string") {
        if (num.length === 1) return "0"+num;
    }
    return num;
}

export const createWebinar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { title, date, description, name } = req.body
        let dd = new Date(date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
        let correctdate = moment(date, "YYYY-MM-DD hh:mm:ss").utcOffset("-5:30")
        console.log("correctdate", correctdate);
        let webinar = new webinarModel({
            title, date, description, name
        })
        webinar = await webinar.save()
        return res.status(200).json({ errorcode: 0, status: false, msg: "Webinar Created Successfully", data: webinar });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const getWebinars = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        let webinar = await webinarModel.find({})
        webinar = webinar.filter(webinar => {
            // let dd6 = moment(webinar.date).format("DD-MM-YYYY hh:mm:ss a")
            // console.log("new Date()",new Date())
            // let a=moment(dd6).isBefore(new Date())

            let dd = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
            let dd5 = `${dd.getFullYear()}-${addZero(dd.getMonth()+1)}-${addZero(dd.getDate())} ${addZero(dd.getHours())}:${addZero(dd.getMinutes())}:${addZero(dd.getSeconds())}`;
            let todayDate = moment(dd5, "YYYY-MM-DD hh:mm:ss a");
            console.log("todaydate",todayDate);
            let dd6 = moment(webinar.date).format("YYYY-MM-DD hh:mm:ss a")
            let a=moment(dd6).isAfter(todayDate)
            console.log("111111",a);
            if(a){
            return {
                _id:webinar._id,
                title:webinar.title,
                date: dd6,
                description:webinar.description,
            }
        }
        })
        return res.status(200).json({ errorcode: 0, status: false, msg: "Webinar Found", data: webinar });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

