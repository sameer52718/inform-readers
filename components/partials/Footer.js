import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Footer() {
    return (
        <footer className="bg-gray-100 text-white border-t border-black">
      <div className='grid grid-cols-1 md:grid-cols-2 border-b-4 border-black px-6 md:px-20 lg:px-40 items-center py-8 gap-6'>
        <div>
          <Image
            src="/website/assets/images/logo/logo.png"
            width={1000}
            height={1000}
            alt="Logo"
            className='w-[70%] h-auto mx-auto md:mx-0'
          />
        </div>

        <div className='text-black'>
          <ul className='flex flex-wrap justify-center md:justify-between border-b border-black pb-2.5 font-bold text-lg gap-4 md:gap-2'>
            <li><Link href="#">Entertainment</Link></li>
            <li><Link href="#">Celebrity</Link></li>
            <li><Link href="#">Lifestyle</Link></li>
            <li><Link href="#">Drama</Link></li>
            <li><Link href="#">Technology</Link></li>
            <li><Link href="#">Health</Link></li>
          </ul>
          <ul className='flex flex-wrap justify-center md:justify-end gap-4 mt-3'>
            <li><Link href="#">About</Link></li>
            <li><Link href="#">Contact</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Newsletter</Link></li>
          </ul>
        </div>
      </div>
      
      <div className='px-6 md:px-20 lg:px-40 mt-10'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-900">
          <div>
            <h3 className="text-2xl font-semibold">About us</h3>
            <p className="text-sm mt-2">
              Each template in our ever-growing studio library can be added and moved around within any page effortlessly with one click.
            </p>
            <div className="flex space-x-3  mt-4 ">
              <a href="#" target='_blank' className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white text-2xl">
                <Icon icon="ri:instagram-fill" />
              </a>
              <a href="#" target='_blank' className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl">
                <Icon icon="ri:facebook-fill" />
              </a>
              <a href="#" target='_blank' className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white text-2xl">
                <Icon icon="ri:youtube-fill" />
              </a>
              <a href="#" target='_blank' className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl">
                <Icon icon="ri:linkedin-fill" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Latest Articles</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="#" className="font-semibold">Creative Writing as a Therapeutic Tool</Link> <br /><span className="text-gray-500">LifeStyle September 13, 2023</span></li>
              <li><Link href="#" className="font-semibold">Traveling the World on a Small Budget</Link> <br /><span className="text-gray-500">LifeStyle September 13, 2023</span></li>
              <li><Link href="#" className="font-semibold">The Benefit of Outdoor Activities</Link> <br /><span className="text-gray-500">LifeStyle September 13, 2023</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Most Popular</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link href="#" className="font-semibold">10 Scandalous Love Triangles Captivating the Public</Link> <br /><span className="text-gray-500">Scandals September 13, 2023</span></li>
              <li><Link href="#" className="font-semibold">The Ethical Dilemmas of Reality TV Production</Link> <br /><span className="text-gray-500">Drama September 13, 2023</span></li>
              <li><Link href="#" className="font-semibold">Debunking Movie Myths: What Hollywood Gets Wrong</Link> <br /><span className="text-gray-500">Celebrity September 13, 2023</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">Subscribe</h3>
            <input type="email" placeholder="Email address" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            <button className="w-full mt-3 bg-red-600 text-white py-2 font-semibold rounded">I WANT IN</button>
            <div className="mt-2 flex items-start space-x-2 text-sm">
              <input type="checkbox" className="mt-1" />
              <span>
                I've read and accept the <Link href="#" className="text-red-500">Privacy Policy</Link>.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 py-4 text-center text-lg font-bold text-gray-700">
        &copy; informreader. All Rights Reserved. Made by Kamran.
      </div>
    </footer>
    )
}

export default Footer
