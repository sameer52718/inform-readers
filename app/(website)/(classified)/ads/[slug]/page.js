import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

function AdDetail() {
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

                <div className='flex items-center justify-end gap-3 mb-5'>
                    <Icon icon="material-symbols:share-outline" width="24" height="24" />
                    <Icon icon="logos:whatsapp-icon" width="24" height="24" />
                    <Icon icon="skill-icons:instagram" width="24" height="24" />
                    <Icon icon="logos:facebook" width="24" height="24" />
                    <Icon icon="devicon:linkedin" width="24" height="24" />
                    <Icon icon="fa6-brands:square-x-twitter" width="24" height="24" />
                </div>

                <div>
                    <h4 className='text-center text-5xl font-bold mb-5'>
                        HD Camera <span className='text-red-500'>5100</span>
                    </h4>

                    <div>

                    </div>

                    <div className='bg-gray-300 p-6 rounded-xl'>
                        <div className='bg-white p-10 grid grid-cols-12 rounded-3xl'>
                            <div className="col-span-9 flex gap-3">
                                <Image src="/website/assets/images/icons/image-circle.png" width={1000} height={1000} className='w-auto h-20' alt='icon-1' />
                                <div>
                                    <h4 className='text-2xl font-bold mb-2'>
                                        Seller Information
                                    </h4>
                                    <p className='text-lg font-bold mb-3'>RadiusTheme</p>

                                    <div className='flex items-center gap-x-16 gap-y-4 flex-wrap' >
                                        <p> <Icon icon="mdi:location" width="20" height="20" className='inline mr-1' />House#18, Road#07 Hutchinson, Kansas</p>
                                        <p> <Icon icon="ic:baseline-phone" width="20" height="20" className='inline mr-1' />376548255xxx</p>
                                        <p> <Icon icon="ic:outline-circle" width="20" height="20" className='inline mr-1' />offline Now</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <button className='bg-red-500 text-white py-1.5 mb-2  px-10 font-bold text-2xl w-full rounded-lg'>
                                    <Icon icon="mage:we-chat" width="35" height="35" className='inline mr-1 text-black' /> Chat
                                </button>
                                <button className='bg-red-500 text-white py-1.5 mb-2 text-start px-10 font-bold text-2xl w-full rounded-lg'>
                                    <Icon icon="dashicons:email" width="35" height="35" className='inline mr-1 text-black' /> Email to Seller
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-6 pb-2 pt-5 '>
                        <h4 className='text-end text-lg font-bold'>July 18, 2019 12:20 pm</h4>
                        <h4 className='text-end text-lg font-bold'> <Icon icon="mdi:location" width="20" height="20" className='inline mr-1' />Hutchinson, Kansas</h4>
                    </div>

                    <HoverBanner padding='0px' />

                    <div className=''>
                        <h4 className='text-3xl font-bold mb-5'>
                            Overview
                        </h4>

                        <div className='bg-[#d9d9d9] border border-black p-5 rounded-3xl'>
                            <div className=' bg-white border border-black rounded-2xl py-6'>
                                <div className="grid grid-cols-2  px-6 py-2 mb-3">
                                    <div className='text-2xl font-semibold '>Brand:</div>
                                    <div className='text-2xl font-semibold '>Other Brand</div>
                                </div>
                                :
                                <div className="grid grid-cols-2  px-6 py-2 mb-3">
                                    <div className='text-2xl font-semibold '> Item Type:</div>
                                    <div className='text-2xl font-semibold '>Digital Camera</div>
                                </div>
                                <div className="grid grid-cols-2  px-6 py-2 mb-3">
                                    <div className='text-2xl font-semibold '>Condition:</div>
                                    <div className='text-2xl font-semibold '>New</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-12'>
                        <p className='mb-4 font-semibold text-lg'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In eu mi bibendum neque egestas congue quisque. At urna condimentum mattis pellentesque id nibh tortor. Aliquam eleifend mi in nulla posuere. Sed sed risus pretium quam vulputate. Sit amet dictum sit amet justo donec enim diam vulputate. Condimentum lacinia quis vel eros donec ac odio. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Id interdum velit laoreet id. Enim diam vulputate ut pharetra sit. Dictum sit amet justo donec enim diam vulputate. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
                        </p>
                        <p className='mb-4 font-semibold text-lg'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In eu mi bibendum neque egestas congue quisque. At urna condimentum mattis pellentesque id nibh tortor. Aliquam eleifend mi in nulla posuere. Sed sed risus pretium quam vulputate. Sit amet dictum sit amet justo donec enim diam vulputate.
                        </p>
                        <p className='mb-4 font-semibold text-lg'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In eu mi bibendum neque egestas congue quisque. At urna condimentum mattis pellentesque id nibh tortor. Aliquam eleifend mi in nulla posuere. Sed sed risus pretium quam vulputate. Sit amet dictum sit amet justo donec enim diam vulputate. Condimentum lacinia quis vel eros donec ac odio. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Id interdum velit laoreet id. Enim diam vulputate ut pharetra sit. Dictum sit amet justo donec enim diam vulputate. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
                        </p>
                        <p className='mb-4 font-semibold text-lg'>
                            Condimentum lacinia quis vel eros donec ac odio. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Id interdum velit laoreet id. Enim diam vulputate ut pharetra sit. Dictum sit amet justo donec enim diam vulputate. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa.
                        </p>
                    </div>

                    <div className=''>
                        <h4 className='text-3xl font-bold mb-5'>
                            Location
                        </h4>

                        <div className='bg-[#d9d9d9] border border-black h-[550px] rounded-3xl overflow-hidden'>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2snl!4v1741030403478!5m2!1sen!2snl"
                                // width="600"
                                // height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className='h-full w-full'
                            />

                        </div>
                    </div>

                    <div className='my-10'>
                        <Image src={"/website/assets/images/banner/01.png"} width={1000} height={1000} alt="banner" className='w-full h-auto' />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdDetail
