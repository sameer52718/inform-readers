import AdBanner from '@/components/partials/AdBanner'
import React from 'react'

function AdDetail() {
    return (
        <div>
            <AdBanner />

            <div className='px-32 bg-white'>
                <div className='flex items-center gap-1 px-32 py-6'>
                    <h6>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Actresses</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Dilraba Dilmurat</h6>
                </div>
            </div>
        </div>
    )
}

export default AdDetail
