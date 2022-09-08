import express from 'express'
import { createCategory, getCategories,editCategory} from '../controllers/category.Controller.js'
import { s3StorageCategory } from '../middleware/s3-upload-file.js'
const router = express.Router()

router.get('/',getCategories)
router.post('/',s3StorageCategory.single("image"),createCategory)
router.post('/:id',s3StorageCategory.single("image"),editCategory)

export default router