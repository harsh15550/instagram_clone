import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import ReelItem from "./ReelItem";

const Reels = () => {
  const { post } = useSelector((store) => store.post);
  const [reels, setReels] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});
  const [activeCommentId, setActiveCommentId] = useState(null);
  
  useEffect(() => {
    if (post && post.length > 0) {
      const reel = post?.filter((item) => item.reel);
      setReels(reel);

      // Automatically play the first reel on page load
      if (reel.length > 0) {
        setPlayingVideo(reel[0]?._id);
      }
    }
  }, []);

  useEffect(() => {
    // Automatically play the current reel if it's not already playing
    if (playingVideo && videoRefs.current[playingVideo]) {
      videoRefs?.current[playingVideo].play();
    }

    // Pause other videos
    reels?.forEach((reel) => {
      if (reel?._id !== playingVideo && videoRefs?.current[reel._id]) {
        videoRefs?.current[reel?._id].pause();
      }
    });
  }, [playingVideo, reels]);

  const handleVideoClick = (id) => {
    const currentVideo = videoRefs?.current[id];
    if (currentVideo) {
      if (playingVideo === id) {
        currentVideo.pause();
        setPlayingVideo(null);
      } else {
        // Pause the currently playing video (if any)
        if (playingVideo !== null && videoRefs?.current[playingVideo]) {
          videoRefs?.current[playingVideo].pause();
        }
        currentVideo.play();
        setPlayingVideo(id);
      }
    }
  };

  const handleOutsideClick = (e) => {
    if (e?.target?.id === "popup-overlay") {
      setActiveCommentId(null);
    }
  };

  return (
    <div
      id="popup-overlay"
      onClick={handleOutsideClick}
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory"
      style={{
        WebkitOverflowScrolling: "touch",
      }}
    >
      {reels.map((reel) => {
        return (
          <ReelItem playingVideo={playingVideo} videoRefs={videoRefs} key={reel?._id} reel={reel} handleVideoClick={handleVideoClick} />
        );
      })}
    </div>
  );
};

export default Reels;
