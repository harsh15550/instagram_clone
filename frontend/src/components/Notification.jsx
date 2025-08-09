import React from 'react';
import { useSelector } from 'react-redux';

const Notification = ({setIsPopupOpen}) => {
    const { notification } = useSelector(store => store.notification);

    return (
        <div className=" flex-1 pt-3 overflow-y-auto">
            <div className="p-4 pb-6 flex justify-between gap-2 border-b border-gray-700">
                <h2 className="text-xl pb-3 font-semibold text-gray-200">Notification</h2>
                <button
                        className="text-sm font-medium px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-md border border-gray-700"
                        onClick={() => {
                            setIsPopupOpen(false)
                        }}
                    >
                        Close
                    </button>
            </div>
            <div className='mt-5'>

                {notification?.map((notification, index) => {
                    return (
                        <div key={index}>

                            <div className="flex items-center p-5 pt-2.5 pb-2.5 pt-0 hover:bg-gray-800 rounded-md justify-between cursor-pointer">
                                <div className="flex items-center gap-3" >
                                    <img
                                        src={`${notification?.profile}`}
                                        alt="User Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-200">{notification?.username}</span>
                                    </div>
                                </div>
                                {notification?.image ?
                                    <img src={`${notification?.image}`} className='h-[45px] object-cover w-[45px] rounded-md' alt="" />
                                    : <video
                                        // controls
                                        src={notification?.reel}// Create URL for the selected file
                                        className="h-[45px] object-cover w-[45px] rounded-md"
                                    />
                                }
                            </div>
                        </div>
                    )
                })}
            </div>


        </div>
    );
};

export default Notification;
