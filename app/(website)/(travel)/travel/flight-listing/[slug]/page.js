import AdBanner from '@/components/partials/AdBanner'
import React from 'react'

function FlightDetail() {
  return (
    <div>
      <AdBanner />

      <div className='container px-44 py-8'>
        <h4 className='text-4xl text-center font-bold'>Step 1: Review what’s included in your fare</h4>
        <p className='text-xl font-semnibold '>
        See baggage size and weight limit.Total prices may include estimated baggage fees and flexibility. Some options may require added baggage or flexibility when checking out. Check terms and conditions on the booking site.
        </p>
      </div>
    </div>
  )
}

export default FlightDetail
