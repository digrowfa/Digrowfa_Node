import express from "express";
import { getAllEnquiries,createNewEnquiry,updateEnquiry } from "../controllers/liveEnquiry.Controller.js";
const router=express.Router()

router.get('/',getAllEnquiries);
router.post('/',createNewEnquiry);
router.post('/:id',updateEnquiry);

export default router