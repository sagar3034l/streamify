import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { acceptFriendReqs, getFriendRequest } from "./lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";

export default function Notifications(){
    const queryClient = useQueryClient();
    const {data:friendRqs,isLoading} = useQuery({
        queryKey:["friendRequests"],
        queryFn:getFriendRequest
    })

    const {mutate,isPending} = useMutation({
        mutationFn:acceptFriendReqs,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["friendRequests"]});
            queryClient.invalidateQueries({queryKey:["friends"]});
        }
    })
    const incomingRequest = friendRqs?.incomingReqs || []
    const acceptedRequests = friendRqs?.acceptedReqs || []
    return <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl space-y-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifiaction</h1>
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg">
                    </span>
                </div>
            ) : (
                <>
                 {incomingRequest.length > 0 &&(
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <UserCheckIcon className="h-5 w-5 text-primary" />
                            Friend Requests
                            <span className="badge badge-primary ml-2">
                                {incomingRequest.length}
                            </span>
                        </h2>
                        <div className="space-y-3">
                            {incomingRequest.map((requests)=>{
                                return <div key={requests._id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="card-body p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                                    <img src={requests.sender.profilePic} alt={requests.sender.fullname} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{requests.sender.fullname}</h3>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        <span className="badge badge-secondary badge-sm" >
                                                            native: {requests.sender.nativeLanguage}
                                                        </span>
                                                        <span className="badge badge-secondary badge-sm" >
                                                            learning: {requests.sender.learningLanguage}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                             onClick={()=>mutate(requests._id)}
                                             disabled={isPending}
                                             className="btn btn-primary btn-sm">
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </section>
                 )}
                 {/* Accepted Req notification */}
                 {acceptedRequests.length > 0 &&(
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <BellIcon className="h-5 w-5 text-success" />
                            New Connection
                        </h2>
                        <div className="space-y-3">
                            {acceptedRequests.map((notification)=>{
                               return <div key={notification._id} className="card bg-base-200 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="avatar mt-1 size-10 rounded-full"> 
                                                <img src={notification.recipient.profilePic} alt={notification.recipient.fullname} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{notification.recipient.fullname}</h3>
                                                <p className="text-sm my-1">
                                                        {notification.recipient.fullname} accepted your friend request
                                                </p>
                                                <p className="text-xs flex items-center opacity-70">
                                                    <ClockIcon className="h-3 w-3 mr-1" />
                                                    Recently
                                                </p>
                                            </div>
                                            <div className="badge badge-success">
                                                <MessageSquareIcon className="h-3 w-3 mr-1" />
                                                New friend
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </section>
                 )}
                 {incomingRequest.length === 0 && acceptedRequests.length === 0 &&(
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="size-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
                            <BellIcon className="size-16 font-semibold mb-2"/>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            No notification
                        </h3>
                        <p className="text-base-content opacity-70 max-w-md">
                            When you receive friend requests or message, they'll appear here
                        </p>
                    </div>
                 )}
                </>
            )}
        </div>   
    </div>
}