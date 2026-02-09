import React, { useEffect, useState } from 'react'
import { dummyChats } from '../assets/assets';

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
      </div>
    </div>
  )
}

export default Messages
