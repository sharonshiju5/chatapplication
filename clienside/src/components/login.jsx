import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Link,useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import axios from "axios"
import APIURL from "./path"
import { ToastContainer, toast } from 'react-toastify';
import Loader from './Loader';

// Login Component
const Login = () => {
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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



  const validateLoginForm = () => {
    const newErrors = {};

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async(e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    
    try {
      setLoading(true);
      const res=await axios.post(APIURL+"/login",formData)
      console.log(res);
      const{token,userId}=res.data
      if (res.status=200) {
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
          localStorage.setItem("token",token)
          localStorage.setItem("userId",userId)
          navigate("/")
        }, 1000);
      }
    } catch (error) {
      console.log(error);
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

  return (
    <div className="min-h-screen gradient-light flex items-center justify-center px-4">
      <motion.div 
        className="glass-card w-full max-w-md p-8 rounded-2xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <motion.h2 
          className="text-2xl font-bold text-center mb-6 gradient-text animate-glow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Login to ChatApp
        </motion.h2>
        
        <motion.form 
          onSubmit={handleLogin} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
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
                } glass-effect py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all`}
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
            transition={{ delay: 0.5 }}
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
                } glass-effect py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all`}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white gradient-primary hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all animate-glow disabled:opacity-50"
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
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <Link to="/register" className="font-medium gradient-text hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </motion.div>
      <ToastContainer/>
    </div>
  );
};
export default Login