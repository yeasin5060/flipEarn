import React from 'react'
import Hero from '../components/Hero'
import LatestListign from '../components/LatestListign'
import Plans from '../components/Plans'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
       <Hero/>
       <LatestListign/>
       <Plans/>
       <CTA/>
       <Footer/>
    </div>
  )
}

export default Home