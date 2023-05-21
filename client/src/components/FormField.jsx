import React from 'react'

const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange, WhiteTheme }) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className={`font-epilogue font-medium text-[14px] leading-[22px] ${WhiteTheme? "text-[#4f4f50]" : "text-[#808191]"} mb-[10px]`}>{labelName}</span>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={4}
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px]  ${WhiteTheme ? "border-[#3a3a43]" : "bg-transparent text-white  border-[#4b5264]"} font-epilogue text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] ${WhiteTheme ? "border-[#3a3a43]" : "bg-transparent text-white  border-[#4b5264]"} font-epilogue  text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      )}
    </label>
  )
}

export default FormField