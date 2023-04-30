import React, { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ethers } from 'ethers';
import { Address, ABI , ErrorCode} from '../constants/index';

// Has to change
Address["starterAddress"] = '0x4c30Aa76180Ea5b52ef6d30de8E5B687d16E920a';

const StateContext = createContext();

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

const databaseContract = new ethers.Contract(ethers.utils.getAddress(Address.dbAddress), ABI.databaseABI, provider);
const crowdfundingContract = new ethers.Contract(ethers.utils.getAddress(Address.crowdfundingAddress), ABI.crowdfundingABI, signer);
const projectContract = new ethers.Contract(ethers.constants.AddressZero, ABI.projectABI, provider);
const userContract = new ethers.Contract(ethers.constants.AddressZero, ABI.userABI, provider);
const starterContract = new ethers.Contract(ethers.constants.AddressZero, ABI.starterABI, signer);

export const StateContextProvider = ({ children }) => {

  const createProject = async (starterAddress, form) => {
    if(form.fundingDuration < 0) throw {reason: 'execution reverted: 431'}
    return await starterContract.attach(starterAddress).createProject(
        form.title, 
        form.description,
        form.amountRequired,
        form.fundingDuration,
        form.isCharity,
        form.image
      )
  }

  const createUser = async(form)=>{
    if(form.isStarter)
      return await crowdfundingContract.createStarter(form.name, form.email, form.password);
    else
      return await crowdfundingContract.createBacker(form.name, form.email, form.password); 
  }

  const authenticatUser = async(form)=>{
    if(form.isStarter)
      return await crowdfundingContract.authenticateStarter(form.email, form.password);
    else
      return await crowdfundingContract.authenticateBacker(form.email, form.password); 
  }

  const getProjectList = async({skip = 0,recent=false, popular=false, onlyCharity=false, onlyStartup=false}) => {
    const noSort = !(recent || popular || onlyCharity || onlyStartup)

    return await databaseContract.getProjectList([skip, noSort, recent, popular, onlyCharity, onlyStartup])
  }

  const getProjectDetails = async(projectAddress) => {
    const response = await projectContract.attach(projectAddress).getProjectDetails()

    const details = {
      title: response.title,
      description: response.description,
      endTime: parseInt(response.endTime),
      amountRequired : ethers.utils.formatUnits(response.amountRequired, 18),
      amountRaised : ethers.utils.formatUnits(await projectContract.attach(projectAddress).amountRaised(), 18),
      starterId: await projectContract.attach(projectAddress).starterId(),
      isCharity: await projectContract.attach(projectAddress).isCharity(),
      image: await databaseContract.getProjectImage(projectAddress)
    }

    return details
  }

  const getUserDetails = async(userAddress) => {
    const details = await userContract.attach(userAddress).getDetails()
    return details
  }

  const getUserProjects = async(userAddress) => {
    let list = [];
    const [projectAddress, count] = await userContract.attach(userAddress).getProjectList(0)

    for(let i = 0 ; i < count ; i++){
      list.push((await userContract.attach(userAddress).getProjectList(i))[0])
    }

    return [list, count]
  }

  const checkStarterVerified = async(userAddress) => {
    const isVerified = await crowdfundingContract.checkStarterVerified(userAddress)
    return isVerified
  }

  const applyForVerification = async ({ email, password, name, panNumber}) => {
    await crowdfundingContract.documentVerification(email, password, [name, panNumber])
  }

  
  return (
    <StateContext.Provider
      value={{ 
        createProject,
        getProjectList,
        getProjectDetails,
        getUserDetails,
        getUserProjects,
        checkStarterVerified,
        applyForVerification,
        createUser,
        authenticatUser
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);