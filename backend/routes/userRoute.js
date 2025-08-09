import express from "express";
import { editProfile, followAndUnfollow, getProfile, getSuggestedUser, login, logout, register, searchUser } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const userRoute = express.Router();

userRoute.post("/register",register);
userRoute.post("/login",login);
userRoute.post("/logout",logout);
userRoute.get("/profile/:id", isAuthenticated ,getProfile);
userRoute.post('/edit', isAuthenticated,upload.single('file') ,editProfile);
userRoute.get("/suggested", isAuthenticated, getSuggestedUser);
userRoute.post("/followunfollow/:id", isAuthenticated, followAndUnfollow);
userRoute.get("/search", searchUser);

export default userRoute;
