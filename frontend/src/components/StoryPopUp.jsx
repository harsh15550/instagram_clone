import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useState } from 'react'
import { ImCross } from "react-icons/im";
import { useDispatch } from 'react-redux';
import { setSelectStory } from './redux/storySlice';


const StoryPopUp = ({ storyDialog, activeStory, setStoryDialog }) => {
    const [timeCount, setTimeCount] = useState(0);
    const [timePlus, setTimePlus] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        if (storyDialog) {
            setTimeCount(0);
            setTimePlus(0);
            const intarval = setInterval(() => {
                setTimePlus(prev => prev + 1);
                setTimeCount(prev => prev + 1);
                console.log(timePlus);

            }, 1000);


            const timer = setTimeout(() => {
                setStoryDialog(false);

            }, 5000);

            return () => {
                clearInterval(intarval)
                clearTimeout(timer);
            }
        }

    }, [storyDialog]);

    return (
        <div>
            {storyDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="relative bg-white rounded-lg shadow-lg pt-1 pb-5 px-5 w-[90%] max-w-md">
                        {/* Progress Bar */}
                        <div className="h-2 bg-gray-300 rounded-full overflow-hidden mt-4">
                            <div
                                className="h-full bg-black transition-all"
                                style={{ width: `${timePlus * 20}%` }}
                            ></div>
                        </div>

                        <ImCross
                            className="absolute cursor-pointer mt-8 top-4 right-4 text-black text-lg hover:text-gray-800"
                            onClick={() => { setStoryDialog(false); dispatch(setSelectStory({})) }}
                        />

                        <div className="flex mt-4 items-center">
                            <Avatar>
                                <AvatarImage
                                    src={activeStory?.user?.profile}
                                    className="rounded-full object-cover w-12 h-12"
                                    alt="image"
                                />
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-semibold">{activeStory?.user?.username}</p>
                                <p className="text-gray-600">{activeStory?.user?.bio}</p>
                            </div>
                        </div>

                        <div className="w-full relative flex justify-center">
                            <img
                                src={`${activeStory?.image}`}
                                alt="Story"
                                className="rounded-lg mt-8 object-cover max-h-[600px] w-full"
                            />
                            <h1
                                className={`absolute text-3xl top-[50%] ${activeStory?.textColor} font-black	`}
                            >
                                {activeStory?.text}
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryPopUp;
