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
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 capitalize'>
            {isEditing ? 'Edit Listing' : 'List Your Account'}
          </h1>
          <p className='text-gray-600 mt-2'>
            {isEditing ? 'Update your existing account listing' : 'Create a mock listing to display your account info'}
          </p>
        </div>
        <form className='space-y-8' onSubmit={handleSubmit}>
          {/*Basic Info */}
          <Section title='Basic Information'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <InputField label='Listing Title *' value={formData.title} onChange={(v)=> handleInputChange('title', v)} placeholder='e.g., Premium Travel Instagram Account' required = {true} />

              <SelectField label='Platforms *' value={formData.platform}  options={platForms} onChange={(v)=> handleInputChange('platform', v)}/> 
              
              <InputField label='Username/Handle *' value={formData.username} onChange={(v)=> handleInputChange('username', v)} placeholder='@username' required = {true} />

               <SelectField label='Niche/Category *' value={formData.niche}  options={niches} onChange={(v)=> handleInputChange('niche', v)}/> 
              
            </div>
          </Section>
        </form>
      </div>
    </div>
  )
}

 {/*----- Common Elements----- */}

const Section = ({title , children})=> ( 
  <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-6'>
    <h1 className='text-lg font-semibold text-gray-800'>{title}</h1>
    {children}
  </div>
)

const InputField = ({label , value , onChange, placeholder, type = 'text', required = false , min = null , max = null})=> ( 
  <div>
    <label className='block text-sm font-medium text-gray-700 mt-2'>{label}</label>
    <input className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300' type={type} min={min} max={max} placeholder={placeholder} value={value} required ={required} onChange={(e)=> onChange(e.target.value)}/>
  </div>
)

const SelectField = ({label , value , onChange, options, placeholder, required = false})=> ( 
  <div>
    <label className='block text-sm font-medium text-gray-700 mt-2'>{label}</label>
    <select className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300' value={value} onChange={(e)=> onChange(e.target.value)} required = {required}>
      <option value=''>Select...</option>
      {options.map((opt)=> (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

export default ManageListing
