import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'

const Loading = () => {
  const {nextUrl} = useParams();
  const navigate = useNavigate();

  useEffect(()=> {
    if(nextUrl){
      setTimeout(()=> {
        navigate("/", + nextUrl)
      },6000);
    }
  },[])
  return (
    <div className='flex items-center justify-between h-[8-vh]'>
      <Loader2Icon className='size-7 text-indigo-700 animate-spin'/>
    </div>
  )
}

export default Loading
