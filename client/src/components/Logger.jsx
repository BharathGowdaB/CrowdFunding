import React from "react";
import CustomButton from "./CustomButton";

const Logger = ({ error, message, handleClick } = {}) => {
  return (
    <div className="fixed inset-0 z-50 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <div className="w-[600px] bg-[#13131a] px-8 py-4 rounded-[12px] text-[#808191] max-h-[80%] snap-y">
        <h2 className=" font-bold text-white text-[32px] ">
          {error ? "Error" : "Alert"}
        </h2>
        <p className="mt-[20px] font-epilogue font-bold text-[20px] text-left whitespace-wrap">
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
