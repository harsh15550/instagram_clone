import axios from 'axios';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from './redux/postSlice';

const useToggleLike = (item) => {
  const auth = useSelector(store => store.auth);
  const { post } = useSelector(store => store.post);
  const dispatch = useDispatch();
  
  const [likeCount, setLikeCount] = useState(item?.likes?.length);
  const [like, setLike] = useState(
    item?.likes?.some((id) => id === auth?.user?._id)
  )

  const likeDislikeHandler = async (postId) => {
    const action = !like ? 'like' : 'dislike';
    try {
      const res = await axios.post(`https://instagram-clone-5r4x.onrender.com/api/post/${action}/${postId}`, {}, {
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
  return { likeDislikeHandler, setLikeCount, likeCount, like, setLike, item }
}

export default useToggleLike