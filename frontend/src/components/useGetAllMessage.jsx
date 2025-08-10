import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setMessage } from './redux/chatslice';

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectUser} = useSelector(store => store.auth); // Use Redux state for posts

    const fetchMessage = async () => {
        try {
            if(selectUser){

                const res = await axios.get(`https://instagram-clone-5r4x.onrender.com/api/message/all/${selectUser._id}`, {
                    withCredentials: true
                });
    
                if (res.data.success) {
                    dispatch(setMessage(res.data.messages));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchMessage();
    }, [])
    return { fetchMessage };
}

export default useGetAllMessage