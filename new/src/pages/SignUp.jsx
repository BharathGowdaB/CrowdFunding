import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { CustomButton, FormField, Loader, Logger, ToggleBar } from '../components';
import { ErrorCode } from '../constants';

import { useStateContext } from '../context';


const Signup = ({ setStarterAddress, setBackerAddress }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false)
  const [logger, setLogger] = useState({ on: false, error: false, message: "" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    isStarter: false
  });

  const { createUser } = useStateContext()

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleToggle = (isStarter) => {
    setForm({ ...form, isStarter });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const txn = await createUser(form);
      // await txn.wait()


      setLogger({
        error: false, message: 'Sign up Successfully', handleClick: function () {
          navigate('/login')
          setIsLogging(false)
        }
      })
    } catch (error) {
      const reason = error.reason ? error.reason : error.toString()
      const message = ErrorCode[error.reason.split(/execution reverted: /, 2)[1]] ? ErrorCode[error.reason.split(/execution reverted: /, 2)[1]] : reason.toString()
      setLogger({
        error: true, message, handleClick: function () {
          setIsLogging(false)
        }
      })
    }

    setIsLoading(false);
    setIsLogging(true);
  }

  return (

    <div className="flex justify-center items-center">
      <div className="w-[55%] h-screen">
        <img
          src="https://cdn.vectorstock.com/i/1000x1000/34/22/crowdfunding-trendy-web-concept-with-icons-vector-27973422.webp"
          alt="Background Image"
          className="w-half h-half object-cover absolute top-5 left-20 z-0"
          style={{ width: '55%', height: '100%' }} 
        />

      </div>

      <div className="w-[30%]">
        <div className="bg-gradient-to-r from-gray-200 to-blue-700 flex justify-center items-center flex-col rounded-[10px] p-4 sm:p-10">
          {isLoading && <Loader />}
          {isLogging && <Logger {...logger} />}

          <h2 className="text-2xl font-bold mb-8">Sign Up</h2>
          <ToggleBar onToggle={handleToggle} />
          <form onSubmit={handleSubmit} className="w-full mt-8 flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">

              <label className="flex items-center">
                <input
                  name="isStarter"
                  type="checkbox"
                  className="mr-2"
                  checked={form.isStarter}
                  onChange={(e) => handleFormFieldChange('isStarter', e.target.checked)}
                />
                <span className="text-[#808191]">isCharity:</span>
              </label>
            </div>
            <FormField
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              labelName="Name *"
              placeholder="Enter your name"
              inputType="text"
              value={form.name}
              handleChange={(e) => handleFormFieldChange('name', e)}
            />
        
        <FormField
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          labelName="Email *"
          placeholder="Enter your email"
          inputType="email"
          value={form.email}
          handleChange={(e) => handleFormFieldChange('email', e)}
        />
        <FormField
          labelName="Password *"
          placeholder="Enter your password"
          inputType="password"
          handleChange={(e) => handleFormFieldChange('password', e)}
        />
        <div className="flex justify-center items-center mt-6">
          <CustomButton btnType="submit" title="Sign Up" styles="bg-[#1dc071]" />
        </div>

      </form>
    </div>
        </div >
        
      </div >
    



  
);

  
}

export default Signup;