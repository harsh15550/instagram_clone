import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setSelectPost } from './redux/postSlice';

const CommentDialog = ({ dialog, setDialog }) => {
  const [text, setText] = useState("");

  const [getComment, setGetComment] = useState([]);
  const comment = useSelector(store => store.post.selectPost);
  const dispatch = useDispatch();

  // const getAllComment = async () => {
  //   try {
  //     const res = await axios.post(`https://instagram-clone-5r4x.onrender.com/api/post/allcomment/${comment._id}`, {}, { withCredentials: true });
  //     if (res.data.success) {
  //       console.log('Fetched Comments:', res.data.comments);
  //       setGetComment(res.data.comments); 
  //     }
  //   } catch (error) {
  //     console.error('Error fetching comments:', error);
  //   }
  // };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagram-clone-5r4x.onrender.com/api/post/addcomment/${comment._id}`,
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
        toast.success(res.data.message);

        dispatch(setSelectPost({
          ...comment,
          comments: [
            ...comment.comments,
            { _id: res.data.comment._id, text: res.data.comment.text, author: res.data.comment.author }
          ]
        }));

      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setDialog(false);
    }
  };

  return (
    <>
      {dialog ? (
        <div
        id="popup-overlay"
        onClick={handleOutsideClick}
        className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-40 backdrop-blur-md"
      >
        <div className="bg-black border border-1 border-gray-800 rounded-lg shadow-lg max-w-4xl w-full p-6 flex">
          {/* Image or Video Section */}
          <div className="w-1/3 flex justify-center items-center">
            {comment.image ? (
              <img
                src={comment?.image}
                alt="Comment Image"
                className="rounded-lg object-cover h-full"
              />
            ) : (
              <video
                controls
                src={comment?.reel} // Create URL for the selected file
                className="object-contain w-full h-100"
              />
            )}
          </div>
      
          {/* Comment Section */}
          <div className="w-2/3 ml-6 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Comments</h2>
              <button
                className="text-gray-400 hover:text-gray-200 transition-colors"
                onClick={() => setDialog(false)}
              >
                Close
              </button>
            </div>
      
            {/* Comments List */}
            <div className="space-y-4 h-64 overflow-y-auto pr-2 flex-grow">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-5">
                  {comment.comments.length > 0 ? (
                    comment.comments.map((item) => (
                      <div className="flex items-center gap-2" key={item._id}>
                        <img
                          className="rounded-full w-8 h-8 object-cover"
                          src={`${item?.author?.profile}`}
                          alt={`${item?.author?.username}`}
                        />
                        <p className="font-semibold text-white">
                          {item?.author?.username}
                        </p>
                        <p className="text-gray-400">{item?.text}</p>
                      </div>
                    ))
                  ) : (
                    <h1 className="text-xl text-white">No Comment Added</h1>
                  )}
                </div>
              </div>
            </div>
      
            {/* Input Section */}
            <div className="border-t mt-4 pt-4 flex items-center border-gray-700">
              <input
                type="text"
                value={text}
                onKeyDown={e => {
                  if(e.key === 'Enter'){
                    commentHandler();
                  }
                }}
                
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow p-2 border border-gray-700 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={commentHandler} // Post new comment
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
                disabled={!text.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      
      ) : null}
    </>
  );
};

export default CommentDialog;
