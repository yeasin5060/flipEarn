import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProfileLink, platformIcons } from '../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon, ArrowUpRightFromSquareIcon, Calendar, CheckCircle2, ChevronLeftIcon, ChevronRightIcon, DollarSign, Eye, LineChart, Loader2Icon, MapPin, MessageSquareMoreIcon, ShoppingBagIcon, Users } from 'lucide-react';
import { setChat } from '../app/features/chatSlice.js';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import api from '../configs/axios.js';

const ListingDetails = () => {

  const dispatch = useDispatch();
  const {user , isLoaded} = useUser();
  const {openSignIn} = useClerk();
  const {getToken} = useAuth();

  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [listing , setListing] = useState(null);
  const profileLink = listing && getProfileLink(listing.platform , listing.username);

  const {listingId} = useParams();
  const {listings} = useSelector(state => state.listing);

  const prevSlide = ()=> setCurrent((prev)=> (prev === 0 ? images.length -1 : prev -1));
  const nextSlide = ()=> setCurrent((prev)=> (prev === images.length -1 ? 0 : prev + 1));

  const purshaseAccount = async ()=> {
    try {
      if(!user){
        return openSignIn()
      }
      toast.loading('creating payment link...');

      const token = await getToken();
      const {data} = await api.get(`/api/listing/purchase-account/${listing.id}`,{headers : {Authorization : `Bearer ${token}`}});
      toast.dismissAll();
      window.location.href = data.paymentLink
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message||error.message);
      console.log(error);
    }
  }

  const loadChatBox = ()=> {
    if(!isLoaded || !user) return toast('Please login to chat with seller');
    if(user.id === listing.ownerId) return toast("You can't chat with your own listing")
    dispatch(setChat({listing : listing}))
  }

  useEffect(()=> {
    const listing = listings.find((listing)=> listing.id === listingId);
    if(listing){
      setListing(listing)
    }
  },[listings,listingId]);

  const [current , setCurrent] = useState(0);
  const images = listing?.images || 0 ;
  return listing ? (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <button onClick={()=> navigate(-1)} className='flex items-center gap-2 text-slate-600 py-5'>
        <ArrowLeftIcon className='size-4'/> go to previous page
      </button>

      <div className='flex items-start max-md:flex-col gap-10'>
        <div className='flex-1 max-md:w-full'>
          {/* top section */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-5'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
              <div className='flex items-start gap-3'>
                <div className='p-2 rounded-xl'>
                  {platformIcons[listing.platform]}
                </div>
                <div>
                  <h2 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>{listing.title}
                    <Link target='_blank' to={profileLink}>
                      <ArrowUpRightFromSquareIcon className='size-4 text-indigo-500'/>
                    </Link>
                  </h2>
                  <p className='text-gray-500 text-sm'>
                    @{listing.username}.{listing.platform?.charAt().toUpperCase() + listing.platform.slice(1)}
                  </p>
                  <div className='flex gap-2 mt-2'>
                    {listing.verified &&(
                      <span className='flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md capitalize'>
                        <CheckCircle2 className='w-3 h-3 mr-1'/>
                        verified
                      </span>
                    )}
                    {listing.monetized &&(
                      <span className='flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md capitalize'>
                        <DollarSign className='w-3 h-3 mr-1'/>
                        minetized
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <h3 className='text-2xl font-bold text-gray-800'>
                  {currency}
                  {listing.price?.toLocaleString()}
                </h3>
                <p className='text-sm text-gray-500'>USD</p>
              </div>
            </div>
          </div>
          {/* Screenshort section */}
           {images?.length > 0 && (
            <div className='bg-white rounded-xl border border-gray-200 mb-5 overflow-hidden '>
              <div className='p-4'>
                <h4 className='font-semibold text-gray-800'>Screenshort & Proof</h4>
              </div>
              {/* slider container */}
              <div className='relative w-full aspect-video overflow-hidden'>
                <div className='flex transition-transform duration-300 ease-in-out' style={{transform : `translateX(-${current * 100}%)`}}>
                  {images.map((image,index)=>(
                    <img className='w-full shrink-0' key={index} src={image} alt="not found" />
                  ))}
                </div>
                {/* navigation button */}
                <button onClick={prevSlide} className='absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow'>
                  <ChevronLeftIcon className='w-5 h-5 text-gray-700' />
                </button>
                <button onClick={nextSlide} className='absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow'>
                  <ChevronRightIcon className='w-5 h-5 text-gray-700' />
                </button>
                {/* Dots indicator */}
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
                  {images.map((_,index)=> (
                    <button onClick={()=> setCurrent(index)} key={index} className={`w-2.5 h-2.5 rounded-full ${current === index ? 'bg-indigo-600' : 'bg-gray-300'}`}/>
                  ))}
                </div>
              </div>
            </div>
           )}
          {/* Account Metrics */}
          <div className='text-white rounded-xl border border-gray-200 mb-5'>
              <div className='p-4 border-b border-gray-100'>
                <h4 className='font-semibold text-gray-800 capitalize'>Account Metrics</h4>
              </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center'>
              <div>
                <Users className='mx-auto w-5 h- mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {listing.followers_count?.toLocaleString()}
                </p>
                <p className='text-gray-500 text-xs capitalize'>followers</p>
              </div>
              <div>
                <LineChart className='mx-auto w-5 h- mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {listing.engagement_rate}%
                </p>
                <p className='text-gray-500 text-xs capitalize'>engagement</p>
              </div>
              <div>
                <Eye className='mx-auto w-5 h- mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {listing.monthly_views?.toLocaleString()}
                </p>
                <p className='text-gray-500 text-xs capitalize'>monthly views</p>
              </div>
              <div>
                <Calendar className='mx-auto w-5 h- mb-1 text-gray-400' />
                <p className='font-semibold text-gray-800'>
                  {new Date(listing.createAt).toLocaleDateString()}
                </p>
                <p className='text-gray-500 text-xs capitalize'>Listed</p>
              </div>
            </div>
          </div>
          {/* Description */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-5'>
            <div className='p-4 border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800 capitalize'>Description</h4>
            </div>
            <div className='p-4 text-sm text-gray-600'>{listing.description}</div>
          </div>
          {/* Additional Details */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-5'>
            <div className='p-4 border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800 capitalize'>Additional Details</h4>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 text-sm'>
              <div>
                <p className='text-gray-500 capitalize'>niche</p>
                <p className='font-medium capitalize'>{listing.niche}</p>
              </div>
              <div>
                <p className='text-gray-500 capitalize'>primary country</p>
                <p className='font-medium flex items-center'><MapPin className='size-4 text-gray-400 mr-1'/>{listing.country}</p>
              </div>
              <div>
                <p className='text-gray-500 capitalize'>audience age</p>
                <p className='font-medium capitalize'>{listing.age_range}</p>
              </div>
              <div>
                <p className='text-gray-500 capitalize'>platform verified</p>
                <p className='font-medium capitalize'>{listing.platformAssured ? 'Yes':'No'}</p>
              </div>
              <div>
                <p className='text-gray-500 capitalize'>monetization</p>
                <p className='font-medium capitalize'>{listing.monetized ? 'Enabled' : 'Desabled'}</p>
              </div>
              <div>
                <p className='text-gray-500 capitalize'>status</p>
                <p className='font-medium capitalize'>{listing.status}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Seller Info $ Purchase Option  */}
        <div className='bg-white min-w-full md:min-w-[370px] rounded-xl border border-gray-200 p-5 max-md:mb-10'>
          <h4 className='font-semibold text-gray-800 mb-4'>Seller Information</h4>
          <div className='flex items-center gap-3 mb-2'>
            <img className='size-10 rounded-full' src={listing.owner?.image} alt="seller image" />
            <div>
              <p className='font-medium text-gray-800'>{listing.owner?.name}</p>
              <p className='text-sm text-gray-500'>{listing.owner?.email}</p>
            </div>
          </div>
          <div className='flex items-center justify-between text-gray-600 mb-4 text-sm'>
            <p>Member Since<span className='font-medium'>{new Date(listing.owner?.createdAt).toLocaleDateString()} </span></p>
          </div>
          <button onClick={loadChatBox} className='w-full bg-indigo-600 py-2 text-white rounded-lg capitalize hover:bg-indigo-700 transition tex-sm font-medium flex items-center justify-center gap-2'>
            <MessageSquareMoreIcon className='size-4'/>chat
          </button>
          {
            listing.isCredentialChanged && (
              <button onClick={purshaseAccount} className='w-full mt-2 bg-purple-600 py-2 text-white rounded-lg capitalize hover:bg-purple-700 transition tex-sm font-medium flex items-center justify-center gap-2'>
                <ShoppingBagIcon className='size-4'/>Purshase
              </button>
            )
          }
        </div>
      </div>
    </div>
  ): (
    <div className='h-screen flex items-center justify-center'>
      <Loader2Icon className='size-7 animate-spin text-indigo-600'/>
    </div>
  )
}

export default ListingDetails