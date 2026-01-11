import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "./lib/api";
import { StreamChat } from "stream-chat"

import {
    Channel,  
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window
} from "stream-chat-react"
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
export default function ChatPage() {
    const { id: targetUserId } = useParams();
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuthUser()
    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser
    })
    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser) return;
            try {
                console.log("Initiliazing stream chat client...");
                const client = StreamChat.getInstance(STREAM_API_KEY)
                if (client.userID && client.userID !== authUser._id) {
                    await client.disconnectUser();
                }

                await client.connectUser({
                    id: authUser._id,
                    name: authUser.fullname,
                    image: authUser.profilePic,
                }, tokenData.token)
                const channelId = [authUser._id, targetUserId].sort().join("-");
                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId]
                })
                await currChannel.watch();
                setChatClient(client);
                setChannel(currChannel);
            } catch (error) {
                console.error("there is an error:", error)
                toast.error("Could not connect to chat. Please try again")
            } finally {
                setLoading(false)
            }
        }
        initChat()
    }, [tokenData, authUser, targetUserId])
    const handleVideoCall = () => {
        if (channel) {
            const callURL = `${window.location.origin}/call/${channel.id}`
            channel.sendMessage({
                text: `I have started a video call, join me here:${callURL}`
            })
            toast.success("video call link send")
        }
    }
    if (loading || !chatClient || !channel) return <ChatLoader />
    return <div className="h-[93vh]">
        <Chat client={chatClient}>
            <Channel channel={channel}>
                <div className="w-full relative">
                    <CallButton handleVideoCall={handleVideoCall} />
                    <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput focus />
                    </Window>
                </div>
                <Thread />
            </Channel>
        </Chat>
    </div>
}