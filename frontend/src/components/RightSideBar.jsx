import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAuthuser } from './redux/authslice';
import { toast } from 'sonner';

const RightSideBar = () => {
  const auth = useSelector(store => store.auth);
  const { user, userProfile, suggestedUser } = useSelector(store => store.auth);
  const [flag, setFlag] = useState(user?.following?.includes(userProfile?._id) || false)
  const dispatch = useDispatch();

  const handlefollowUnfollow = async (userId) => {
    const res = await axios.post(`http://localhost:4000/api/user/followunfollow/${userId}`, {}, {
      withCredentials: true
    })
    if (res.data.success) {
      dispatch(setAuthuser({
        ...user,
        following: user?.following?.includes(userId)
          ? user?.following?.filter(id => id !== userId)
          : [...user?.following, userId]
      }));
      setFlag(!flag)
      toast.success(res.data.message)
      console.log(res);
    }
  }

  return (
    <div className=' w-[50%] mr-[%] pr-[7%]  flex justify-center mt-[3%]' >
      <div className="w-full max-w-md mx-auto p-4 rounded-lg">
        {/* Logged-In User Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to={`/profile/${auth?.user?._id}`} className="flex items-center space-x-3">
              <img
                src={auth?.user?.profile}
                alt={auth?.user?.username}
                className="w-12 h-12 rounded-full object-cover  "
              />
              <div>
                <h3 className="text-lg font-medium">{auth?.user?.username}</h3>
                <p className="text-xs text-gray-500">{auth?.user?.bio}</p>
              </div>
            </Link>
          </div>
          <button className="text-xs text-blue-500">Switch</button>
        </div>

        {/* Title for Suggested Users */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-600">Suggested for you</h2>
          <button className="text-xs text-blue-500">See All</button>
        </div>

        {/* Suggested Users List */}
        <div className="space-y-4">
          {auth?.user?._id != suggestedUser?._id && suggestedUser?.map((users, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${users?._id}`}  >
                  {users?.profile ?
                    <img
                      src={users?.profile}
                      className={`w-10 h-10 rounded-full bg-gray-600 object-cover`}
                    /> : <div className={`w-10 h-10 rounded-full flex border justify-center text-2xl bg-gray-600`}>{users?.username[0]}</div>
                  }
                </Link>
                <Link to={`/profile/${users?._id}`}  >
                  <div>
                    <h3 className="text-sm font-medium">{users?.username}</h3>
                    <p className="text-xs text-gray-500">{users?.bio}</p>
                  </div>
                </Link>
              </div>
              {user?.following?.includes(users?._id) ? (

                <button onClick={() => { handlefollowUnfollow(users._id) }} className="text-xs text-gray-200">Following</button>
              ) : (
                <button onClick={() => { handlefollowUnfollow(users._id) }} className="text-xs text-blue-500">Follow</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RightSideBar