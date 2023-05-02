import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { verified, failed, inProgress,inFunding, tagType, funded} from '../assets';
import { CustomButton, FormField, Loader, Logger, MilestoneCard } from "../components";
import { ErrorCode } from "../constants";
import { daysLeft } from "../utils";

import { useStateContext } from "../context";

const Milestone = ({isStarter, userAddress}) => {
  const navigate = useNavigate();
  const  { projectAddress:paramAddress } = useParams()

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });

  const [projectList, setProjectList] = useState([]);
  const [projectAddress, setProjectAddress] = useState(paramAddress)

  const [projectMilestone, setProjectMilestone] = useState([]);

  const {  getUserProjects,getProjectMilestone} = useStateContext();


  const fetchProjectList = async () => {
    setIsLoading(true);
    const [list, count] = await getUserProjects(userAddress);
    setProjectList(list);
    if(paramAddress) setProjectAddress(paramAddress)
    else setProjectAddress(list[0])
    setIsLoading(false);
  }

  const fetchMilestoneList = async() => {
    setIsLoading(true)
    const [list, count] = await getProjectMilestone(projectAddress);
    setProjectMilestone(list);
    console.log(list)
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

    useEffect(() => {
        if(projectAddress)
            fetchMilestoneList()
    },[projectAddress])

  useEffect(() => {
    if(userAddress)
        fetchDetails()
  },[userAddress])

  return (
      <>
        <div className={`flex-1 justify-between items-center bg-[#1c1c24] rounded-[12px] w-fit p-4 mb-4`}>
            <div className=" w-full">
                <label className="text-[#b2b3bd]">Project Address:</label>
                <select onChange={(e) => setProjectAddress(e.target.value)} id='projectList' className="bg-[#1c1c24] text-[#b2b3bd]  p-1 outline-0 rounded-[8px]">
                    {projectList.map(address =>( <option className="p-1" key={address} value={address}>{address}</option>))}
                </select>
            </div>
        </div>
        <div className="w-full">
            {
                projectMilestone.map(milestone => (
                    <MilestoneCard
                        key={milestone}  
                        milestoneAddress={milestone} 
                        projectAddress={projectAddress}
                        userAddress={userAddress}
                        isStarter={isStarter}
                   />
                ))
            }
        </div>
      </>
  )

}

export default Milestone