import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { money } from "../assets";
import { CustomButton, FormField, Loader, Logger } from "../components";
import { checkIfImage } from "../utils";
import { ErrorCode } from "../constants";

import { useStateContext } from "../context";

const CreateProject = ({ isStarter, userAddress, WhiteTheme = false }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({ error: false, message: "", handleClick: ""});

  const [form, setForm] = useState({
    title: "",
    description: "",
    amountRequired: "",
    deadline: "",
    image: "",
    isCharity: false,
  });

  const { createProject, processTransactionError, getPublicAddressByAddress } = useStateContext();

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    checkIfImage(form.image, async (exists) => {
      try{
          setForm({ ...form, image: "" })
          if(!exists) {
            throw {
              reason : "Provide a vaild Image URL"
            }
          }

          const tnx = await createProject(userAddress, {
            ...form,
            amountRequired: ethers.utils.parseUnits(form.amountRequired, 18),
            fundingDuration: Math.floor( (new Date(form.deadline).getTime() + 86399000 - Date.now()) / 1000 ),
          });
          await tnx.wait();

          setLogger({ error: false, message: "Project Created Successfully", handleClick: function () {
              setIsLogging(false);
              navigate('/home')
            },
          });
        } catch (error) {
          const res = processTransactionError(error);

          let message;
          if (res.errorCode == 401) message = `${res.message}:\nPlease Ensure that you are using account with public address: ${await getPublicAddressByAddress(userAddress)}`;
          else message = res.message;
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
    });
  };

  return (
    <div className={`flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 ${WhiteTheme ? "bg-[#ffffff] box-shadow" : "bg-[#1c1d24]"}`}>
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start new Project
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]" >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Project Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
            WhiteTheme={WhiteTheme}
          />
          <label className="flex w-fit flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
              &nbsp;
            </span>
            <div className="w-fit flex align-center font-[700]">
              <input  name={"isCharity"} 
                onClick={(e) => setForm({ ...form, ["isCharity"]: e.target.checked }) }
                type={"checkbox"} step="0.1"
                className="py-[15px] sm:px-[25px] px-[15px]  outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px]"
              />
              <label className={`text-[#808191] p-[12px] ${ form.isCharity && "text-[#116f41]" }`} > isCharity:{" "} </label>
            </div>
          </label>
        </div>

        <FormField
          labelName="Description *"
          placeholder="Write project description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
          WhiteTheme={WhiteTheme}
        />

        <div className="w-full flex justify-start items-center p-[16px] bg-[#8c6dfd]  rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Amount Required *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.amountRequired}
            handleChange={(e) => handleFormFieldChange("amountRequired", e)}
            WhiteTheme={WhiteTheme}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
            WhiteTheme={WhiteTheme}
          />
        </div>

        <FormField
          labelName="Project image *"
          placeholder="Place image URL of your project"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
          WhiteTheme={WhiteTheme}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new project"
            styles={WhiteTheme ? "bg-[#1dc071]" : "bg-[#116f41]"}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
