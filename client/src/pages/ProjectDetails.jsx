import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { verified, failed, inProgress,inFunding, tagType, funded} from '../assets';
import { CustomButton, FormField, Loader, Logger } from "../components";
import { ErrorCode } from "../constants";
import { daysLeft } from "../utils";

import { useStateContext } from "../context";
import CreateProject from "./CreateProject";

const ProjectDetails = ({}) => {
  const navigate = useNavigate();

  const { projectAddress } = useParams()
  const [userAddress, setUserAddress] = useState('')
  const [isStarter, setIsStarter] = useState(true)

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });

  const [projectDetails, setProjectDetails] = useState({
    title: "",
    description: "",
    amountRequired: "",
    amountRaised: "",
    state: 0,
    endTime: "",
    image: "",
    isCharity: false,
    starterId: "",
    backersCount: "",
    daysLeft: '',
    diffAmount: ''
  });
  const [fundValue, setFundValue] = useState(0)

  const { getProjectDetails,fundProject } = useStateContext();

  const fetchDetails = async() => {
      setIsLoading(true)
      
      try{
        const details = await getProjectDetails(projectAddress)
        details.daysLeft = daysLeft(details.endTime * 1000).padStart(2, '0')
        setProjectDetails(details)
      } catch(error){
            setLogger({
                error: false, 
                message: 'Project Not Found', 
                handleClick : () => {
                    navigate('/home')
                    setIsLogging(false)
                }
            })
            setIsLogging(true)
      }
      setIsLoading(false)
  }

  useEffect(() => {
      fetchDetails()
      setUserAddress(window.sessionStorage.getItem("userAddress"))
      setIsStarter(window.sessionStorage.getItem("isStarter") == "true")
  },[logger])

  const handleFundProject = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      try{
        const tnx = await fundProject(userAddress, projectAddress, ethers.utils.parseUnits('0' + fundValue, "ether"))
        await tnx.wait()
        setLogger({error: false, message: "Funded Successfully" , handleClick : function () { setIsLogging(false)} })
      } catch(error){
        const reason = error.reason ? error.reason : error.toString();
        const message = ErrorCode[reason.split(/execution reverted: /, 2)[1]]
          ? ErrorCode[reason.split(/execution reverted: /, 2)[1]]
          : reason.toString();
        setLogger({
          error: true,
          message,
          handleClick: function () {
            setIsLogging(false);
          },
        });
      }
      setIsLoading(false)
      setIsLogging(true)
  }

  return (
    <>
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} />}
        <div className={`flex-1 flex  justify-between items-center bg-[#1c1c24] rounded-[12px] w-full p-4 mb-4`}>
            <div className="flex-1">
                <div className="flex">
                    <div className="flex-1">
                        <h1 className="flex-1 font-epilogue font-semibold text-[30px] capitalize text-white text-left min-w-[150px]">{projectDetails.title}</h1>
                        <div className="flex flex-row items-center mb-[18px]">
                            <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain"/>
                            <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">{projectDetails.isCharity ? 'Charity': 'Startup'}</p>
                        </div>
                    </div>
                    {/* ProjectState: initial, inFunding, inExecution, ended, rejected, aborted */}
                    {projectDetails.state == 0 && 
                        <div className='flex text-white font-[600] text-[16px] items-center'> 
                            <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]' >Not Started</div>
                        </div>}  
                    {projectDetails.state == 1 && 
                        <div className='flex text-white font-[600] text-[16px] items-center'> 
                            <img src={inFunding} title="In FUnding State" alt="In FUnding State" className="w-[36px] h-[36px] object-contain"/> 
                            <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>In Funding State</div>
                        </div>} 
                    {projectDetails.state == 2 && 
                        <div className='flex text-white font-[600] text-[16px] items-center'> 
                            <img src={inProgress} title="In Execution State" alt="In Execution State" className="w-[32px] h-[32px] object-contain"/> 
                            <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>In Execution State</div>
                        </div>}  
                    {projectDetails.state == 3 && 
                        <div className='flex text-white font-[600] text-[16px] items-center'> 
                            <img src={verified} title="Project Ended" alt="Project Ended" className="w-[36px] h-[36px] object-contain"/> 
                            <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Project Ended</div>
                        </div>}    
                    {(projectDetails.state == 4 || projectDetails.state == 5) && 
                        <div className='flex text-white font-[600] text-[16px] items-center'> 
                            <img src={failed} title="Failed" alt="Failed" className="w-[36px] h-[36px] object-contain"/> 
                            <div className='p-[10px] pl-[8px] min-h-[36px] text-[#b2b3bd]'>Project{projectDetails.state == 4 ? ' Rejected': ' Aborted'}</div>
                        </div>}
                </div>
                
                <div className="mt-4 mb-4">
                    <p className="mt-[3px] font-epilogue font-normal text-[14px] leading-[18px] text-[#808191] ">
                    <span className=" font-semibold text-[16px] text-[#b2b3bd] leading-[22px]">{projectDetails.amountRaised + "    "}</span>
                    Raised of {projectDetails.amountRequired}</p>
                    <input className="w-full" type="range" min="0" max={projectDetails.amountRequired} value={projectDetails.amountRaised} disabled></input>
                    <div className="flex">
                        <div className="flex-1 text-[#b2b3bd]">0</div>
                        <div className="flex-1 text-right text-[#b2b3bd]">{projectDetails.amountRequired + ' ETH'}</div>
                    </div>
                </div>
                <div className="flex">
                    <h1 className="flex-1 font-epilogue font-[500] text-[12px] mt-[6px] text-[#b2b3bd] text-left grayscale">Starter Address: {projectDetails.starterId}</h1>
                    <h1 className="flex-1 font-epilogue font-[500] text-[12px] mt-[6px] text-[#b2b3bd] text-left grayscale">Project Address: {projectAddress}</h1>
               </div>  
 
            </div> 
            <div className="w-[180px] flex flex-col h-full text-center text-[#b2b3bd]">
                <div className="flex-1 flex justify-center items-center min-h-[140px]">
                    <div>
                        <h1 className="font-[700] text-[#1dc071]  text-[32px]">{projectDetails.daysLeft}</h1>
                        <h2>Days Left</h2>
                    </div>
                </div>
                <div>
                    <div className="flex w-full text-center justify-center items-center gap-2 mt-6">
                        <img src={funded} title="Verified" alt="Verified" className="rounded-[20px] w-[20px] h-[20px] object-contain"></img>
                        <div className=" ">{projectDetails.backersCount}</div>
                    </div>
                    <div className="text-[12px]">Backers Count</div>
                </div>  
            </div>
            
        </div>
        <div className="flex-1 flex flex-col  justify-between bg-[#1c1c24] rounded-[12px] w-full p-4 mb-4">
            <div className="text-[#b2b3bd] mb-[4px] text-[14px] font-600">Description: </div>
            <div className="text-[#b2b3bd]">
                {projectDetails.description}
            </div>
        </div>
        { projectDetails.state == 1 && !isStarter && <div className="flex justify-end items-center mt-[40px]">
            <form onSubmit={handleFundProject}>
                <div className="flex gap-2 ">
                    <div title="Remaining Amount">
                        { !projectDetails.isCharity && <CustomButton 
                            btnType="button"
                            title="-"
                            styles="bg-[#0000000] border-[1px] border-[#3a3a43] rounded-[8px]"
                            handleClick={(e) => setFundValue((projectDetails.amountRequired - projectDetails.amountRaised).toString())}
                        />}
                    </div>
                    
                    <FormField 
                        placeholder={`Fund value ${projectDetails.isCharity == true ? 'in' : ('<= ' + (projectDetails.amountRequired - projectDetails.amountRaised))} ETH`}
                        inputType="text"
                        value={fundValue}
                        handleChange={(e) => setFundValue(e.target.value)}
                        className='w-[100px]'
                    />
                    <CustomButton 
                        btnType="submit"
                        title="Fund Project"
                        styles="bg-[#116f41] rounded-[8px]"
                    />
                </div>
            </form>
        </div>}
    </>
    
  );
};

export default ProjectDetails;
