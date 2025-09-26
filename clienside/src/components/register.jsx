import React, { useState } from 'react';
import { Eye, EyeOff,Phone, Lock,Camera, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import APIURL from './path';
import { Link,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Loader from './Loader';

const Register = () => {
  const navigate=useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [imagePreviews, setImagePreviews] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    phone:"",
    profile:'',
    email: '',
    password: '',
    cpassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

  const handleRegister = async(e) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      setLoading(true);
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
      
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(previewUrl);

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          profile: reader.result 
        }));
      };
    }
  };

  return (
     <div className="min-h-screen gradient-light flex items-center justify-center px-4 py-2">
      <motion.div 
        className="glass-card w-full max-w-md p-4 sm:p-6 rounded-2xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <motion.h2 
          className="text-xl sm:text-2xl font-bold text-center mb-4 gradient-text animate-glow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Create an Account
        </motion.h2>
        
        <motion.form 
          onSubmit={handleRegister} 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="flex flex-col items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <div className="relative w-20 sm:w-24 h-20 sm:h-24">
              {/* Circular image container */}
              <motion.div 
                className="w-full h-full rounded-full overflow-hidden border-4 border-white/30 shadow-xl glass-effect animate-float"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {formData.profile ? (
                  <img 
                    src={formData.profile} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full glass-effect flex items-center justify-center">
                    <User className="w-8 sm:w-12 h-8 sm:h-12 text-gray-500" />
                  </div>
                )}
              </motion.div>
              
              {/* Camera icon / Upload button */}
              <motion.label 
                htmlFor="profile-upload" 
                className="absolute bottom-0 right-0 gradient-success rounded-full w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center cursor-pointer shadow-lg animate-bounce-soft"
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <input
                  id="profile-upload"
                  type="file"
                  name="profile"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Camera className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
              </motion.label>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative mt-1">
              <motion.div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                whileHover={{ scale: 1.1 }}
              >
                <User className="h-5 w-5 text-gray-400" />
              </motion.div>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`chat-input pl-10 block w-full rounded-xl border ${
                  errors.username ? 'border-red-500' : 'border-white/30'
                } glass-effect py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              />
              {errors.username && (
                <motion.p 
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.username}
                </motion.p>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <motion.div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                whileHover={{ scale: 1.1 }}
              >
                <Mail className="h-5 w-5 text-gray-400" />
              </motion.div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`chat-input pl-10 block w-full rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-white/30'
                } glass-effect py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              />
              {errors.email && (
                <motion.p 
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative mt-1">
              <motion.div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                whileHover={{ scale: 1.1 }}
              >
                <Phone className="h-5 w-5 text-gray-400" />
              </motion.div>
              <input
                type="tel"
                name="phone"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleInputChange}
                className="chat-input pl-10 block w-full rounded-xl border border-white/30 glass-effect py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label> 
            <div className="relative mt-1">
              <motion.div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                whileHover={{ scale: 1.1 }}
              >
                <Lock className="h-5 w-5 text-gray-400" />
              </motion.div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`chat-input pl-10 pr-10 block w-full rounded-xl border ${
                  errors.password ? 'border-red-500' : 'border-white/30'
                } glass-effect py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </motion.button>
              {errors.password && (
                <motion.p 
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <motion.div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                whileHover={{ scale: 1.1 }}
              >
                <Lock className="h-5 w-5 text-gray-400" />
              </motion.div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="cpassword"
                id="confirmPassword"
                value={formData.cpassword}
                onChange={handleInputChange}
                className={`chat-input pl-10 block w-full rounded-xl border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-white/30'
                } glass-effect py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              />
              {errors.cpassword && (
                <motion.p 
                  className="mt-1 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.cpassword}
                </motion.p>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white gradient-primary hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all animate-glow disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-purple-300/50 border-t-purple-200 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-sm text-gray-600">
            Already have an account? {' '}
            <Link to="/login" className="font-medium gradient-text hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer/>
    </div>
  );
};

export default Register