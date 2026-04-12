import React, { useEffect, useState } from 'react'
import { dummyOrders } from '../assets/assets';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [orders , setOrders] = useState([]);
  const [loding , setLoding] = useState(true);
  const [enpendedId , setExpendedId] = useState(null);

  const fetchOrder = async () => {
    setOrders(dummyOrders);
    setLoding(false);
  };

  useEffect(()=> {
    fetchOrder();
  },[]);

  const mask = (val , type) => {
    if(!val && val !== 0) return '_';
    return type.toLowerCase() === 'password' ? '.' .repeat(8) : String(val);
  };

  const copy = async (txt) => {
    try {
      await navigator.clipboard.writeText(txt);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Copy Failed');
    }
  };

  if(!orders.length){
    return (
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        <div className='max-w-2xl mx-auto mt-14 bg-white rounded-xl border border-gray-200 p-8 text-center'>
          <h3 className='text-lg font-semibold'>No order yet</h3>
          <p className='text-sm text-gray-500 m-2'>You have't purchased any listings yet.</p>
        </div>
      </div>
    )
  }
  return (
    <div>MyOrders page</div>
  )
}

export default MyOrders