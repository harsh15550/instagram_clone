import React from "react";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import instaIcon from "../assets/instagram1.jpg"

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black gap-6">
      {/* Instagram Icon */}
      <img src={instaIcon} style={{height:'100px', width:"100px"}} alt="" />

      {/* Social Actions */}
      <div className="flex gap-6">
        <FaHeart
          size={40}
          className="text-red-500 animate-bounce"
          style={{ animationDelay: "0s" }}
        />
        <FaComment
          size={40}
          className="text-blue-400 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />
        <FaShare
          size={40}
          className="text-green-400 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
};

export default Loader;
