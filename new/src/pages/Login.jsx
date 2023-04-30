import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { CustomButton, FormField, Loader, Logger} from '../components';
import { ErrorCode } from '../constants';

import { useStateContext} from '../context';

const Login = ({ setStarterAddress, setBackerAddress}) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false)
  const [logger, setLogger] = useState({ on: false, error: false, message: ""});

  const [form, setForm] = useState({
    email: "",
    password: "",
    isStarter: true
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

          if(form.isStarter){
            window.sessionStorage.setItem('starterAddress', userAddress)
            window.sessionStorage.setItem('backerAddress', '')
          }else{
            window.sessionStorage.setItem('backerAddress', userAddress)
            window.sessionStorage.setItem('starterAddress', '')
          }
          
          setLogger({error: false, message: 'Login Successfully' , handleClick: function() {
            navigate('/home')
            setIsLogging(false)
          }})

        } catch(error) {
          const message = error.reason ? ErrorCode[error.reason] : error.toString()
          setLogger({error: true, message , handleClick: function() {
            setIsLogging(false)
          }})
        }
     
      setIsLoading(false);
      setIsLogging(true);
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col w-full min-h-screen h-full sm:p-10 p-4">
      {isLoading && <Loader/>}
      {isLogging && <Logger {...logger}/>}

      <div className='bg-[#13131a] px-8 py-6 rounded-[12px]'>
      <form onSubmit={handleSubmit} className="w-[300px] flex flex-col gap-[24px]">
        <h1 className='self-center text-[#1dc071] font-[700] text-[32px]'>Crowdfunding</h1>
        <div className='relative flex gap-[16px] text-[#808191] text-[18px] text-center'>
          
          <input className="hidden" type="radio" id='isStrater-Starter'  value={form.isStarter} required></input>
          <input className="hidden" type="radio" id="isStrater-Backer"  value={!form.isStarter} required></input>
          <label className={`z-10 flex-1  signup-label ${form.isStarter && 'text-black'}`} onClick={(e) => setForm({...form, ['isStarter']: true})} htmlFor='isStrater-Starter'>Starter</label>
          <label className={`z-10 flex-1 signup-label ${!form.isStarter && 'text-black'}`} onClick={(e) => setForm({...form, ['isStarter']: false})}  htmlFor='isStrater-Backer'>Backer</label>
          <div className={`z-1 absolute p-4 rounded-[24px] w-[48%] bg-[#1dc071] left-0 transition-[left] duration-700 ${!form.isStarter && 'left-[52%]'} `}></div>
        </div>

        <FormField 
            labelName="Email *"
            placeholder="Email"
            inputType="text"
            value={form.description}
            handleChange={(e) => handleFormFieldChange('email', e)}
          />
  
          <FormField 
            labelName="Password *"
            placeholder="Password"
            inputType="password"
            value={form.password}
            handleChange={(e) => handleFormFieldChange('password', e)}
          />

          <div className="flex justify-center px-[20px] items-center mt-[10px]">
            <CustomButton 
              btnType="submit"
              title="Authenticate"
              styles="bg-[#8c6dfd] min-w-[180px]"
            />
          </div>
      </form>
      <div className='flex-1 text-center pt-[10px] mt-[32px] text-[#808191] hover:text-[#1dc071] border-[#808191] border-t-[1px]'>
        <a href="/signup">Create New Account</a>
      </div>
      </div>
      
    </div>
  )
}

export default Login