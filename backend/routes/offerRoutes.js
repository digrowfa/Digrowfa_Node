import express from "express";
const router=express.Router()
import {createOffer,deleteOffer,getOffers} from '../controllers/offer.Controller.js'

router.get('/',getOffers)
router.post('/',createOffer)
router.post('/:id',deleteOffer)

export default router