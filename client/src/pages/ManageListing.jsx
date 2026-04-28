import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast';
import {Loader2Icon, Upload, X} from 'lucide-react'
import { useAuth } from '@clerk/clerk-react';
import api from '../configs/axios';
import { getAllUserListing } from '../app/features/listingSlice';
import { getAllPublicListing } from '../../../server/controllers/listingcontroller';

const ManageListing = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {userListings} = useSelector((state)=> state.listing);

  const {getToken} = useAuth();
  const dispatch = useDispatch();

  const[logingListing,setLodingLsting] = useState(false);
  const[isEditing,setIsEditing] = useState(false);

  const [formData , setFormData] = useState({
    title : '',
    platform : '',
    username : '',
    followers_count : '',
    engagement_rate : '',
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
    if(!id) return;

    setIsEditing(true);
    setLodingLsting(true);
    const listing = userListings.find((listing) => listing.id === id);
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
    toast.loading('Saving...');
    const dataCopy = structuredClone(formData);
    try {
      if(isEditing){
        dataCopy.images = formData.images.filter((image) => typeof image === 'string');
        const formDataInstance = new FormData();
        formDataInstance.append('accountDetails', JSON.stringify(dataCopy));
        formData.images.filter((image) => typeof image !== 'string').forEach((image)=>{
          formDataInstance.append('images' , image)
        });
        const token = await getToken();
        const {data} = await api.put('/api/listing' , formDataInstance, {headers : {Authorization : `Bearer ${token}`}});

        toast.dismissAll();
        toast.success(data.message);

        dispatch(getAllUserListing({getToken}));
        dispatch(getAllPublicListing());
        navigate('my-listings');
      }else{
        delete dataCopy.images;
        const formDataInstance = new FormData();
        formDataInstance.append('accountDetails', JSON.stringify(dataCopy));
        formData.images.forEach((image)=> {
          formDataInstance.append('images' , image)
        });
        const token = await getToken();
        const {data} = await api.post('/api/listing' , formDataInstance, {headers : {Authorization : `Bearer ${token}`}});

        toast.dismissAll();
        toast.success(data.message);

        dispatch(getAllUserListing({getToken}));
        dispatch(getAllPublicListing());
        navigate('my-listings');
      }
    } catch (error) {
      toast.dismissAll();
      toast.error(error?.response?.data?.message||error.message)
    }
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
          {/* METRICS */}
          <Section title='Account Metrics'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <InputField label='Followers count *' min={0} type='number' value={formData.followers_count} onChange={(v)=> handleInputChange('followers_count', v)} placeholder='10000' required = {true} />

              <InputField label='Engagement Rate (%)' min={0} max={100} type='number' value={formData.engagement_rate} onChange={(v)=> handleInputChange('engagement_rate', v)} placeholder='4' />

              <InputField label='Monthly Views/Impressions' min={0} type='number' value={formData.monthly_views} onChange={(v)=> handleInputChange('monthly_views', v)} placeholder='100000' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <InputField label='Primary Audience Country' min={0} value={formData.country} onChange={(v)=> handleInputChange('country', v)} placeholder='United States' />

              <SelectField label='Primary Audience Age Range ' value={formData.age_range}  options={ageRanges} onChange={(v)=> handleInputChange('age_range', v)}/> 
            </div>
            <div className='space-y-3'>
              <CheckboxField label='Account is verified on the platform' checked={formData.verified} onChange={(v)=> handleInputChange('verified', v)} />
              <CheckboxField label='Account is monetize' checked={formData.monetized} onChange={(v)=> handleInputChange('monetize', v)} />
            </div>
          </Section>
           {/* Pricing */}
          <Section title='Pricing & Description'>
            <InputField label='Asking Price (USD) *' min={0} type='number' value={formData.price} onChange={(v)=> handleInputChange('price', v)} placeholder='2500.00' required={true}/>

            <TextareaField label='Description *' value={formData.description} onChange={(v)=> handleInputChange('description', v)} required={true}/>
          </Section>
           {/* Images */}
           <Section title='Screenshots & Proof'>
             <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
              <input className='hidden' type='file' id='images' multiple accept='image/*' onChange={handleImageUpload} />
              <Upload className='w-12 h-12 text-gray-400 mx-auto mb-4'/>
              <label className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer' htmlFor='images'>Choose Files</label>
              <p className='text-sm text-gray-500 mt-2'>Upload screenshots or proof of account analytics</p>
             </div>
             {formData.images.length > 0 && (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4'>
                {formData.images.map((img , index)=> (
                  <div key={index} className='relative'>
                    <img className='w-full h-24 object-cover rounded-lg' src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt={`image ${index + 1}`}/>
                    <button className='absolute -top-2 -right-2 dsize-6 bg-red-600 text-white rounded-full hover:bg-red-700' type='button' onClick={()=> removeImage(index)}>
                      <X/>
                    </button>
                  </div>
                ))}
              </div>
             )}
           </Section>
           <div className='flex justify-end gap-3 text-sm'>
            <button onClick={()=> navigate(-1)} className='px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors capitalize'>
              Cancel
            </button>
            <button className='text-white px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors capitalize' type='submit'>
              {isEditing ? 'Update Listing' : 'Create Listing'}
            </button>
           </div>
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

const CheckboxField = ({label , checked , onChange, required = false})=> ( 
  <label className='flex items-center space-x-2 cursor-pointer'>
    <input className='size-4' type='checkbox' checked = {checked} onChange={(e)=> onChange(e.target.checked)} required = {required}/>
    <span className='text-sm text-gray-700'>{label}</span>
  </label>
)

const TextareaField = ({label , value , onChange, required = false})=> ( 
  <div>
    <label className='block text-sm font-medium text-gray-600 mb-2'>
      {label}
    </label>
    <textarea className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300' rows={5} value={value} onChange={(e)=> onChange(e.target.value)} required = {required}/>
  </div>
)
export default ManageListing
