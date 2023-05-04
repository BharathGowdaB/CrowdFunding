import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import { ethers } from "ethers";
import { Login, Signup, User } from './pages';

const App = () => {
  
  return (
    <div>
      <Routes>
          <Route path="/login" element={ <Login />} />
          <Route path="/signup" element={ <Signup />} />
          <Route path="/*" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
