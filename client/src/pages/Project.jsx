import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { verified, failed, inProgress,inFunding, tagType, funded} from '../assets';
import { CustomButton, FormField, Loader, Logger , MilestoneCard} from "../components";
import { ErrorCode } from "../constants";
import { daysLeft } from "../utils";

import { useStateContext } from "../context";

const Project = ({isStarter, userAddress}) => {
  const navigate = useNavigate();

  const {projectAddress: temparamAddress} = useParams()
  const paramAddress = temparamAddress == '0' ? undefined : temparamAddress;

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

  const [projectList, setProjectList] = useState([]);
  const [logMessageList, setLogMessageList] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [projectAddress, setProjectAddress] = useState(paramAddress)
  const [isAddMilestone, setIsAddMilestone] = useState(false)
  const [fundValue, setFundValue] = useState(0)
  const [logMessage, setLogMessage] = useState('')

  const { addLogMessage, getLogMessage ,getProjectDetails ,getUserProjects,getProjectMilestone, addNewMilestone,releaseFunds, startProject, fundProject, abortProject, refundBackerFunds} = useStateContext();

  const [form, setForm] = useState({
    title: '',
    description: '',
    fundsRequired: '',
    returnAmount: ''
  })

  const handleLogMessage  = async(e) => {
      e.preventDefault()
      setIsLoading(true)
    try{
        const tnx = await addLogMessage(userAddress, isStarter, projectAddress,logMessage)
        await tnx.wait()

        setLogger({
            error: false,
            message: "Message Logged",
            handleClick: function () {
              setIsLogging(false);
            },
          });
    } catch (error) {
        const reason = error.reason ? error.reason : error.toString();
        const message = ErrorCode[reason.split(/execution reverted: /, 2)[1]]? ErrorCode[reason.split(/execution reverted: /, 2)[1]]: reason.toString();
        setLogger({
            error: true,
            message,
            handleClick: function () {
                navigate('/project/'+projectAddress)
              setIsLogging(false);
            },
        });
        setIsLogging(true)
    }
    setIsLoading(false)
  }

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setIsLoading(true)
    try{
        console.log(form)
        const tnx = await addNewMilestone(projectAddress,{
            ...form,
            ['fundsRequired'] : ethers.utils.parseUnits(form.fundsRequired, 18),
            ['returnAmount'] : ethers.utils.parseUnits(form.returnAmount, 18)
        })

        await tnx.wait()
        setLogger({
            error: false,
            message: "Milestone Created Successfully",
            handleClick: function () {
                setIsAddMilestone(false)
              setIsLogging(false);
            },
          });
    } catch (error) {
        console.log(error)
        const reason = error.reason ? error.reason : error.toString();
        const message = ErrorCode[reason.split(/execution reverted: /, 2)[1]]? ErrorCode[reason.split(/execution reverted: /, 2)[1]]: reason.toString();
        setLogger({
            error: true,
            message,
            handleClick: function () {
                navigate('/project/'+ projectAddress)
              setIsLogging(false);
            },
        });
        setIsLogging(true)
    }
    setIsLoading(false)
  }

  const handleStartProject = async () => {
    setIsLoading(true)
    try{
        let tnx , message;
        if(projectDetails.isCharity) {
             tnx =  await releaseFunds(projectAddress)
             message = 'Funds Released'
        }
        else{
            tnx = await startProject(projectAddress)
            message = "Project Started: In Execution"
        }
        
        await tnx.wait()
        setLogger({
            error: false,
            message,
            handleClick: function () {
              setIsLogging(false);
            },
          });
    } catch (error) {
        console.log(error)
        const reason = error.reason ? error.reason : error.toString();
        const message = ErrorCode[reason.split(/execution reverted: /, 2)[1]]? ErrorCode[reason.split(/execution reverted: /, 2)[1]]: reason.toString();
        setLogger({
            error: true,
            message,
            handleClick: function () {
              setIsLogging(false);
            },
        });
        setIsLogging(true)
    }
    setIsLoading(false)
  }

  const handleAbortProject = async () => {
    setIsLoading(true)
    try{
        const tnx = await abortProject(projectAddress)
        const message = "Project Aborted"
        
        await tnx.wait()
        setLogger({
            error: false,
            message,
            handleClick: function () {
              setIsLogging(false);
            },
          });
    } catch (error) {
        const reason = error.reason ? error.reason : error.toString();
        const message = ErrorCode[reason.split(/execution reverted: /, 2)[1]] ? ErrorCode[reason.split(/execution reverted: /, 2)[1]]: reason.toString();
        setLogger({
            error: true,
            message: message,
            handleClick: function () {
              setIsLogging(false);
            },
        });
        setIsLogging(true)
    }
    setIsLoading(false)
  }

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

  const handleRefundFunds = async () => {
    setIsLoading(true)
    try{
        const tnx = await refundBackerFunds(userAddress, projectAddress)
        await tnx.wait()
        const message = "Funds Refunded Successfully"
        
        setLogger({
            error: false,
            message,
            handleClick: function () {
              setIsLogging(false);
            },
          });
    } catch (error) {
        const reason = error.reason ? error.reason : error.toString();
        const message = ErrorCode[reason.split(/execution reverted: /, 2)[1]] ? ErrorCode[reason.split(/execution reverted: /, 2)[1]]: reason.toString();
        setLogger({
            error: true,
            message: message,
            handleClick: function () {
              setIsLogging(false);
            },
        });
        
    }
    setIsLogging(true)
    setIsLoading(false)
  }

  const fetchLogMessages = async() => {
    setIsLoading(true);
    const [list, count] = await getLogMessage(projectAddress);
    setLogMessageList(list);
    setIsLoading(false);
  }

  const fetchProjectList = async () => {
    setIsLoading(true);
    const [list, count] = await getUserProjects(userAddress);
    setProjectCount(parseInt(count));
    setProjectList(list);
    if(paramAddress) setProjectAddress(paramAddress)
    else setProjectAddress(list[0])
    setIsLoading(false);
  }



  const fetchDetails = async() => {
      setIsLoading(true)
      try{
        await fetchProjectList()
      } catch(error){
        console.log(error)
      }
      setIsLoading(false)
  }

  const fetchProject = async () => {
    setIsLoading(true)
      try{
        const details = await getProjectDetails(projectAddress)
        details.daysLeft = daysLeft(details.endTime * 1000).padStart(2, '0')
        setProjectDetails(details)
      } catch(error){
        console.log(error)
      }
      setIsLoading(false)
  }

  useEffect(() => {
    fetchLogMessages()
  },[logger])

  useEffect(() => {
      if(userAddress){
        fetchDetails()
        fetchLogMessages()
      }
        
  }, [userAddress])

  useEffect(() => {
      if(projectAddress)
        fetchProject()
    },[projectAddress, logger])

  return (
    <>
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} />}
        { projectList.length == 0 && !paramAddress && <div className={`flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[12px] w-full p-4 mb-4 text-white`}> No Projects</div>}
        { (projectList.length > 0 || paramAddress) && <><div className={`flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[12px] w-full p-4 mb-4`}>
            <div className=" w-full pb-2">
                <select onChange={(e) => setProjectAddress(e.target.value)} id='projectList' className="bg-[#1c1c24] text-[#b2b3bd]  p-1 outline-0 rounded-[8px]">
                    {projectList.map(address =>( <option className="p-1" key={address} value={address}>{address}</option>))}
                </select>
                
            </div>
            <div className="flex flex-1 w-full">
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
            
        </div>
        <div className="flex-1 flex flex-col  justify-between bg-[#1c1c24] rounded-[12px] w-full p-4 mb-4">
            <div className="text-[#b2b3bd] mb-[4px] text-[14px] font-600">Description: </div>
            <div className="text-[#b2b3bd]">
                {projectDetails.description}
            </div>
        </div>
        { projectDetails.state == 1 && isStarter && <div className="flex gap-4 mb-2">
            <CustomButton 
                btnType="button"
                title={ projectDetails.isCharity ? 'Release Funds' :"Start Project"}
                styles="bg-[#116f41] hover:bg-[#1ec775] rounded-[8px]"
                handleClick={handleStartProject}
            />
            <CustomButton 
                btnType="button"
                title={"Abort Project"}
                styles="bg-[#df060a] hover:bg-[#f92023] rounded-[8px]"
                handleClick={handleAbortProject}
            />
        </div>}
        { projectDetails.state == 1 && !isStarter && <div className="flex gap-4 mb-2">
                <CustomButton 
                btnType="button"
                title={ 'Refund Funds'}
                styles="bg-[#df060a] hover:bg-[#f92023] rounded-[8px]"
                handleClick={handleRefundFunds}
                />
            <div className="flex justify-end items-center flex-1">
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
            </div>
            </div>}
        { !projectDetails.isCharity && projectDetails.state == 2 && <div className="flex-1 flex flex-col  justify-between bg-[#1c1c24] rounded-[12px] w-full p-4 mb-4">
            <div className="text-[#b2b3bd] mb-[4px] text-[14px] font-600">Milestones: </div>
            <div className="flex gap-4">
            {projectDetails.starterId == userAddress &&  <div className="flex flex-col">
                <input type='checkbox' className='hidden' onChange={(e) => setIsAddMilestone(e.target.checked)} id='add-milestone' name="add-milestone-form"/>
                <label htmlFor="add-milestone" className="font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] block mt-[12px] w-fit border-[1px] border-[#8c6dfd] rounded-[4px] p-3 text-[#8c6dfd]">Add Milestone</label>
                { isAddMilestone && 
                <>
                    <div className="fixed w-full h-full flex z-20 top-0 right-0 justify-center items-center">
                    
                        <form onSubmit={handleSubmit} className='flex flex-col h-fit justify-center min-w-[50%] gap-6 p-8 rounded-[4px] bg-[#1c1c24] border-2 border-[#2c2f32] text-white'>
                        <div className="flex justify-center items-center p-[12px] sm:min-w-[300px] bg-[#3a3a43] rounded-[10px]">
                            <h1 className="font-epilogue font-bold sm:text-[22px] text-[16px] leading-[38px] text-white">
                            Start New Milestone
                            </h1>
                        </div>
                        <FormField 
                            labelName="Title *"
                            placeholder="Title"
                            inputType="text"
                            value={form.title}
                            handleChange={(e) => handleFormFieldChange('title', e)}
                        />
                        <FormField 
                            labelName="Description *"
                            placeholder="Description"
                            inputType="text"
                            isTextArea={true}
                            value={form.description}
                            handleChange={(e) => handleFormFieldChange('description', e)}
                        />
                        <FormField 
                            labelName="Funds Required *"
                            placeholder="Funds Required in ETH"
                            inputType="text"
                            value={form.fundsRequired}
                            handleChange={(e) => handleFormFieldChange('fundsRequired', e)}
                        />
                        <FormField 
                            labelName="Return Amount *"
                            placeholder="Return Amount in ETH"
                            inputType="text"
                            value={form.returnAmount}
                            handleChange={(e) => handleFormFieldChange('returnAmount', e)}
                        />
                        <div className="relative flex justify-center items-center mt-[4px]">
                            <CustomButton 
                            btnType="submit"
                            title="Submit new Milestone"
                            styles="bg-[#8c6dfd] cursor-pointer"
                            />
                        
                        <label htmlFor="add-milestone" className="absolute right-[10px] cursor-pointer hover:text-[#ff0000]">Cancel</label>
                        </div>
                        </form>
                        
                    </div>
                    <div className="fixed w-screen h-screen blur-sm top-0 bg-[#808191] left-0 z-10 opacity-80 blur-sm">
                    </div>
                    </>}
            </div>}
            <div>
                <CustomButton
                type="button"
                title={ isStarter? 'Update Milestone': 'Get Milestones'}
                handleClick={() => navigate('/milestone/' + projectAddress)}
                styles='mt-[12px] w-fit border-[1px] border-[#1dc071] rounded-[4px] p-2 text-[#1dc071]'
                />
            </div>
            </div>
        </div>}
        <div className="flex-1 flex flex-col  justify-between bg-[#1c1c24] rounded-[12px] w-full p-4 mb-4">
            <div className="text-[#b2b3bd] mb-[12px] text-[14px] font-600">Message Log: </div>
            <div>
                {
                    logMessageList.map(log => (<div key={log.id + log.timestamp} className="flex flex-col mb-[12px] bg-[#13131a] p-4 rounded-[4px]">
                       <div className="flex text-[#b2b3bd] text-[12px] ">
                           <div className="flex-1">{log.id}</div> 
                           <div className="p-1">{new Date((log.timestamp || 0) * 1000).toISOString()} </div>
                        </div>
                        <div className="text-white">{log.body}</div>
                    </div> ))
                }
            </div>
            <div >
                <form onSubmit={handleLogMessage}>
                    <div className="flex gap-4">
                        <FormField
                        placeholder="Type message here"
                        value={logMessage}
                        handleChange={(e) => setLogMessage(e.target.value)}
                        />
                        <CustomButton 
                        type="submit"
                        title="Enter"
                        styles="bg-[#744ffd] min-w-[120px]"
                        />
                    </div>
                </form>
            </div>
        </div> </>}
    </>
    
  );
};

export default Project;
