import React from 'react'
import { Button } from '../ui/button'
import DailySummary from './DailySummary';

function Hero() {
    // const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    const cities = ['Delhi'];
    
  return (
    <div className='flex flex-col mx-40 gap-5'>
      <h1 className='font-extrabold text-[50px] text-center mt-5'>
        <span className='text-[#292929]'>RealTime Weather Monitoring</span>
        </h1>
      {cities.map((city, index) => (
        <DailySummary key={index} city={city} />
      ))}
    </div>
  )
}

export default Hero