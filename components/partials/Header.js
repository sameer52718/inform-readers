import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function Header() {

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleOpen = (id) => {
        const element = document.getElementById(id);
        element.classList.toggle("hidden");
    };

    const links = [
        {
            id: 1,
            title: "Mobiles",
            url: "/",
        },
        {
            id: 2,
            title: "Laptops",
            url: "/",
        },
        {
            id: 3,
            title: "Tv",
            url: "/",
        },
        {
            id: 4,
            title: "Tablets",
            url: "/",
        },
        {
            id: 5,
            title: "Smart Watches",
            url: "/",
        },
        {
            id: 6,
            title: "Games",
            url: "/",
        },
        {
            id: 7,
            title: "Headphone",
            url: "/",
        },
        {
            id: 8,
            title: "Speakers",
            url: "/",
        },
        {
            id: 9,
            title: "Cameras",
            url: "/",
        },
        {
            id: 10,
            title: "Printers",
            url: "/",
        },
        {
            id: 11,
            title: "More",
            url: "/",
            sublinks: [
                {
                    id: 1,
                    title: "Mobiles",
                    url: "/",
                },
                {
                    id: 2,
                    title: "Laptops",
                    url: "/",
                }
            ]
        },
    ]

    return (
        <header className="  text-white text-center ">
            <div className="flex sm:flex-row flex-col items-center justify-between bg-gray-100 md:px-16 sm:px-10 py-3">
                <div>
                    <h6 className="text-black">{currentDate}</h6>
                </div>
                <div className="flex items-center gap-3 text-black">
                    <button>
                        <Link href={"/"}>About</Link>
                    </button>
                    <button>
                        <Link href={"/"}>Contact</Link>
                    </button>
                    <button className="px-4 py-2">
                        <Link href={"/"} className="text-xl text-outline">
                            My account
                        </Link>
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-center border-gray-300 border-[2px]">
                <Link href="/" >
                    <Image src="/website/assets/images/logo/logo.png" alt="Vercel Logo" width={2000} height={2000} className="md:w-[490px] w-[400px] h-auto p-4" />

                </Link>
            </div>
            <div className='border-b-2 border-black'>
                <ul className='flex flex-wrap items-center justify-around px-14  py-3'>
                    {
                        links.map((link) => (
                            <li key={link.id} className='text-black relative text-lg cursor-pointer ' >
                                <Link href={link.url} className='flex items-center'>
                                    {link.title}
                                    {link.sublinks && (
                                        <Image src="/website/assets/images/icons/caret-down.png" alt="Vercel Logo" width={2000} height={2000} className="w-[20px] h-[20px] mt-1" />
                                    )}
                                </Link>
                                {/* {link.sublinks && (
                                    <ul className="absolute top-8 right-0 bg-white text-black border">
                                        {link.sublinks.map((sublink) => (
                                            <li key={sublink.id} className='px-8 border-b-[1px] py-2 hover:bg-gray-100 text-sm'>
                                                <Link href={sublink.url}>{sublink.title}</Link>
                                                
                                            </li>
                                        ))}
                                    </ul>
                                )} */}
                            </li>
                        ))
                    }

                </ul>
            </div>
        </header>
    )
}

export default Header
