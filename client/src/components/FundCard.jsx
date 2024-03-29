import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { tagType, thirdweb } from "../assets";
import { useStateContext } from "../context";
import { daysLeft } from "../utils";

const FundCard = ({ projectAddress, handleClick, WhiteTheme }) => {
  const navigate = useNavigate();

  const [project, setProjectDetails] = useState({
    address: projectAddress,
    starterId: "0x000000000000000000000000000",
    title: "",
    description: "",
    amountRequired: 0,
    amountRaised: 0,
    isCharity: true,
    endTime: Date.now() + 10,
    image: ''
  })

  const { getProjectDetails } = useStateContext()

  useEffect(() => {
    (async () => {
      const details = await getProjectDetails(projectAddress)
      details.remainingDays = daysLeft(details.endTime * 1000).toString().padStart(2, '0')
      setProjectDetails(details)
    })();
  }, []);

  return (
    <div className={`sm:w-[288px] w-full rounded-[15px] ${WhiteTheme ? "bg-[#ffffff] box-shadow" : "bg-[#1c1c24]"} cursor-pointer`} onClick={handleClick}>
      <div className={`w-full h-[161px] object-cover rounded-[15px] ${WhiteTheme && "box-shadow shadow-inner border-b-[3px]"}`} >
        <img  src={project.image} alt="fund" className="w-full h-[158px] object-cover rounded-[16px]" />
      </div>
      

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
            {project.isCharity ? "Charity" : "Startup"}
          </p>
        </div>

        <div className="block">
          <h3 className={`font-epilogue font-semibold text-[16px] ${WhiteTheme ? "text-[#010101]" : "text-white"} text-left leading-[26px] truncate`}>
            {project.title}
          </h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">
            {project.description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"}  leading-[22px]`}>
              {project.amountRaised}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Raised of {project.amountRequired}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"} leading-[22px] `}>
              {project.remainingDays}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain" />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            by <span className={`${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>{project.starterId}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
