import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {blockchain} from '../assets';
import { CustomButton, FormField, Loader, Logger } from "../components";
import { useStateContext } from "../context";

const Login = ({WhiteTheme = true}) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });

  const [form, setForm] = useState({
    email: "",
    password: "",
    isStarter: true,
  });

  const { authenticatUser, processViewError, getPublicAddress } =
    useStateContext();

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userAddress = await authenticatUser(form);
      window.sessionStorage.setItem("userAddress", userAddress);

      if (form.isStarter) {
        window.sessionStorage.setItem("isStarter", true);
      } else {
        window.sessionStorage.setItem("isStarter", false);
      }

      navigate("/home");
    } catch (error) {
      const res = processViewError(error);

      let message;
      if (res.errorCode == 401)
        message = `${
          res.message
        }:\nPlease Ensure that you are using account with public address: ${await getPublicAddress(
          form.email,
          form.isStarter
        )}`;
      else message = res.message;

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

  return (
    <div className="bg-[#ffffff] flex justify-center items-center  w-full min-h-screen h-full ">
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} WhiteTheme={WhiteTheme}/>}
      <div className={`h-[100%] max-h-[100vh] bg-gradient-to-r from-slate-950 to-transparent bg-blend-multiply shadow-2xl`}>
        <img className="bg-blend-multiply max-h-[100vh] contain " src={blockchain}/>
      </div>
      <div className="flex flex-1 justify-item p-12 px-20">

      
      <div className="bg-[#d0e9fd] px-8 justify-item py-6 rounded-[12px] box-shadow">
        <form
          onSubmit={handleSubmit}
          className="w-[300px] flex flex-col gap-[24px]"
        >
          <h1 className="self-center text-[#116f41] font-[700] text-[32px]">
            Crowdfunding
          </h1>
          <div className="relative flex gap-[16px] text-[#4f4f50] text-[18px] text-center">
            <input
              className="hidden"
              type="radio"
              id="isStrater-Starter"
              value={form.isStarter}
              required
            />
            <input
              className="hidden"
              type="radio"
              id="isStrater-Backer"
              value={!form.isStarter}
              required
            />
            <label
              className={`z-10 flex-1  signup-label ${
                form.isStarter && "text-white"
              }`}
              onClick={(e) => setForm({ ...form, ["isStarter"]: true })}
              htmlFor="isStrater-Starter"
            >
              {" "}
              Starter{" "}
            </label>
            <label
              className={`z-10 flex-1 signup-label ${
                !form.isStarter && "text-white"
              }`}
              onClick={(e) => setForm({ ...form, ["isStarter"]: false })}
              htmlFor="isStrater-Backer"
            >
              {" "}
              Backer{" "}
            </label>
            <div
              className={`z-1 absolute p-4 rounded-[24px] w-[48%] bg-[#116f41] left-0 transition-[left] duration-700 ${
                !form.isStarter && "left-[52%]"
              } `}
            ></div>
          </div>

          <FormField
            labelName="Email *"
            placeholder="Email"
            inputType="text"
            value={form.description}
            handleChange={(e) => handleFormFieldChange("email", e)}
            WhiteTheme = {WhiteTheme}
          />

          <FormField
            labelName="Password *"
            placeholder="Password"
            inputType="password"
            value={form.password}
            handleChange={(e) => handleFormFieldChange("password", e)}
            WhiteTheme = {WhiteTheme}
          />

          <div className="flex justify-center px-[20px] items-center mt-[10px]">
            <CustomButton
              btnType="submit"
              title="Authenticate"
              styles="bg-[#115bfb] min-w-[180px]"
            />
          </div>
        </form>
        <div className="flex-1 text-center pt-[10px] mt-[32px] text-[#4f4f50] hover:text-[#2ec975] border-[#4f4f50] border-t-[1px]">
          <a href="/signup">Create New Account</a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
