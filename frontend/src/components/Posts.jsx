import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FiMoreHorizontal } from 'react-icons/fi';
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { GrShareOption } from "react-icons/gr";
import { FaRegBookmark } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPost, setSelectPost } from './redux/postSlice';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import useAllPost from './useAllPost';
import { setUserProfile } from './redux/authslice';
import { FaBookmark } from "react-icons/fa6";
import { addNotification, removeNotification } from './redux/notificationSlice';
// import useToggleLike from './useToggleLike';
import useSocket from './useSocket';
import { DialogTitle } from '@radix-ui/react-dialog';

const Posts = ({ item }) => {
  // const { setLikeCount, likeCount, like, setLike } = useToggleLike(item);
  const auth = useSelector(store => store.auth);
  const [likeCount, setLikeCount] = useState(item?.likes?.length);
  const [like, setLike] = useState(
    item?.likes?.some((id) => id === auth?.user?._id)
  )
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [dialog, setDialog] = useState(false);
  const { selectPost, post } = useSelector(store => store.post);
  const { fetchAllPost } = useAllPost("");
  const dispatch = useDispatch();
  const [isBookmarked, setIsBookmarked] = useState(
    auth?.userProfile?.bookmarks?.some((bookmark) => bookmark?._id === item?._id)
  );
  // const socket = useSelector((store) => store.socket.socket);
  const [visibleHearts, setVisibleHearts] = useState({});
  const [commentLength, setCommentLength] = useState(item?.comments?.length)
  const socket = useSocket();

  // POST DELETE 
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:4000/api/post/deletepost/${item._id}`, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchAllPost();
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
    setOpen(false);
  };

   useEffect(() => {
    const handleLikeNotification = (likeNotification) => {
      dispatch(addNotification(likeNotification));
    };

    const handleDislikeNotification = (disLikeNotification) => {
      dispatch(removeNotification(disLikeNotification));
    };

    socket?.on('likeNotification', handleLikeNotification);
    socket?.on('disLikeNotification', handleDislikeNotification);

    return () => {
      if (like) {
        socket?.off('likeNotification', handleLikeNotification);
      } else {
        socket?.off('disLikeNotification', handleDislikeNotification);
      }
    };
  }, [socket, dispatch]);

  const likeDislikeHandler = async (postId) => {
    const action = !like ? 'like' : 'dislike';
    try {
      const res = await axios.post(`http://localhost:4000/api/post/${action}/${postId}`, {}, {
        withCredentials: true
      });

      if (res.data.success) {
        setLike(!like);
        like ? setLikeCount(prev => prev - 1) : setLikeCount(prev => prev + 1)
        const updatedPostData = post.map(p =>
          p._id === postId
            ? { ...p, likes: like ? p.likes.filter(id => id !== auth.user._id) : [...p.likes, auth.user._id] } : p
        )
        dispatch(setPost(updatedPostData))
      }

    } catch (error) {
      console.log(error);
    }
  };

  const onImgLikeHandle = async (itemId) => {
    // Hide heart after 2 seconds
    setTimeout(() => {
      setVisibleHearts((prev) => ({ ...prev, [itemId]: false }));
    }, 1500);
    setVisibleHearts((prev) => ({ ...prev, [itemId]: true })); // Show heart for the clicked image
    if (!like) {

      try {
        const res = await axios.post(`http://localhost:4000/api/post/like/${itemId}`, {}, {
          withCredentials: true
        });

        if (res.data.success) {
          setLike(true);
          setLikeCount(prev => prev + 1)
          const updatedPostData = post.map(p =>
            p._id === itemId
              ? { ...p, likes: [...p.likes, auth.user._id] } : p
          )
          dispatch(setPost(updatedPostData))
        }

      } catch (error) {
        console.log(error);
      }
    }
  }

  // ADD COMMENT 
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/post/addcomment/${item._id}`,
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
        dispatch(setSelectPost({
          ...selectPost,
          comments: [
            ...selectPost.comments,
            { _id: res.data.comment._id, text: res.data.comment.text, author: res.data.comment.author }
          ]
        }));
        fetchAllPost();
        setCommentLength(prev => prev + 1);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // BookMark 
  const bookmarkHandler = async (itemId) => {
    if (!itemId) {
      console.log('Item Id is Undefined');
      return;

    }
    try {
      const response = await axios.post(
        `http://localhost:4000/api/post/bookmark/${itemId}`,
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
              { ...item }
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

  const handleAddToFavorites = () => {
    setOpen(false);
  };

  return (
    <div className='w-full flex min-h-[100%] justify-center mt-4 mb-4'>
      <div className='flex gap-2 flex-col'>
        <div className="flex  justify-between">
          <div className='flex justify-center items-center mb-3 gap-2'>
            <Link to={`/profile/${item?.author?._id}`}>
              <Avatar>
                <AvatarImage className='w-10 h-10 object-cover rounded-full' src={item?.author?.profile} />
                <AvatarFallback>{item?.author?.username}</AvatarFallback>
              </Avatar>
            </Link>
            <div className='flex gap-2'>
              <Link to={`/profile/${item?.author?._id}`}>
                <h2>{item?.author?.username}</h2>
              </Link>
              {auth?.user?._id === item?.author?._id && <Badge className='bg-gray-800 text-white'>Author</Badge>}
            </div>
          </div>
          <div className="dialog">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-0.5 bg-black hover:bg-gray-800 hover:text-white text-white">
                  <FiMoreHorizontal />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 text-white text-center p-6 sm:max-w-[425px] shadow-lg border border-zinc-700 rounded-lg">
                <DialogTitle className="mb-4 text-zinc-300">
                  You're about to unfollow this user. Choose an option below to proceed.
                </DialogTitle>
                <div className="flex flex-col gap-4">
                  
                  <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white" variant="secondary" onClick={() => {bookmarkHandler(item?._id); handleAddToFavorites(); } }>

                    {isBookmarked ? 'Removed from Favorites' : 'Add to Favorites' } 
                  </Button>
                  {auth && auth?.user?._id === item?.author?._id && (
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700" onClick={handleDelete}>
                      Delete
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

        </div>
        <div className="relative pb-1 border border-slate-700 max-w-[450px] min-w-[450px] flex justify-center">
          <div className="h-full object-cover">

            {item?.image ?
              <img
                className="h-full object-cover"
                onDoubleClick={() => onImgLikeHandle(item._id)}
                src={item?.image}
                alt=""
              /> :
              <video
                // controls
                muted
                loop
                autoPlay
                onDoubleClick={() => onImgLikeHandle(item._id)}
                src={item?.reel}
                className="object-cover h-[550px]"
              />
            }
          </div>
          {visibleHearts[item._id] && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="heart-animation">
                ❤️
              </div>
            </div>
          )}
        </div>


        <div className="flex justify-between">
          <div className="flex gap-4">
            <div onClick={() => likeDislikeHandler(item?._id)} className="text-[25px] cursor-pointer transition-colors duration-300">
              {like ? (
                <FaHeart className="text-red-500 hover:text-red-700" />
              ) : (
                <FaRegHeart className="hover:text-gray-500" />
              )}
            </div>
            <FaRegComment onClick={() => { setDialog(true); dispatch(setSelectPost(item)); }} className='text-[25px] cursor-pointer hover:text-gray-500 transition-colors duration-300' />
            <GrShareOption className='text-[25px] hover:text-gray-500 transition-colors cursor-pointer duration-300' />
          </div>
          <div>
            {isBookmarked ? (
              <FaBookmark onClick={() => { bookmarkHandler(item?._id); }} className='text-[25px] cursor-pointer hover:text-gray-700 transition-colors duration-300' />
            ) : (
              <FaRegBookmark onClick={() => { bookmarkHandler(item?._id); }} className='text-[25px] cursor-pointer hover:text-gray-700 transition-colors duration-300' />
            )}
          </div>
        </div>
        <div className="border-b">
          <span> {likeCount} likes</span>
          <p className='flex gap-2'>
            <span className=' font-bold'>{item?.author?.username}</span>
            <span className='max-w-[370px]'>{item?.caption}</span>
          </p>
          <p className='cursor-pointer text-gray-400' onClick={() => { setDialog(true); dispatch(setSelectPost(item)); }}>view all {commentLength} comments</p>
          <CommentDialog dialog={dialog} setDialog={setDialog} />
          <div className="flex">
            <input type="text" value={text} onClick={() => { dispatch(setSelectPost(item)); }} onChange={e => setText(e.target.value)} placeholder='Add a Comment...' className='w-full bg-black h-10 outline-none' />
            {text.trim().length > 0 && (
              <p onClick={commentHandler} className='pr-4 cursor-pointer text-blue-500'>Post</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
