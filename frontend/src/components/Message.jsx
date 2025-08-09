import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from './redux/chatslice';
import axios from 'axios';
import useRTM from './useRTM';
import { PiDotsThreeCircle } from "react-icons/pi";
import { RiReplyFill } from "react-icons/ri";
import { Trash2 } from 'lucide-react';


const Message = ({ setRepliedMessage, repliedMessage, setRepliedUserId, setRepliedMessageId, repliedMessageId }) => {
    useRTM();
    const { message } = useSelector(store => store.chat);
    const { selectUser, user } = useSelector(store => store.auth);
    const messagesEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [message]);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    const formatDate = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    const dispatch = useDispatch();

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/message/all/${selectUser._id}`, {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setMessage(res.data.messages));

            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchMessages();
    }, [selectUser])

    const unSendMessageHandler = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/api/message/unsend/${selectUser?._id}/${repliedMessageId}`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })

            if (response.data.success) {
                dispatch(setMessage(message.filter(msg => msg._id !== response.data.messages?._id)));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            setIsOpen(false);
        }
    };

    return (
        <div>
            <div id="popup-overlay" onClick={handleOutsideClick} className="flex-1 min-h-[355px] pt-8 mb-[110px] p-4 bg-black">
                {message && message.map((msg) => {

                    return (
                        <div key={msg._id} className={`mb-5 flex ${msg.senderId === user._id ? "justify-end" : "justify-start"}`}>
                            <div className="flex items-center max-w-[430px] gap-3">
                                {msg.senderId !== user._id && (
                                    <img src={selectUser?.profile} alt="User" className="h-8 w-8 rounded-full object-cover" />
                                )}

                                <div className="relative group">
                                    {msg.repliedMessage && (
                                        <div className={`mb-1 flex ${msg.repliedUserId === user._id ? "justify-end" : ""}  text-sm text-gray-300`}>
                                            <div className="px-2 py-1 rounded-lg flex items-center gap-1">
                                                <span className="text-purple-400 font-semibold">
                                                    {msg.repliedUserId === user._id ? "You:" : msg.repliedUsername || selectUser.username}:
                                                </span>
                                                <p className="truncate">{msg.repliedMessage}</p>
                                            </div>
                                        </div>
                                    )}


                                    <div className={`flex gap-4 items-center ${msg.senderId === user._id ? "justify-end" : "justify-start"}`}>
                                        {msg.senderId === user._id && (
                                            <PiDotsThreeCircle
                                                onClick={() => {
                                                    // setRepliedMessage(msg.messages);
                                                    setRepliedMessageId(msg._id);
                                                    setIsOpen(true);
                                                    // setRepliedUserId(msg.senderId);
                                                }}
                                                className="cursor-pointer text-white text-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                        )}

                                        <div
                                            className={`relative p-3 pt-2 pb-2 rounded-lg shadow-md text-sm transition-all duration-300 cursor-pointer group-hover:shadow-lg
                                ${msg.senderId === user._id ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white" : "bg-zinc-800 text-white"}`}
                                            onClick={() => setIsOpen(!isOpen)}
                                        >
                                            {msg.messages}
                                        </div>

                                        {msg.senderId !== user._id && (
                                            <PiDotsThreeCircle
                                                onClick={() => {
                                                    // setRepliedMessage(msg.messages);
                                                    setRepliedMessageId(msg._id);
                                                    setIsOpen(true);
                                                    // setRepliedUserId(msg.senderId);
                                                }}
                                                className="cursor-pointer text-white text-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                        )}

                                        {msg.senderId === user._id && (
                                            <img src={user.profile || "https://via.placeholder.com/40"} alt="User" className="w-8 h-8 rounded-full object-cover" />
                                        )}
                                    </div>

                                    {isOpen && msg._id === repliedMessageId && (
                                        <div className={`absolute ${msg.senderId === user._id ? "right-14 top-11" : "left-14 top-14"} border mt-2 z-10 w-36 bg-zinc-900 shadow-lg rounded-lg p-2 transition-all duration-300`}>
                                            <button onClick={() => {
                                                setRepliedMessage(msg.messages);
                                                setRepliedMessageId(msg._id);
                                                setIsOpen(false);
                                                setRepliedUserId(msg.senderId);
                                            }}
                                                className="flex items-center w-full px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded">
                                                <RiReplyFill className="w-4 h-4 mr-2" /> Reply
                                            </button>
                                            {msg.senderId === user._id && (
                                                <button onClick={() => { unSendMessageHandler(); setIsOpen(false) }} className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-zinc-800 rounded">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Unsend
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <div className="absolute bottom-full left-0 mb-2 text-nowrap px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        {formatDate(msg.time)}
                                    </div>

                                    <p className={`text-xs text-gray-400 text-nowrap mt-1 ${msg.senderId === user._id ? "text-right" : "text-left"}`}>
                                        {formatTime(msg.time)}
                                    </p>
                                </div>
                            </div>
                        </div>

                    );
                })}
                <div ref={messagesEndRef}></div>
            </div>

        </div>
    )
}

export default Message