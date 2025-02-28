'use client';

import { Icon } from '@iconify/react';
import { useState } from 'react';
import FilterSlider from '../ui/FilterSlider';
import CategoryBox from './CategoryBox';
import { categories } from '@/constant/data';
// import { RotateCcw } from 'lucide-react';




export default function PriceFilter() {
  const [price, setPrice] = useState([20, 80]);

  const resetFilter = () => {
    setPrice([20, 80]);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-xl shadow-md">
      <h2 className=" font-semibold text-center bg-white rounded-md py-2 text-xl">Filters</h2>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Price Range</span>
          <button onClick={resetFilter} className="text-sm flex items-center gap-1 text-gray-500 hover:text-black">
            Resst All  <Icon icon="ix:reload" width="18" height="18" />
          </button>
        </div>
        <FilterSlider
          defaultValue={price}
          min={0}
          max={100}
          step={1}
          onValueChange={setPrice}
          className="text-red-500"
        />
      </div>

      <div className='mb-4'>
        <div className='flex items-center justify-between gap-2'>
          <h5 className='text-xl font-bold'>Brand</h5>
          <Icon icon="basil:caret-down-solid" width="35" height="35" />
        </div>
        <CategoryBox categories={categories} />
      </div>
      <div className='mb-4'>
        <div className='flex items-center justify-between gap-2'>
          <h5 className='text-xl font-bold'>Platform</h5>
          <Icon icon="basil:caret-down-solid" width="35" height="35" />
        </div>
        <CategoryBox categories={categories} />
      </div>
      <div className='mb-4'>
        <div className='flex items-center justify-between gap-2'>
          <h5 className='text-xl font-bold'>Genre</h5>
          <Icon icon="basil:caret-down-solid" width="35" height="35" />
        </div>
        <CategoryBox categories={categories} />
      </div>
      <div className='mb-4'>
        <div className='flex items-center justify-between gap-2'>
          <h5 className='text-xl font-bold'>Age Rating (PEGI)</h5>
          <Icon icon="basil:caret-down-solid" width="35" height="35" />
        </div>
        <CategoryBox categories={categories} />
      </div>
      <div className='mb-4'>
        <div className='flex items-center justify-between gap-2'>
          <h5 className='text-xl font-bold'>Market Status</h5>
          <Icon icon="basil:caret-down-solid" width="35" height="35" />
        </div>
        <CategoryBox categories={categories} />
      </div>
      <div className='mb-4'>
        <div className='flex items-center justify-between gap-2'>
          <h5 className='text-xl font-bold'>More Features</h5>
          <Icon icon="basil:caret-down-solid" width="35" height="35" />
        </div>
        <CategoryBox categories={categories} />
      </div>






    </div>
  );
}
