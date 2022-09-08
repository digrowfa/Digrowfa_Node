import express from "express"
import { adminSignIn, adminSignUp } from "../controllers/admin.Controller.js"
const router=express.Router()

router.post('/signin',adminSignIn)
router.post('/signup',adminSignUp)

export default router