import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import userRoute from './routes/userRoute.js';
import bodyParser from 'body-parser';
import postRoute from './routes/postRoute.js';
import messageRoute from './routes/messageRoute.js';
import storyRoute from './routes/storyRoute.js';
import { app, server } from './socket/socket.js';
// import OpenAI from 'openai';
import multer from "multer";
import imageCaptionRoute from './routes/imageCaptionRoute.js';


// DATA BASE 
mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log("DB CONNECTED "))
    .catch(() => console.log("NOT CONNECTED")
    )

// MIDDLEWARE 
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('upload'));
// app.use(bodyParser.urlencoded);


app.use(cors({
    origin: ["http://localhost:5173", "https://instagram-frontend-g2i1.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/stories", storyRoute);
app.use("/api/message", messageRoute);
app.use('/api/caption', imageCaptionRoute);

server.listen(process.env.PORT, () => {
    console.log(`server is running on port no ${process.env.PORT}`);
})