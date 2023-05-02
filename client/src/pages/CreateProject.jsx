import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { money } from "../assets";
import { CustomButton, FormField, Loader, Logger } from "../components";
import { checkIfImage } from "../utils";
import { ErrorCode } from "../constants";

import { useStateContext } from "../context";

const CreateProject = ({ isStarter, userAddress }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    amountRequired: "",
    deadline: "",
    image:
      "",
    isCharity: false,
  });

  const { createProject } = useStateContext();

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        try {
          const tnx = await createProject(userAddress, {
            ...form,
            amountRequired: ethers.utils.parseUnits(form.amountRequired, 18),
            fundingDuration: Math.floor(
              (new Date(form.deadline).getTime() + 86399000 - Date.now()) / 1000
            ),
          });
          await tnx.wait();

          setLogger({
            error: false,
            message: "Project Created Successfully",
            handleClick: function () {
              setIsLogging(false);
            },
          });
        } catch (error) {
          const reason = error.reason ? error.reason : error.toString();
          const message = ErrorCode[
            error.reason.split(/execution reverted: /, 2)[1]
          ]
            ? ErrorCode[error.reason.split(/execution reverted: /, 2)[1]]
            : reason.toString();
          setLogger({
            error: true,
            message,
            handleClick: function () {
              setIsLogging(false);
            },
          });
        }
      } else {
        setLogger({
          error: true,
          message: "Provide a vaild Image URL",
          handleClick: function () {
            setIsLogging(false);
          },
        });

        setForm({ ...form, image: "" });
      }
      setIsLoading(false);
      setIsLogging(true);
    });
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start new Project
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Project Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
          <label className="flex w-fit flex flex-col">
            <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
              &nbsp;
            </span>
            <div className="w-fit flex align-center font-[700]">
              <input
                name={"isCharity"}
                onClick={(e) =>
                  setForm({ ...form, ["isCharity"]: e.target.checked })
                }
                type={"checkbox"}
                step="0.1"
                className="py-[15px] sm:px-[25px] px-[15px]  outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[14px] placeholder:text-[#4b5264] rounded-[10px]"
              />
              <label
                className={`text-[#808191] p-[12px] ${
                  form.isCharity && "text-[#116f41]"
                }`}
              >
                isCharity:{" "}
              </label>
            </div>
          </label>
        </div>

        <FormField
          labelName="Description *"
          placeholder="Write project description"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />

        <div className="w-full flex justify-start items-center p-[16px] bg-[#8c6dfd]  rounded-[10px]">
          <img
            src={money}
            alt="money"
            className="w-[40px] h-[40px] object-contain"
          />
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
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>

        <FormField
          labelName="Project image *"
          placeholder="Place image URL of your project"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new project"
            styles="bg-[#116f41]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
