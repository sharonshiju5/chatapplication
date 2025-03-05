import React, { useState } from 'react';
import { Eye, EyeOff,Phone, Lock, Mail, User } from 'lucide-react';
import axios from 'axios';
import APIURL from './path';
import { Link,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
  const navigate=useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone:"",
    profile:[],
    email: '',
    password: '',
    cpassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.cpassword) {
      newErrors.cpassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async(e) => {
    e.preventDefault();
    console.log(formData);
    
    try {

      const res=await axios.post(APIURL+"/adduser",formData)
      console.log(res);
      if (res.status=201) {
        const{msg}=res.data
        toast.success(msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
          setTimeout(() => {
            navigate("/login")
          }, 1000);
      }
      
    } catch (error) {
      // console.log(error);
      const errorMsg = error.response.data.msg || 'An unexpected error occurred';
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);

    const imageUrls = [];
    files.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = () => {
            imageUrls.push(reader.result);
            setFormData(prev => ({ ...prev, profile: [...prev.profile, reader.result] }));
        };
    });
};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label  className="block text-sm font-medium text-gray-700">
                profile
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* <Phone className="h-5 w-5 text-gray-400" /> */}
                </div>
                <input
                  type="file"
                  name="profile"
                  placeholder="+1 234 567 8900"
                  onChange={handleImageUpload}
                  className={`pl-10 block w-full rounded-md border shadow-sm py-2 focus:border-indigo-500 focus:ring-indigo-500`}
                />

            </div>
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`pl-10 block w-full rounded-md border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } shadow-sm py-2 focus:border-indigo-500 focus:ring-indigo-500`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`pl-10 block w-full rounded-md border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } shadow-sm py-2 focus:border-indigo-500 focus:ring-indigo-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
          <div>
          <label  className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleInputChange}
              className={`pl-10 block w-full rounded-md border shadow-sm py-2 focus:border-indigo-500 focus:ring-indigo-500`}
            />
            
          </div>
        </div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-10 block w-full rounded-md border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } shadow-sm py-2 focus:border-indigo-500 focus:ring-indigo-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="cpassword"
                id="confirmPassword"
                value={formData.cpassword}
                onChange={handleInputChange}
                className={`pl-10 block w-full rounded-md border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } shadow-sm py-2 focus:border-indigo-500 focus:ring-indigo-500`}
              />
              {errors.cpassword && (
                <p className="mt-1 text-sm text-red-500">{errors.cpassword}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? {' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </p>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Register 
