import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { CustomButton, FormField, Loader, Logger} from '../components';
import { ErrorCode } from '../constants';

import { useStateContext} from '../context';

const Login = ({ setStarterAddress, setBackerAddress}) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false)
  const [logger, setLogger] = useState({ on: false, error: false, message: ""});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    isStarter: false
  });

  const { authenticatUser } = useStateContext()

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
        try {
          const userAddress = await authenticatUser(form);
          // await txn.wait()
          if(form.isStarter){
            setStarterAddress(userAddress)
            setBackerAddress('')
          }else{
            setBackerAddress(userAddress)
            setStarterAddress('')
          }
          
          setLogger({error: false, message: 'Login Successfully' , handleClick: function() {
            navigate('/')
            setIsLogging(false)
          }})
        } catch(error) {
          const reason = error.reason ? error.reason : error.toString()
          const message = ErrorCode[error.reason.split(/execution reverted: /, 2)[1]] ? ErrorCode[error.reason.split(/execution reverted: /, 2)[1]] : reason.toString()
          setLogger({error: true, message , handleClick: function() {
            setIsLogging(false)
          }})
        }
     
      setIsLoading(false);
      setIsLogging(true);
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader/>}
      {isLogging && <Logger {...logger}/>}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">

          <label className="flex w-fit flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">&nbsp;</span>
            <div className='w-fit flex align-center font-[700]'>
              <input 
                name={'isStarter'}
                onClick={(e) => setForm({ ...form, ['isStarter']: e.target.checked })}
                type={"checkbox"}
                step="0.1"
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px]"
              />
              <label className='text-[#808191] p-[12px]'>isCharity: </label>
            </div>
            
          </label>
          
        </div>

        <FormField 
            labelName="Email *"
            placeholder="Email"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('email', e)}
          />


        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="password*"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.password}
            handleChange={(e) => handleFormFieldChange('password', e)}
          />

        </div>

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Submit new project"
              styles="bg-[#1dc071]"
            />
          </div>
      </form>
    </div>
  )
}

export default Login