import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserProfile } from './redux/authslice';

const useUserProfile = (userId) => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`https://instagram-clone-5r4x.onrender.com/api/user/profile/${userId}`, {
          withCredentials: true
        })

        if (res.data.success) {
          dispatch(setUserProfile(res.data.userData));
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserProfile();
  }, [userId, user])
}

export default useUserProfile