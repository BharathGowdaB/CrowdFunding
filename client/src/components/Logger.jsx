import React from "react";
import CustomButton from "./CustomButton";

const Logger = ({ error, message, handleClick, WhiteTheme = true} = {}) => {
  return (
    <div className="fixed inset-0 z-[100] h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <div className={`w-[600px] ${WhiteTheme ? "bg-[#ffffff] box-shadow text-black " : "bg-[#13131a] text-white" } px-8 py-4 rounded-[12px]  max-h-[80%] snap-y`}>
        <h2 className=" font-bold  text-[32px] ">
          {error ? "Error" : "Alert"}
        </h2>
        <p className={`mt-[20px] ${WhiteTheme ? "text-[#4f4f50]" : "text-[#b2b3bd]" }  font-epilogue font-bold text-[20px] text-left whitespace-wrap`}>
          {message}
        </p>
        <CustomButton
          handleClick={handleClick}
          title="ok"
          styles="bg-[#116f41] min-h-[32px] mt-[10px] ml-[90%] mr-0"
        ></CustomButton>
      </div>
    </div>
  );
};

export default Logger;
