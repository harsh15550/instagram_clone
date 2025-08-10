import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthuser } from './redux/authslice';
import { FaSpinner } from 'react-icons/fa6';

const EditProfile = ({ dialog, setDialog }) => {
    const { user } = useSelector((state) => state.auth);
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [profile, setProfile] = useState({ file: null, previewUrl: user?.profile || '' });
    const [gender, setGender] = useState(user?.gender || '');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfile({ file, previewUrl: imageUrl });
        }
    };

    const editProfileHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('bio', bio);
            formData.append('file', profile.file);
            formData.append('gender', gender);

            const res = await axios.post(
                'https://instagram-clone-5r4x.onrender.com/api/user/edit',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                const updatedUser = {
                    ...user,
                    username: res.data.userData.username,
                    bio: res.data.userData.bio,
                    profile: res.data.userData.profile,
                    gender: res.data.userData.gender,
                };

                dispatch(setAuthuser(updatedUser));
                toast.success(res.data.message);
                setDialog(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === "popup-overlay") {
            setDialog(false);
        }
    };

    return (
        dialog && (
            <div id="popup-overlay"  onClick={handleOutsideClick} className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50 bg-black bg-opacity-75">
                <div className="bg-gray-950  border border-1 border-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6">
                    <form onSubmit={editProfileHandler} className="space-y-6">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center">
                            <img
                                src={profile.previewUrl}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-gray-700"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-4 text-sm text-gray-400 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-gray-200 file:bg-gray-700 file:cursor-pointer hover:file:bg-gray-600"
                            />
                        </div>
        
                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-semibold text-gray-200"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full mt-1 p-3 bg-gray-950 text-gray-100 border border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
        
                            <div>
                                <label
                                    htmlFor="bio"
                                    className="block text-sm font-semibold text-gray-200"
                                >
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full mt-1 p-3 bg-gray-950 text-gray-100 border border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows="3"
                                />
                            </div>
        
                            <div>
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-semibold text-gray-200"
                                >
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full mt-1 p-3 bg-gray-950 text-gray-100 border border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="" disabled>
                                        Select Gender
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
        
                        {/* Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:ring-2 focus:ring-blue-500"
                                onClick={() => setDialog(false)}
                            >
                                Cancel
                            </button>
                            {!loading ? (
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 flex items-center"
                                >
                                    Save Changes
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md flex items-center gap-2 opacity-70 cursor-not-allowed"
                                    disabled
                                >
                                    Saving... <FaSpinner className="animate-spin" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        )    
)
}

export default EditProfile;
