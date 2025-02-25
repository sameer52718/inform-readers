import React from 'react'

function CategorySection({ category }) {
    return (
        <section className='px-32 py-10'>
            <div className='grid md:grid-cols-6 grid-cols-2 gap-4 px-8 '>
                {
                    category.slice(0, 6).map((cate, index) => (
                        <div key={index} className="col-span-1  flex items-center justify-center flex-col">
                            <div className='h-20 w-20 border-[1px] border-black rounded-lg mb-3'>
                                <img src={cate.image} alt={cate.name} className='h-full w-full object-contain' />
                            </div>
                            <h3 className='font-semibold'>{cate.name}</h3>
                        </div>
                    ))
                }
            </div>

            <div className=' bg-[#d9d9d9] mt-10 w-full h-2 mx-8'>
                <div className='w-40 h-full bg-[#FF0000] '></div>
            </div>
        </section>
    )
}

export default CategorySection
