import express from 'express'
import { signUp, signIn } from '../controllers/userController.js'
import { user } from '../middleware/validator.js'
const router = express.Router()

// router
//   .route('/signup').user("signup")
//   .post(user("signup"),signUp)
// router.post("/signup/email", user("signup1"), emailSignUpStep1)
// router.post("/signup-login", SignUpOrLogin)
// router.post("/verify-otp", verifyMobOtp)

router.post("/signup", signUp)
router.post("/signin", signIn)

export default router
