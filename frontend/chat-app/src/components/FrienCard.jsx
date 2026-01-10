import React from 'react'
import { LANGUAGE_TO_FLAG } from '../constants';
import { Link } from 'react-router-dom';

const FrienCard = ({ friend }) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className='card-body p-4'>
        <div className='card-body p-4'>
          <div className='flex flex-center gap-3 mb-3'>
            <div className='avatar size-12'>
              <img src={friend.profilePic} alt={friend.fullname} />
            </div>
            <h3 className='font-semibold truncate'>
              {friend.fullname}
            </h3>
          </div>
          <div className='flex flex-wrap gap-1 mb-3'>
             <span className='badge badge-secondary text-xs'> 
                  {getLanguageFlag(friend.nativeLanguage)}
                  Native:{friend.nativeLanguage}
             </span>
             <span className='badge badge-outline text-xs'>
                  {getLanguageFlag(friend.learningLanguage)}
                  Learning:{friend.learningLanguage}
             </span>
          </div>
        </div>
        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
            Message           
        </Link>
      </div>
    </div>
  )
}

export default FrienCard

export function getLanguageFlag(language){

    if(!language) return null;

    const langlower = language.toLowerCase();
    const countryCode = LANGUAGE_TO_FLAG[langlower]

    if(countryCode){
      <img
      src={`https://flagcdn.com/24x18/${language}.png`}
      alt={`${langlower} flag`}
      className='h-3 mr-1 inline-block'
       />
    }
    
}

