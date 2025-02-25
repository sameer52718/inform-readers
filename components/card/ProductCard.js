import Image from 'next/image'
import React from 'react'

function ProductCard() {
    return (
        <div className='border rounded-lg p-4 bg-white'>

            <div className='flex items-center justify-center flex-col'>
                <Image src={'/website/assets/images/product/01.png'} width={1000} height={1000} alt="product" className='w-20 h-32'  />
                <h4>Redmi Xiomi 13c</h4>
            </div>
            <div className="divider h-[1px] w-full bg-black"></div>
            <div className='py-2 px-2 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Image src={'/website/assets/images/icons/heart.png'} width={1000} height={1000} alt="product" className='w-5 h-auto' />
                    <Image src={'/website/assets/images/icons/share.png'} width={1000} height={1000} alt="product" className='w-5 h-auto' />
                </div>
                <div>
                    <h6 className='text-[#ff0000]'>
                    $1000
                    </h6>
                </div>
            </div>

        </div>
    )
}

export default ProductCard
