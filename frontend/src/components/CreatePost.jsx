import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from './redux/postSlice'; // Updated import

const CreatePostDialog = ({ selectedImage, selectedReel, setSelectedReel, setFilePopup, setSelectedImage }) => {
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [captionLoading, setCaptionLoading] = useState(false);
    const auth = useSelector(store => store.auth);
    const posts = useSelector(store => store.post.post);
    const dispatch = useDispatch();
    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            setSelectedImage('');
        }
    };

    const handleCreatePostOrReel = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Determine the media type and append appropriate data
        const isReel = selectedReel?.type?.startsWith("video/");
        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("type", isReel ? "reel" : "post"); // Send media type
        formData.append("media", isReel ? selectedReel : selectedImage); // Add the file (image or reel)

        try {
            const res = await axios.post(`https://instagram-clone-5r4x.onrender.com/api/post/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                const newPost = res.data.post;
                const updatedPosts = [...posts, newPost];
                dispatch(setPost(updatedPosts));
                setCaption("");
                setSelectedImage(null);
                // setOpen(false);
                setSelectedReel(null);
                setFilePopup(false);
                setLoading(false);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const generateImageCaption = async () => {
        setCaptionLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", selectedImage);

            const response = await axios.post('https://instagram-clone-5r4x.onrender.com/api/caption/image-to-text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setCaption(response.data.caption);
                setCaptionLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>

            {(selectedImage || selectedReel) ? (
                <div id="popup-overlay" onClick={handleOutsideClick} className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 backdrop-blur-md">
                    <div className="bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl border border-gray-700 w-[550px] max-w-3xl p-8 pt-3 flex flex-col text-gray-100">

                        <div className="flex justify-between items-center mt-2 mb-4">
                            <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                                Create Post
                            </h2>
                            <button
                                className="text-gray-400 hover:text-red-500 transition duration-200 text-xl"
                                onClick={() => { setSelectedImage(null); setSelectedReel(null) }}
                            >
                                ✖
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center mb-4">
                            <Avatar>
                                <AvatarImage
                                    src={`${auth?.user?.profile}`}
                                    className="rounded-full object-cover w-14 h-14 shadow-lg border-2 border-purple-500"
                                    alt="User profile"
                                />
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold text-lg">{auth?.user?.username}</p>
                                <p className="text-gray-400 text-sm">{auth?.user?.bio}</p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleCreatePostOrReel}>
                            <div className="space-y-6">
                                {/* Caption Input */}
                                <div className="relative flex items-center gap-3">
                                    <textarea
                                        required
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="Write a caption..."
                                        className="w-full p-4 pt-3 pb-3 bg-gray-800 bg-opacity-60 text-gray-100 border border-gray-700 rounded-xl shadow-md focus:outline-none transition resize-none overflow-y-auto"
                                    />
                                    {selectedImage &&
                                        <div className="relative w-11 h-10 flex items-center justify-center">
                                        {captionLoading ? (
                                            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                                        ) : (
                                            <div className="group">
                                                <img
                                                    src="https://i.pinimg.com/736x/50/b4/4e/50b44e46baafda29997981b6c235ba31.jpg"
                                                    onClick={generateImageCaption}
                                                    className="h-10 w-10 cursor-pointer rounded-full"
                                                    alt=""
                                                />
                                                {/* Tooltip */}
                                                <div className="absolute text-nowrap left-1/2 -translate-x-1/2 -top-10 bg-black border border-gray-600 text-white text-1xl px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Generate Caption
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    }
                                </div>


                                {/* Selected Image Preview */}
                                {(selectedImage || selectedReel) && (
                                    <div className="rounded-xl overflow-hidden border border-gray-700">
                                        {selectedImage &&
                                            <img
                                                src={URL.createObjectURL(selectedImage)}
                                                alt="Selected Image"
                                                className="object-contain w-full h-80"
                                            />
                                        }

                                        {selectedReel &&
                                            <div className="rounded-xl overflow-hidden border border-gray-700">
                                                <video
                                                    src={URL.createObjectURL(selectedReel)} // Create URL for the selected file
                                                    className="object-contain w-full h-80"
                                                />
                                            </div>

                                        }
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div>
                                    {loading ? (
                                        <Button className="flex w-full justify-center items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md shadow-lg">
                                            Please Wait
                                            <Loader2 className="ml-3 w-5 h-5 animate-spin" />
                                        </Button>
                                    ) : (
                                        <button
                                            className="flex w-full justify-center items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md shadow-lg"
                                            disabled={!caption.trim()}
                                            type="submit"
                                        >
                                            Create Post
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div >
                </div >
            ) : null}
        </>

    );
};

export default CreatePostDialog;
