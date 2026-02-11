import React, { useEffect, useState } from 'react'
import { dummyChats } from '../assets/assets';
import { Search } from 'lucide-react';

const Messages = () => {
  const user = {id : 'user_1'};

  const [chats , setChats] = useState([]);
  const [searchQuery , setSeachQuery] = useState('');
  const [loading , setLoading] = useState(true);

  const fetchUserChats = async ()=> {
    setChats(dummyChats);
    setLoading(false);
  };

  useEffect(()=> {
    fetchUserChats();
    const interval = setInterval(()=> {
      fetchUserChats();
    },10*1000);
    return ()=> clearInterval(interval);
  },[]);

  return (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='py-10'>
        {/*Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2 capitalize'>message</h1>
          <p className='text-gray-600'>chat with Buyer and sellers</p>
        </div>
         {/*Search */}
        <div className='relative max-w-xl mb-8'>
          <Search className='absolute left-3 top-1/2 transform translate-y-1/2 text-gray-400 w-5 h-5'/>
          <input className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-indigo-500' type="text" placeholder='Search conversations...' value={searchQuery}  onChange={(e)=> setSeachQuery(e.target.value)}/>
        </div>
      </div>
    </div>
  )
}

export default Messages
