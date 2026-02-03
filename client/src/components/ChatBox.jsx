import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dummyChats } from '../assets/assets';
import { X } from 'lucide-react';
import { clearChat } from '../app/features/chatSlice.js';

const ChatBox = () => {
     const dispatch = useDispatch()
    const {listing ,isOpen , chatId} = useSelector((state)=> state.chat);
    const user = {id : 'user_2'} ;
    const [chat , setchat] = useState(null);
    const [messages , setMessages] = useState([]);
    const [newMessage , setNewMessage] = useState('');
    const [isLoding , setIsLoding] = useState(true);
    const [isSending , setIsSending] = useState(false);

    const fetchChat = ()=> {
        setchat(dummyChats[0]);
        setMessages(dummyChats[0].messages);
        setIsLoding(false)
    };

    useEffect(()=> {
        if (listing) {
            fetchChat()
        }
    },[listing]);

    useEffect(()=> {
        if(!isOpen){
            setchat(null);
            setMessages([]);
            setIsLoding(true);
            setNewMessage(''); 
            setIsSending(false); 
        }
    },[isOpen]);

    if(!isOpen || !listing) return null
  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-100 flex items-center justify-center sm:p-4'>
        <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-2xl h-screen sm:h-[600px] flex flex-col'>
            {/*Header */}
            <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-lg truncate'>{listing?.title}</h3>
                    <p className='text-sm text-indigo-100 truncate'>{user.id === listing?.ownerId?`Chating with Buyer (${chat?.chatUser?.name || 'Loading'})` : `Chating with seller (${chat?.ownerUser?.name || 'Loading'})`}</p>
                </div>
                <button onClick={()=> dispatch(clearChat())} className='ml-4 p-1 hover:bg-white/20 hover:bg-opacity-20 rounded-lg transition-colors'>
                    <X className='w-5 h-5'/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ChatBox