import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../stream.js";

dotenv.config();

async function signup(req, res) {
    const { email, password, fullname } = req.body;
    try {
        if (!email || !password || !fullname) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be six charecters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Give a valid email" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already existed , Use a different one" });
        }

        function generateRandomAvatar() {
            const seed = Math.random().toString(36).substring(2, 12);
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        }

        const randomAvatar = generateRandomAvatar();

        const newUser = await User.create({
            email,
            password,
            fullname,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePic || "",
            });
            console.log(`Stream User created for ${newUser.fullname}`);
        } catch (error) {
            console.error(error);
        }
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });
        return res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.log("Error in signup", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json("All fields are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid user or password" });
        }
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Incorrect password" });
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });
        return res.status(200).json({ message: "You are logged in", success: true });
    } catch (error) {
        console.log("Error in login", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const { fullname, bio, nativeLanguage, learningLanguage, location } = req.body;
        if (!fullname || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullname && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativelanguage",
                    !learningLanguage && "learninglanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true,
            },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullname,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`);
        } catch (error) {
            console.error("Internal server error", error);
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function logout(req, res) {
    res.clearCookie("token");
    return res.status(200).json({ message: "successfully logged out" });
}

export { signup, login, logout, onboard };
