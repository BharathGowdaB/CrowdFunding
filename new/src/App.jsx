import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import { ethers } from "ethers";
import { Login, Signup, User } from './pages';

const App = () => {
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState('')
  const [isStarter, setIsStarter] = useState(true)


  useEffect(() => {
    if(!(userAddress)){
      const starter = window.sessionStorage.getItem("starterAddress")
      const backer = window.sessionStorage.getItem("backerAddress")
      if(!(starter || backer)) navigate('/login')
      else{
        setUserAddress(starter || backer)
        if(starter) setIsStarter(true)
        else setIsStarter(false)
      }
    }
  },[])
  
  return (
    <div>
      <Routes>
          <Route path="/login" element={ <Login />} />
          <Route path="/signup" element={ <Signup />} />
          <Route path="/*" element={<User isStarter={isStarter} userAddress={userAddress}/>} />
      </Routes>
    </div>
  );
};

export default App;
