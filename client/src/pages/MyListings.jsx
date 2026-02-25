import React from 'react'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { ArrowDownCircleIcon, CheckCircle, CoinsIcon, DollarSign, Eye, Plus, TrendingUp, WalletIcon } from 'lucide-react';
import StatCard from '../components/StatCard';

const MyListings = () => {
  const {userListings ,  balance } = useSelector((state)=> state.listing);
  const currency = import.meta.env.VITE_CURRENCY  || '$';
  const navigate = useNavigate();
  const totalValue = userListings.reduce((sum , listing)=> sum + (listing.price || 0), 0);
  const activeListings = userListings.filter((listing)=> listing.status === 'active').length;
  const soldListings = userListings.filter((listing)=> listing.status === 'sold').length;

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 pt-8'>
      {/*Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 capitalize'>my listing</h1>
          <p className='text-gray-600 mt-1'>Manage your social media account listing</p>
        </div>
        <button onClick={()=> navigate('/create-listing')} className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium flex items-center space-x-2 mt-4 md:mt-0'>
          <Plus className='size-4'/>
          <span>new listing</span>
        </button>
      </div>
      {/*stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <StatCard title='Total Listing' value={userListings.length} icon={<Eye className='size-6 text-indigo-600'/>} color='indigo'/>

        <StatCard title='Active Listing' value={activeListings} icon={<CheckCircle className='size-6 text-green-600'/>} color='green'/>

        <StatCard title='sold' value={soldListings} icon={<TrendingUp className='size-6 text-indigo-600' />} color='indigo'/>

        <StatCard title='Total Value' value={`${currency} ${totalValue.toLocaleString()}`} icon={<DollarSign className='size-6 text-yellow-600'/>}  color='yellow'/>
      </div>
      {/*Balance Section */}
      <div className='flex flex-col sm:flex-row justify-between gap-4 xl:gap-20 p-6 mb-10 bg-white rounded-xl broder border-gray-200'>
        {
          [
            {lable: 'Earned', value: balance.earned, icon: WalletIcon},
            {lable: 'Withdrawn', value: balance.withdrawn, icon: ArrowDownCircleIcon},
            {lable: 'Available', value: balance.available, icon: CoinsIcon}
          ].map((item, index)=>(
            <div key={index} className='flex flex-1 items-center justify-between p-4 rounded-lg border border-gray-100 cursor-pointer'>
              <div className='flex items-center gap-3'>
                <item.icon className='text-gray-500 w-6 h-6'/>
                <span className='text-gray-600 font-medium'>{item.lable}</span>
              </div>
              <span className='text-xl font-medium text-gray-700'>
                {currency}
                {item.value.toFixed(2)}
              </span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyListings
