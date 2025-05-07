import React, { useState } from 'react';
import Authlayouts from '../../components/layouts/Authlayouts';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input'; // Adjust path if needed
import {validateEmail} from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstances';
import { API_PATHS } from '../../utils/apiPaths';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext'; // Adjust path if needed

// ✅ Email validation function
// const validateEmail = (email) => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return regex.test(email);
// };

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid Email Address');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    setError('');
    // Proceed with login logic
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      } )
      const { token ,user } = response.data;

      if(token){
        localStorage.setItem("token", token )
        updateUser(user)
        navigate("/dashboard")
      }
    }catch(error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message)

      }else{
        setError("Something went wrong,please try again")
      }
      
      

    }
  };

  return (
    <Authlayouts>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label='Email Address'
            placeholder='john@example.com'
            type='text'
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label='Password'
            placeholder='••••••••'
            type='password'
          />

          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

          <button
            type='submit'
            className='btn-primary'
          >
            Login
          </button>
          
          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{' '}
            <Link
              className='font-medium text-purple-500 underline'
              to='/SignUp'
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </Authlayouts>
  );
};

export default Login;
