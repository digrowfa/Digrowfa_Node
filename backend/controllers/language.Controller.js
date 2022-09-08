import { validationResult } from 'express-validator';
import Language from '../models/language.Model.js'

export const getLanguages=async (req, res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        let languages=await Language.find({})
        return res.status(200).json({ errorcode: 0, status: true, msg: "Languages Found", data:languages  });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
}

export const createLanguage=async (req, res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const {name}=req.body
        let languageExist=await Language.findOne({name:name})
        if(languageExist) return res.status(200).json({ errorcode: 1, status: false, msg: "Language Already Exist", data:null  });
        let language=new Language({
            name
        })
        language=await language.save()
        return res.status(200).json({ errorcode: 0, status: true, msg: "Language Added Successfully", data:language  });
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: e });
    }
}