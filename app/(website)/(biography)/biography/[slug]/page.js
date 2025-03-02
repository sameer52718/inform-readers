import AdBanner from '@/components/partials/AdBanner'
import HoverBanner from '@/components/partials/HoverBanner'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BiographyTable = () => {
    const specifications = [
        { label: "Brand", value: "Motorola" },
        { label: "Model", value: "65 Inch LED Ultra HD (4K) TV (65SAUHDM)" },
        { label: "Price", value: "₹57,999 (India)" },
        { label: "Model Name", value: "65SAUHDM" },
        { label: "Display Size", value: "65 inch" },
        { label: "Screen Type", value: "LED" },
        { label: "Color", value: "Black" },
        { label: "Resolution (pixels)", value: "3840×2160" },
        { label: "Resolution Standard", value: "4K" },
        { label: "3D", value: "No" },
        { label: "Smart TV", value: "Yes" },
        { label: "Curve TV", value: "No" },
        { label: "Launch Year", value: "2019" },
    ];

    return (
        <div className=" bg-white  border-black rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-gray-700">
                    <tbody>
                        {specifications.map((item, index) => (
                            <tr key={index} className="odd:bg-gray-100 even:bg-white">
                                <td className="px-4 py-2 font-medium">{item.label}</td>
                                <td className="px-4 py-2">{item.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function BiographyDetail() {
    return (
        <>
            <AdBanner />

            <section className='px-32 bg-white'>
                <div className='flex items-center gap-1 px-32 py-6'>
                    <h6>Home</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Actresses</h6>
                    <Icon icon="basil:caret-right-solid" className='mt-[2px]' width="18" height="18" />
                    <h6>Dilraba Dilmurat</h6>
                </div>
            </section>

            <section className='px-32 py-8'>
                <div className='grid grid-cols-3 mt-6 gap-2'>
                    <div className="col-span-1">
                        <div className="col-span-2 h-[340px] w-full">
                            <Image src={"/website/assets/images/specifacationCard/game/01.png"} alt='spec-image' width={1000} height={1000} className='w-full h-full object-contain' />
                        </div>
                    </div>
                    <div className="col-span-2 p-6">
                        <div className="bg-[#d9d9d9] px-4 pt-4 pb-4 border border-black rounded-xl w-full mb-4 shadow-md grid grid-cols-3 items-center">
                            <div className="col-span-3 pl-4">
                                <h2 className="text-2xl font-semibold text-center text-gray-600 underline">
                                    <Link href={"#"}>
                                        Dilraba Dilmurat
                                    </Link>
                                </h2>
                                <div className=" grid grid-cols-3 gap-2 mt-8">
                                    <div className="flex items-center col-span-1 gap-2 mb-4">
                                        <Image
                                            src={"/website/assets/images/specifacationCard/game/icon-2.png"}
                                            alt="icon"
                                            width={1000}
                                            height={1000}
                                            className="w-10 h-10"
                                        />
                                        <span className="text-gray-600 text-base ">
                                            Modes: Single-player, Multiplayer
                                        </span>
                                    </div>

                                    <div className="flex items-center col-span-1 gap-2 mb-4">
                                        <Image
                                            src={"/website/assets/images/specifacationCard/game/icon-1.png"}
                                            alt="icon"
                                            width={1000}
                                            height={1000}
                                            className="w-10 h-10"
                                        />
                                        <span className="text-gray-600 text-base ">
                                            Modes: Single-player, Multiplayer
                                        </span>
                                    </div>

                                    <div className="flex items-center col-span-1 gap-2 mb-4">
                                        <Image
                                            src={"/website/assets/images/specifacationCard/game/icon-3.png"}
                                            alt="icon"
                                            width={1000}
                                            height={1000}
                                            className="w-10 h-10"
                                        />
                                        <span className="text-gray-600 text-base ">
                                            Modes: Single-player, Multiplayer
                                        </span>
                                    </div>

                                </div>

                                <div className="border border-gray-400"> </div>
                                <div className=" grid grid-cols-3 gap-2 mt-8">
                                    <div className="flex items-center col-span-1 gap-2 mb-4">
                                        <Image
                                            src={"/website/assets/images/specifacationCard/game/icon-4.png"}
                                            alt="icon"
                                            width={1000}
                                            height={1000}
                                            className="w-10 h-10"
                                        />
                                        <span className="text-gray-600 text-base ">
                                            Modes: Single-player, Multiplayer
                                        </span>
                                    </div>
                                    <div className="flex items-center col-span-1 gap-2 mb-4">
                                        <Image
                                            src={"/website/assets/images/specifacationCard/game/icon-4.png"}
                                            alt="icon"
                                            width={1000}
                                            height={1000}
                                            className="w-10 h-10"
                                        />
                                        <span className="text-gray-600 text-base ">
                                            Modes: Single-player, Multiplayer
                                        </span>
                                    </div>
                                    <div className="flex items-center col-span-1 gap-2 mb-4">
                                        <Image
                                            src={"/website/assets/images/specifacationCard/game/icon-4.png"}
                                            alt="icon"
                                            width={1000}
                                            height={1000}
                                            className="w-10 h-10"
                                        />
                                        <span className="text-gray-600 text-base ">
                                            Modes: Single-player, Multiplayer
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section >

            <HoverBanner />

            <div className="mx-40 flex items-center justify-between bg-red-600 text-white px-2 py-3 text-sm font-bold mb-8">
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

            <div className='px-40'>
                <BiographyTable />
            </div>
            <HoverBanner />

            <div className='px-40'>
                <BiographyTable />
                <div className='mt-10'>
                    <h5 className='text-3xl font-bold mt-3'>Personal Profile About Dilraba Dilmurat: </h5>
                    <p className='mt-2 font-semibold mb-10'> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>


                    <h5 className='text-3xl font-bold mt-3  '>Personal Profile About Dilraba Dilmurat: </h5>
                    <p className='mt-2 font-semibold mb-10'> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                </div>

            </div>
            <HoverBanner />

        </>
    )
}

export default BiographyDetail
