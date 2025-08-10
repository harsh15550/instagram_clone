import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setAuthuser } from './redux/authslice'
import CreatePost from './CreatePost'
import SearchUser from './SearchUser'
import Notification from './Notification'
import { FaVideo } from 'react-icons/fa'
import { FaImage } from 'react-icons/fa6'
import { CgPlayButtonR } from "react-icons/cg";

const LeftSidebar = () => {
    const url = "https://instagram-clone-5r4x.onrender.com";
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(null);
    const { user } = useSelector(store => store.auth);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [leftSidePopup, setLeftSidePopup] = useState('');
    const [filePopup, setFilePopup] = useState(false);
    const { notification } = useSelector(store => store.notification)
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedReel, setSelectedReel] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Close the popup if clicked outside of it
    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            setIsPopupOpen(false);
            setFilePopup(false);
        }
    };

    const sideBarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <CgPlayButtonR className='w-6 h-6' />, text: "Reels" },
        { icon: <MessageCircle className='h-7 w-7'/>, text: "Messages" },
        {
            icon: <div className='relative' >
                <div className='h-4 absolute left-4 bottom-3 flex items-center justify-center w-4 bg-red-600 rounded-full' >{notification.length}</div>
                <Heart />
            </div>, text: "Notification"
        },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (<Avatar>
                <AvatarImage className='w-7 object-cover rounded-full h-7' src={user?.profile} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>), text: "Profile"
        },
        {
            icon: (<Avatar>
                <AvatarImage className='w-7 object-cover rounded-full h-7' src='https://newsinhealth.nih.gov/sites/nihNIH/files/2023/January/jan-2023-capsule2-conceptual-graphic-showing-many-ways-AI-integrated-into-technologies-people-use-every-day.jpg' />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>), text: "AI"
        },
        { icon: <LogOut />, text: "Logout" },
    ]

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${url}/api/user/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthuser(null))
                navigate('/login')
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sideBarHandler = (text) => {
        if (text === "Logout") {
            logoutHandler();
        } else if (text === "Create") {
            setFilePopup(true);
        } else if (text === "Profile") {
            navigate(`/profile/${user._id}`)
        } else if (text === "Explore") {
            navigate(`/explore`)
        } else if (text === "Reels") {
            navigate(`/reel`)
        } else if (text === "Messages") {
            navigate(`/chat`)
        } else if (text === "Home") {
            navigate(`/`)
        } else if (text === "AI") {
            navigate(`/ai`)
        } else if (text === "Search") {
            setIsPopupOpen(true);
            setLeftSidePopup('Search')
        } else if (text === "Notification") {
            setIsPopupOpen(true);
            setLeftSidePopup('Notification')
        }
    }

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedReel(file)
        }
    };

    return (
        <>

            <div className='fixed top-0 px-4 left-0 -grey-300 w-[16%] h-screen' >
                <div className='flex relative flex-col'>
                    <h1
                        style={{ fontFamily: 'Lobster', WebkitBackgroundClip: 'text'}}
                        className='flex center mt-7 text-white text-3xl px-3 mb-4'>
                        InstaVibes
                    </h1>
                    <div>
                        {/* Sidebar Items */}
                        {sideBarItems.map((items, index) => {
                            return (
                                <div
                                    onClick={() => sideBarHandler(items.text)}
                                    className="flex gap-3 mt-3 rounded-md items-center relative p-3 hover:bg-zinc-800 cursor-pointer"
                                    key={index}
                                >
                                    {items.icon}
                                    <span>{items.text}</span>
                                </div>
                            );
                        })}

                        {(isPopupOpen || filePopup) && (
                            <div
                                id="popup-overlay"
                                className="fixed inset-0 bg-black opacity-50"
                                onClick={handleOutsideClick}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Search Drawer Popup */}
            <div className={`fixed z-20 top-0 left-0 bottom-0 w-[350px] bg-zinc-900 border-r border-gray-700 text-white transition-transform duration-300 ease-in-out ${isPopupOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex mr-3 ml-3 flex-col h-full">
                    {leftSidePopup === 'Search' ? <SearchUser setIsPopupOpen={setIsPopupOpen}/> : <Notification setIsPopupOpen={setIsPopupOpen} />}
                </div>
            </div>

            {/* Select Image And Reel Popup  */}
            {filePopup && (
                <div className="fixed bottom-[170px] left-4 w-[210px] bg-zinc-800 shadow-lg rounded-md p-4 z-50">
                    <h1 className="text-gray-300 text-sm font-medium mb-3">Choose Upload Type</h1>
                    <div className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-zinc-700 rounded-md transition">
                        <input
                            type="file"
                            required
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="absolute opacity-0 cursor-pointer"
                        />
                        <FaVideo className="text-white text-xl" />
                        <span className="text-white text-sm font-medium">Upload Reel</span>
                    </div>
                    <div className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-zinc-700 rounded-md transition">
                        <input
                            type="file"
                            required
                            accept="image/*"
                            onChange={handleImgChange}
                            className="absolute opacity-0 cursor-pointer"
                        />
                        <FaImage className="text-white text-xl" />
                        <span className="text-white text-sm font-medium">Upload Image</span>
                    </div>
                </div>
            )}



            {/* </div > */}
            <CreatePost open={open} setSelectedReel={setSelectedReel} selectedReel={selectedReel} selectedFile={selectedFile} selectedImage={selectedImage} setFilePopup={setFilePopup} setOpen={setOpen} setSelectedImage={setSelectedImage} />
        </>
    )
}

export default LeftSidebar