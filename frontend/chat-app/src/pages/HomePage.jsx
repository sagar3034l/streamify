import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react';
import { getOutgoingFriendReqs, getRecomendedUsers, getUserFriends, sendFriendReqs } from './lib/api'
import { Link } from 'react-router-dom';
import { CheckCircleIcon, MapIcon, MapPinIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FrienCard'
import NoFriendFound from '../components/NoFriendFound';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outGoingFriendReqIds, setOutGoingFriendReqIds] = useState(new Set())

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends
  })

  const { data: recomendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecomendedUsers
  })

  const { data: outGoingFriendReqs } = useQuery({
    queryKey: ["outGoingFriendReqs"],
    queryFn: getOutgoingFriendReqs
  })

  const { mutate: sendReqMutate ,isPending} = useMutation({
    mutationFn: sendFriendReqs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outGoingFriendReqs"] }) 
    }
  })

  useEffect(() => {
    const outGoingIds = new Set()
    if (outGoingFriendReqs && outGoingFriendReqs.length > 0) {
      outGoingFriendReqs.forEach((req) => {
        outGoingIds.add(req.recipient._id)
      })
      setOutGoingFriendReqIds(outGoingIds)
    }
  }, [outGoingFriendReqs])

  return <div>
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your friends</h2>
          <Link to={"/notification"} className='flex justify-center items-center btn btn-sm btn-outline'>
            <UserIcon className='mr-2 size-4' />
            Friend Requests
          </Link>
        </div>
        {
          loadingFriends ? (
            <div className='flex justify-center py-12'>
              <span
                className='loading loading-spinner loading-lg'
              />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendFound />
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
              {
                friends.map((friend) => {
                  return <FriendCard key={friend._id} friend={friend} />
                })
              }
            </div>
          )
        }
        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='opacity-70 sm:text-3xl font-bold tracking-tight'>Meet new learners</h2>
                <p className='opacity-70'>Discover perfect language parteners based on your profile</p>
              </div>
            </div>
          </div>
          {
            loadingUsers ? (
              <div className='flex justify-center py-12'>
                <span className='loading loading-spinner loading-lg' />
              </div>
            ) : (
              recomendedUsers.length === 0 ? (
                <div className='card bg-base-200 text-center -z-20'>
                  <h3 className='font-semibold text-lg mb-2'>No recommendation friends yet</h3>
                  <p className='text-base-content opacity-70'>Check back later for new language parteners</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {recomendedUsers.map((user,i) => {
                    const hasRequestSent = outGoingFriendReqIds.has(user._id)
                    return (
                      <div
                        className='card bg-base-200 hover:shadow-lg transition-all duration-300'
                        key={i}>
                        <div className='card-body p-5 space-y-4'>
                          <div className='flex items-center gap-3'>
                            <div className='avatar size-16 rounded-full'>
                              <img src={user.profilePic} alt={user.fullname} />
                            </div>
                            <div>
                              <h3>{user.fullname}</h3>
                              {
                                user.location && (
                                  <div className='flex items-center text-x5 opacity-70 mt-1'>
                                    <MapPinIcon className='size-3 mr-1' />
                                    {user.location}
                                  </div>
                                )
                              }
                            </div>

                          </div>
                          <div className='flex flex-wrap gap-1.5'>
                            <span className='badge badge-secondary'>
                              {getLanguageFlag(user.nativelanguage)}
                              Native: {capitalize(user.nativeLanguage)}
                            </span>
                            <span className='badge badge-outline'>
                              {getLanguageFlag(user.nativelanguage)}
                              Learning: {capitalize(user.learningLanguage)}
                            </span>
                          </div>
                          {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}
                          <button 
                          onClick={()=>sendReqMutate(user._id)}
                          className={`btn w-full mt-2 ${hasRequestSent ? "btn-disabled" : "btn-primary"}`}>
                              {
                                hasRequestSent ? (
                                  <>
                                    <CheckCircleIcon className='size-4 mr-2' />
                                    request sent...
                                  </>
                                ) : (
                                 <>
                                    <UserPlusIcon className='size-4 mr-2' />
                                    Send Friend Request
                                 </>
                                )
                              }
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            )
          }
        </section>
      </div>
    </div>
  </div>
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)


export default HomePage