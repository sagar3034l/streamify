import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, Links, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../pages/lib/api';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation()
  const isChatPage = location.pathname?.startsWith("/chat");


  const queryClient = useQueryClient();
  const {mutate} = useMutation({
     mutationFn:logout,
     onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:["authUser"]})
     }
  });
  return <nav className='bg-base-200 border-b border-base-300'>
    <div className='container mx-auto pt-4 sm:px-6 lg:px-8'>
      <div className='flex items-center justify-end'>
        {
          isChatPage && (
            <div className='pl-5'>
              <Link className='flex items-center gap-2.5' to={'/'}>
                <ShipWheelIcon className='size-9 text-primary' />
                <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                    Azuzu
                </span>
              </Link>
            </div>
          )
        }
        <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
          <Link to={"/notifications"}>
                <button className='btn btn-ghost btn-circle'>
                   <BellIcon className='h-6 w-7 text-base-content' />
                </button>
          </Link>
        </div>
        <div className='avatar'>
            <div className='w-9 rounded-full'>  
               <img src={authUser.profilePic} alt="User Avatar" rel='noreferrer'/>
            </div>
        </div>
        <ThemeSelector />
        <button className='btn btn-ghost btn-circle' onClick={mutate}>
          <LogOutIcon className='size-6 text-base-content opacity-70' />
        </button>
      </div>
    </div>
  </nav>
}

export default Navbar