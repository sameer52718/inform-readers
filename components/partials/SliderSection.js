import React from 'react'
import ContentCard from '../card/ContentCard'


function SliderSection({ heading = "Latest Gadget" }) {
  return (
    <section className='md:px-32 md:py-6'>
      <h1 className='text-center text-[#ff0000] md:text-5xl text-3xl font-semibold mb-5'>{heading}</h1>
      <div className="divider h-[3px] w-full bg-black mb-8"></div>
    </section>
  )
}

export default SliderSection
