import express from 'express';
import { getAllMessage, sendMessage, unSendMessage } from '../controllers/messageController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const messageRoute = express.Router();

messageRoute.post("/send/:id",isAuthenticated, sendMessage);
messageRoute.post("/unsend/:id/:msgId",isAuthenticated, unSendMessage);
messageRoute.get("/all/:id",isAuthenticated, getAllMessage);

export default messageRoute;