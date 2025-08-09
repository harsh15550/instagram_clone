import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from './redux/postSlice';
import axios from 'axios';

const useAllPost = () => {
    const dispatch = useDispatch();
  const posts = useSelector(store => store.post.post); 

    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/post/allpost", {
          withCredentials: true
        });

        if (res.data.success) {
          dispatch(setPost(res.data.post)); 
        }
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
        fetchAllPost();
    }, [])
    return { posts, fetchAllPost };
}

export default useAllPost