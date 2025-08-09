import axios from 'axios';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const SearchUser = ({ setIsPopupOpen }) => {
    const [searchUser, setSearchUser] = useState('');
    const [users, setUsers] = useState([]);

    const handleSearchUser = async () => {
        if (searchUser) {
            try {
                const response = await axios.get(`http://localhost:4000/api/user/search?username=${searchUser}`);

                if (response.status === 200) {
                    if (response.data.success && response.data.users.length > 0) {
                        setUsers(response.data.users);
                    } else {
                        console.log('No users found.');
                        setUsers([]);
                    }
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
    return (
        <>
            <div className="p-4 pb-6 flex flex-col gap-2 border-b ">
                <div className='flex justify-between mb-2 items-center '>
                    <h2 className="text-xl font-semibold text-gray-200">Search</h2>
                    <button
                        className="text-sm font-medium px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md border border-gray-700"
                        onClick={() => {
                            setIsPopupOpen(false)
                        }}
                    >
                        Close
                    </button>
                </div>
                <input
                    type="text"
                    value={searchUser}
                    onChange={e => setSearchUser(e.target.value)}
                    placeholder="Search User..."
                    className="p-3 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
            </div>

            <div className=" flex-1 pt-3 overflow-y-auto">

                {users.length > 0 ? users?.map((user) => {
                    return (
                        <div key={user._id}>
                            <Link to={`/profile/${user._id}`}>
                                <div className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-md cursor-pointer">
                                    <img
                                        src={`${user.profile}`}
                                        alt="User Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-200">{user.username}</span>
                                        <span className="text-sm font-semibold text-gray-400">{user.bio}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                }) : <h1 className='m-2 ml-4 text-2xl'>No User Found</h1>
                }
            </div>
        </>
    )
}

export default SearchUser