import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { Button } from './ui/button';
import { useSelector } from 'react-redux';
import { FaPlusCircle } from "react-icons/fa";
import Stories from './Stories';
import { BsThreeDotsVertical } from "react-icons/bs";


const AddStory = () => {
    const [image, setImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [userStoryOpen, setUserStoryOpen] = useState(false);
    const [text, setText] = useState("");
    const [textColor, setTextColor] = useState("text-white");
    const [loading, setLoading] = useState(false);
    const auth = useSelector(store => store.auth);
    const [stories, setStories] = useState([]);
    const [loginUserStorys, setLoginUserStory] = useState([]);
    const [storyCount, setStoryCount] = useState(0);
    const [textPosition, setTextPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef(null);
    const [colourShow, setColourShow] = useState(false);
    const [textStyleShow, setTextStyleShow] = useState(false);
    const [textStyle, setTextStyle] = useState('');
    const contentEditableRef = useRef(null);
    const [open, setOpen] = useState(false);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    // DRAG AND DROP CODE 

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - textPosition.x,
            y: e.clientY - textPosition.y,
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setTextPosition({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!image) return;
            const formData = new FormData();
            formData.append('image', image);
            if (text) {
                formData.append('text', text);
            }
            if (textColor) {
                formData.append('textColor', textColor);
            }
            if (textStyle) {
                formData.append('textStyle', textStyle);
            }
            if (textPosition) {
                formData.append('textPositionX', textPosition.x);
                formData.append('textPositionY', textPosition.y);
            }

            // Upload to Cloudinary
            const res = await axios.post('https://instagram-clone-5r4x.onrender.com/api/stories/create', formData, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                setLoginUserStory(prev => [...prev, res.data.story])
                setIsOpen(false);
                setImage(null);
                setText('');
                setTextColor('');
                setTextStyle('');
                setImage(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStories = async () => {
        try {
            const res = await axios.get(`https://instagram-clone-5r4x.onrender.com/api/stories/allStory`);
            if (res.data.success) {
                setStories(res?.data?.storys);
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        }
    };

    // GET LOGIN USER STORY 
    const loginUserStory = async () => {
        const response = await axios.get('https://instagram-clone-5r4x.onrender.com/api/stories/userstory', { withCredentials: true })
        if (response?.data?.success) {
            setLoginUserStory(response?.data?.story)
        }
    }

    useEffect(() => {
        loginUserStory();
    }, [])


    useEffect(() => {
        fetchStories();
    }, [])

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleTextStyleClick = () => {
        setTextStyleShow(true);
        setTimeout(() => {
            if (contentEditableRef.current) {
                contentEditableRef.current.focus();
            }
        }, 0);
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            setImage(false);
            setUserStoryOpen(false);
        }
    };

    const handleDeleteStory = async (itemId) => {
        try {
            const response = await axios.delete(`https://instagram-clone-5r4x.onrender.com/api/stories/deleteStory/${itemId}`);
            if(response.data.success){
                setLoginUserStory(prevStories => prevStories.filter(story => story._id !== itemId));
                setUserStoryOpen(false);
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className='flex item-center' >
            <form action="" onSubmit={handleUpload}>
                <div className="flex z-10 flex-col justify-start mt-5 ml-5 mr-5">
                    <button
                        className={`relative flex items-center justify-center w-20 h-20 shadow-lg overflow-hidden ${loginUserStorys.length > 0 && 'rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 cursor-pointer'}`}
                    >
                        <img
                            onClick={() => setUserStoryOpen(true)}
                            src={`${auth?.user?.profile}`}
                            alt=""
                            className="inset-0 w-full rounded-full border border-black border-2 h-full object-cover z-0"
                        />
                    </button>
                    <div>
                        <FaPlusCircle
                            onClick={handleFileClick}
                            className="absolute cursor-pointer left-[320px] top-[70px] bg-white border rounded-full text-gray-800 text-2xl"
                        />
                        {/* Hidden input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    <h1 className='text-[17px] text-nowrap mt-2 font-semibold' >Add Story</h1>

                    {image && (

                        <div id="popup-overlay" onClick={handleOutsideClick} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                            <div className="relative w-[380px] rounded-md h-full border border-gray-600 max-h-[600px] bg-black">

                                <div className="relative w-full h-full rounded-md overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Selected"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none"></div>

                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

                                    {/* Editable Text */}
                                    {/* {(textStyle || colourShow) && ( */}
                                    <div
                                        contentEditable
                                        suppressContentEditableWarning
                                        ref={contentEditableRef}
                                        className={`absolute cursor-grab ${textColor} text-xl font-bold outline-none`}
                                        style={{
                                            top: `${textPosition.y}px`,
                                            left: `${textPosition.x}px`,
                                            fontFamily: `${textStyle}`
                                        }}
                                        onBlur={(e) => setText(e.target.innerText)} // Save text on blur
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseDown={handleMouseDown}
                                    >
                                        {text && (
                                            <p style={{ fontFamily: `${textStyle}` }} className={`text-xl text-purple text-${textColor} font-bold`}>{text}</p>
                                        )}
                                    </div>
                                    {/* )} */}
                                    <div className="rounded-full flex absolute gap-2 top-3 right-3">
                                        <img
                                            onClick={() => {
                                                setTextStyleShow(true);
                                                setColourShow(false);
                                                handleTextStyleClick();
                                            }}
                                            className="rounded-full h-8 w-8 border border-2"
                                            src="https://i.pinimg.com/736x/67/17/b0/6717b06276cff2be7e6c678a31b52a63.jpg"
                                            alt=""
                                        />
                                        <img
                                            onClick={() => {
                                                handleTextStyleClick();
                                                setColourShow(true);
                                                setTextStyleShow(false);
                                            }}
                                            className="rounded-full h-8 w-8"
                                            src="https://img.freepik.com/premium-vector/rgb-color-wheel-spectrum-selector-picker-rgb-palette-logo-color-rainbow-diagram-circle_514344-696.jpg"
                                            alt=""
                                        />
                                    </div>

                                    {/* Color and Font Options */}
                                    <div className="absolute top-14 right-3 flex flex-col gap-2">
                                        {colourShow && (
                                            <div className="flex gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-black`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-black`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-gray-600`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-gray-600`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-white`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-white`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-red-800`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-red-800`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-yellow-300`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-yellow-300`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-green-600`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-green-600`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-blue-600`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-blue-600`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-purple-800`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-purple-800`}
                                                ></button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTextColor(`text-teal-500`)}
                                                    className={`h-8 w-8 rounded-full border border-white bg-teal-500`}
                                                ></button>

                                            </div>

                                        )}
                                        {(textStyleShow) && (
                                            <div className="flex no-scrollbar gap-2 w-[350px] overflow-y-auto">
                                                {[
                                                    "Roboto",
                                                    "Playwrite IN",
                                                    "Roboto Condensed",
                                                    "Roboto Mono",
                                                    "Oswald",
                                                    "Playfair Display",
                                                    "Dancing Script",
                                                ].map((font) => (
                                                    <div key={font}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setTextStyle(font)}
                                                            className="rounded-md whitespace-nowrap p-1 text-black bg-white"
                                                            style={{ fontFamily: `${font}` }}
                                                        >
                                                            {font}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Buttons */}
                                    <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                        {loading ? (
                                            <Button className="">
                                                Please Wait
                                                <Loader2 className="mx-3 w-4 animate-spin" />
                                            </Button>
                                        ) : (
                                            <button
                                                className="px-4 py-2 bg-blue-700 border text-white rounded-lg disabled:opacity-50"
                                                type="submit"
                                            >
                                                Add Story
                                            </button>
                                        )}
                                        <button
                                            className="px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setImage(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </form>

            {loginUserStorys.length > 0 && userStoryOpen && (
                <div id="popup-overlay" onClick={handleOutsideClick} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-md transition-opacity duration-300">
                    <div className="relative bg-[#121212] rounded-lg shadow-2xl pb-8 pl-8 pr-8 pt-5 max-w-lg w-full transform transition-transform duration-300 scale-100 border border-gray-800">
                        {/* Close Button */}

                        <BsThreeDotsVertical onClick={() => setOpen(true)} className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-white transition-transform duration-200 hover:scale-110" />
                            {open && (
                                <div className="fixed z-10 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <div className="relative bg-zinc-900 text-white p-6 rounded-lg shadow-lg w-[300px] text-center">
                                  {/* Close Button */}
                                  <button 
                                    onClick={() => setOpen(false)} 
                                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                              
                                  <h2 className="text-lg font-semibold mb-4">Delete Story?</h2>
                                  <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this story?</p>
                                  
                                  <button 
                                    onClick={() => handleDeleteStory(loginUserStorys[storyCount]._id)} 
                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                                  >
                                    Delete Story
                                  </button>
                                </div>
                              </div>
                              
                              )}
                        


                        {/* Title */}
                        <h2 className="text-4xl font-extrabold mb-5 text-center text-blue-500 tracking-wide">
                            Your Story
                        </h2>

                        <div className="flex flex-col items-center w-full gap-5">

                            {/* Story Image Section */}
                            <div className="relative w-full max-w-md rounded-lg flex items-center justify-center overflow-hidden shadow-lg border border-gray-700">
                                <img
                                    className="object-contain w-full h-[300px] md:h-[400px] rounded-lg transform hover:scale-105 transition-all duration-300"
                                    src={`${loginUserStorys[storyCount]?.image}`}
                                    alt="Story Image"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <p className="text-gray-200 text-3xl font-semibold drop-shadow-md text-center px-4">
                                        {loginUserStorys[storyCount]?.text}
                                    </p>
                                </div>

                                {/* Navigation Arrows on Image */}
                                <div className="absolute inset-0 flex justify-between items-center px-4">
                                    {storyCount > 0 &&
                                        <button
                                            className="bg-gray-800 bg-opacity-70 hover:bg-gray-700 rounded-full p-3 shadow-md hover:scale-110 transition-transform absolute left-4"
                                            onClick={() => setStoryCount((prev) => prev - 1)}
                                            style={{ zIndex: 1 }} // Ensure left button is on top
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="h-8 w-8 text-white"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                            </svg>
                                        </button>
                                    }
                                    {storyCount < loginUserStorys.length - 1 &&
                                        <button
                                            className="bg-gray-800 bg-opacity-70 hover:bg-gray-700 rounded-full p-3 shadow-md hover:scale-110 transition-transform absolute right-4"
                                            onClick={() => setStoryCount((prev) => prev + 1)}
                                            style={{ zIndex: 1 }} // Ensure right button is on top
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="h-8 w-8 text-white"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    }
                                </div>
                            </div>

                            {/* Seen By Section */}
                            <div className="w-full max-w-md">
                                <h3 className="text-2xl font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">
                                    Seen By
                                </h3>
                                <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                                    {loginUserStorys[storyCount]?.seenUser?.map((item, index) => (
                                        <div className="flex  items-center gap-3" key={index}>
                                            <img
                                                src={item?.profile}
                                                className="w-10 h-10 object-cover rounded-full border-2 border-gray-600"
                                                alt={`${item.username}`}
                                            />
                                            <h1 className="text-lg font-medium text-gray-300">
                                                {item?.username}
                                            </h1>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Popup Modal */}

            <div className="flex w-full overflow-hidden">
                <Stories />
            </div>
        </div>
    );
};

export default AddStory;
