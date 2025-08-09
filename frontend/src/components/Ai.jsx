import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Ai = () => {

    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! I’m here to help. Please tell me what you’re looking for." },
    ]);
    // Function to handle sending messages
    const predefinedResponses = {
        "daksha kesi hai": "daksha mevada pagal hai",
        "explain project overview": "InstaVibes is a MERN stack social media platform where users can sign up, log in, and manage their profiles by editing details and uploading a profile picture. It allows users to create, edit, and delete posts, as well as like, comment on, and bookmark them. Users can share stories, view others' stories, and see who created or viewed them. InstaVibes also includes a real-time chat feature for connecting with other users and an AI chatbot for interactive assistance. This platform combines creativity and connectivity, offering a seamless social media experience.",
        "mayur kesa hai": "mayur suthar is genius",
    };

    // Convert predefinedResponses keys to lowercase
    const lowerCaseResponses = Object.fromEntries(
        Object.entries(predefinedResponses).map(([key, value]) => [key.toLowerCase(), value])
    );

    const sendMessage = async () => {
        if (!text.trim()) return;

        const userMessage = { sender: "user", text };
        setMessages((prev) => [...prev, userMessage]);
        setText(""); 
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const lowerCaseInput = text.toLowerCase();
        if (lowerCaseResponses[lowerCaseInput]) {
            const botMessage = { sender: "bot", text: lowerCaseResponses[lowerCaseInput] };
            setMessages((prev) => [...prev, botMessage]);
            return;
        }

        try {

            const response = await axios({
                url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDt8tOL6fTuT1PWFubQ6BXWkJ2kyOrFJBQ',
                method: 'post',
                data: {
                    contents: [{
                        parts: [{ text }]
                    }]
                }
            })

            if (response.status === 200) {
                setLoading(false);
            }
            const botReply =
                response?.data?.candidates[0]?.content?.parts[0]?.text || "Sorry, no response received.";
            const botMessage = { sender: "bot", text: botReply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage = {
                sender: "bot",
                text: "Sorry, I couldn't process your request. Please try again later.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <div className="w-[84%] ml-[16%]">
            <div className="flex flex-col h-screen bg-black border border-gray-800 bg-zinc-900 text-gray-200">
                {/* Header */}
                <div className="py-4 px-6 bg-gradient-to-r from-indigo-800 to-purple-800 text-white text-2xl font-semibold shadow-md">
                    <div className="flex items-center">
                        <span className="text-white" style={{ fontFamily: 'Roboto' }}>
                            AI Chatbot
                        </span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {/* Show AI Image for AI Messages */}
                            {msg.sender !== "user" && (
                                <img
                                    src="https://i.pinimg.com/736x/29/9a/18/299a18978cec31cf00958720baf8fbf9.jpg"  // Change to your AI image URL
                                    alt="AI"
                                    className="h-10 w-10 rounded-full mr-3 object-cover"
                                />
                            )}

                            {/* Message Box */}
                            <div
                                className={`max-w-[900px] p-4 pt-2 pb-2 rounded-lg shadow-md ${msg.sender === "user"
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                    : "bg-black border border-gray-600"
                                    }`}
                            >
                                <pre className="whitespace-pre-wrap">{msg.text}</pre>
                            </div>

                            {/* Show User Image for User Messages */}
                            {msg.sender === "user" && (
                                <img
                                    src={user.profile}  // Change to your user image URL
                                    alt="User"
                                    className="h-10 w-10 rounded-full ml-3 object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>


                {/* Input Box */}
                <div className="flex items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 shadow-md">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        placeholder="Type your message here..."
                        className="flex-grow bg-gray-900 border border-gray-700 rounded-md px-4 py-3 mr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={text.trim().length === 0}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-md font-medium hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Ai;
