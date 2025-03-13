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
        <div className="border rounded-lg overflow-hidden bg-gray-300 p-2">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="bg-white text-xl font-semibold px-3 py-2 text-left">Attribute</th>
                        <th className="bg-white text-xl font-semibold px-3 py-2 text-left">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Row - Name */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Name</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Kabir</td>
                    </tr>

                    {/* Row - Meaning */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Meaning</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">
                            Great, Aged, Senior, Venerable, Reverend, Respected
                        </td>
                    </tr>

                    {/* Row - Gender */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Gender</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Boy</td>
                    </tr>

                    {/* Row - Origin */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Origin</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Arabic</td>
                    </tr>

                    {/* Row - Lucky */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Lucky</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">5</td>
                    </tr>

                    {/* Row - Religion */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Religion</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Muslims</td>
                    </tr>

                    {/* Row - Short Name */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Short Name</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">YES</td>
                    </tr>

                    {/* Row - Length of Name */}
                    <tr>
                        <td className="bg-white text-xl font-semibold px-3 py-2">Length of Name</td>
                        <td className="bg-white text-xl font-semibold px-3 py-2">5 Letters and 1 Word</td>
                    </tr>
                </tbody>
            </table>
        </div>


    );
};


function NameDetail() {
    return (
        <div className='container mx-auto'>
            <AdBanner />

            <div className='md:px-44 px-4 py-8'>
                <NameFilter />

                <div className="mt-8">
                    <h4 className="font-semibold text-2xl">Search Baby Names By Religion:</h4>

                    <div className='bg-[#D9d9d9] md:p-5 rounded-xl border border-black mt-2 md:px-4 gap-1.5 px-2 sm:px-12 md:gap-3 py-4 flex items-center flex-wrap'>
                        {nameReligion.map((name, index) => (
                            <Link
                                key={index}
                                href={"#"}
                                className='bg-white py-4 md:px-6 px-3 w-fit md:text-xl text-sm font-semibold rounded-2xl mb-4 sm:mb-0 md:mr-4'
                            >
                                {name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="md:px-44 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className='md:px-44 px-4 py-8'>

                <h5 className='text-2xl font-semibold '>Kabir Name Meaning</h5>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>

                <div className=" mt-8 flex items-center justify-between bg-red-600 text-white md:px-6 px-2 py-3 text-sm font-bold mb-8">
                    <h5 className="ml-2 md:text-3xl text-base">Dilraba Dilmurat</h5>
                    <div className="flex items-center space-x-2 mr-2">
                        <Link href={"#"}>
                            <Icon icon="ic:baseline-share" width="24" height="24" className="md:w-8 w-5 h-8 cursor-pointer" /></Link>
                        <Link href={"#"}>
                            <Icon icon="logos:whatsapp-icon" width="24" height="24" className="md:w-8 w-5 h-8 cursor-pointer" /></Link>
                        <Link href={"#"}>
                            <Icon icon="skill-icons:instagram" width="24" height="24" className="md:w-8 w-5 h-8 cursor-pointer" /></Link>
                        <Link href={"#"}>
                            <Icon icon="logos:facebook" width="15" height="15" className="md:w-8 w-5 h-8 cursor-pointer" />
                        </Link>
                        <Link href={"#"}>
                            <Icon icon="devicon:linkedin" width="24" height="24" className="md:w-8 w-5 h-8 cursor-pointer" />
                        </Link>
                        <Link href={"#"}>
                            <Icon icon="logos:twitter" width="24" height="24" className="md:w-8 w-5 h-8 cursor-pointer" />
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
            </div>

            <div className="md:px-44 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>





            <div className='md:px-44 px-4 py-8'>
                <h4 className='text-xl sm:text-2xl  font-semibold my-5'>
                    FAQs About The Name
                </h4>

                <p className='text-base sm:text-lg  font-semibold'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>

                <h4 className='text-xl sm:text-2xl  font-semibold my-5'>
                    What is the Meaning of Kabir?
                </h4>

                <p className='text-base sm:text-lg  font-semibold'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>

                <h4 className='text-xl sm:text-2xl  font-semibold my-5'>
                    What is the name length of Kabir?
                </h4>

                <p className='text-base sm:text-lg  font-semibold'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>

                <h4 className='text-xl sm:text-2xl  font-semibold my-5'>
                    What is the lucky number of Kabir?
                </h4>

                <p className='text-base sm:text-lg  font-semibold'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>

            </div>


            <div className="md:px-44 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>


        </div>
    )
}

export default NameDetail
