import express from 'express'
import { editCourseFaq,getEnrolledCourses,getCourses,createCourse,createLesson,deleteCourse,getCoursdetails,editLesson,deleteLesson,editCourse,getCategoryCourses} from '../controllers/courseController.js'
import {s3LessonStorage,s3StorageCourse} from '../middleware/s3-upload-file.js'
const router = express.Router()


router.get("/category/:id",getCategoryCourses )
router.get("/",getCourses )
router.get("/enrolled/:id",getEnrolledCourses )
router.get("/:id",getCoursdetails )
router.post("/faq/:id",editCourseFaq )
router.post("/lesson-delete",deleteLesson )
router.post("/lesson",createLesson )
router.post("/lesson/:id",editLesson )
router.post("/",s3StorageCourse.fields([
    {name:"image",maxcount:1},
    {name:"whyimage",maxcount:1},
    {name:"mentorimage",maxcount:1},
    {name:"video",maxcount:1}
]),createCourse )
router.post("/:id",s3StorageCourse.fields([
    {name:"image",maxcount:1},
    {name:"video",maxcount:1}
]),editCourse )
router.delete("/:id", deleteCourse)

export default router