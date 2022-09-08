import express from "express";
import { createBlogPost,getBlogs,getPost,deleteBlogPost } from "../controllers/blog.Controller.js";
import { s3StorageBlogPost } from "../middleware/s3-upload-file.js";
const router=express.Router();

router.post('/',s3StorageBlogPost.single("image"),createBlogPost)
router.get('/',getBlogs)
router.get('/:id',getPost)
router.delete('/:id',deleteBlogPost)

export default router;