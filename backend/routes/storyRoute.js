import express from 'express';
import { allStory, createStory, deleteStory, getAnotherUserStory, seenStoryUser, userStory } from '../controllers/storycontroller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import upload from '../middleware/multer.js';

const storyRoute = express.Router();

storyRoute.post("/create", isAuthenticated, upload.single("image"), createStory);
storyRoute.get("/allStory", allStory);
storyRoute.delete("/deleteStory/:id", deleteStory);
storyRoute.delete("/expdeleteStory", deleteStory);
storyRoute.post("/storyseenuser/:id", isAuthenticated, seenStoryUser);
storyRoute.get("/userstory" , isAuthenticated, userStory);
storyRoute.get("/anotherUserStory/:id", isAuthenticated, getAnotherUserStory);


export default storyRoute