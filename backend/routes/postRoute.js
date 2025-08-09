import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import { addComment, addContent, bookmarkPost, deletePost, dislike, getAllComment, getAllPost, getUserPost, likePost } from "../controllers/postController.js";

const postRoute = express.Router();

postRoute.post("/add", isAuthenticated, upload.single('media'), addContent);
// postRoute.post("/addreel" , isAuthenticated, upload.single("reel"), addnewReel);
postRoute.get("/allpost", getAllPost);
postRoute.get("/userpost", isAuthenticated, getUserPost);
postRoute.post("/like/:id", isAuthenticated, likePost);
postRoute.post("/dislike/:id", isAuthenticated, dislike);
postRoute.post("/addcomment/:id", isAuthenticated, addComment);
postRoute.post("/allcomment/:id", isAuthenticated, getAllComment);
postRoute.delete("/deletepost/:id", isAuthenticated, deletePost);
postRoute.post("/bookmark/:id", isAuthenticated, bookmarkPost);

export default postRoute;