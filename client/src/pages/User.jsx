import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import { Sidebar, Navbar, Loader, Logger } from "../components";
import { Home, CreateProject, Profile, UserDetails } from "./";

import { useStateContext } from "../context";

const User = ({userAddress, isStarter}) => {
  const context = useStateContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [Logger, setLogger] = useState({
    on: false,
    error: false,
    message: "",
  });

  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      {isLoading && <Loader />}
      {isLogging && <Logger {...Logger} />}
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/create-project" element={<CreateProject  isStarter={isStarter} userAddress={userAddress}/>} />
          <Route path="/profile" element={<Profile isStarter={isStarter} userAddress={userAddress}/>} />
          <Route path="/user/:userAddress" element={<UserDetails />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;
