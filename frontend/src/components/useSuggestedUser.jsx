import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSuggestedUser } from './redux/authslice';

const useSuggestedUser = () => {
    const dispatch = useDispatch();

    const fetchSuggesteduser = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/user/suggested", {
                withCredentials: true
            });
            
            if (res.data.success) {
                dispatch(setSuggestedUser(res.data.suggestedUsers));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSuggesteduser();
    }, []);

    // Log suggestedUser whenever it updates

    return { fetchSuggesteduser };
};

export default useSuggestedUser;
