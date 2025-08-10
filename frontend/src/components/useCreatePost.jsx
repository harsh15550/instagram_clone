import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserProfile } from './redux/authslice';
import { setPost } from './redux/postSlice';

const useCreatePost = (caption, selectedImage) => {
    // const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const auth = useSelector(store => store.auth);
    const posts = useSelector(store => store.post.post);
    const dispatch = useDispatch();

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('caption', caption);
        formData.append('image', selectedImage);

        try {
            const res = await axios.post('https://instagram-clone-5r4x.onrender.com/api/post/addpost', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true, // For sending cookies if needed
            });

            if (res.data.success) {
                const newPost = res.data.post;
                console.log("New post created:", newPost);
                dispatch(setPost([...posts, newPost]));
                // setCaption("");
                // setSelectedImage(null);
                setOpen(false);
                setLoading(false);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };
}

export default useCreatePost