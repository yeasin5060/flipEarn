import React from 'react'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'

const MyListings = () => {
  const {userListing ,  balance } = useSelector((state)=> state.listing);
  const currency = import.meta.env.VITE_CURRENCY  || '$';
  const navigate = useNavigate();
  const totalValue = userListing.reduce((sum , listing)=> sum + (listing.price || 0), 0)
  return (
    <div>
      MyListings page
    </div>
  )
}

export default MyListings
