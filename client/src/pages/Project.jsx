import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { verified, failed, inProgress, inFunding, tagType,  funded } from "../assets";
import { CustomButton, FormField, Loader, Logger } from "../components";
import { daysLeft } from "../utils";

import { useStateContext } from "../context";

const Project = ({ isStarter, userAddress, WhiteTheme }) => {
  const navigate = useNavigate();

  const { projectAddress: paramAddress } = useParams();

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
    daysLeft: "",
    diffAmount: "",
    balance: 0,
  });

  const [projectList, setProjectList] = useState([]);
  const [logMessageList, setLogMessageList] = useState([]);
  const [projectAddress, setProjectAddress] = useState(paramAddress);
  const [isAddMilestone, setIsAddMilestone] = useState(false);
  const [fundValue, setFundValue] = useState(0);
  const [logMessage, setLogMessage] = useState("");

  const [lastTransactions, setLastTransactions] = useState([])

  const [currentVote, setCurrentVote] = useState({
    votes: 0,
    maxVotes: 0,
  });
  const [isTerminate, setIsTerminate] = useState(false);

  const {
    addLogMessage,
    getLogMessage,
    getProjectDetails,
    startProject,
    endProject,
    getProjectVote,
    getUserProjects,
    addNewMilestone,
    releaseFunds,
    processTransactionError,
    processViewError,
    fundProject,
    abortProject,
    refundBackerFunds,
    getLastNTransactions
  } = useStateContext();

  const [form, setForm] = useState({
    title: "",
    description: "",
    fundsRequired: "",
    returnAmount: "",
  });

  const handleLogMessage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tnx = await addLogMessage(
        userAddress,
        isStarter,
        projectAddress,
        logMessage
      );
      await tnx.wait();

      fetchLogMessages();

      setLogger({
        error: false,
        message: "Message Logged",
        handleClick: function () {
          setIsLogging(false);
        },
      });
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message,
        handleClick: function () {
          setIsLogging(false);
          navigate("/project/" + projectAddress);
        },
      });
      setIsLogging(true);
    }
    setIsLoading(false);
  };

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tnx = await addNewMilestone(projectAddress, {
        ...form,
        ["fundsRequired"]: ethers.utils.parseUnits(form.fundsRequired, 18),
        ["returnAmount"]: ethers.utils.parseUnits(form.returnAmount, 18),
      });

      await tnx.wait();
      setLogger({
        error: false,
        message: "Milestone Created Successfully",
        handleClick: function () {
          setIsAddMilestone(false);
          setIsLogging(false);
          navigate("/project/" + projectAddress);
        },
      });
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message,
        handleClick: function () {
          setIsLogging(false);
          navigate("/project/" + projectAddress);
        },
      });
    }
    setIsLogging(true);
    setIsLoading(false);
  };

  const handleStartProject = async () => {
    setIsLoading(true);
    try {
      let tnx, message;
      if (projectDetails.isCharity) {
        tnx = await releaseFunds(projectAddress);
        message = "Funds Released";
      } else {
        tnx = await startProject(projectAddress, userAddress, isStarter);
        message = "Project Started: In Execution";
      }
      await tnx.wait();

      setLogger({
        error: false,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
    } catch (error) {
      console.log(error)
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
      setIsLogging(true);
    }
    setIsLoading(false);
  };

  const handleAbortProject = async () => {
    setIsLoading(true);
    try {
      const tnx = await abortProject(projectAddress);
      const message = "Project Aborted";

      await tnx.wait();
      setLogger({
        error: false,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message: message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
      setIsLogging(true);
    }
    setIsLoading(false);
  };

  const handleFundProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tnx = await fundProject(
        userAddress,
        projectAddress,
        ethers.utils.parseUnits("0" + fundValue, "ether")
      );
      await tnx.wait();

      setLogger({
        error: false,
        message: "Funded Successfully",
        handleClick: function () {
          setIsLogging(false);
        },
      });
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
    }
    setIsLoading(false);
    setIsLogging(true);
  };

  const handleRefundFunds = async () => {
    setIsLoading(true);
    try {
      const tnx = await refundBackerFunds(userAddress, projectAddress);
      await tnx.wait();
      const message = "Funds Refunded Successfully";

      setLogger({
        error: false,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message: message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
    }
    setIsLogging(true);
    setIsLoading(false);
  };

  const handleEndProject = async (vote) => {
    setIsLoading(true);
    try {
      const tnx = await endProject(userAddress, projectAddress, vote);
      await tnx.wait();
      const message = "Voted Successfully";

      setLogger({
        error: false,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
    } catch (error) {
      const { message } = processTransactionError(error);
      setLogger({
        error: true,
        message: message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
    }
    setIsLogging(true);
    setIsLoading(false);
  };

  const fetchLogMessages = async () => {
    setIsLoading(true);

    const [list, count] = await getLogMessage(projectAddress);
    setLogMessageList(list);

    setIsLoading(false);
  };

  const fetchProjectList = async () => {
    setIsLoading(true);

    const [list, count] = await getUserProjects(userAddress);
    setProjectList(list);

    console.log(paramAddress);
    if (paramAddress) setProjectAddress(paramAddress);
    else if (count > 0) setProjectAddress(list[0]);

    setIsLoading(false);
  };

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      await fetchProjectList();

      if (projectAddress && projectAddress != ethers.constants.AddressZero)
        await fetchLogMessages();
    } catch (error) {
      const { message } = processViewError(error);
      setLogger({
        error: true,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
      setIsLogging(true);
    }
    setIsLoading(false);
  };

  const fetchProjectVote = async () => {
    const res = await getProjectVote(userAddress, projectAddress);
    setIsTerminate(res.isTerminate);
    setCurrentVote(res);
  };

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const details = await getProjectDetails(projectAddress, userAddress);
      details.daysLeft = daysLeft(details.endTime * 1000).padStart(2, "0");
      setProjectDetails(details);

      if (!details.isCharity) {
        await fetchProjectVote();
      }

    } catch (error) {
      const { message } = processViewError(error);
      setLogger({
        error: true,
        message,
        handleClick: function () {
          setIsLogging(false);
        },
      });
      setIsLogging(true);
    }
    setIsLoading(false);
  };

  const fetchLastTransactions = async() =>  {
    let list = await getLastNTransactions(projectAddress, 10)
    console.log(list)
    setLastTransactions(list)
  }
  useEffect(() => {
    if (projectAddress && projectAddress != ethers.constants.AddressZero){
      fetchLogMessages();

      fetchLastTransactions();
      
    }
      
  }, [projectAddress]);

  useEffect(() => {
    if (userAddress) fetchDetails();
  }, [userAddress]);

  useEffect(() => {
    if (projectAddress && projectAddress != ethers.constants.AddressZero)
      fetchProject();
  }, [projectAddress, logger]);

  return (
    <div className="flex gap-4">
    
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} WhiteTheme={WhiteTheme}/>}
      <div className="flex-1">
      {projectList.length == 0 && !paramAddress && (  <div className={`${WhiteTheme ? "box-shadow bg-[#ffffff] text-[#4f4f50]": "bg-[#1c1c24] text-white" } rounded-[12px] w-full p-4 mb-4 `}>
          {" "}
          No Project Found:
          <span className={`${WhiteTheme ? "text-[#010101]" : "text-[#b2b3bd]" }`}>
            {isStarter ? " Please Create New Project" : " Please Fund Project"}
          </span>
        </div>
      )}
      {(projectList.length > 0 || paramAddress) && (
        <>
          <div className={`${WhiteTheme ? "box-shadow bg-[#ffffff]" : "bg-[#1c1c24]"} flex-1 flex flex-col justify-between items-center  rounded-[12px] w-full p-4 mb-4`}>
            <div className=" w-full pb-2">
              <select
                onChange={(e) => setProjectAddress(e.target.value)}
                id="projectList"
                className={`${WhiteTheme ? "bg-[#ffffff] text-[#4f4f50]" : "bg-[#1c1c24] text-[#b2b3bd]"}  p-1 outline-0 rounded-[8px]`}
              >
                {projectList.map((address) => (
                  <option className="p-1" key={address} value={address}>
                    {address}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 w-full">
              <div className="flex-1">
                <div className="flex">
                  <div className="flex-1">
                    <h1 className={`flex-1 font-epilogue font-semibold text-[30px] capitalize ${WhiteTheme ? "text-[#010101]" : "text-white"} text-left min-w-[150px]`}>
                      {projectDetails.title}
                    </h1>
                    <div className="flex flex-row items-center mb-[18px]">
                      <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
                      <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
                        {projectDetails.isCharity ? "Charity" : "Startup"}
                      </p>
                    </div>
                  </div>
                  {/* ProjectState: initial, inFunding, inExecution, ended, rejected, aborted */}
                  {projectDetails.state == 0 && (
                    <div className="flex text-white font-[600] text-[16px] items-center">
                      <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
                        Not Started
                      </div>
                    </div>
                  )}
                  {projectDetails.state == 1 && (
                    <div className="flex text-white font-[600] text-[16px] items-center">
                      <img src={inFunding} title="In FUnding State"  alt="In FUnding State" className="w-[36px] h-[36px] object-contain"/>
                      <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
                        {projectDetails.daysLeft != "00"  ? "In Funding State": "Funding Ended"}
                      </div>
                    </div>
                  )}
                  {projectDetails.state == 2 && (
                    <div className="flex text-white font-[600] text-[16px] items-center">
                      <img src={inProgress} title="In Execution State" alt="In Execution State" className="w-[32px] h-[32px] object-contain"/>
                      <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
                        In Execution State
                      </div>
                    </div>
                  )}
                  {projectDetails.state == 3 && (
                    <div className="flex text-white font-[600] text-[16px] items-center">
                      <img src={verified} title="Project Ended" alt="Project Ended" className="w-[36px] h-[36px] object-contain" />
                      <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
                        Project Ended
                      </div>
                    </div>
                  )}
                  {(projectDetails.state == 4 || projectDetails.state == 5) && (
                    <div className="flex text-white font-[600] text-[16px] items-center">
                      <img src={failed} title="Failed" alt="Failed" className="w-[36px] h-[36px] object-contain" />
                      <div className={`p-[10px] pl-[8px] min-h-[36px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
                        Project
                        {projectDetails.state == 4 ? " Rejected" : " Aborted"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 mb-6">
                  <p className={`mt-[3px] font-epilogue font-normal text-[16px] leading-[18px] text-[#808191]`}>
                    Balance:{" "}
                    <span className={`font-semibold text-[16px] ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"} ml-[6px] leading-[22px]`}>
                      {"   " + projectDetails.balance + "  ETH"}
                    </span>
                  </p>
                </div>

                <div className="mt-4 mb-4">
                  <p className="mt-[3px] font-epilogue font-normal text-[14px] leading-[18px] text-[#808191] ">
                    <span className={`font-semibold text-[16px] ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"} ml-[6px] leading-[22px]`}>
                      {projectDetails.amountRaised + "    "}
                    </span>
                    Raised of {projectDetails.amountRequired}
                  </p>
                  <input
                    className="w-full"
                    type="range"
                    min="0"
                    max={projectDetails.amountRequired}
                    value={projectDetails.amountRaised}
                    disabled
                  ></input>
                  <div className="flex">
                    <div className={`flex-1 ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>0</div>
                    <div className={`flex-1 text-right ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
                      {projectDetails.amountRequired + " ETH"}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <h1 className={`flex-1 font-epilogue font-[500] text-[12px] mt-[6px] ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"} text-left grayscale`}>
                    Starter Address: {projectDetails.starterId}
                  </h1>
                  <h1 className={`flex-1 font-epilogue font-[500] text-[12px] mt-[6px] ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"} text-left grayscale`}>
                    Project Address: {projectAddress}
                  </h1>
                </div>
              </div>
              <div className={`w-[180px] flex flex-col h-full text-center ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>
                <div className="flex-1 flex justify-center items-center min-h-[140px]">
                  <div>
                    <h1 className="font-[700] text-[#1dc071]  text-[32px]">
                      {projectDetails.daysLeft}
                    </h1>
                    <h2>Days Left</h2>
                  </div>
                </div>
                <div>
                  <div className="flex w-full text-center justify-center items-center gap-2 mt-6">
                    <img
                      src={funded}
                      title="Verified"
                      alt="Verified"
                      className="rounded-[20px] w-[20px] h-[20px] object-contain"
                    ></img>
                    <div className=" ">{projectDetails.backersCount}</div>
                  </div>
                  <div className="text-[12px]">Backers Count</div>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex-1 flex flex-col  justify-between ${WhiteTheme ? "bg-[#ffffff] shadow-xl" : " bg-[#1c1c24]"} rounded-[12px] w-full p-4 mb-4`}>
            <div className={` ${WhiteTheme ? "text-[#4f4f50]" :"text-[#b2b3bd]"} mb-[4px] text-[14px] font-600`}>
              Description:{" "}
            </div>
            <div className={`${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"}`}>{projectDetails.description}</div>
          </div>
          {projectDetails.state == 1 && projectDetails.starterId == userAddress && (
            <div className="flex gap-4 mb-4">
              <CustomButton
                btnType="button"
                title={
                  projectDetails.isCharity ? "Release Funds" : "Start Project"
                }
                styles="bg-[#116f41] hover:bg-[#1ec775] rounded-[4px]"
                handleClick={handleStartProject}
              />
              <CustomButton
                btnType="button"
                title={"Abort Project"}
                styles="bg-[#df060a] hover:bg-[#f92023] rounded-[4px]"
                handleClick={handleAbortProject}
              />
            </div>
          )}
          {projectDetails.state == 2 &&  (
            <div className="flex gap-4 mb-4 justify-end items-center">
              <div className="text-[#4f4f50]">
                Current Termination Request:{" "}
                <span className="font-[500]">{`${
                  Math.round(
                    (currentVote.votes / currentVote.maxVotes) * 10000.0
                  ) / 100
                } %`}</span>
              </div>
              {!isTerminate && !isStarter && (
                <CustomButton
                  btnType="button"
                  title={"Terminate Project"}
                  styles="bg-[#df060a] hover:bg-[#f92023] rounded-[4px]"
                  handleClick={() => handleEndProject(true)}
                />
              )}
              {isTerminate && !isStarter && (
                <CustomButton
                  btnType="button"
                  title={"Recall Termination"}
                  styles="bg-[#116f41] hover:bg-[#1ec775] rounded-[4px]"
                  handleClick={() => handleEndProject(false)}
                />
              )}
            </div>
          )}
          {projectDetails.state == 1 &&
            projectDetails.daysLeft != "00" &&
            !isStarter && (
              <div className="flex gap-4 mb-4">
                <CustomButton
                  btnType="button"
                  title={"Refund Funds"}
                  styles="bg-[#df060a] hover:bg-[#f92023] rounded-[4px]"
                  handleClick={handleRefundFunds}
                />
                <div className="flex justify-end items-center flex-1">
                  <form onSubmit={handleFundProject}>
                    <div className="flex gap-2 ">
                      <div title="Remaining Amount">
                        {!projectDetails.isCharity && (
                          <CustomButton
                            btnType="button"
                            title="-"
                            styles={`${WhiteTheme ? "text-black" : "text-white" } border-[1px] border-[#3a3a43] rounded-[8px]`}
                            handleClick={(e) =>
                              setFundValue(
                                (
                                  projectDetails.amountRequired -
                                  projectDetails.amountRaised
                                ).toString()
                              )
                            }
                          />
                        )}
                      </div>

                      <FormField
                        placeholder={`Fund value ${
                          projectDetails.isCharity == true
                            ? "in"
                            : "<= " +
                              (projectDetails.amountRequired -
                                projectDetails.amountRaised)
                        } ETH`}
                        inputType="text"
                        value={fundValue}
                        handleChange={(e) => setFundValue(e.target.value)}
                        className="w-[100px]"
                        WhiteTheme={WhiteTheme}
                      />
                      <CustomButton
                        btnType="submit"
                        title="Fund Project"
                        styles="bg-[#116f41] hover:bg-[#1ec775] rounded-[8px]"
                      />
                    </div>
                  </form>
                </div>
              </div>
            )}
          {projectDetails.state == 1 &&
            !projectDetails.isCharity &&
            projectDetails.daysLeft == "00" &&
            !isStarter && (
              <div className="flex gap-4 mb-4">
                <CustomButton
                  btnType="button"
                  title={"Start Project"}
                  styles="bg-[#116f41] hover:bg-[#1ec775] rounded-[8px]"
                  handleClick={handleStartProject}
                />
              </div>
            )}
          {!projectDetails.isCharity && projectDetails.state >= 2 && (
            <div className={`flex-1 flex flex-col  justify-between ${WhiteTheme ? "bg-[#ffffff] shadow-xl" : "bg-[#1c1c24]"} rounded-[12px] w-full p-4 mb-4`}>
              <div className={`${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"} mb-[4px] text-[14px] font-600`}>
                Milestones:{" "}
              </div>
              <div className="flex gap-4">
                {projectDetails.starterId == userAddress && projectDetails.state >= 2 && (
                  <div className="flex flex-col">
                    <input
                      type="checkbox"
                      className="hidden"
                      onChange={(e) => setIsAddMilestone(e.target.checked)}
                      id="add-milestone"
                      name="add-milestone-form"
                    />
                    <label
                      htmlFor="add-milestone"
                      className="font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] block mt-[12px] w-fit border-[1px] border-[#8c6dfd] rounded-[4px] p-3 text-[#8c6dfd]"
                    >
                      Add Milestone
                    </label>
                    {isAddMilestone && (
                      <>
                        <div className="fixed w-full h-full flex z-20 top-0 right-0 justify-center items-center">
                          <form
                            onSubmit={handleSubmit}
                            className={`flex flex-col h-fit justify-center min-w-[50%] gap-6 p-8 rounded-[4px] ${WhiteTheme ? "bg-[#ffffff] text-black" : "bg-[#1c1c24] text-white"} border-2 border-[#2c2f32]`}
                          >
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
                              handleChange={(e) =>
                                handleFormFieldChange("title", e)
                              }
                              WhiteTheme={WhiteTheme}
                            />
                            <FormField
                              labelName="Description *"
                              placeholder="Description"
                              inputType="text"
                              isTextArea={true}
                              value={form.description}
                              handleChange={(e) =>
                                handleFormFieldChange("description", e)
                              }
                              WhiteTheme={WhiteTheme}
                            />
                            <FormField
                              labelName="Funds Required *"
                              placeholder="Funds Required in ETH"
                              inputType="text"
                              value={form.fundsRequired}
                              handleChange={(e) =>
                                handleFormFieldChange("fundsRequired", e)
                              }
                              WhiteTheme={WhiteTheme}
                            />
                            <FormField
                              labelName="Return Amount *"
                              placeholder="Return Amount in ETH"
                              inputType="text"
                              value={form.returnAmount}
                              handleChange={(e) =>
                                handleFormFieldChange("returnAmount", e)
                              }
                              WhiteTheme={WhiteTheme}
                            />
                            <div className="relative flex justify-center items-center mt-[4px]">
                              <CustomButton
                                btnType="submit"
                                title="Submit new Milestone"
                                styles="bg-[#8c6dfd] cursor-pointer"
                              />

                              <label
                                htmlFor="add-milestone"
                                className="absolute right-[10px] cursor-pointer text-[#ff0000]"
                              >
                                Cancel
                              </label>
                            </div>
                          </form>
                        </div>
                        <div className="fixed w-screen h-screen blur-sm top-0 bg-[#808191] left-0 z-10 opacity-80 blur-sm"></div>
                      </>
                    )}
                  </div>
                )}
                <div>
                  <CustomButton
                    type="button"
                    title={isStarter ? "Update Milestone" : "Get Milestones"}
                    handleClick={() => navigate("/milestone/" + projectAddress)}
                    styles="mt-[12px] w-fit border-[1px] border-[#1dc071] rounded-[4px] p-2 text-[#1dc071]"
                  />
                </div>
              </div>
            </div>
          )}
          <div className={`flex-1 flex flex-col  justify-between ${WhiteTheme ? "shadow-xl  bg-[#ffffff]" : "bg-[#1c1c24]"} rounded-[12px] w-full mt-4 p-4 mb-4`}>
            <div className={`${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]" } mb-[12px] text-[14px] font-600`}>
              Message Log:{" "}
            </div>
            <div>
              {logMessageList.map((log) => (
                <div
                  key={log.id + log.timestamp}
                  className={`flex flex-col mb-[12px] ${WhiteTheme ? "bg-[#ffffff] shadow shadow-inner" : "bg-[#13131a]" } p-4 rounded-[4px]`}
                >
                  <div className={`flex ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]"} text-[12px] `}>
                    <div className="flex-1">{log.id}</div>
                    <div className="p-1">
                      {new Date((log.timestamp || 0) * 1000).toISOString()}{" "}
                    </div>
                  </div>
                  <div className={`${WhiteTheme ? "text-[#4f4f50]" : "text-white" } `}>{log.body}</div>
                </div>
              ))}
            </div>
            <div>
              <form onSubmit={handleLogMessage}>
                <div className="flex gap-4">
                  <FormField
                    placeholder="Type message here"
                    value={logMessage}
                    handleChange={(e) => setLogMessage(e.target.value)}
                    WhiteTheme = {WhiteTheme}
                  />
                  <CustomButton
                    type="submit"
                    title="Enter"
                    styles="bg-[#744ffd] min-w-[120px]"
                  />
                </div>
              </form>
            </div>
          </div>{" "}
        </>
      )}
      </div>
      <div className="w-[300px] flex flex-col gap-4">
        <div className={`flex justify-center font-bold text-[#8c6dfd] text-[20px] px-[8px] gap-1 py-[8px]  ${WhiteTheme ? "shadow bg-[#ffffff]" : "bg-[#1c1c24]"}`}>
          Transaction History
        </div>
        {lastTransactions.map((log) => {
          return (<div
          key={log.time}
          className={`flex flex-col px-[8px] gap-1 py-[14px]  ${WhiteTheme ? "shadow bg-[#ffffff]" : "bg-[#1c1c24]"} ${log.isdebit ? "border-r-8 border-[#1dc071]" : "border-l-8 border-[#8c6dfd]"}`}
          >
            <div className={`text-[12px] ${WhiteTheme ? "text-black" : "text-[#b2b3bd]"}`}>{log.address} </div>
            <div className={`flex justify-between text-[12px] ${WhiteTheme ? "text-black" : "text-[#b2b3bd]"} `}> 
              <div className={`text-[14px] font-bold`}>{log.value + " ETH"}</div>
              <div>{log.time}</div>
            </div>
            </div>)
        })}
      </div>
    </div>
  );
};

export default Project;
