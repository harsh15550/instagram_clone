import {Server} from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin : ["http://localhost:5173", "https://instagram-frontend-g2i1.vercel.app"],
        methods: ['GET', 'POST']
    }
})

const userSocketMap = {};

export const getReceverSocketId = (receiverId) => userSocketMap[receiverId];
export const getPostOwnerID = (ownerID) => userSocketMap[ownerID];

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
        console.log(`connect user id = ${userId} socket id = ${socket.id}`);        
    }
    
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        if(userId){
            delete userSocketMap[userId]
            console.log(`disconnect user id = ${userId} socket id = ${socket.id}`);        
        }

        io.emit('getOnlineUsers', Object.keys(userSocketMap))

    })
})

export {io, app, server}