import express from "express";
const router=express.Router();
import { createBatch, getAllBatches, getbatchDetails, getbatchDetailsOfCourse } from '../controllers/batch.controller.js'

router.get('/',getAllBatches)
router.post('/',createBatch)
router.get('/:id',getbatchDetails)
router.get('/course/:id',getbatchDetailsOfCourse)

export default router;