import AdBanner from '@/components/partials/AdBanner'
import React from 'react'
import { nameReligion } from '@/constant/data'
import NameFilter from '@/components/partials/NameFilter'
import Link from 'next/link'
import HoverBanner from '@/components/partials/HoverBanner'
import NamePagination from '@/components/ui/NamePagination'
import { Icon } from '@iconify/react'


const NameCard = () => {
    return (
        <div className=" border rounded-lg bg-gray-300 p-8">
            <div className="grid grid-cols-3 border border-gray-300">
                {/* Row 1 - White */}
                <div className="bg-white col-span-1 text-xl font-semibold px-3 py-2 ">Name</div>
                <div className="bg-white px-3 py-2 col-span-2 text-xl font-semibold">Kabir</div>
                {/* Row 1 - White */}
                <div className=" col-span-1 text-xl font-semibold px-3 py-2 ">Meaning</div>
                <div className=" px-3 py-2 col-span-2 text-xl font-semibold">Great, Aged, Senior, Venerable, Reverend, Respected</div>
                {/* Row 1 - White */}
                <div className="bg-white col-span-1 text-xl font-semibold px-3 py-2 ">Gender</div>
                <div className="bg-white px-3 py-2 col-span-2 text-xl font-semibold">Boy</div>
                {/* Row 1 - White */}
                <div className=" col-span-1 text-xl font-semibold px-3 py-2 ">Origin</div>
                <div className=" px-3 py-2 col-span-2 text-xl font-semibold">Arabic</div>
                {/* Row 1 - White */}
                <div className="bg-white col-span-1 text-xl font-semibold px-3 py-2 ">Lucky</div>
                <div className="bg-white px-3 py-2 col-span-2 text-xl font-semibold">5</div>
                {/* Row 1 - White */}
                <div className=" col-span-1 text-xl font-semibold px-3 py-2 ">Religion</div>
                <div className=" px-3 py-2 col-span-2 text-xl font-semibold">Muslims</div>
                {/* Row 1 - White */}
                <div className="bg-white col-span-1 text-xl font-semibold px-3 py-2 ">Short Name</div>
                <div className="bg-white px-3 py-2 col-span-2 text-xl font-semibold">YES</div>
                {/* Row 1 - White */}
                <div className="bg-white col-span-1 text-xl font-semibold px-3 py-2 ">Length of Name </div>
                <div className="bg-white px-3 py-2 col-span-2 text-xl font-semibold">5 Letters and 1 Word</div>


            </div>
        </div>
    );
};


function NameDetail() {
    return (
        <div className='container mx-auto'>
            <AdBanner />

            <div className='px-44 py-8'>
                <NameFilter />

                <div className="mt-8">
                    <h4 className=" font-semibold text-2xl">Search Baby Names By Religion:</h4>

                    <div className='bg-[#D9d9d9] p-5 rounded-xl border border-black mt-2 px-12 gap-3 py-4 flex items-center flex-wrap'>
                        {nameReligion.map((name, index) => (
                            <Link key={index} href={"#"} className='bg-white py-4  px-6  w-fit text-xl font-semibold rounded-2xl'>
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>

                <HoverBanner padding='0px' />

                <div>
                    <h5 className='text-2xl font-semibold '>Kabir Name Meaning</h5>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>

                    <div className=" mt-8 flex items-center justify-between bg-red-600 text-white px-6 py-3 text-sm font-bold mb-8">
                        <h5 className="ml-2 text-3xl">Dilraba Dilmurat</h5>
                        <div className="flex items-center space-x-2 mr-2">
                            <Link href={"#"}>
                                <Icon icon="ic:baseline-share" width="24" height="24" className="w-8 h-8 cursor-pointer" /></Link>
                            <Link href={"#"}>
                                <Icon icon="logos:whatsapp-icon" width="24" height="24" className="w-8 h-8 cursor-pointer" /></Link>
                            <Link href={"#"}>
                                <Icon icon="skill-icons:instagram" width="24" height="24" className="w-8 h-8 cursor-pointer" /></Link>
                            <Link href={"#"}>
                                <Icon icon="logos:facebook" width="15" height="15" className="w-8 h-8 cursor-pointer" />
                            </Link>
                            <Link href={"#"}>
                                <Icon icon="devicon:linkedin" width="24" height="24" className="w-8 h-8 cursor-pointer" />
                            </Link>
                            <Link href={"#"}>
                                <Icon icon="logos:twitter" width="24" height="24" className="w-8 h-8 cursor-pointer" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <NameCard />

                        <div className='flex items-center justify-center my-6'>
                            <buttom className='py-2 px-6 bg-[#d9d9d9] text-[#ff0000] rounded-3xl border border-[#000]  w-fit'>
                                <Link href={"#"} className='flex items-center font-semibold text-lg'>
                                    Change Your Language  <Icon icon="ri:arrow-right-double-line" width="28" height="28" className='mt-1' />
                                </Link>
                            </buttom>
                        </div>
                    </div>

                    <HoverBanner  padding='0px'/>

                    <div>
                        <h4 className='text-2xl font-semibold my-5'>
                            FAQs About The Name
                        </h4>

                        <p className='text-lg font-semibold'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                        </p>

                        <h4 className='text-2xl font-semibold my-5'>
                            What is the Meaning of Kabir?
                        </h4>

                        <p className='text-lg font-semibold'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                        <h4 className='text-2xl font-semibold my-5'>
                            What is the name length of Kabir?
                        </h4>

                        <p className='text-lg font-semibold'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                        <h4 className='text-2xl font-semibold my-5'>
                            What is the lucky number of Kabir?
                        </h4>

                        <p className='text-lg font-semibold'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>


                    <HoverBanner padding='0px'/>
                </div>
            </div>
        </div>
    )
}

export default NameDetail
