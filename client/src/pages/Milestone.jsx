import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {  Loader, Logger, MilestoneCard } from "../components";

import { useStateContext } from "../context";

const Milestone = ({ isStarter, userAddress , WhiteTheme}) => {
  const { projectAddress: paramAddress } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({
    error: false,
    message: "",
    handleClick: "",
  });

  const [projectList, setProjectList] = useState([]);
  const [projectAddress, setProjectAddress] = useState(paramAddress);

  const [projectMilestone, setProjectMilestone] = useState([]);

  const { getUserProjects, getProjectMilestone, getProjectDetails } = useStateContext();

  const fetchProjectList = async () => {
    setIsLoading(true);
    const [list, count] = await getUserProjects(userAddress);

    let startUpList = []

    for(let i = 0 ; i < count ; i++){
      let detail = await getProjectDetails(list[i])
      if(!detail.isCharity) startUpList.push(list[i]) 
    }
    setProjectList(startUpList);
    if (paramAddress) setProjectAddress(paramAddress);
    else setProjectAddress(startUpList[0]);
    setIsLoading(false);
  };

  const fetchMilestoneList = async () => {
    setIsLoading(true);
    const [list, count] = await getProjectMilestone(projectAddress);
    setProjectMilestone(list);
    setIsLoading(false);
  };

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      await fetchProjectList();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (projectAddress) fetchMilestoneList();
  }, [projectAddress]);

  useEffect(() => {
    if (userAddress) fetchDetails();
  }, [userAddress]);

  return (
    <>
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} />}
      <div
        className={` flex-1 justify-between items-center ${WhiteTheme ? "box-shadow bg-[#ffffff]" : "bg-[#1c1c24]"} rounded-[12px] w-fit p-4 mb-4`}
      >
        <div className=" w-full">
          <label className={` ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>Project Address:</label>
          <select
            onChange={(e) => setProjectAddress(e.target.value)}
            id="projectList"
            className={` p-1 outline-0 rounded-[8px] ${WhiteTheme ? "text-[#4f4f50] bg-[#ffffff]" : "text-[#b2b3bd] bg-[#1c1c24]"}`}
          >
            {projectList.map((address) => (
              <option className="p-1" key={address} value={address}>
                {address}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full">
        {projectMilestone.map((milestone) => (
          <MilestoneCard
            key={milestone}
            milestoneAddress={milestone}
            projectAddress={projectAddress}
            userAddress={userAddress}
            isStarter={isStarter}
            setIsLoading={setIsLoading}
            setIsLogging={setIsLogging}
            setLogger={setLogger}
            WhiteTheme={WhiteTheme}
          />
        ))}
      </div>
    </>
  );
};

export default Milestone;
