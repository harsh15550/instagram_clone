import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectStory } from "./redux/storySlice";
import { ImCross } from "react-icons/im";
import { FaRegHeart } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";

const Stories = () => {
  const [groupedStories, setGroupedStories] = useState({});
  const selectStory = useSelector((store) => store?.story?.selectStory);
  const auth = useSelector((store) => store.auth);
  const [storyDialog, setStoryDialog] = useState(false);
  const [activeStories, setActiveStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const dispatch = useDispatch();
  const [timeCount, setTimeCount] = useState(0);
  const [timePlus, setTimePlus] = useState(0);

  // Fetch stories from the API
  const fetchStories = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/stories/allStory`);
      const fetchedStories = res?.data?.storys;

      // Group stories by user
      const grouped = fetchedStories.reduce((acc, story) => {
        const userId = story.user._id;
        if (!acc[userId]) acc[userId] = [];
        acc[userId].push(story);
        return acc;
      }, {});
      setGroupedStories(grouped);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Mark story as seen
  const seenUserStory = async (storyId) => {
    if (!storyId) return;
    try {
      await axios.post(
        `http://localhost:4000/api/stories/storyseenuser/${storyId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error marking story as seen:", error);
    }
  };

  // Handle story dialog timer and next story
  useEffect(() => {
    if (storyDialog) {
      setTimeCount(0);
      setTimePlus(0);

      // Automatically progress to the next story
      const interval = setInterval(() => {
        setTimePlus((prev) => prev + 0.5);
        setTimeCount((prev) => prev + 0.5);
      }, 500);

      const timer = setTimeout(() => {
        if (currentStoryIndex < activeStories.length - 1) {
          navigateToNextStory();
        } else {
          setStoryDialog(false);
          setTimeCount(0);
          setTimePlus(0);
        }
      }, 5500);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [storyDialog, currentStoryIndex, activeStories]);

  // Navigate to the next story
  const navigateToNextStory = () => {
    if (currentStoryIndex < activeStories.length - 1) {
      const nextStoryId = activeStories[currentStoryIndex + 1]._id;
      seenUserStory(nextStoryId);
      setCurrentStoryIndex((prev) => prev + 1);
    }
  };

  // Navigate to the previous story
  const navigateToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      const prevStoryId = activeStories[currentStoryIndex - 1]._id;
      seenUserStory(prevStoryId);
      setCurrentStoryIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      {/* Story Header */}
      <div className="story-container px-5 items-center mt-5 gap-x-4 flex overflow-x-auto w-[650px]">
        {Object.entries(groupedStories).map(([userId, userStories]) => userId !== auth?.user?._id && (
          <div key={userId} className="flex flex-col items-center gap-y-2">
            <div
              onClick={() => {
                setActiveStories(userStories);
                setCurrentStoryIndex(0);
                setStoryDialog(true);
                seenUserStory(userStories[0]._id);
              }}
              className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 cursor-pointer"
            >
              <img
                src={userStories[0]?.user?.profile}
                alt="profile"
                className="w-full h-full rounded-full object-cover border-2 border-black"
              />
            </div>
            <p className="text-white text-center">{userStories[0]?.user?.username}</p>
          </div>
        ))}
      </div>

      {/* Story Dialog */}
      {storyDialog && activeStories[currentStoryIndex] && (
        <div className="fixed  inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-gray-950 text-white rounded-lg shadow-lg w-[90%] max-w-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-gray-700">
              <div
                className="h-full bg-white transition-all duration-500 ease-linear"
                style={{ width: `${timePlus * 20}%` }}
              ></div>
            </div>

            {/* Close Button */}
            <ImCross
              className="absolute top-4 right-4 text-2xl mt-3 mr-2 cursor-pointer text-white hover:text-gray-400"
              onClick={() => {
                setStoryDialog(false);
                setTimeCount(0);
                setTimePlus(0);
                dispatch(setSelectStory({}));
              }}
            />

            {/* Story Header */}
            <div className="flex items-center gap-4 p-4">
              <img
                src={activeStories[currentStoryIndex]?.user?.profile}
                alt="profile"
                className="w-12 h-12 rounded-full border-2 border-white object-cover"
              />
              <div>
                <p className="font-semibold text-lg">
                  {activeStories[currentStoryIndex]?.user?.username}
                </p>
              </div>
            </div>

            {/* Story Content */}
            <div className="relative border border-gray-800 bg-black flex justify-center items-center">
              <img
                src={activeStories[currentStoryIndex]?.image}
                alt="story"
                className="w-full max-h-[530px] min-h-[500px] object-contain"
              />
              {activeStories[currentStoryIndex]?.text && (
                <h1
                  className={`absolute text-3xl font-black ${activeStories[currentStoryIndex]?.textColor}`}
                  style={{
                    fontFamily: activeStories[currentStoryIndex]?.textStyle,
                    top: `${activeStories[currentStoryIndex]?.textPositionY}px`,
                    left: `${activeStories[currentStoryIndex]?.textPositionX}px`,
                  }}
                >
                  {activeStories[currentStoryIndex]?.text}
                </h1>
              )}
              {/* // Previous Icon  */}
              {currentStoryIndex > 0 && (
                <p onClick={navigateToPreviousStory} className="absolute cursor-pointer bg-gray-800 border hover:bg-black h-12 w-12 rounded-full p-2 left-3"><GrPrevious className="text-white text-[30px]" /></p>
              )}
              {currentStoryIndex < activeStories.length - 1 && (
                <p onClick={navigateToNextStory} className="absolute cursor-pointer bg-gray-800 border hover:bg-black h-12 w-12 rounded-full p-2 right-5"><GrNext className="text-white text-[30px]" /></p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 justify-between items-center p-4 bg-gray-900">
              <input
                type="text"
                className="w-full p-3 text-sm text-white bg-gray-800 border border-gray-700 rounded-md placeholder-gray-400 outline-none"
                placeholder={`Reply to ${activeStories[currentStoryIndex]?.user?.username}`}
              />
              <FaRegHeart className="text-[30px]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
