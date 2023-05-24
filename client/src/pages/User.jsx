import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import { Sidebar, Navbar } from "../components";
import { Home, CreateProject, Profile, UserDetails, Project, Milestone } from "./";

const User = () => {
  const navigate = useNavigate();

  const [userAddress, setUserAddress] = useState('')
  const [isStarter, setIsStarter] = useState(true)

  const [WhiteTheme, setIsWhiteTheme] = useState(true)

  useEffect(() => {
    if(!(userAddress)){
      const address = window.sessionStorage.getItem("userAddress")
      if(!( address )) navigate('/login')
      else{
        setUserAddress(address)
        setIsStarter(window.sessionStorage.getItem("isStarter") == "true")
      }
    }
  },[])
  
  return (
    <div className={`relative sm:-8 p-4 min-h-screen flex flex-row ${WhiteTheme ? "bg-[#f5fafe] text-[#010101]" : "bg-[#13131a]"}`}>
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar isStarter={isStarter} setIsWhiteTheme={setIsWhiteTheme} WhiteTheme={WhiteTheme}/>
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar isStarter={isStarter} WhiteTheme={WhiteTheme}/>

        <Routes>
          <Route path="/home" element={<Home WhiteTheme={WhiteTheme}/>} />
          <Route path="/create-project" element={<CreateProject  isStarter={isStarter} userAddress={userAddress} WhiteTheme={WhiteTheme}/>} />
          <Route path="/profile" element={<Profile isStarter={isStarter} userAddress={userAddress} WhiteTheme={WhiteTheme}/>} />
          <Route path="/user/:userAddress" element={<UserDetails WhiteTheme={WhiteTheme}/>} />
          <Route path="/project/:projectAddress" element={<Project isStarter={isStarter} userAddress={userAddress} WhiteTheme={WhiteTheme}/>} />
          <Route path="/project/" element={<Project isStarter={isStarter} userAddress={userAddress} WhiteTheme={WhiteTheme}/>} />
          <Route path="/milestone/:projectAddress" element={<Milestone isStarter={isStarter} userAddress={userAddress} WhiteTheme={WhiteTheme}/>} />
          <Route path="/milestone/" element={<Milestone isStarter={isStarter} userAddress={userAddress} WhiteTheme={WhiteTheme}/>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;
