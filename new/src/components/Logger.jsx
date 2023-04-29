import React from 'react'
import CustomButton from './CustomButton'


const Logger = ({ error , message, handleClick} = {}) => {
  return (
    <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <h2 className="text-white font-bold text-[32px] ">{error ? 'Error': 'Alert'}</h2>
      <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">{message}</p>
      <CustomButton
        handleClick={handleClick}
        title = "ok"
        styles = "bg-[#1dc071] min-h-[32px] mt-[10px]"
      ></CustomButton>
    </div>
  )
}

export default Logger