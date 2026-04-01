import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast';

const ManageListing = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const {userListing} = useSelector((state)=> state.listing);

  const[logingListing,setLodingLsting] = useState(false);
  const[isEditing,srtIsEditing] = useState(false);

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

  
  return (
    <div>
      
    </div>
  )
}

export default ManageListing
