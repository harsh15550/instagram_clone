import React, { useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Signup = () => {

    const url = "https://instagram-clone-5r4x.onrender.com";
    const [loading, setLoading] = useState(false); // Initially not loading
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        cpassword: "",
    });
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setInput(prev => ({ ...prev, [name]: value }));
    }

    const onsubmitHandler = async (e) => {
        e.preventDefault();
        if(input.cpassword !== input.password) {
            return toast.error('Password and Confirm Password do not match')
        }
        try {
            setLoading(true);
            const res = await axios.post(`${url}/api/user/register`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setInput({
                    username: "",
                    password: "",
                    email: ""
                });
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center h-screen justify-center">

        <div className="w-[400px] max-w-md  bg-black border p-8 rounded-2xl shadow-2xl border-gray-900">
            <h1 className="text-4xl text-center text-white font-bold mb-4">Sign Up</h1>
            <h4 className="text-sm text-gray-400 text-center mb-6">Create your account</h4>

            <form onSubmit={onsubmitHandler}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300">Username</label>
                    <input
                        type="text"
                        name="username"
                        required
                        value={input.username}
                        onChange={onChangeHandler}
                        className="mt-2 w-full px-4 py-2 bg-zinc-900 text-white border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200"
                    />
                </div>
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
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                    <input
                        type="password"
                        name="cpassword"
                        required
                        value={input.cpassword}
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
                        Register
                    </Button>
                )}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">Already have an account?</p>
                    <Link to="/login" className="text-green-500 hover:text-green-400 font-medium transition-all duration-200">
                        Login here
                    </Link>
                </div>
            </form>
        </div>
        </div>


    );
}

export default Signup;
