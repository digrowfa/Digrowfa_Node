import Offer from '../models/offer.Model.js';
import Batch from '../models/batch.Model.js'
import { validationResult } from 'express-validator';

export const getOffers=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const offers=await Offer.find({})
        return res.status(200).json({ status: false, msg: "Offers Found", data: offers })
    } catch (e) {
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }
}

export const createOffer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const {name,discount,batch_id}=req.body
        const existingOffer=await Offer.findOne({name:name})
        if(existingOffer) return res.status(200).json({  errorcode: 2, status: false, msg: "Offer with same name already Exist.", data: null });
        const batch=await Batch.find({_id:batch_id})
        if(!batch) return res.status(200).json({errorcode: 3, status: false, msg: "Batch Not Found", data: null })
        const offer=await Offer.create({
            name,
            discount,
            batch:batch_id
        })
        batch.forEach(async(Batch)=>{
            Batch.discountPrice=offer.discount
            await Batch.save()
        })
        return res.status(200).json({ errorcode: 0,status: true, msg: "Offer Added Successfully for the Batch", data: offer });
    } catch (e) {
        console.log(e)
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const deleteOffer=async(req,res)=>{
    console.log("deleteOffer req.body:::",req.body)
    
    console.log("req.params:::",req.params)
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const {id}=req.params;
        const {batch}=req.body;
        let offer=await Offer.findById(id)
        console.log("offer",offer)
        if(!offer)  return res.status(200).json({  errorcode: 2, status: false, msg: "Offer Not Found", data: null })
        let exbatch=await Batch.findById(batch);
        console.log("exbatch",exbatch)
        if(!exbatch)  return res.status(200).json({  errorcode: 2, status: false, msg: "Batch Not Found", data: null })
        await Offer.deleteOne({_id:id})
        exbatch.discountPrice=0;
        await exbatch.save();
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}


export const editOfferfromBatch=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(200).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        // const {id}=req.params;
        const {batch,offerid,discount}=req.body;
        let offer=await Offer.findById(offerid)
        if(!offer)  return res.status(200).json({  errorcode: 2, status: false, msg: "Offer Not Found", data: null })
        offer.discount=discount;
        await offer.save();
        let exbatch=await Batch.findById(batch);
        if(!exbatch)  return res.status(200).json({  errorcode: 2, status: false, msg: "Batch Not Found", data: null })
        exbatch.discountPrice=discount?discount:0;
        await exbatch.save();
        if(!offer)  return res.status(200).json({  errorcode: 2, status: false, msg: "Offer Updated Successfully", data: null })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}