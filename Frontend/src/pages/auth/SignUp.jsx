import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Authlayouts from '../../components/layouts/Authlayouts';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstances';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/UserContext';
import uploadImage from '../../utils/uploadImage';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!fullName) {
      setError('Full name is required.');
      return;
    }
    // if (!profilePic) {
    //   setError('Profile picture is required.');
    //   return;
    // }

    setError('');
    let profileImageUrl = '';

    try {
      // Upload profile picture
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.url || '';
      }

      // API call to register
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong, please try again.';
      setError(message);
    }
  };

  return (
    <Authlayouts>
      <div className="lg:w-full h-auto md:h-full md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-800 mt-1 mb-6">
          Join us by entering your details below
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="••••••••"
              type="password"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button type="submit" className="btn-primary mt-4">
            Sign Up
          </button>

          <p className="text-sm text-slate-800 mt-3">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-500 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Authlayouts>
  );
};

export default SignUp;
