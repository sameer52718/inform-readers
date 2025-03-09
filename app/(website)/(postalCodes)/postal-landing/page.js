import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import WeatherFilter from '@/components/partials/WeatherFilter'
import Pagination from '@/components/ui/Pagination';
import { Icon } from '@iconify/react';
import React from 'react'



function LocationTable() {
    const locations = [
        { country: 'Pakistan', state: 'Sindh', city: 'Adil Pur' },
        { country: 'Pakistan', state: 'Sindh', city: 'Agra' },
        { country: 'Pakistan', state: 'Sindh', city: 'Agricultur Institute Nawabshah' },
        { country: 'Pakistan', state: 'Sindh', city: 'Allah Ditto Bhambhro' },
        { country: 'Pakistan', state: 'Sindh', city: 'Arain Road' },
        { country: 'Pakistan', state: 'Sindh', city: 'Aqil Shah' },
        { country: 'Pakistan', state: 'Sindh', city: 'Arzi Bhutto' },
        { country: 'Pakistan', state: 'Sindh', city: 'Ammunition Depot Kashmore' },
        { country: 'Pakistan', state: 'Sindh', city: 'Ahmed Pur' },
        { country: 'Pakistan', state: 'Sindh', city: 'Babarloi' },
    ];

    return (
        <div className="p-3 border border-black bg-gray-300 rounded-lg w-full">
            <table className="w-full border-collapse">
                <thead className='mb-5'>
                    <tr className="bg-red-500 text-white">
                        <th className="p-2 text-left">Country</th>
                        <th className="p-2 text-left">Regions/ States /Provinces</th>
                        <th className="p-2 text-left">City/Area</th>
                        <th className="p-2 text-left">Postal Code</th>
                    </tr>
                </thead>
                <tbody className='bg-gray-300'>
                    {locations.map((location, index) => (
                        <tr key={index} className="">
                            <td className="p-2">{location.country}</td>
                            <td className="p-2">{location.state}</td>
                            <td className="p-2">{location.city}</td>
                            <td className="p-2 text-red-500 underline cursor-pointer">View Details</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PostalLanding() {
    return (
        <div>
            <AdBanner />
            <div className='container mx-auto px-44 py-8'>

                <WeatherFilter />

                <div className='mb-5 py-5'>
                    <h6 className='text-3xl font-semibold mb-3 px-2'>
                        Regions
                    </h6>
                    <div className='bg-gray-300 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6'>
                        <div className='grid grid-cols-3 w-full'>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Azad Jammu And Kashmir</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Fedral Capital </div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Balochistan</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Gilgit Baltistan</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Sindh</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Punjab</div>
                            <div className='text-red-500 text-xl font-bold  mb-5'><Icon icon="bi:dot" width="16" height="16" className='h-6 w-6 inline' /> Khyber Pakhtunkhwa</div>
                        </div>
                    </div>
                </div>

                <HoverBanner padding='0px' />

                <LocationTable />

                <div className='flex items-center justify-center my-5'>
                    <Pagination currentPage={1} totalPages={10} />
                </div>

                <HoverBanner padding='0px' />


                <div>
                    <div className=" p-6">
                        <h1 className="text-red-500 text-4xl font-bold mb-4">General breakdown of postal codes</h1>
                        <ul className="list-decimal pl-6 text-lg">
                            <li>
                                A
                                <ul className="list-disc pl-6 text-base">
                                    <li>Represents the <span className="text-red-500 font-bold">region</span> or <span className="text-red-500 font-bold">state</span>.</li>
                                    <li>Example: "A" could mean the <span className="text-red-500 font-bold">North Zone</span>.</li>
                                </ul>
                            </li>
                            <li>
                                1
                                <ul className="list-disc pl-6 text-base">
                                    <li>Specifies a <span className="text-red-500 font-bold">sub-region</span> within the main region.</li>
                                    <li>Example: "1" might identify a <span className="text-red-500 font-bold">specific province or city</span>.</li>
                                </ul>
                            </li>
                            <li>
                                B
                                <ul className="list-disc pl-6 text-base">
                                    <li>Refines the area further, identifying a <span className="text-red-500 font-bold">district or zone</span>.</li>
                                    <li>Example: "B" could represent a specific <span className="text-red-500 font-bold">sector or neighborhood</span>.</li>
                                </ul>
                            </li>
                            <li>
                                2
                                <ul className="list-disc pl-6 text-base">
                                    <li>Indicates the local delivery unit or <span className="text-red-500 font-bold">postal sector</span>.</li>
                                    <li>Example: "2" might refer to a <span className="text-red-500 font-bold">postal office branch in the area</span>.</li>
                                </ul>
                            </li>
                            <li>
                                C3
                                <ul className="list-disc pl-6 text-base">
                                    <li>Further pinpoints a specific location, such as a <span className="text-red-500 font-bold">street, block, or building</span>.</li>
                                    <li>Example: "C3" could mean Main Street, Block 3.</li>
                                </ul>
                            </li>
                            <li>
                                - 456 (Optional Extension)
                                <ul className="list-disc pl-6 text-base">
                                    <li>Adds extra precision, like an <span className="text-red-500 font-bold">apartment, suite, or floor</span>.</li>
                                    <li>Example: "456" could represent <span className="text-red-500 font-bold">Suite 456 in Building 3</span>.</li>
                                </ul>
                            </li>
                        </ul>
                        <h2 className="text-3xl mb-2 font-bold mt-6">1. Example with Names:</h2>
                        <p className="text-lg font-semibold">A1B 2C3-456</p>
                        <ul className="list-disc pl-6 text-base">
                            <li><span className="text-red-500 font-bold">A</span> = Region (North Zone)</li>
                            <li><span className="text-red-500 font-bold">1</span> = Sub-region (City A)</li>
                            <li><span className="text-red-500 font-bold">B</span> = District (Neighborhood B)</li>
                            <li><span className="text-red-500 font-bold">2</span> = Local delivery office</li>
                            <li><span className="text-red-500 font-bold">C3</span> = Specific street/block (e.g., Elm Street, Block 3)</li>
                            <li><span className="text-red-500 font-bold">456</span> = Apartment/Suite (e.g., Suite 456)</li>
                        </ul>
                    </div>
                </div>

                <HoverBanner padding='0px' />


            </div>
        </div>
    )
}

export default PostalLanding
