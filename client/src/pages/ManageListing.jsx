import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast';
import {Loader2Icon} from 'lucide-react'

const ManageListing = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {userListing} = useSelector((state)=> state.listing);

  const[logingListing,setLodingLsting] = useState(false);
  const[isEditing,setIsEditing] = useState(false);

  const [formData , setFormData] = useState({
    title : '',
    platform : '',
    username : '',
    followers_count : '',
    engament_rent : '',
    monthly_views : '',
    niche : '',
    price : '',
    description : '',
    verified : false ,
    monetized : false,
    country : '',
    age_range : '',
    images : []
  });

  const platForms = ['youtube','instagram','tiktok','facebook','twitter','linkedin','pinterest','snapchat','twitch','discord'];

  const niches = ['lifestyle','fitness','food','travel','tech','gaming','fashion','beauty','business','education','entertainment','music','art','sports','health','finance','other'];

  const ageRanges = ['13-17 years','18-24 years','25-34 years','35-44 years','45-54 years','55+ years','Mixed ages'];

  const handleInputChange = (field , value) => {
    setFormData((prev)=> ({...prev,[field] : value}));
  };

  const handleImageUpload = async (event)=> {
    const files = Array.from(event.target.files);
    if(!files.length) return ;
    if(files.length + formData.images.length > 5) return toast.error('You can add up to 5 image');
    setFormData((prev)=> ({...prev,images : [...prev.images, ...files]}))
  };

  const removeImage = (indexToRemove)=> {
    setFormData((prev)=>({
      ...prev, images : prev.images.filter((_,i)=> i !== indexToRemove)
    }));
  };

    // get listing data for edit if 'id' porvided (edit mode)
  
  useEffect(()=>{
    if(!id) return
    setIsEditing(true);
    setLodingLsting(true);
    const listing = userListing.find((listing) => listing.id === id);
    if(listing){
      setFormData(listing);
      setLodingLsting(false);
    }else{
      toast.error('Listing not found');
      navigate('my-listing');
    }
  },[id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if(logingListing){
    return(
      <div className='h-screen flex items-center justify-center'>
        <Loader2Icon className='size-7 animate-spin text-indigo-600'/>
      </div>
    )
  }
  return (
    <div className='min-h-screen py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 capitalize'>
           {isEditing ? 'Edit Listing' : 'List Your Account'}
        </h1>
        <p className='text-gray-600 mt-2'>
          {isEditing ? 'Update your existing account listing' : 'Create a mock listing to display your account info'}
        </p>
      </div>
    </div>
  )
}

export default ManageListing
