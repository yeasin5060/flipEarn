import { ChevronDown, Filter, X } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSidebar = ({showFilterphone,setShowFilterPhone,filters , setFilters}) => {

  const currency = import.meta.env.VITE_CURRENCY || '$' ;
  const [searchParams , setSearchparams] = useSearchParams();
  const [search , setSearch] = useState(searchParams.get('search') || '');
  const navigate = useNavigate();
  const onChangeSearch = (e)=> {
      if(e.target.value){
        setSearchparams({search : e.target.value});
        setSearch(e.target.value);
      }else{
        navigate (`/marketplace`);
        setSearch('');
      };
  };

  const [expandedSection , setExpandedSection] = useState({
    platform : true,
    price : true,
    followers : true,
    niche : true,
    status : true
  });

  const toggleSection = (section)=> {
    setExpandedSection((prev)=>({...prev, [section]: !prev[section]}));
  };

  const onFiltersChenge = (newFilters)=> {
      setFilters ({...filters, ...newFilters});
  };

  const platforms = [
    {value : 'youtube' , label : 'YouTube'},
    {value : 'instagram' , label : 'Instagram'},
    {value : 'tiktok' , label : 'Tiktok'},
    {value : 'facebook' , label : 'Facebook'},
    {value : 'twitter' , label : 'Twitter'},
    {value : 'linkedin' , label : 'Linkedin'},
    {value : 'twitch' , label : 'Twitch'},
    {value : 'descord' , label : 'Descord'},
  ];
  return (
    <div className={`${showFilterphone ? 'max-sm:fixed ': 'max-sm:hidden'}max-sm:inset-0 z-100 max-sm:h-screen max-sm:overflow-scroll bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24 md:min-w-[300px]`}>
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 text-gray-700'>
            <Filter className='size-4'/>
            <h3 className='font-semibold capitalize'>filters</h3>
          </div>
          <div className='flex items-center gap-2'>
            <X className='size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer'/>
            <button onClick={()=> setShowFilterPhone(false)} className='sm:hidden text-sm border text-gray-700 px-3 py-1 rounded'>apply</button>
          </div>
        </div>
      </div>
      <div className='p-4 space-y-6 sm:max-h-[calc(100vh-200px)] overflow-y-scroll no-scrollbar'>
        {/*search bar */}
        <div className='flex items-center justify-between'>
          <input className='w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-300' type="text" placeholder='Search by username , platform , niche ,etc' onChange={onChangeSearch} value={search}/>
        </div>
         {/*Platform Filter */}
        <div>
          <button onClick={()=> toggleSection('platform')} className='flex items-center justify-between w-full mb-3'>
            <label className='text-sm font-medium text-gray-800'>Platform</label>
            <ChevronDown className={`size-4 transition-transform ${expandedSection.platform ? 'rotate-180':''}`}/>
          </button>
          {expandedSection.platform && (
            <div className='flex flex-col gap-2'>
               {platforms.map((platform)=>(
                  <label className='flex items-center gap-2 text-gray-700 text-sm' key={platform.value}>
                    <input type="checkbox" checked ={filters.platform?.includes(platform.value) || false} onChange={(e)=> {
                       const checked = e.target.checked;
                       const current = filters.platform || [];
                       const updated = checked ? [...current , platform.value] : current.filter((p)=> p !== platform.value)

                       onFiltersChenge({
                        ...filters,
                        platform : updated.length > 0 ? updated : null
                       })
                      }
                    } />
                    <span>{platform.label}</span>
                  </label>
              ))}
            </div>
          )}
        </div>
         {/*Price Range */}
        <div>
          <button onClick={()=> toggleSection('price')} className='flex items-center justify-between w-full mb-3'>
            <label className='text-sm font-medium text-gray-800'>Price Range</label>
            <ChevronDown className={`size-4 transition-transform ${expandedSection.price ? 'rotate-180':''}`}/>
          </button>
          {expandedSection.price && (
            <div className='space-y-3'>
              <input className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 outline-none' type="range" min='0' max='100000' step='100' value={filters.maxPrice || 100000} onChange={(e)=> onFiltersChenge({...filters , maxPrice : parseInt(e.target.value)})}/>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>{currency}0</span>
                <span>{currency}{(filters.maxPrice ||100000).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar
