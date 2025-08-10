import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

const PostDialog = ({ postOpen, setPostOpen, activePost, setActivePost }) => {
    const { user } = useSelector(store => store.auth);
    const { post } = useSelector(store => store.post);
    const [text, setText] = useState("");
    const dispatch = useDispatch();
    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            setPostOpen(false);
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(
                `https://instagram-clone-5r4x.onrender.com/api/post/addcomment/${activePost._id}`,
                { text },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                setText("");
                dispatch(setActivePost({
                    ...activePost,
                    comments: [
                        ...activePost.comments,
                        { _id: res.data.comment._id, text: res.data.comment.text, author: res.data.comment.author }
                    ]
                }));
                // fetchAllPost();
                // setCommentLength(prev => prev + 1);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const postd = post.find(post => post._id === activePost._id);

    return (
        postOpen &&
        <div id="popup-overlay" onClick={handleOutsideClick} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-black border border-gray-600 rounded-lg shadow-xl max-w-5xl w-full mx-4 md:mx-0 flex overflow-hidden">
                <div className="w-1/2 border border-l border-gray-700">
                    {activePost.image ?
                        <img
                            src={`${activePost.image}`}
                            alt="Post"
                            className="w-full h-full object-cover"
                        />
                        : <video
                            controls
                            src={activePost.reel} // Create URL for the selected file
                            className="w-full max-h-[600px] object-contain"
                        />
                    }
                </div>

                <div className="w-1/2 flex flex-col p-4 relative">
                    <div className="flex items-center gap-4 border-gray-700 border-b pb-4">
                        <img
                            src={`${activePost.author.profile}`}
                            alt="User Profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="text-lg font-semibold">{activePost?.author?.username}</h3>
                            <p className="text-sm text-gray-300">{activePost?.author?.bio}</p>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="flex-1 overflow-y-auto mt-4 space-y-4">
                        {/* Example comment */}
                        <div className="items-start max-h-[380px]  min-h-[380px] overflow-y-auto gap-3">
                            {activePost?.comments?.map((comment) => {

                                return (
                                    <div className="flex gap-2 p-2 items-center" key={comment._id}>

                                        <img
                                            src={`${comment?.author?.profile}`}
                                            alt="Commenter Profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm flex gap-2">
                                                <span className="font-semibold">{comment?.author?.username}</span>
                                                <span className="text-gray-400">{comment?.text}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            }
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-gray-700 pt-4">
                        <input
                            type="text"
                            value={text}
                            // onClick={() => setSelectPost(activePost)}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-black px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    commentHandler();
                                }
                            }}
                        />
                        <button className="p-2 w-[100px] rounded-md bg-blue-500" onClick={() => commentHandler()}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDialog;
