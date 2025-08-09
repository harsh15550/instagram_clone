import { useEffect } from 'react';
import Posts from './Posts';
import useAllPost from './useAllPost';
import { useSelector } from 'react-redux';
import useSuggestedUser from './useSuggestedUser';

const Feed = () => {
  const { posts, fetchAllPost } = useAllPost();
  const { fetchSuggesteduser } = useSuggestedUser();
  const { user } = useSelector(store => store.auth);

  useEffect(() => {
    fetchAllPost();
    fetchSuggesteduser();
  }, []);
  return (
    <div className='w-[100%] min-h-[563px] mt-10 flex justify-center flex-col'>
      {
        posts?.map((item, index) => {
          if(user.following.includes(item.author._id) ||  item?.author?._id === user?._id )  {

            return (
              <div key={index}>
              <Posts item={item} />
            </div>
          )
        }
        })
      }
    </div>
  );
};

export default Feed;
