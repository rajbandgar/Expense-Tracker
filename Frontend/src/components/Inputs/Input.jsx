import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'; // Importing icons from Font Awesome

const Input = ({ value, onChange, placeholder, type, label }) => {
  const [showPassword, setShowPassword] = useState(false); // corrected variable name

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordType = type === 'password';

  return (
    <div className='mb-4'>
      <label className='text-[13px] text-slate-800 block mb-1'>{label}</label>

      <div className='relative border px-3 py-2 rounded bg-white'>
        <input
          type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className='w-full bg-transparent outline-none'
          value={value}
          onChange={onChange}
        />
        {isPasswordType && (
          <div
            className='absolute top-1/2 right-3 transform -translate-y-1/2 text-lg text-gray-500 cursor-pointer'
            onClick={toggleShowPassword}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
