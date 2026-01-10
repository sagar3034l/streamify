

import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useThemeStore } from '../store/useThemeStore'

const PageLoader = () => {
  const{theme} = useThemeStore()
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme="theme">
        <Loader className='animate-spin size-10'/>
    </div>
  )
}

export default PageLoader