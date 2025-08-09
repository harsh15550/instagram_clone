// import { useEffect } from "react";
// import { io } from "socket.io-client";
// import { useDispatch, useSelector } from "react-redux";
// import { setSocket } from "./redux/socketslice";

// let socket = null; // Global socket instance

// const useSocket = () => {
//     const dispatch = useDispatch();
//     const user = useSelector(store => store.auth.user);

//     useEffect(() => {
//         if (user && !socket) {  // Ensure only one instance of socket is created
//             socket = io('http://localhost:4000', {
//                 query: { userId: user._id },
//                 transports: ['websocket']
//             });

//             dispatch(setSocket({ id: socket.id, connected: socket.connected }));

//             socket.on('connect', () => {
//                 dispatch(setSocket({ id: socket.id, connected: socket.connected }));
//             });

//             socket.on('disconnect', () => {
//                 dispatch(setSocket({ id: null, connected: false }));
//             });
//         }

//         return () => {
//             // Do not close the socket here, it should persist for the session
//         };
//     }, [user, dispatch]);

//     return socket;
// };

// export default useSocket;

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketslice';

const useSocket = () => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const user = useSelector(store => store.auth.user);

    useEffect(() => {
        if (user) {
            const socketIo = io('http://localhost:4000', {
                query: { userId: user._id },
                transports: ['websocket']
            });

            socketRef.current = socketIo;
            dispatch(setSocket({ id: socketIo.id, connected: socketIo.connected }));

            socketIo.on('connect', () => {
                dispatch(setSocket({ id: socketIo.id, connected: socketIo.connected }));
            });

            socketIo.on('disconnect', () => {
                dispatch(setSocket({ id: null, connected: false }));
            });

            return () => {
                socketIo.close();
                dispatch(setSocket({ id: null, connected: false }));
                socketRef.current = null;
            };
        }
    }, [user, dispatch]);

    return socketRef.current;
};

export default useSocket;