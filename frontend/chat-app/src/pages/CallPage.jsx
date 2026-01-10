import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getStreamToken } from "./lib/api";
import PageLoader from "../components/PageLoader"

import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    CallingState,
    useCallStateHooks,
    StreamTheme
} from "@stream-io/video-react-sdk"
import toast from "react-hot-toast";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import useAuthUser from "../hooks/useAuthUser";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

export default function CallPage() {
    const { id: callId } = useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsconnecting] = useState(true);
    const { authUser,isLoading} = useAuthUser();

    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser,
    })   
    useEffect(() => {
        const initCall = async () => {
            if (!tokenData?.token || !authUser || !callId) return;
            try {
                console.log("Init stream video client");
                const user = {
                    id: authUser._id,
                    name: authUser.fullname,
                    image: authUser.profilePic,
                }
                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token
                })
                const callInstance = videoClient.call("default", callId)
                await callInstance.join({ create: true });
                console.log("Joined call successfully")
                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.error("Error joining call:", error)
                toast.error("Could not join the call. Please try again")
            } finally {
                setIsconnecting(false);
            }
        }
        initCall()
    }, [tokenData, authUser, callId])
    if (isLoading || isConnecting) {
        return <PageLoader />
    }
    return <div className="h-screen flex flex-col items-center justify-center">
        <div className="relative">
            {
                client && call ? (
                    <StreamVideo>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center">
                        <p>Couldn't initialize call. Please refresh or try again later</p>
                    </div>
                )
            }
        </div>
    </div>
}

const CallContent = () => {
    const { useCallCallingState } = useCallStateHooks()
    const callingState = useCallCallingState();
    const navigate = useNavigate();
    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            navigate('/');
        }
    }, [callingState, navigate]);

    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    )
}
