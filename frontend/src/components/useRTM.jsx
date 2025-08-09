import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from './redux/chatslice';
import useSocket from './useSocket'; // Import useSocket hook

const useRTM = () => {
    const dispatch = useDispatch();
    const { message } = useSelector(store => store.chat);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('newMessage', (newMessage) => {
                dispatch(setMessage([...message, newMessage]));
            });

            socket.on('unSendMessage', (unSendMessage) => {
                dispatch(setMessage(message.filter(msg => msg._id !== unSendMessage?._id)));
            });

            return () => {
                socket.off('newMessage');
            };
        }
    }, [socket, message, dispatch]);
};

export default useRTM;
