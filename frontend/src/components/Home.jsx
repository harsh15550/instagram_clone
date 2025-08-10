import React, { useEffect, useState } from 'react'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import AddStory from './AddStory'
import axios from 'axios'

const Home = () => {
  // const [deleteStory, setDeleteStory] = useState(null);

  useEffect(() => {
    const deleteStory = async () => {
      try {
        const res = await axios.delete("https://instagram-clone-5r4x.onrender.com/api/stories/expdeleteStory")
      } catch (error) {
        console.log(error.message);
      }
    }
    deleteStory();
  },[])

  return (
    <div className='flex border w-[84%] justify-center mx-[16%]  border-gray-600 justify-between'>
      <div className="w-full">
        <AddStory />
        <Feed />
      </div>
      <RightSideBar />
    </div>
  )
}

export default Home