import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const checkMetamaskConnection = async () => {
  if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
    try {
      // Request connection to MetaMask
      await window.ethereum.enable();
      
      // Connection successful
      console.log('Connected to MetaMask!');

      const provider = new ethers.providers.Web3Provider(window.ethereum)

      // MetaMask requires requesting permission to connect users accounts
      provider.send("eth_requestAccounts", [])
    } catch (error) {
      // Connection failed
      console.error('Failed to connect to MetaMask:', error);
      throw new Error("Failed to connect to MetaMask")
    }
  } else {
    // MetaMask is not installed or not enabled
    // Handle the error
    console.error('MetaMask is not installed or not enabled.');
    throw new Error("Metamask Not Installed")
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));

checkMetamaskConnection().then(res => {

  root.render(
    <div>
      <Router>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </Router>
    </div>
      
  )
}).catch(err => {
  root.render(
    <>
      <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
        <h2 className="text-white font-bold text-[32px] ">{'Error'}</h2>
      <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">{err.toString()}</p>
  </div>
    </>
    
  )
})
