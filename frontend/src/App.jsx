import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './components/redux/socketslice';
import { setOnlineUsers } from './components/redux/chatslice';
import Ai from './components/Ai';
import ProtectedRoute from './components/ProtectedRoute';
import Reels from './components/Reels';
import Explore from './components/Explore';
// import SocialLoader from './components/SocialLoader';
import Loader from './components/SocialLoader';

const App = () => {
  const location = useLocation();

  const noLayoutRoutes = ['/login', '/register'];
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();
  const socketRef = useRef(null); // Store socket instance outside Redux
    const { post } = useSelector(store => store.post);

useEffect(() => {
  if (user) {
    const socketIo = io('https://instagram-clone-5r4x.onrender.com', {
      query: { userId: user?._id },
      transports: ['websocket']
    });

    socketRef.current = socketIo; // Store socket instance in useRef

    dispatch(setSocket({ id: socketIo.id, connected: socketIo.connected })); // Store only serializable data

    socketIo.on('connect', () => {
      dispatch(setSocket({ id: socketIo.id, connected: socketIo.connected }));
    });

    socketIo.on('disconnect', () => {
      dispatch(setSocket({ id: null, connected: false }));
    });

    socketIo.on('getOnlineUsers', (onlineUser) => {
      dispatch(setOnlineUsers(onlineUser));
    });

    return () => {
      socketIo.close();
      dispatch(setSocket({ id: null, connected: false }));
      socketRef.current = null;
    };
  } else if (socketRef.current) {
    socketRef.current.close();
    dispatch(setSocket({ id: null, connected: false }));
    socketRef.current = null;
  }
}, [user, dispatch]);

  useEffect(() => {
    if(post) setLoading(false);
  }, [post])

  if(loading) {
    return (
      <Loader />
    )
  }


  const PublicRoute = ({ children }) => {
    return user ? <Navigate to="/" replace /> : children;
  };
  
  const validRoutes = ['/', '/login', '/register', '/profile/:id', '/chat', '/ai']; // Define your valid routes


  return (
    <div className='bg-black text-white' >
      {!noLayoutRoutes.includes(location.pathname) && <MainLayout />}

      <Routes>
        {/* Public Routes */}
        {/* {user && <Navigate to={'/home'} />} */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute user={user}>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute user={user}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai"
          element={
            <ProtectedRoute user={user}>
              <Ai />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reel"
          element={
            <ProtectedRoute user={user}>
              <Reels />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to={'/'} />} />
      </Routes>
    </div>
  );
}

export default App;
