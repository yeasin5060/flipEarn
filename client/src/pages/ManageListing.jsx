import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'

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
    image : []
  });

  const platForms = ['youtube','instagram','tiktok','facebook','twitter','linkedin','pinterest','snapchat','twitch','discord']

  const niches = ['lifestyle','fitness','food','travel','tech','gaming','fashion','beauty','business','education','entertainment','music','art','sports','health','finance','other']
  return (
    <div>
      
    </div>
  )
}

export default ManageListing
