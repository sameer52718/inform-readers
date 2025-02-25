import Image from 'next/image'
import React from 'react'

function AdBanner() {
  return (
    
    <div className='py-6 border-b border-black px-32'>
      <Image src={'/website/assets/images/banner/02.jpeg'}  width={2000} height={2000} alt="ad-banner" className='px-32 h-auto mx-auto' />
    </div>
  )
}

export default AdBanner
