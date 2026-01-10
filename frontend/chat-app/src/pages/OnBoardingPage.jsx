import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuthUser from '../hooks/useAuthUser';
import {useEffect, useState} from 'react'
import {LoaderIcon, Toaster,toast} from 'react-hot-toast'
import { completeOnBoarding } from './lib/api';
import { CameraIcon, MapIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { Navigate } from 'react-router-dom';
export default function Onboarding() {
    const queryClient = useQueryClient()
    const {authUser,refetch } = useAuthUser();
    const [formState, setFormState] = useState({
        fullname: authUser.fullname || "",
        bio: authUser.bio || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
    }); 
    const{mutate,isPending,error} = useMutation({
        mutationFn:completeOnBoarding,
        onSuccess: async ()=>{
            toast.success("Profile onboarded successfully");
            queryClient.invalidateQueries({queryKey:["authUser"]})
        },
    })

    const handleGenerateAvatar = (e) =>{
        function generateRandomAvatar() {
            const seed = Math.random().toString(36).substring(2, 12);
            return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        }
        const randomAvatar = generateRandomAvatar();
        setFormState({...formState,profilePic:randomAvatar})
        toast.success("Avatar changed successfully!")
    }

    const handleSubmitMethod = (e)=>{
        e.preventDefault();
        mutate(formState);
    }

    return <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
        <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
            <div className='card-body p-6 sm:p-8'>
                <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete your profile</h1> 
                <form onSubmit={handleSubmitMethod} className='space-y-6'>
                    {/* profile pic container */}
                    <div className='flex flex-col items-center justify-center space-y-4'>
                        <div className='size-32 rounded-full bg-base-300 overflow-hidden'> 
                            {
                            formState.profilePic ? (
                                <img
                                 src={formState.profilePic}
                                 alt="Profile Preview"
                                 className='w-full h-full object-cover' 
                                />

                            ) : (
                                <div className='flex items-center justify-center h-full'>
                                    <CameraIcon className='size-12 text-base-content opacity-40'></CameraIcon>
                                </div>
                            ) 
                        }
                        </div>
                        <div className='flex items-center gap-2'>
                            <button type='button' onClick={handleGenerateAvatar} className='btn btn-accent'>
                                <ShuffleIcon className='size-4 mr-2'/>
                                 Generate Random Avatar
                            </button>
                        </div>
                    </div>
                     <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Full Name</span>
                            </label>
                            <input
                             type="text"
                             name='fullname'
                             value={formState.fullname}
                             onChange={(e)=>setFormState({...formState,fullname:e.target.value})}
                             placeholder='Your full name'
                             className='rounded-xl p-3'
                            />
                        </div>
                        {/* Bio */}
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>Bio</span>
                            </label>
                            <textarea 
                             name="bio"
                             value={formState.bio}
                             onChange={(e)=>setFormState({...formState,bio:e.target.value})}
                             className='textarea textarea-bordered h-24'
                             placeholder='Tell other about yourself and your language learning goals'
                            ></textarea>
                        </div>

                        {/* languages */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Native language</span>
                                </label>
                                <select 
                                name="nativeLanguage"
                                value={formState.nativeLanguage}
                                onChange={(e)=>setFormState({...formState,nativeLanguage:e.target.value})}
                                className='select select-bordered w-full'
                                >
                                <option value="">Select your native language</option>
                                {
                                    LANGUAGES.map((lang)=>(
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))
                                }
                                </select>
                            </div>

                            {/* LEARNING LANGUAGE */}
                             <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Learrning language</span>
                                </label>
                                <select 
                                name="nativeLanguage"
                                value={formState.learningLanguage}
                                onChange={(e)=>setFormState({...formState,learningLanguage:e.target.value})}
                                className='select select-bordered w-full'
                                >
                                <option value="">Select your native language</option>
                                {
                                    LANGUAGES.map((lang)=>(
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))
                                }
                                </select>
                            </div>
                        </div>
                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text'>
                                    Location
                                </span>
                            </label>
                            <div className='relative'>
                                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70'/>
                                <input
                                type="text"
                                name='location'
                                value={formState.location}
                                onChange={(e)=>setFormState({...formState,location:e.target.value})}
                                className='input input-bordered w-full pl-10'
                                placeholder='City, Country'
                                 />
                            </div>
                        </div>
                        <button  className='btn btn-primary w-full' disabled={isPending} type='submit'>
                                {!isPending ? (
                                    <>
                                     <ShipWheelIcon className='size-5 mr-2'/>
                                     Complete Onboarding
                                    </>
                                ) : (
                                    <>
                                     <LoaderIcon className=' animate-spin size-5 mr-2'/>
                                       Onboarding...
                                    </>
                                ) }
                        </button>
                </form>               
            </div>
        </div>
    </div>
}