import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CustomButton, FormField, Loader, Logger } from "../components";

import { useStateContext } from "../context";

const Signup = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [logger, setLogger] = useState({ on: false, error: false, message: ""});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
    isStarter: true,
  });

  const { createUser, processTransactionError } = useStateContext();

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const passwordReg = new RegExp( /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$])[0-9a-zA-Z@#$]{8,}$/);
  const validateForm = () => {
    if (!passwordReg.test(form.password)) {
      throw {
        reason: `Password Pattern Not Matching: \n* Password should contain atleast 8 characters.\n* Password must contain alphabets, numbers and \n\tspecial characters(@,$,#).\n* Password must have atleast one lowercase, one \n\tuppercase, one number and one special character.`,
      };
    }

    if (!(form.password === form.repassword)) {
      throw {
        reason: `Passwords not matching!`,
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      validateForm();
      const txn = await createUser(form);
      await txn.wait();

      setLogger({
        error: false,
        message: "Sigup Successfully",
        handleClick: function () {
          navigate("/login");
          setIsLogging(false);
        },
      });
    } catch (error) {
      const message = processTransactionError(error).message
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

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col w-full min-h-screen h-full sm:p-[12px] p-[12px]">
      {isLoading && <Loader />}
      {isLogging && <Logger {...logger} />}

      <div className="bg-[#13131a] px-8 py-6 rounded-[12px]  ">
        <form onSubmit={handleSubmit} className="w-[300px] flex flex-col gap-[16px]" >
          <h1 className="self-center text-[#1dc071] font-[700] text-[32px]">
            Crowdfunding
          </h1>
          <div className="relative flex gap-[16px] text-[#808191] text-[18px] text-center">
            <input className="hidden" type="radio" id="isStrater-Starter" value={form.isStarter} required />
            <input className="hidden" type="radio" id="isStrater-Backer" value={!form.isStarter} required />
            <label className={`z-10 flex-1  signup-label ${ form.isStarter && "text-black"  }`}
              onClick={(e) => setForm({ ...form, ["isStarter"]: true })}
              htmlFor="isStrater-Starter"
            >  Starter </label>
            <label className={`z-10 flex-1 signup-label ${ !form.isStarter && "text-black" }`}
              onClick={(e) => setForm({ ...form, ["isStarter"]: false })}
              htmlFor="isStrater-Backer"
            >  Backer </label>
            <div className={`z-1 absolute p-4 rounded-[24px] w-[48%] bg-[#1dc071] left-0 transition-[left] duration-700 ${ !form.isStarter && "left-[52%]"  } `} ></div>
          </div>
          <FormField
            labelName="Username *"
            placeholder="Username"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />

          <FormField
            labelName="Email *"
            placeholder="Email"
            inputType="text"
            value={form.description}
            handleChange={(e) => handleFormFieldChange("email", e)}
          />

          <FormField
            labelName="Password *"
            placeholder="Password"
            inputType="password"
            value={form.password}
            handleChange={(e) => handleFormFieldChange("password", e)}
          />

          <FormField
            labelName="Re-password *"
            placeholder="Retype password"
            inputType="text"
            value={form.repassword}
            handleChange={(e) => handleFormFieldChange("repassword", e)}
          />

          <div className="flex justify-center px-[20px] items-center mt-[10px]">
            <CustomButton
              btnType="submit"
              title="Create New Account"
              styles="bg-[#8c6dfd]"
            />
          </div>
        </form>
        <div className="flex-1 text-center pt-[10px] mt-[32px] text-[#808191] hover:text-[#1dc071] border-[#808191] border-t-[1px]">
          <a href="/login">Login to Account</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
