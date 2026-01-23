import React from 'react'
import Title from './Title'
import {useSelector} from 'react-redux'

const LatestListign = () => {

    const {listings} = useSelector(state => state.listing)
  return (
    <div className='mt-20 mb-8' >
        <Title title='latest listing' description='Discover the hottest social profile avaiable right now'/>
        <div className='flex flex-col gap-6 px-6'>
            {listings.slice(0,4).map((listing , index)=>(
                <div className='mx-auto w-full max-w-3xl rounded-xl' key={index}>
                    <h1>{listing.title}</h1>
                    <h1>{listing.username}</h1>
                </div>
            ))}
        </div>
    </div>
  )
}

export default LatestListign