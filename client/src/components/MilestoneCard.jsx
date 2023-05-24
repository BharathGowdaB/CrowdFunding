import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { verified, failed, inProgress, inFunding } from "../assets";

import { useStateContext } from "../context";
import CustomButton from "./CustomButton";

const MilestoneCard = ({
  milestoneAddress,
  projectAddress,
  isStarter,
  userAddress,
  setIsLoading,
  setIsLogging,
  setLogger,
  WhiteTheme
}) => {
  const navigate = useNavigate();

  const [currentVote, setCurrentVote] = useState({
    votes: 0,
    maxVotes: 0,
  });
  const [isRejected, setIsRejected] = useState(false);

  const [milestone, setMilestoneDetails] = useState({
    projectId: projectAddress,
    address: milestoneAddress,
    title: "",
    description: "",
    fundsRequired: 0,
    returnAmount: 0,
    startTime: Date.now() + 10,
    state: "0",
  });

  const {
    getMilestoneDetails,
    getMilestoneVotes,
    voteMilestone,
    processTransactionError,
    startMilestone,
    endMilestone,
  } = useStateContext();

  const fetchDetails = async () => {
    const details = await getMilestoneDetails(userAddress, milestoneAddress);
    console.log(details);
    setIsRejected(details.vote);
    setMilestoneDetails({ ...milestone, ...details });
  };

  const fetchCurrentVote = async () => {
    const details = await getMilestoneVotes(projectAddress, milestoneAddress);
    setCurrentVote(details);
  };

  const handleStartMilestone = async () => {
    setIsLoading(true);
    try {
      const tnx = await startMilestone(projectAddress, milestoneAddress);
      await tnx.wait();

      fetchDetails();
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message,
        handleClick: () => {
          setIsLogging(false);
        },
      });
      setIsLogging(true);
    }
    setIsLoading(false);
  };

  const handleEndMilestone = async () => {
    setIsLoading(true);
    try {
      const tnx = await endMilestone(
        projectAddress,
        milestoneAddress,
        milestone.returnAmount
      );
      await tnx.wait();

      fetchDetails();
    } catch (error) {
      console.log(error);
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message,
        handleClick: () => {
          setIsLogging(false);
        },
      });
      setIsLogging(true);
    }
    setIsLoading(false);
  };

  const handleVoting = async (vote) => {
    setIsLoading(true);
    try {
      const tnx = await voteMilestone(userAddress, milestoneAddress, vote);
      await tnx.wait();

      setLogger({
        error: false,
        message: "Succefully Voted",
        handleClick: () => {
          setIsLogging(false);
        },
      });
      setIsRejected(vote);
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message,
        handleClick: () => {
          setIsLogging(false);
        },
      });
    }
    setIsLoading(false);
    setIsLogging(true);
  };

  useEffect(() => {
    fetchCurrentVote();
  }, [isRejected]);

  useEffect(() => {
    fetchDetails();
  }, [projectAddress]);

  return (
    <div className={`w-full flex  cursor-pointer p-4 mb-[20px] rounded-[8px]  ${ WhiteTheme ? "bg-[#ffffff] box-shadow " : "bg-[#1c1c24]"}`}>
      <div className="flex-1 flex flex-col pr-4">
        <div className="block flex-1">
          <div className="flex pr-[10px]">
            <h3 className={`flex-1 text-[24px] font-bold  text-left ${ WhiteTheme ? "text-black" : "text-white" }`}>
              {milestone.title}
            </h3>
          </div>

          <p className={`flex-1 whitespace-wrap mt-[8px] font-epilogue font-normal text-[#808191] text-left whitespace-wrap ${ WhiteTheme && "text-[#4f4f50]" }`}>
            {milestone.description}
          </p>
        </div>
        <div className={`text-[#b2b3bd] flex justify-between my-[20px] ${ WhiteTheme && "text-[#4f4f50]" }`}>
          <div className={`${ WhiteTheme && "text-[#808191]"}`}>
            <span className={`text-white font-[500]  ${ WhiteTheme && "text-[#4f4f50]" }`}>
              {milestone.fundsRequired + " ETH "}
            </span>{" "}
            required with expected return
            <span className={`text-[#8c6dfd] font-[500]"`}>
              {" " + milestone.returnAmount + " ETH "}
            </span>
          </div>
        </div>
        <div className={`flex gap-4 font-[500] items-center text-[#b2b3bd] text-[12px]   ${ WhiteTheme && "text-[#4f4f50]" }`}>
          <div className={ `${ WhiteTheme && "text-[#4f4f50]" } flex-1`}>Address: {milestone.address}</div>
          <div className={ `${ WhiteTheme && "text-[#4f4f50]" } flex w-fit items-center gap-2 `}>
            <div>Current Approved Percent: </div>
            <div
              className={`w-fit font-[700] text-[16px] text-[#1dc071] ${
                (currentVote.votes / currentVote.maxVotes) * 100.0 < 50 &&
                "text-[#ff0000]"
              }`}
            >
              {`${
                Math.round(
                  (currentVote.votes / currentVote.maxVotes) * 10000.0
                ) / 100
              } %`}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-[180px]">
        {/* MilestoneState: initial, inVoting, inExecution, rejected, ended */}
        {milestone.state == 0 && (
          <div className="flex flex-1 text-white font-[600] w-[100%] text-[16px] items-center">
            <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
              Not Started
            </div>
          </div>
        )}
        {milestone.state == 1 && (
          <div className="flex flex-1 text-white font-[600] w-[100%] text-[16px] items-center">
            <img
              src={inFunding}
              title="In Funding State"
              alt="In Funding State"
              className="w-[36px] h-[36px] object-contain"
            />
            <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
              {milestone.startTime + 86400 < Date.now() ? "In Voting State" : "Voting Ended"}
            </div>
          </div>
        )}
        {milestone.state == 2 && (
          <div className="flex flex-1 text-white font-[600] w-[100%] text-[16px] items-center">
            <img
              src={inProgress}
              title="In Execution State"
              alt="In Execution State"
              className="w-[32px] h-[32px] object-contain"
            />
            <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
              In Execution
            </div>
          </div>
        )}
        {milestone.state == 4 && (
          <div className="flex flex-1 text-white font-[600] w-[100%] text-[16px] items-center">
            <img
              src={verified}
              title="Milestone Ended"
              alt="Milestone Ended"
              className="w-[36px] h-[36px] object-contain"
            />
            <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
              Completed
            </div>
          </div>
        )}
        {milestone.state == 3 && (
          <div className="flex flex-1 text-white font-[600] w-[100%] text-[16px] items-center">
            <img
              src={failed}
              title="Failed"
              alt="Failed"
              className="w-[36px] h-[36px] object-contain"
            />
            <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
              Is Rejected
            </div>
          </div>
        )}
        {isStarter && (
          <div className="w-[100%]">
            {milestone.state == 1 && (
              <div>
                <CustomButton
                  type="button"
                  title="Start Milestone"
                  styles="mt-[12px] w-fit border-[1px] font-[400] min-w-[170px] border-[#1dc071] rounded-[4px] p-1 text-[#1dc071]"
                  handleClick={handleStartMilestone}
                />
              </div>
            )}
            {milestone.state == 2 && (
              <div className="w-[100%]">
                <CustomButton
                  type="button"
                  title="End Milestone"
                  styles="mt-[12px] w-[100%] min-w-[100px] font-[400] min-w-[170px] border-[1px] border-[#ff0000] rounded-[4px] p-[2px] text-[#ff0000]"
                  handleClick={handleEndMilestone}
                />
              </div>
            )}
          </div>
        )}
        {!isStarter && milestone.state == 1 && !isRejected && (
          <div>
            <CustomButton
              type="button"
              title="Reject Milestone"
              styles="mt-[12px] w-fit border-[1px] font-[400] min-w-[170px] border-[#ff0000] rounded-[4px] p-1 text-[#ff0000]"
              handleClick={() => handleVoting(true)}
            />
          </div>
        )}
        {!isStarter && milestone.state == 1 && isRejected && (
          <div>
            <CustomButton
              type="button"
              title="Approve Milestone"
              styles="mt-[12px] w-fit border-[1px] font-[400] min-w-[170px]  border-[#1dc071] rounded-[4px] p-1 text-[#1dc071]"
              handleClick={() => handleVoting(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
