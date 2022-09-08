import express from "express";
import { createLanguage, getLanguages } from "../controllers/language.Controller.js";
import {protect} from '../middleware/jwtToken.js'
const router=express.Router()

router.get('/',getLanguages)
router.post('/',createLanguage)
// router.delete('/',deleteLanguage)

export default router