import { generateStreamToken } from "../stream.js";

async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user._id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error occured" });
    }
}

export default getStreamToken;
