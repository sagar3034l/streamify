import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
