import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useUserProfile from './useUserProfile';
import { FaComment, FaHeart } from 'react-icons/fa';
import EditProfile from './EditProfile';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthuser } from './redux/authslice';
import { ImCross } from 'react-icons/im';
import PostDialog from './PostDialog';

const Profile = () => {
  const { id } = useParams();
  useUserProfile(id);
  const { user, userProfile } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [activetab, setActiveTab] = useState("posts");
  const [dialog, setDialog] = useState(false);
  const [flag, setFlag] = useState(user?.following?.includes(userProfile?._id) || false)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followDialog, setFollowDislog] = useState(false);
  const [followAndFollowing, setFollowAndFollowing] = useState('');
  const [followUser, setFollowUsers] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [activePost, setActivePost] = useState({});
  const [postOpen, setPostOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500)
  }, [loading])

  let displayPost = [];

  // Search Followed/Unfollowed User 


  const handleSearchUser = async () => {
    if (searchUser) {

      try {
        const response = await axios.get(`https://instagram-clone-5r4x.onrender.com/api/user/search?username=${searchUser}`);
        if (response.data.success) {
          const filteredUsers = followUser.filter(fuser => response.data.users.some(user => user._id === fuser._id))
          setUsers(filteredUsers);
        }
      } catch (error) {
        if (error.response.status === 404) {
          setUsers([]);
        } else {
          console.error('Error occurred:', error.message);
        }
      }
    }
  };


  useEffect(() => {
    handleSearchUser();
  }, [searchUser])

  if (activetab === "posts") {
    displayPost = userProfile?.post?.filter((item) => item?.image);
  } else if (activetab === "saved") {
    displayPost = userProfile?.bookmarks
  } else if (activetab === "reels") {
    displayPost = userProfile?.post?.filter((item) => item.reel)
  }

  const handlefollowUnfollow = async () => {
    try {
      const res = await axios.post(`https://instagram-clone-5r4x.onrender.com/api/user/followunfollow/${userProfile._id}`, {}, {
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setAuthuser({
          ...user,
          following: user.following.includes(userProfile._id)
            ? user.following.filter(id => id !== userProfile._id)
            : [...user.following, userProfile._id]
        }));
        setFlag(!flag)
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);

    }
  }

  const followerIds = userProfile?.followers.map(follower => follower._id);
  const followingIds = userProfile?.following.map(following => following._id);

  const isFollower = followerIds?.includes(user._id);
  const isFollowing = followingIds?.includes(user._id);

  useEffect(() => {
    followAndFollowing === 'following' ? setFollowUsers(userProfile?.following) : setFollowUsers(userProfile?.followers);
  }, [followAndFollowing])

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setFollowDislog(false);
    }
  };

  const showUsers = searchUser ? users : followUser;

  return (
    <div className="flex justify-center">
      <div className="max-w-5xl pl-[100px] h-screen flex flex-col items-center w-full mx-auto px-4 py-8">
        <div className="flex items-start gap-[150px] mb-6">
          {loading ? (
            <div className="bg-gradient-to-r from-gray-700 rounded-full via-gray-600 to-gray-500 h-36 w-36 "></div>
          ) : (

            <img
              src={userProfile?.profile}
              onClick={togglePopup}
              alt={userProfile?.username}
              className="w-36 h-36 cursor-pointer rounded-full object-cover border border-gray-300"
            />
          )
          }
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
              <div className="relative max-w-[800px]  max-h-[600px] p-4 rounded-lg ">
                {/* Close Button */}
                <button
                  className="absolute top-7 right-7 border-2 border-white bg-black hover:bg-gray-800 text-gray-700 rounded-full p-2 focus:outline-none shadow-md"
                  onClick={togglePopup}
                >
                  <ImCross className="w-5 h-5 text-white" />
                </button>

                {/* Image */}
                <div className="flex items-center justify-center">
                  <img
                    src={userProfile?.profile}
                    alt={userProfile?.username}
                    className="max-w-full max-h-[500px] rounded-md object-contain border border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              {loading ?
                <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-7 w-[120px] rounded-md"></div>
                : <h1 className="text-2xl font-light">{userProfile?.username}</h1>
              }
              {loading ?
                <div>
                  <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-7 w-[120px] rounded-md"></div>
                </div> :
                <div>

                  {
                    user?._id === userProfile?._id ? (
                      <button
                        onClick={() => setDialog(true)}
                        className="px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-700 bg-zinc-700"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      isFollower ? (
                        <button
                          onClick={handlefollowUnfollow}
                          className="h-8 w-20 bg-slate-300 text-black rounded-md"
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={handlefollowUnfollow}
                          className="h-8 w-20 bg-sky-400 text-white rounded-md"
                        >
                          Follow
                        </button>
                      )
                    )
                  }
                </div>
              }
            </div>

            {/* Stats: Posts, Followers, Following */}
            {loading ?
              <div className="flex space-x-10 mb-4">
                <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-6 w-[300px] rounded-md"></div>
              </div>
              : <div className="flex space-x-10 mb-4">
                <div>
                  <span className="font-semibold size-lg">{userProfile?.post.length} Posts</span>
                </div>
                <div onClick={() => { setFollowDislog(true); setFollowAndFollowing('followers') }} >
                  <span className="font-semibold cursor-pointer">{userProfile?.followers.length} Followers</span>
                </div>
                <div onClick={() => { setFollowDislog(true); setFollowAndFollowing('following') }}>
                  <span className="font-semibold cursor-pointer">{userProfile?.following?.length} Following</span>
                </div>
              </div>
            }

            {/* Follow Unfollow Dialog  */}
            {followDialog && (
              <div id="popup-overlay" onClick={handleOutsideClick} className="fixed bg-opacity-70 backdrop-blur-md inset-0 z-10 bg-black bg-opacity-70 flex justify-center items-center">
                <div className="bg-gradient-to-b bg-black border border-1 border-gray-700 w-full max-w-md p-6 rounded-xl shadow-2xl">
                  <h1 className='text-2xl mb-5' >{followAndFollowing}</h1>
                  {/* Search Bar */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Search User..."
                      className="w-full bg-black text-gray-200 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                    />
                  </div>

                  {/* Following List */}
                  {showUsers.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {showUsers.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 pb-1 border-gray-700 hover:bg-zinc-800 rounded-md transition-colors"
                        >
                          <Link to={`/profile/${user._id}`} onClick={() => setFollowDislog(false)}>
                            <div className="flex items-center">
                              <img
                                src={`${user.profile}`}
                                alt="Following Profile"
                                className="w-12 h-12 object-cover rounded-full border-2 border-blue-500 shadow-md"
                              />
                              <p className="ml-4 text-gray-200 font-medium text-sm">
                                {user.username}
                              </p>
                            </div>
                          </Link>
                          <button className="text-sm text-red-500 hover:text-red-400 font-semibold">
                            Unfollow
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <h1 className="text-center text-gray-300 font-medium">
                      You have not {followAndFollowing} anyone yet.
                    </h1>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => setFollowDislog(false)}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}



            {/* User Bio */}
            {loading ? <div>
              <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-6 w-[300px] rounded-md"></div>
            </div>
              : <div>
                <p>{userProfile?.bio}</p>
              </div>
            }
          </div>
        </div>

        {/* EDIT PROFILE DIALOG  */}
        <EditProfile dialog={dialog} setDialog={setDialog} />

        {/* active tab  */}
        <div className='w-full flex justify-center mt-10 '>
          <div className="w-full border-t border-t-slate-300 ">
            {loading ? <div className='flex mt-3 justify-center gap-8 w-full'>
              <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-6 w-[300px] rounded-md"></div>
            </div>
              : <div className="flex mt-3 justify-center gap-8 w-full ">
                <div onClick={() => setActiveTab("posts")} className={` cursor-pointer ${activetab === "posts" ? 'font-bold border-b border-black' : ''}`}>
                  <span>POSTS</span>
                </div>
                {user._id === id &&
                  <div onClick={() => setActiveTab("saved")} className={` cursor-pointer ${activetab === "saved" ? 'font-bold border-b border-black' : ''}`}>
                    <span>SAVED</span>
                  </div>
                }
                <div onClick={() => setActiveTab("reels")} className={` cursor-pointer ${activetab === "reels" ? 'font-bold border-b border-black' : ''}`}>
                  <span>REELS</span>
                </div>
                <div onClick={() => setActiveTab("tags")} className={` cursor-pointer ${activetab === "tags" ? 'font-bold border-b border-black' : ''}`}>
                  <span>TAGS</span>
                </div>
              </div>
            }
          </div>
        </div>

        {/* Posts Grid */}
        {loading ?
          <div className='grid grid-cols-3 mt-8 gap-5' >
            <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-[320px] w-[290px] rounded-md"></div>
            <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-[320px] w-[290px] rounded-md"></div>
            <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 h-[320px] w-[290px] rounded-md"></div>

          </div>
          : <div className="grid grid-cols-3 mt-8 gap-5">

            {displayPost?.length > 0 ? (
              displayPost?.map((post, index) => (
                <div key={index} className="overflow-hidden group">
                  <div className="relative">
                    {post.image ?
                      <img
                        src={post.image}
                        alt="Post"

                        className="w-full z-[-1] h-[320px] rounded-lg shadow-md object-cover transition-transform duration-300"
                      />
                      : <video
                        src={post.reel} // Create URL for the selected file
                        className="object-contain h-[320px] w-[320px] rounded border-gray-700 border"
                      />
                    }
                    {/* Likes and comments display on hover */}
                    <div onClick={() => { setActivePost(post); setPostOpen(true) }} className="absolute inset-0 flex rounded-lg justify-center items-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex gap-8 text-white">
                        <div className="flex gap-2 items-center">
                          <FaHeart className="text-3xl" />
                          <span className="text-3xl">{post?.likes?.length}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <FaComment className="text-3xl" />
                          <span className="text-3xl">{post?.comments?.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h1 className="text-2xl">No Content Available</h1>
              </div>
            )}
          </div>
        }

        {/* Active Post Component  */}
        <PostDialog postOpen={postOpen} setPostOpen={setPostOpen} activePost={activePost} setActivePost={setActivePost} />

      </div>
    </div>
  );
};

export default Profile;
