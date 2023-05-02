import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { tagType, thirdweb } from '../assets';
import { useStateContext } from '../context';
import { daysLeft } from '../utils';
import CustomButton from './CustomButton';

const MilestoneCard = ({ milestoneAddress , projectAddress, isStarter ,userAddress }) => {
  const navigate = useNavigate();

  const [miletstone, setMilestoneDetails] = useState({
    projectId: projectAddress,
    address: milestoneAddress,
    title: 'Project Planning',
    description: 'Gather Required information, do requirement analysis and feasibility study.',
    fundsRequired: 100,
    returnAmount: 120,
    startTime: Date.now() + 10,
    state: '0'
  })

  const { getMilestoneDetails } = useStateContext()

  const fetchDetails = async () => {
    const details = await getMilestoneDetails(milestoneAddress)
    setMilestoneDetails(details)
  }

  useEffect(() => {
    fetchDetails()
  }, [projectAddress])
  

  return (
    <div className="w-full flex rounded-[8px] bg-[#1c1c24] cursor-pointer p-4 mb-[16px]" >
        <div className='flex-1'>
          <div className="block">
            <h3 className=" text-[24px] text-white text-left">{miletstone.title}</h3>
            <p className="mt-[8px] font-epilogue font-normal text-[#808191] text-left whitespace-wrap">{miletstone.description}</p>
          </div>
          <div className='flex gap-4 text-[#808191]'>
            <div className="flex-1  mt-[20px]">
              Project Address: {miletstone.projectId}
            </div>
            <div className="flex-1  mt-[20px]">
              Milestone Address: {miletstone.address}
            </div>
          </div>
          {isStarter && <div>
            {miletstone.state == 1 && <div>
              <CustomButton 
              type ="button"
              title="Start Milestone"
              styles='bg-[#116f41] p-2  mt-[10px]'
              />
              </div>}
              {miletstone.state == 2 && <div>
              <CustomButton 
              type ="button"
              title="End Milestone"
              styles='bg-[#f92023] p-2  mt-[10px]'
              />
              </div>}
          </div>}
          {!isStarter && <div>
            <CustomButton 
              type ="button"
              title="Vote Milestone"
              styles='bg-[#116f41] p-2  mt-[10px]'
              />
            </div>}
         
        </div>
        
        <div>
          {/* MilestoneState: initial, inVoting, inExecution, rejected, ended */}
                {miletstone.state == 0 && 
                            <div className='flex text-white font-[600] text-[16px] items-center'> 
                                <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]' >Not Started</div>
                            </div>}  
                {miletstone.state == 1 && 
                            <div className='flex text-white font-[600] text-[16px] items-center'> 
                                <img src={inFunding} title="In FUnding State" alt="In FUnding State" className="w-[36px] h-[36px] object-contain"/> 
                                <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>In Voting State</div>
                            </div>} 
                {miletstone.state == 2 && 
                            <div className='flex text-white font-[600] text-[16px] items-center'> 
                                <img src={inProgress} title="In Execution State" alt="In Execution State" className="w-[32px] h-[32px] object-contain"/> 
                                <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>In Execution State</div>
                            </div>}  
                {miletstone.state == 4 && 
                            <div className='flex text-white font-[600] text-[16px] items-center'> 
                                <img src={verified} title="Milestone Ended" alt="Milestone Ended" className="w-[36px] h-[36px] object-contain"/> 
                                <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Milestone Ended</div>
                            </div>}    
                {miletstone.state == 3 &&
                            <div className='flex text-white font-[600] text-[16px] items-center'> 
                                <img src={failed} title="Failed" alt="Failed" className="w-[36px] h-[36px] object-contain"/> 
                                <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'> Rejected</div>
                            </div>}
        </div>
    </div>
  )
}

export default MilestoneCard