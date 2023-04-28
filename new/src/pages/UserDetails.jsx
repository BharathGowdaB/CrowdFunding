import React, { useState, useEffect } from 'react'
import { useParams, useNavigate} from 'react-router-dom'

import { ethers } from 'ethers';

import { verified, failed, inProgress} from '../assets';
import { DisplayProjects, Loader, Logger } from '../components';
import { useStateContext} from '../context';

const UserDetails = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isLogging, setIsLogging] = useState(false)
    const [logger, setLogger] = useState({ on: false, error: false, message: ""});

    const { getUserProjects, getUserDetails, checkStarterVerified } = useStateContext()

    const [projectList, setProjectList] = useState([]);
    const [projectCount, setProjectCount] = useState(0);
    const [userDetails, setUserDetails] = useState({
        name: '',
        verified: 0,
        email: ''
    })

    const { userAddress } = useParams()

    const fetchProjectList = async () => {
        const [list, count] = await getUserProjects(userAddress);
        setProjectCount(parseInt(count));
        setProjectList(list)
        document.getElementById('searchAddress').value = ''
    }

    const fetchStarterDetails = async () => {
        try{
            await fetchProjectList();
            const details = await getUserDetails(userAddress)
            const verificationState = await checkStarterVerified(userAddress)
    
            setUserDetails({
                name: details[0],
                email: details[1],
                verified: verificationState
            })
        } catch(error){
            setLogger({
                error: false, 
                message: 'Please Enter a valid User Address', 
                handleClick : () => {
                    navigate('/')
                    setIsLogging(false)
                }
            })
            setIsLogging(true)
        }
    }


    useEffect(() => {
        setIsLoading(true);
        if(!ethers.utils.isAddress(userAddress)) {
            setLogger({
                error: false, 
                message: 'Please Enter a valid User Address', 
                handleClick : () => {
                    navigate('/')
                    setIsLogging(false)
                }
            })
            setIsLogging(true)
        } else{
            fetchStarterDetails()
        }
        setIsLoading(false)
    }, [userAddress])


  return (
    <>
        {isLoading && <Loader/>}
        {isLogging && <Logger {...logger}/>}
        <div className="flex-1 flex  justify-between items-center bg-[#1c1c24] rounded-[12px] w-full p-4 mt-8 mb-4"> 
            <div>
                <h1 className="flex-1 font-epilogue font-semibold text-[30px] capitalize text-white text-left min-w-[150px]">{userDetails.name}</h1>
                <h1 className="flex-1 font-epilogue font-[700] text-[16px] italic text-[#b2b3bd] text-left grayscale">{userDetails.email}</h1>
            </div>
            {userDetails.verified == 0 && 
                <div className='flex text-white font-[600] text-[16px] items-center'> 
                    <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]' >Not Verified</div>
                </div>}  
            {userDetails.verified == 1 && 
                <div className='flex text-white font-[600] text-[16px] items-center'> 
                    <img src={inProgress} title="Verification InProgress" alt="Verification InProgress" className="w-[36px] h-[36px] object-contain"/> 
                    <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Verifying</div>
                </div>} 
            {userDetails.verified == 2 && 
                <div className='flex text-white font-[600] text-[16px] items-center'> 
                    <img src={failed} title="Verification Failed" alt="Verification Failed" className="w-[32px] h-[32px] object-contain"/> 
                    <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Verification Failed</div>
                </div>}  
            {userDetails.verified == 3 && 
                <div className='flex text-white font-[600] text-[16px] items-center'> 
                    <img src={verified} title="Verified" alt="Verified" className="w-[36px] h-[36px] object-contain"/> 
                    <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Verified</div>
                </div>}    
        </div>
        <DisplayProjects
            title = {"User Projects"} 
            total = {projectCount}
            isLoading = {isLoading}
            projectList = {projectList}
            emptyMessage = {'User has zero projects'}
        />
    </>
    
  )
}

export default UserDetails