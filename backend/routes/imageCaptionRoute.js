import express from 'express';
import upload from '../middleware/multer.js';
import { imageToAcption } from '../controllers/imageCaptionController.js';
const imageCaptionRoute = express.Router();

imageCaptionRoute.post('/image-to-text', upload.single('image'), imageToAcption);

export default imageCaptionRoute