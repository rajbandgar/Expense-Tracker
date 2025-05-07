import React from 'react';
import card from '../../assets/images/card.png';
import { LuTrendingUpDown } from 'react-icons/lu';

const Authlayouts = ({ children }) => {
  return (
    <div className='flex'>
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>
        {children}
      </div>

      <div className='hidden md:block w-[40vw] bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5' />
        <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] right-10' />
        <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 left-5' />

        {/* Stats Info */}
        <div className='grid grid-cols-1 z-20 relative'>
          <StatsInfo 
            icon={LuTrendingUpDown} 
            label="Track your Income and Expenses"
            value="₹4,50,000"
            color="bg-purple-600"
          />
        </div>

        {/* Card Image */}
        <img
          src={card}
          alt='Card'
          className='w-64 lg:w-[90%] absolute bottom-24 shadow-lg shadow-blue-400/15'
        />
      </div>
    </div>
  );
};

export default Authlayouts;

//  StatsInfo Component
const StatsInfo = ({ icon: Icon, label, value, color }) => {
  return (
    <div className='flex flex-col gap-2 p-6 rounded-xl bg-white shadow-md w-fit'>
      <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        <Icon />
      </div>
      <h6 className='text-sm text-gray-700 font-medium'>{label}</h6>
      <span className='text-lg font-bold text-black'>{value}</span>
    </div>
  );
};
