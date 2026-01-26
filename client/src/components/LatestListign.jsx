import React from 'react'
import Title from './Title'
import {useSelector} from 'react-redux'
import ListingCard from './ListingCard'

const LatestListign = () => {

    const {listings} = useSelector(state => state.listing);
  return (
    <div className='mt-20 mb-8' >
        <Title title='latest listing' description='Discover the hottest social profile avaiable right now'/>
        <div className='flex flex-col gap-6 px-6'>
            {listings.slice(0,4).map((listing , index)=>(
                <div className='mx-auto w-full max-w-3xl rounded-xl' key={index}>
                    <ListingCard listing={listing}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default LatestListign