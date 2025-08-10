import axios from 'axios';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from './redux/authslice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import Message from './Message';
import { FaRegClock, FaUserCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import useSuggestedUser from './useSuggestedUser';
import { setMessage } from './redux/chatslice';
import { RxCrossCircled } from "react-icons/rx";

const ChatPage = () => {

    const { fetchSuggesteduser } = useSuggestedUser();
    const auth = useSelector(store => store.auth);
    const { suggestedUser } = useSelector(store => store.auth);
    const { onlineUsers, message } = useSelector(store => store.chat);
    const [messages, setMessages] = useState("");
    const [selectedHours, setSelectedHours] = useState('');
    const [selectedMinutes, setSelectedMinutes] = useState('');
    const [selectedAmPm, setSelectedAmPm] = useState('');
    const [time, setTime] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const [showDropdown, setShowDropdown] = useState(null);
    const [repliedMessage, setRepliedMessage] = useState('');
    const [repliedUserId, setRepliedUserId] = useState('');
    const [repliedMessageId, setRepliedMessageId] = useState('');


    // Send Message 

    const sendMessage = async (receiverId, time = null) => {
        try {
            if (time) {
                setDialogOpen(false);
                setMessages('');
                const formattedTime = selectedAmPm === 'PM'
                    ? `${selectedHours + 12}:${selectedMinutes}:00`
                    : `${selectedHours}:${selectedMinutes}:00`;

                toast.success(`This Message Is Scheduled for ${formattedTime}`, {
                    position: "top-right",
                });
            }

            // API request
            const res = await axios.post(
                `https://instagram-clone-5r4x.onrender.com/api/message/send/${receiverId}`,
                { repliedMessage, messages, time, repliedUserId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                dispatch(setMessage([...message, res.data.newMessage]))
                setMessages("");
                setRepliedMessage('');
            } else {
                console.error('Message not sent successfully:', res.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    useEffect(() => {
        fetchSuggesteduser();
    }, [])

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null))
        }
    }, [])

    useEffect(() => {
        if (selectedAmPm && selectedHours && selectedMinutes) {
            selectedAmPm === 'PM' ?
                setTime(`${selectedHours + 12}:${selectedMinutes}:00`)
                : setTime(`${selectedHours}:${selectedMinutes}:00`)
        }
    }, [selectedAmPm, selectedHours, selectedMinutes]);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : i));
    const amPm = ["AM", "PM"];

    return (
        <div className="flex bg ml-[16%] h-screen">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-l border-gray-400">
                <div className="p-4 h-[70px] flex items-center font-bold text-lg bg-gray-900">
                    All Users
                </div>
                <ul className="overflow-y-auto">

                    <div>
                        {suggestedUser.map((user, index) => {
                            const isOnline = onlineUsers?.includes(user?._id);
                            return (
                                <li
                                    key={index}

                                >
                                    <div className={`flex ${user.username === auth?.selectUser?.username ? 'bg-gray-800' : ''} items-center flex hover:bg-zinc-800 w-full p-4 gap-3 cursor-pointer`} onClick={() => dispatch(setSelectedUser(user))}>
                                        {user?.profile ?
                                            <img
                                                src={user?.profile}
                                                className={`w-10 h-10 rounded-full bg-gray-600 object-cover`}
                                                alt={user?.username[0]}
                                                /> : <div className={`w-10 h-10 rounded-full flex border justify-center text-2xl bg-gray-600`}>{user?.username[0]}</div>
                                            }
                                        <div>
                                            <p style={{ fontFamily: 'revert' }} className="font-medium">{user.username}</p>

                                            <p className={`text-sm font-semibold ${isOnline ? 'text-lime-600' : 'text-red-500'} truncate`}>
                                                {isOnline ? 'Online' : 'Ofline'}
                                            </p>
                                        </div>
                                    </div>

                                </li>
                            )
                        })}
                    </div>
                </ul>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 flex min-h-[70px] items-center gap-4 bg-gray-900">
                    <Avatar>
                        <AvatarImage className='w-10 h-10  object-cover rounded-full' src={auth?.selectUser?.profile} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>{auth?.selectUser?.username}</p>
                </div>
                {auth.selectUser ? (

                    <div className='overflow-y-auto' >
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="flex justify-center">
                                <div className='w-[100px] h-[100px] bg-slate-300 mb-[100px] rounded-full flex items-center flex-col'>

                                    <Avatar className='w-[100px] h-[100px] object-cover rounded-full'>
                                        {auth?.selectUser?.profile ? (
                                            <AvatarImage className='w-[100px] h-[100px] object-cover rounded-full' src={auth?.selectUser?.profile} />
                                        ) : (
                                            <FaUserCircle className='w-[100px] h-[100px] object-cover rounded-full' />
                                        )}
                                    </Avatar>

                                    <p className='text-2xl whitespace-nowrap mt-1 mb-1'>{auth?.selectUser?.username}</p>

                                    <Link to={`/profile/${auth?.selectUser?._id}`}>
                                        <Button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <Message repliedMessage={repliedMessage} setRepliedMessageId={setRepliedMessageId} repliedMessageId={repliedMessageId} setRepliedMessage={setRepliedMessage} repliedUserId={repliedUserId} setRepliedUserId={setRepliedUserId} />
                            {repliedMessage &&
                                <div className="absolute flex justify-between items-center  bottom-[90px] w-[920px] p-3 bg-zinc-900 border border-gray-700 rounded-lg shadow-lg text-white">
                                    <div className='flex gap-3'>
                                        <span className="text-purple-400 font-semibold">Replied: </span>
                                        <p>{repliedMessage}</p>
                                    </div>
                                    <RxCrossCircled className='text-2xl cursor-pointer hover:text-gray-400' onClick={() => setRepliedMessage('')} />
                                </div>
                            }

                        </div>


                        <div className="p-4 bg-black border-t w-[940px] left-[37%] flex gap-4 fixed bottom-0 left-0 right-0">
                            <input
                                type="text"
                                value={messages}
                                onChange={e => setMessages(e.target.value)}
                                placeholder="Type a message..."
                                onKeyDown={e => {
                                    if (e.key === "Enter" && messages) {
                                        sendMessage(auth?.selectUser?._id);
                                    }
                                }}
                                className="flex-1 p-3 border rounded-md bg-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                                onClick={() => sendMessage(auth?.selectUser?._id)}
                                className="h-[50px] w-[90px] bg-blue-800 text-white"
                                disabled={!messages.trim()}
                            >
                                SEND
                            </Button>

                            <div disabled={!messages || !messages.trim()} className='h-12 flex items-center w-12 justify-center hover:bg-gray-900 rounded-full bg-blue-800'>
                                <button
                                    onClick={() => setDialogOpen(true)}
                                    className="rounded-full">
                                    <FaRegClock className='text-base text-white h-5 w-5' />
                                </button>
                            </div>

                            {dialogOpen && messages && (
                                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
                                    {/* Modal Container */}
                                    <div className="w-[450px] p-6 bg-zinc-900 bg-opacity-90 rounded-xl shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-lg transition-all transform scale-100">
                                        {/* Header */}
                                        <div className="text-2xl text-white font-bold tracking-wide mb-4 flex justify-between items-center">
                                            Set Time
                                            <button
                                                onClick={() => setDialogOpen(false)}
                                                className="text-gray-400 hover:text-red-500 transition duration-300"
                                            >
                                                ✖
                                            </button>
                                        </div>

                                        <div className="grid gap-6 py-4">
                                            {/* Hour Selector */}
                                            <div className="relative">
                                                <button
                                                    className="w-full px-4 py-3 bg-zinc-800 text-white rounded-md shadow-md hover:bg-zinc-700 transition"
                                                    onClick={() => setShowDropdown(showDropdown === "hour" ? null : "hour")}
                                                >
                                                    Hour ▾
                                                </button>
                                                {showDropdown === "hour" && (
                                                    <div className="absolute z-10 left-0 right-0 mt-2 bg-zinc-800 rounded-md shadow-lg max-h-[250px] overflow-y-auto transition-all transform scale-100">
                                                        {hours.map((hour) => (
                                                            <div
                                                                key={hour}
                                                                onClick={() => { setSelectedHours(hour); setShowDropdown(null); }}
                                                                className="px-4 py-2 text-zinc-300 hover:bg-zinc-700 cursor-pointer transition"
                                                            >
                                                                {hour} Hour{hour !== 1 && "s"}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <span className="block text-zinc-400 mt-2">Hour: {selectedHours || "None"}</span>
                                            </div>

                                            {/* Minute Selector */}
                                            <div className="relative">
                                                <button
                                                    className="w-full px-4 py-3 bg-zinc-800 text-white rounded-md shadow-md hover:bg-zinc-700 transition"
                                                    onClick={() => setShowDropdown(showDropdown === "minute" ? null : "minute")}
                                                >
                                                    Minutes ▾
                                                </button>
                                                {showDropdown === "minute" && (
                                                    <div className="absolute z-10 left-0 right-0 mt-2 bg-zinc-800 rounded-md shadow-lg max-h-[230px] overflow-y-auto transition-all transform scale-100">
                                                        {minutes.map((minute) => (
                                                            <div
                                                                key={minute}
                                                                onClick={() => { setSelectedMinutes(minute); setShowDropdown(null); }}
                                                                className="px-4 py-2 text-zinc-300 hover:bg-zinc-700 cursor-pointer transition"
                                                            >
                                                                {minute} Minute{minute !== 1 && "s"}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <span className="block text-zinc-400 mt-2">Minute: {selectedMinutes || "None"}</span>
                                            </div>

                                            {/* AM/PM Selector */}
                                            <div className="relative">
                                                <button
                                                    className="w-full px-4 py-3 bg-zinc-800 text-white rounded-md shadow-md hover:bg-zinc-700 transition"
                                                    onClick={() => setShowDropdown(showDropdown === "ampm" ? null : "ampm")}
                                                >
                                                    AM/PM ▾
                                                </button>
                                                {showDropdown === "ampm" && (
                                                    <div className="absolute left-0 right-0 mt-2 bg-zinc-800 rounded-md shadow-lg transition-all transform scale-100">
                                                        {amPm.map((period) => (
                                                            <div
                                                                key={period}
                                                                onClick={() => { setSelectedAmPm(period); setShowDropdown(null); }}
                                                                className="px-4 py-2 text-zinc-300 hover:bg-zinc-700 cursor-pointer transition"
                                                            >
                                                                {period}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <span className="block text-zinc-400 mt-2">AM/PM: {selectedAmPm || "None"}</span>
                                            </div>

                                            {/* Selected Time Display */}
                                            <div className="flex justify-between items-center mt-4 p-2 border border-zinc-700 rounded-lg bg-zinc-800">
                                                <label className="text-zinc-400 font-medium">Selected Time:</label>
                                                <div className="text-white text-lg font-semibold">
                                                    {selectedHours && selectedMinutes && selectedAmPm
                                                        ? `${selectedHours < 10 ? `0${selectedHours}` : selectedHours}:${selectedMinutes} ${selectedAmPm}`
                                                        : "Please select a time"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-6 flex justify-between">
                                            <button
                                                type="submit"
                                                onClick={() => {
                                                    const scheduledTime = `${selectedAmPm === 'PM' && selectedHours !== 12
                                                        ? selectedHours + 12
                                                        : selectedAmPm === 'AM' && selectedHours === 12
                                                            ? 0
                                                            : selectedHours}:${selectedMinutes}:00`;
                                                    sendMessage(auth?.selectUser?._id, scheduledTime);
                                                }}
                                                className="px-6 w-full py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow-md hover:from-purple-500 hover:to-blue-500 transition focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                Save Time
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {/* </Dialog> */}


                        </div>
                    </div>
                ) : (<div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                    <FaUserCircle className="text-gray-600 text-8xl mb-4" />
                    <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        No User Selected
                    </h1>
                    <p className="text-gray-400 mt-2 text-center max-w-md">
                        Please select a user to view their details or send a message.
                        Your interaction starts here.
                    </p>
                </div>
                )}
            </div>
        </div >
    );

}

export default ChatPage