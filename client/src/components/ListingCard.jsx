import React from 'react'
import { platformIcons } from '../assets/assets'
import { BadgeCheck } from 'lucide-react'

const ListingCard = ({listing}) => {

  const currency = import.meta.env.VITE_CURRENCY || '$'

  return (
    <div className='relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition'>
      { /*Featured Banar*/}

      {
        listing.feature && (
          <>
            <p className='py-1'/>
            <div className='absolute top-0 left-0 w-full bg-gardient-to-r from-pink-500 to-purple-500 text-white text-center text-xs font-semibold py-1 tracking-wide uppercase'>
              Featured
            </div>
          </>
        )
      }
      <div className='p-5 pt-8'>
        {/*Header */}
        <div className='flex items-center gap-3 mb-3'>
          {platformIcons[listing.platform]}
          <div className='flex flex-col'>
            <h2>{listing.title}</h2>
            <p>@{listing.username} - <span className='capitalize'>{listing.platform}</span></p>
          </div>
          {listing.verified && <BadgeCheck className='text-green-500 mt-auto w-5 h-5'/>}
        </div>
      </div>

    </div>
  )
}

export default ListingCard