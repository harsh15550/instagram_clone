import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectPost } from './redux/postSlice';
import { toast } from 'sonner';
import { FaBookmark, FaHeart, FaPause, FaPlay, FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import useToggleLike from './useToggleLike';
import { setUserProfile } from './redux/authslice';
import { Link } from 'react-router-dom';

const ReelItem = ({ reel, handleVideoClick, playingVideo, videoRefs }) => {
    const { likeDislikeHandler, likeCount, like } = useToggleLike(reel);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const { selectPost, post } = useSelector((store) => store.post);
    const [text, setText] = useState("");
    const auth = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [isBookmarked, setIsBookmarked] = useState(
        auth?.userProfile?.bookmarks?.some((bookmark) => bookmark?._id === reel?._id)
    );
    
    const handleCommentClick = (id) => {
        setActiveCommentId(activeCommentId === id ? null : id); // Toggle the popup
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            setActiveCommentId(null);
        }
    };

    const commentHandler = async (item) => {
        try {
            const res = await axios.post(
                `https://instagram-clone-5r4x.onrender.com/api/post/addcomment/${item}`,
                { text },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                setText("");
                dispatch(setSelectPost({
                    ...selectPost,
                    comments: [...selectPost.comments, res.data.comment]
                }))
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const bookmarkHandler = async (itemId) => {
        if (!itemId) {
            console.log('Item Id is Undefined');
            return;

        }
        try {
            const response = await axios.post(
                `https://instagram-clone-5r4x.onrender.com/api/post/bookmark/${itemId}`,
                {},
                { withCredentials: true }
            );

            if (response.data.message === "Added to Bookmark") {
                toast.success(response.data.message);

                dispatch(
                    setUserProfile({
                        ...auth?.userProfile,
                        bookmarks: [
                            ...auth.userProfile.bookmarks,
                            { ...reel }
                        ],
                    })
                );

                setIsBookmarked(true);
            } else if (response.data.message === "Removed from Bookmarked") {
                toast.success(response.data.message);

                dispatch(
                    setUserProfile({
                        ...auth.userProfile,
                        bookmarks: auth.userProfile.bookmarks.filter(
                            (post) => post._id !== itemId
                        ),
                    })
                );

                // Update UI state
                setIsBookmarked(false);
            }
        } catch (error) {
            console.error("Bookmark Error:", error);
            toast.error("Something went wrong while updating the bookmark.");
        }
    };

    return (
        <div
            id="popup-overlay"
            onClick={() => { handleVideoClick(reel._id); }}
            className="max-w-[450px] w-full h-screen snap-start flex items-center justify-center bg-black relative mx-auto"
        >
            <video
                id={reel._id}
                ref={(el) => (videoRefs.current[reel._id] = el)}

                src={reel.reel}
                className="w-full h-[95%] border border-gray-900 object-cover rounded-lg shadow-lg"
                autoPlay={playingVideo === reel._id}
                loop
            />


            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playingVideo === reel._id ? "opacity-0" : "opacity-100"
                    }`}
            >
                {playingVideo === reel._id ? (
                    <FaPause
                        className="text-white text-6xl cursor-pointer"
                        onClick={() => handleVideoClick(reel._id)}
                    />
                ) : (
                    <FaPlay
                        className="text-white text-6xl cursor-pointer"
                        onClick={() => handleVideoClick(reel._id)}
                    />
                )}
            </div>

            <div className="absolute bottom-10 left-2 text-white w-full px-5">
                <div className="flex items-center gap-3 mb-3">
                    <Link className='flex items-center gap-3' to={`/profile/${reel.author._id}`}>
                        <img
                            src={reel.author.profile}
                            alt="User"
                            className="h-10 w-10 object-cover bg-gray-300 rounded-full"
                        />
                        <h2 className="text-lg font-bold">{reel?.author.username}</h2>
                    </Link>
                    <button className="text-white px-5 py-1 rounded-lg border transition-all">
                        Follow
                    </button>
                </div>

                <h1 className="text-md text-gray-400 mb-2">{reel.caption}</h1>

                <div className="absolute right-7 bottom-10 flex flex-col items-center space-y-5">
                    <div className="flex flex-col items-center group">
                        <div
                            onClick={(e) => {
                                dispatch(setSelectPost(reel));
                                e.stopPropagation();
                                likeDislikeHandler(reel._id);
                            }}
                            className="text-[25px] cursor-pointer transition-colors duration-300"
                        >
                            {like ? (
                                <FaHeart className="text-red-500 hover:text-red-700" />
                            ) : (
                                <FaRegHeart className="hover:text-gray-400" />
                            )}
                        </div>
                        <span className="text-sm text-white mt-1">
                            {likeCount}
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center group"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering video play/pause
                            handleCommentClick(reel._id);
                        }}
                    >
                        <FaRegComment
                            onClick={() => {
                                dispatch(setSelectPost(reel));
                            }}
                            className="text-2xl text-white hover:text-gray-400 transition-all cursor-pointer shadow-md"
                        />
                        <span className="text-sm text-white  mt-1">
                            {reel.comments.length}
                        </span>
                    </div>
                    <div className="flex flex-col items-center group">
                        <FiShare2 className="text-2xl text-white hover:text-gray-400 transition-all cursor-pointer shadow-md" />
                        <span className="text-sm text-white mt-1">Share</span>
                    </div>
                    <div onClick={(e) => { bookmarkHandler(reel._id); e.stopPropagation(); }} className="flex flex-col items-center group">
                        {isBookmarked ?
                            <FaBookmark className="text-2xl text-white hover:text-gray-400 transition-all cursor-pointer shadow-md" />
                            : <FaRegBookmark className="text-2xl text-white hover:text-gray-400 transition-all cursor-pointer shadow-md" />
                        }
                        <span className="text-sm text-white mt-1">Save</span>
                    </div>
                </div>
            </div>

            {/* Comment Popup */}
            {activeCommentId === selectPost?._id && (
                <div id="popup-overlay" onClick={() => handleOutsideClick()} className="absolute h-[600px] top-[80px] right-[-370px] w-[350px] h-[350px] bg-zinc-900 text-white rounded-md shadow-lg p-3 z-10">
                    <h3 className="text-lg font-bold border-b border-gray-600 mb-2">Comments</h3>
                    <div className="max-h-[500px] mb-10 bg-zinc-900 overflow-y-auto">
                        <div className="space-y-3 mb-10">
                            {selectPost.comments.map((comment, index) => (
                                <div className='border-b border-gray-800' key={index}>
                                    <div className="flex items-center">
                                        <img
                                            src={comment.author.profile}
                                            className="h-8 w-8 rounded-full"
                                        />
                                        <p className="ml-2">{comment.author.username}</p>
                                    </div>
                                    <p className="ml-9 mb-2 text-gray-400">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex w-[340px] p-3  bg-zinc-900 absolute bottom-0 left-0 gap-2">
                        <input
                            type="text"
                            value={text}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    commentHandler(selectPost?._id);
                                }
                            }}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-zinc-900 border border-gray-700 text-sm p-2.5 rounded-md"
                            placeholder="Add a comment..."
                        />
                        <button
                            onClick={() => {
                                commentHandler(selectPost?._id);
                            }}
                            className="bg-blue-700 text-white text-sm px-3 py-1 rounded-md"
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReelItem