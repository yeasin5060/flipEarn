import React from 'react'
import Hero from '../components/Hero'
import LatestListign from '../components/LatestListign'
import Plans from '../components/Plans'
import CTA from '../components/CTA'

const Home = () => {
  return (
    <div>
       <Hero/>
       <LatestListign/>
       <Plans/>
       <CTA/>
    </div>
  )
}

export default Home