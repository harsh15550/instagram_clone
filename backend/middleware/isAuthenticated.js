import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ success: false, message: "User Not Authenticated" });
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(403).json({ message: "Invalid Token", success: false });
        }
        
        req.id = decode.userId;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({ message: "Server Error", success: false });
    }
}

export default isAuthenticated;