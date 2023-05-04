import React, { useState, useEffect } from 'react'

import { verified, failed, inProgress} from '../assets';
import { CustomButton, DisplayProjects, Loader, Logger , FormField} from '../components';
import { useStateContext} from '../context';
import { useNavigate } from 'react-router-dom';

const Profile = ( { isStarter, userAddress}) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isLogging, setIsLogging] = useState(false)
    const [logger, setLogger] = useState({ on: false, error: false, message: ""});

    const [projectList, setProjectList] = useState([]);
    const [projectCount, setProjectCount] = useState(0);
    const [isVerificationForm , setIsVerificationForm] = useState(false)
    
    const [userDetails, setUserDetails] = useState({
      name: '',
      verified: 0,
      email: ''
    })
    
    const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
      panNumber: ''
    })

    const { getUserProjects ,getUserDetails, checkStarterVerified, applyForVerification, processTransactionError} = useStateContext()

    const handleFormFieldChange = (fieldName, e) => {
      setForm({ ...form, [fieldName]: e.target.value })
    }

    const handleSubmit = async (e) => {
      setIsLoading(true)
      try {
        e.preventDefault();
        await applyForVerification(form)
        setIsVerificationForm(false)
        setLogger({error: false, message: 'Successfully Applied for Verification, check back after some time.' , handleClick: function() {
          setIsLogging(false)
        }})
      } catch(error) {
        const { message } = processTransactionError(error)
        setLogger({error: true, message , handleClick: function() {
          setIsLogging(false)
        }})
      }
      setIsLogging(true)
      setIsLoading(false)
    }

    const fetchProjectList = async () => {
        setIsLoading(true);

        const [list, count] = await getUserProjects(userAddress);
        setProjectCount(parseInt(count));
        setProjectList(list);

        setIsLoading(false);
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      try{
          if(!userAddress) return
          await fetchProjectList();
          const details = await getUserDetails(userAddress)
          const verificationState = await checkStarterVerified(userAddress)
  
          setUserDetails({
              name: details[0],
              email: details[1],
              verified: verificationState
          })
      } catch(error){
          const { message } = processTransactionError(error)
          setLogger({error: false,  message, handleClick : () => {
                  navigate('/home')
                  setIsLogging(false)
              }
          })
          setIsLogging(true)
      }
      setIsLoading(false);
    }

    useEffect(() => {
      if(userAddress) fetchDetails()
      else {
        userAddress = window.sessionStorage.getItem("userAddress")
        isStarter = (window.sessionStorage.getItem("isStarter") == "true")
        if(!( userAddress )) navigate('/login')
      }
    },[userAddress])

    
  return (
    <>
        {isLoading && <Loader/>}
        {isLogging && <Logger {...logger}/>}
        <div className="flex-1 flex  justify-between items-center bg-[#1c1c24] rounded-[12px] w-full p-4 mt-8 mb-4"> 
            <div>
                <h1 className="flex-1 font-epilogue font-semibold text-[30px] capitalize text-white text-left min-w-[150px]">{userDetails.name}</h1>
                <h1 className="flex-1 font-epilogue font-[700] text-[16px] mt-[8px] text-[#b2b3bd] text-left grayscale">Email: {userDetails.email}</h1>
                <h1 className="flex-1 font-epilogue font-[400] text-[12px] mt-[4px] text-[#b2b3bd] text-left grayscale">Address: {userAddress}</h1>
            </div>
            <div className='relative'>
  
              {userDetails.verified == 0 && 
                  <div className='flex text-white font-[600] text-[16px] items-center'> 
                      <label htmlFor="start-verification" className='cursor-pointer p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]' >Not Verified</label>
                  </div>}  
              {userDetails.verified == 1 && 
                  <div className='flex text-white font-[600] text-[16px] items-center'> 
                      <img src={inProgress} title="Verification InProgress" alt="Verification InProgress" className="w-[36px] h-[36px] object-contain"/> 
                      <label htmlFor="start-verification" className='cursor-pointer p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Verifying</label>
                  </div>} 
              {userDetails.verified == 2 && 
                  <div className='flex text-white font-[600] text-[16px] items-center'> 
                      <img src={failed} title="Verification Failed" alt="Verification Failed" className="w-[32px] h-[32px] object-contain"/> 
                      <label htmlFor="start-verification" className='cursor-pointer p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Verification Failed</label>
                  </div>}  
              {userDetails.verified == 3 && 
                  <div className='flex text-white font-[600] text-[16px] items-center'> 
                      <img src={verified} title="Verified" alt="Verified" className="w-[36px] h-[36px] object-contain"/> 
                      <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Verified</div>
                  </div>}
              
              <input type='checkbox' className='hidden' onChange={(e) => setIsVerificationForm(e.target.checked)} id='start-verification' name="start-verification form"/>
              {userDetails.verified != 3 &&  <label htmlFor='start-verification' className=' cursor-pointer text-[#b2b3bd] text-[12px]'>click for verification</label>}
              {
                isVerificationForm && 
                  <div className='absolute right-0 p-4 bg-[#1c1c24] border-2 border-[#2c2f32] text-white'>
                    <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-6'>
                      <FormField 
                        labelName="Name *"
                        placeholder="Name"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => handleFormFieldChange('name', e)}
                      />
                      <FormField 
                        labelName="Email *"
                        placeholder="Email"
                        inputType="text"
                        value={form.email}
                        handleChange={(e) => handleFormFieldChange('email', e)}
                      />
                      <FormField 
                        labelName="Password *"
                        placeholder="Password"
                        inputType="password"
                        value={form.password}
                        handleChange={(e) => handleFormFieldChange('password', e)}
                      />
                      <FormField 
                        labelName="Pan Number *"
                        placeholder="Pan number"
                        inputType="text"
                        value={form.panNumber}
                        handleChange={(e) => handleFormFieldChange('panNumber', e)}
                      />
                      <div className="flex justify-center items-center mt-[4px]">
                        <CustomButton 
                          btnType="submit"
                          title="Submit for Verification"
                          styles="bg-[#8c6dfd]"
                        />
                      </div>
                    </form>
                  </div>
              }
            </div>
                
        </div>
        <DisplayProjects
            title = {"My Projects"} 
            total = {projectCount}
            isLoading = {isLoading}
            projectList = {projectList}
            clickURL = 'project'
        />
    </>
    
  )
}

export default Profile