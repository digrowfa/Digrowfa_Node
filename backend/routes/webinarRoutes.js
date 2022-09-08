import express from "express";
import { createWebinar,getWebinars } from "../controllers/webinar.Controller.js";
import {s3StorageWebinar} from '../middleware/s3-upload-file.js'
const router=express.Router()

router.post('/',s3StorageWebinar.single("image"),createWebinar)
router.get('/',getWebinars)

export default router