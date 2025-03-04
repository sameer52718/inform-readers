import AdBanner from '@/components/partials/AdBanner'
import React from 'react'

function SoftwareDetail() {
    return (
        <div>
            <AdBanner />

            <div className='px-32 bg-white'>
                <div className='flex items-center gap-1 px-32 py-6'>
                    <h6>Home</h6>
                    /
                    <h6>Electronics</h6>
                    /
                    <h6>HD Camera 5100</h6>
                </div>

                <div className='w-full'>
                    <h4 className='text-center text-5xl font-bold mb-5'>
                        HD Camera <span className='text-red-500'>5100</span>
                    </h4>

                    <div className='bg-[#d9d9d9]'>
                        <div>
                            <Image src="" alt="" width={1000} height={1000}/>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SoftwareDetail
