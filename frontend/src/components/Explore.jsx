import { useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import PostDialog from "./PostDialog";

const Explore = () => {
    const { post } = useSelector((store) => store.post);
    const [postOpen, setPostOpen] = useState(false);
    const [activePost, setActivePost] = useState({});

    return (
        <div className="bg-black min-h-screen border-l border-gray-700 ml-[16%] flex justify-center p-4">
            <div className="columns-3 gap-2 w-[80%] space-y-2">
                {post.map((item, index) => (
                    <div key={index} onClick={() => {setActivePost(item); setPostOpen(true)}} className="relative break-inside-avoid">
                        {item.image ?
                            <img
                                src={item.image}
                                alt="Post"
                                className="w-full h-auto object-cover rounded-md cursor-pointer transition-transform duration-300 hover:scale-105"
                            />
                            : <video className="rounded-md" src={item.reel}></video>
                        }
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-black/60 gap-5 flex opacity-0 hover:opacity-100 flex justify-center items-center transition-opacity">
                            <span className="text-white text-3xl flex items-center gap-1 font-semibold">
                                <FaHeart /> {item.likes.length}
                            </span>
                            <span className="text-white text-3xl flex items-center gap-1 font-semibold">
                                <FaComment /> {item.comments.length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <PostDialog postOpen={postOpen} setPostOpen={setPostOpen} activePost={activePost} setActivePost={setActivePost}/>
        </div>
    );
};

export default Explore;
