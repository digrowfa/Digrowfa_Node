import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.Model.js'

const protect = asyncHandler(async (req, res, next) => {
    let token
    // const headersData = req.headers['x-client-id'];
    // if(headersData){
    //     token=headersData;
    // }
    // console.log("1111111111111111111111111",req.headers['x-client-id'])
    if (req.headers['x-client-id']) {
        try {
            token = req.headers['x-client-id']
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-password')
            console.log("decoded",decoded);
            next()
        } catch (error) {
            console.error("error",error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }
    if (!token) {
        console.log(req.headers.authorization)
        res.status(401)
        throw new Error('Not authorized,no token')
    }
})

export { protect }