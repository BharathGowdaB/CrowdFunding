import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import { ethers } from "ethers";
import User from './User';

const App = () => {

  const [starterAddress, setStarterAddress] = useState("0xbE8E1F900047B83d0212ad562D5E39c68A02DE4d") //ethers.constants.AddressZero)
  const [backerAddress, setBackerAddress] = useState(ethers.constants.AddressZero)

  return (
    <div>
      <Routes>
          <Route path="/login" element={ <div>login page</div>} />
          <Route path="/signup" element={ <div>Signup page</div>} />
          <Route path="/*" element={<User isStarter={starterAddress ? true : false} userAddress={starterAddress || backerAddress}/>} />
      </Routes>
    </div>
  );
};

export default App;
