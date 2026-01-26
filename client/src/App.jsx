import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import MarketPlace from "./pages/MarketPlace"
import MyListings from "./pages/MyListings"
import ListingDetails from "./pages/ListingDetails"
import ManageListing from "./pages/ManageListing"
import Messages from "./pages/Messages"
import MyOrders from "./pages/MyOrders"
import Loading from "./pages/Loading"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

function App() {
  const {pathname} = useLocation()
  return (
    <div>
      {!pathname.includes('/admin') && <Navbar/>} 
      <Routes>
        <Route path="/" element ={<Home/>}/>
        <Route path="/marketplace" element ={<MarketPlace/>}/>
        <Route path="/my-listing" element ={<MyListings/>}/>
        <Route path="/listing/:listingId" element ={<ListingDetails/>}/>
        <Route path="/create-listing" element ={<ManageListing/>}/>
        <Route path="/edit-listing/id" element ={<ManageListing/>}/>
        <Route path="/messages" element ={<Messages/>}/>
        <Route path="/my-order" element ={<MyOrders/>}/>
        <Route path="/loading" element ={<Loading/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
