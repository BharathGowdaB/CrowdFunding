import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import { Sidebar, Navbar, Loader, Logger } from "../components";
import { Home, CreateProject, Profile, UserDetails, ProjectDetails, Project, Milestone } from "./";

import { useStateContext } from "../context";

const User = () => {
  const context = useStateContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [Logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });

  const [userAddress, setUserAddress] = useState('')
  const [isStarter, setIsStarter] = useState(true)


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
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      {isLoading && <Loader />}
      {isLogging && <Logger {...Logger} />}
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar isStarter={isStarter}/>
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar isStarter={isStarter}/>

        <Routes>
          <Route path="/create-project" element={<CreateProject  isStarter={isStarter} userAddress={userAddress}/>} />
          <Route path="/profile" element={<Profile isStarter={isStarter} userAddress={userAddress}/>} />
          <Route path="/user/:userAddress" element={<UserDetails />} />
          <Route path="/project/:projectAddress" element={<Project isStarter={isStarter} userAddress={userAddress}/>} />
          <Route path="/milestone/:projectAddress" element={<Milestone isStarter={isStarter} userAddress={userAddress}/>} />
          <Route path="/project-details/:projectAddress" element={<ProjectDetails />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;
