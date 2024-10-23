import React from 'react'
import DailySummary from './DailySummary';
import Footer from './Footer';
import { Toaster } from 'sonner';

function Hero() {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    
  return (
    <div className='flex flex-col mx-40 gap-5'>
      <h1 className='font-extrabold text-[50px] text-center mt-5'>
        <span className='text-[#292929]'>RealTime Weather Monitoring</span>
        </h1>
      {cities.map((city, index) => (
        <DailySummary key={index} city={city} />
      ))}
      
      <Toaster />
      <Footer/>
    </div>
  )
}

export default Hero