import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { dummyChats } from '../assets/assets';
import { Loader2Icon, Send, X } from 'lucide-react';
import { clearChat } from '../app/features/chatSlice.js';
import {format} from 'date-fns'
import toast from 'react-hot-toast';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../configs/axios.js';

const ChatBox = () => {
    const {getToken} = useAuth();
    const{user} = useUser();
    const dispatch = useDispatch();
    const {listing ,isOpen , chatId} = useSelector((state)=> state.chat);
    const [chat , setchat] = useState(null);
    const [messages , setMessages] = useState([]);
    const [newMessage , setNewMessage] = useState('');
    const [isLoding , setIsLoding] = useState(true);
    const [isSending , setIsSending] = useState(false);

    const fetchChat = async ()=> {
       try {
            const token = await getToken();
            const { data} = await api.post('/api/chat',{listingId: listing.id , chatId},{headers : {Authorization : `Bearer ${token}`}});
            console.log(data);
            setchat(data?.chat);
            setMessages(data?.chat?.messages || []);
            setIsLoding(false);
       } catch (error) {
            console.log(error.message);
            toast.error(error?.response?.data?.message||error.message);
       }
    };

    useEffect(()=> {
        if (listing) {
            fetchChat();
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

    console.log(messages);
    

     const messagesEndRef = useRef(null);
     //----For Auto Scroll----
     useEffect(()=> {
        messagesEndRef.current?.scrollIntoView({behavior : 'smooth'});
     },[messages.length]);

     const handleSendMessage = async (e)=> {
        e.preventDefault();
        if(!newMessage.trim()|| isSending) return;
        try {
            setIsSending(true);
            const token = await getToken();
            const { data} = await api.post('/api/chat/send-message',{chatId: chat.id , message:newMessage},{headers : {Authorization : `Bearer ${token}`}});
            setMessages([...messages , data.newMessage]);
            setNewMessage('');
            setIsSending(false);
        } catch (error) {
            console.log(error.message);
            toast.error(error?.response?.data?.message||error.message);
            setIsSending(false);
        }
     }

    if(!isOpen || !listing) return null;

    console.log(messages);
    
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

            {/*Message Area */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100'>
                {
                    isLoding ?(
                        <div className='flex items-center justify-center h-full'>
                            <Loader2Icon className='size-6 animate-spin text-indigo-600'/>
                        </div>
                    ): messages.length === 0 ? (
                        <div className='flex items-center justify-center h-full'>
                            <div className='text-center'>
                                <p className='text-gray-500 mb-2'>No message yet</p>
                                <p className='text-sm text-gray-400'>Start the conversation</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message)=> (
                            <div key={message.id} className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-lg p-3 pb-1 ${message.sender_id === user.id ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                                    <p className='text-sm whitespace-pre-wrap break-words'>{message.message}</p>
                                    <p className={`text-[10px] mt-1 ${message.sender_id === user.id ? 'text-indigo-200': 'text-gray-400'}`}>{format(new Date(message.createdAt), "MMM dd 'at' h:mm a")}</p>
                                </div>
                            </div>
                        ))
                    )
                }
                <div ref = {messagesEndRef}/>
            </div>
             {/*input Area */}
            {chat?.listing?.status === 'active' ?
                (
                    <form onSubmit={handleSendMessage} className='p-4 bg-white border-t border-gray-200 rounded-b-lg'>
                        <div className='flex items-end space-x-2'>
                            <textarea 
                            value={newMessage}
                            onChange={(e)=> setNewMessage(e.target.value)}
                            onKeyDown={(e)=>{
                                if(e.key === 'Enter' && !e.shiftKey){
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            className='flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-indigo-500 max-h-32' placeholder='Type your message...' rows={1}/>
                            <button disabled={!newMessage.trim()|| isSending} type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg disabled:opacity-50 transition-colors'>
                                {isSending ? <Loader2Icon className='w-5 h-5 animate-spin'/> : <Send className='w-5 h-5'/>}
                            </button>
                        </div>
                    </form>
                )
                :
                (
                    <div className='p-4 bg-white border border-gray-200 rounded-b-lg'>
                        <p className='text-sm text-gray-600 text-center'>{chat? `Listing is ${chat?.listing?.status}` : 'Loading Chat....'}</p>
                    </div>
                )
            }
        </div>
    </div>
  )
}

export default ChatBox