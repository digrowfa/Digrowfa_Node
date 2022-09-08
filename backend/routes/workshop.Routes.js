import express from 'express'
import {getCategoryWorkshop,getWorkShops,getEnrolledWorkShops,getWorkshopdetails,
editWorkshopFaq,deleteLesson,createLesson,editLesson,createWorkshop,editWorkshop,deleteWorkshop
} from '../controllers/workshop.Controller.js'
import {s3LessonStorage,s3StorageCourse} from '../middleware/s3-upload-file.js'
const router = express.Router()

router.get("/category/:id",getCategoryWorkshop )
router.get("/",getWorkShops )
router.get("/enrolled/:id",getEnrolledWorkShops )
router.get("/:id",getWorkshopdetails )
router.post("/faq/:id",editWorkshopFaq )
router.post("/lesson-delete",deleteLesson )
router.post("/lesson",createLesson )
router.post("/lesson/:id",editLesson )
router.post("/",s3StorageCourse.fields([
    {name:"image",maxcount:1},
    {name:"whyimage",maxcount:1},
    {name:"mentorimage",maxcount:1},
    {name:"video",maxcount:1}
]),createWorkshop )
router.post("/:id",s3StorageCourse.fields([
    {name:"image",maxcount:1},
    {name:"video",maxcount:1}
]),editWorkshop )
router.delete("/:id", deleteWorkshop)

export default router