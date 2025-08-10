import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setAuthuser } from './redux/authslice';

const Login = () => {
    const url = "https://instagram-clone-5r4x.onrender.com";
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${url}/api/user/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setAuthuser(res.data.userData));
                toast.success(res.data.message);
                setInput({ email: "", password: "" });
                navigate("/");
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const images = [
        "https://i.pinimg.com/736x/cf/59/76/cf5976b94adc1ecb704f855f6af95962.jpg",
        "https://i.pinimg.com/736x/09/89/b6/0989b62342e617e4db8007ebbe0364f6.jpg",
        "https://i.pinimg.com/736x/f3/37/d0/f337d0128636e6c07902933ff6977978.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);  // Start fade-out
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setVisible(true); // Start fade-in after changing image
            }, 500); // Blink duration (500ms)
        }, 3000); // Image changes every 3s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center gap-40 min-h-screen bg-black">

            {/* Left Side with Two Overlapping Phones */}
            <div className="relative w-72 h-[500px] flex items-center justify-center">
                {/* Back Phone */}
                <div className="absolute left-8 w-[300px] h-[530px] bg-black rounded-[40px] border-4 border-gray-700 shadow-xl overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-lg"></div>
                    <div className="w-full h-full overflow-hidden">
                        <div className="flex flex-col gap-2 p-2">
                            <img src="https://i.pinimg.com/736x/45/aa/99/45aa9976a37c543941d9d82f8835050a.jpg" alt="Post 1" className="w-full rounded-lg" />
                            {/* <img src="https://source.unsplash.com/random/300x500?cars" alt="Post 2" className="w-full rounded-lg" /> */}
                        </div>
                    </div>
                </div>

                {/* Front Phone (Slightly Lower) */}
                <div className="absolute top-8 left-20 w-[300px] h-[530px] bg-black rounded-[40px] border-4 border-gray-700 shadow-xl overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 min-h-6 bg-gray-800 rounded-b-lg"></div>
                    <div className="w-full h-full overflow-hidden">
                        <div className="flex  flex-col gap-2 p-2">
                            <img
                                src={images[currentIndex]}
                                alt="Slideshow"
                                className={`w-full mt-4  rounded-lg transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sign-In Box on Right Side */}
            <div className="w-[400px] max-w-md bg-black border p-8 rounded-2xl shadow-2xl border-gray-900">
                <h1 className="text-4xl text-center text-white font-bold mb-4">Sign In</h1>
                <h4 className="text-sm text-gray-400 text-center mb-6">Welcome back!</h4>

                <form onSubmit={onsubmitHandler}>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={input.email}
                            onChange={onChangeHandler}
                            className="mt-2 w-full px-4 py-2 bg-zinc-900 text-white border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={input.password}
                            onChange={onChangeHandler}
                            className="mt-2 w-full px-4 py-2 bg-zinc-900 text-white border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
                        />
                    </div>

                    {loading ? (
                        <Button className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex justify-center items-center">
                            Please Wait
                            <Loader2 className="ml-2 w-5 h-5 animate-spin" />
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200"
                        >
                            Log in
                        </Button>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">Don't have an account?</p>
                        <Link to="/register" className="text-green-500 hover:text-green-400 font-medium transition-all duration-200">
                            Register here
                        </Link>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default Login;
