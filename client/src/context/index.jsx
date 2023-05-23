import React, { useContext, createContext } from 'react';

import milestoneABI from "../../../abi/milestone.json";
import { ethers } from 'ethers';
import { Address, ABI , ErrorCode } from '../constants/index';

const StateContext = createContext();

const BackerOption = {
  "start": 0,
  "refund": 1,
  "milestone": 2,
  "end": 3
} 
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

const databaseContract = new ethers.Contract(ethers.utils.getAddress(Address.dbAddress), ABI.databaseABI, provider);
const crowdfundingContract = new ethers.Contract(ethers.utils.getAddress(Address.crowdfundingAddress), ABI.crowdfundingABI, signer);
const projectContract = new ethers.Contract(ethers.constants.AddressZero, ABI.projectABI, provider);
const startupContract = new ethers.Contract(ethers.constants.AddressZero, ABI.startupABI, signer);
const charityContract = new ethers.Contract(ethers.constants.AddressZero, ABI.charityABI, signer);
const milestoneContract = new ethers.Contract(ethers.constants.AddressZero, milestoneABI, provider);
const userContract = new ethers.Contract(ethers.constants.AddressZero, ABI.userABI, provider);
const starterContract = new ethers.Contract(ethers.constants.AddressZero, ABI.starterABI, signer);
const backerContract = new ethers.Contract(ethers.constants.AddressZero, ABI.backerABI, signer);

export const StateContextProvider = ({ children }) => {

  const getBalance = async (address) => {
    const balance =  await provider.getBalance(address)
    return ethers.utils.formatUnits(balance, 18)
  }

  const getLastNTransactions = async (address, n = 10) => {
    try {
      
      const list = await provider.getLogs({
        address,
        fromBlock: 0,
        toBlock: 'latest'
      })

      const transactionList = []
      for(let i = 0 ; i< list.length ; i++) {
        let log =  projectContract.interface.parseLog(list[i])

        const transaction = {
          value : ethers.utils.formatUnits(log.args[1], 18),
          address: log.args[0],
           time: new Date(parseInt(log.args[2]) * 1000).toISOString()
        }
   
        if(log.name == "fundsReleased") {
          transaction.isdebit = true
        }

        transactionList.push(transaction)
      }
     
      return transactionList
    } catch (error) {
        console.error('Error retrieving transaction history:', error);
      return []
    }
  }

  const processTransactionError =  (error) => {
    const reason = error.reason ? error.reason : error.toString()
    const errorCode = ErrorCode[reason.split(/execution reverted: /, 2)[1]] ? parseInt(reason.split(/execution reverted: /, 2)[1]) : 0

    const message = errorCode == 0 ? reason : ErrorCode[errorCode]

    return { message, errorCode};
  }

  const processViewError =  (error) => {
    const errorCode = ErrorCode[error.reason] ? parseInt(error.reason) : 0

    const message = (errorCode == 0) ? error.toString() : ErrorCode[errorCode]

    return { message, errorCode};
  }

  const getPublicAddress = async(email, isStarter) => {
    const userAddress = isStarter ? await crowdfundingContract.starterList(email) : await crowdfundingContract.backerList(email)
    
    return await userContract.attach(userAddress).id()
  
  }

  const getPublicAddressByAddress = async(userAddress) => {
    return await userContract.attach(userAddress).id()
  
  }

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

  const getProjectDetails = async(projectAddress, userAddress) => {
    const response = await projectContract.attach(projectAddress).getProjectDetails()
    const amountRaised = await projectContract.attach(projectAddress).amountRaised()

    const details = {
      title: response.title,
      description: response.description,
      endTime: parseInt(response.endTime),
      backersCount: parseInt(response.backersCount),
      state: parseInt(response.state),
      amountRequired : ethers.utils.formatUnits(response.amountRequired, 18),
      amountRaised : ethers.utils.formatUnits(amountRaised, 18),
      starterId: await projectContract.attach(projectAddress).starterId(),
      isCharity: await projectContract.attach(projectAddress).isCharity(),
      image: await databaseContract.getProjectImage(projectAddress),
      balance: await getBalance(projectAddress),
    }

    return details
  }

  const getProjectVote = async (userAddress, projectAddress) => {
    const res =  {
      isTerminate: await startupContract.attach(projectAddress).endProjectVotes(userAddress || ethers.constants.AddressZero),
      votes: await startupContract.attach(projectAddress).cumulativeVotes(),
      maxVotes: await startupContract.attach(projectAddress).amountRaised()
    } 
    return res;
  }

  const getMilestoneDetails = async(userAddress, milestoneAddress ) => {
    const response = await milestoneContract.attach(milestoneAddress).getMilestoneDetails()
    
    const details = {
      title: response.title,
      description: response.description,
      endTime: parseInt(response.startTime),
      state: parseInt(response.state),
      fundsRequired : ethers.utils.formatUnits(response.fundsRequired, 18),
      returnAmount : ethers.utils.formatUnits(response.returnAmount, 18),
      vote : await milestoneContract.attach(milestoneAddress).votes(userAddress)
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

  const getProjectMilestone = async(projectAddress) => {
    let list = [];
    const [milestoneAddress, count] = await startupContract.attach(projectAddress).getMilestone(0)

    for(let i = 0 ; i < count ; i++){
      list.push((await startupContract.attach(projectAddress).getMilestone(i))[0])
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

  const fundProject = async (userAddress, projectAddress, fundValue) => {
    return await backerContract.attach(userAddress).fundProject(projectAddress, { value: fundValue});
  }

  const releaseFunds = async (projectAddress) => {
    return await charityContract.attach(projectAddress).releaseFunds()
  }

  const startProject = async (projectAddress, userAddress, isStarter) => {
    if(isStarter) 
      return await startupContract.attach(projectAddress).startProject()    
    else 
      return await backerContract.attach(userAddress).updateProject(projectAddress, BackerOption.start, false)
  }

  const abortProject = async (projectAddress , isCharity) => {
    if(isCharity)
      return await charityContract.attach(projectAddress).abortProject()
    else 
      return await startupContract.attach(projectAddress).abortProject()
  }

  const endProject = async (userAddress, projectAddress, vote) => {
    return await backerContract.attach(userAddress).updateProject(projectAddress, BackerOption.end, vote);
  }

  const refundBackerFunds = async (userAddress, projectAddress) => {
    return await backerContract.attach(userAddress).updateProject(projectAddress, BackerOption.refund, false)
  }

  const addNewMilestone = async (projectAddress, form) => {
    return await startupContract.attach(projectAddress).addMilestone(form.title, form.description, form.fundsRequired, form.returnAmount);
  }

  const voteMilestone = async (userAddress, milestoneAddress, vote) => {
    return await backerContract.attach(userAddress).updateProject(milestoneAddress, BackerOption.milestone, vote);
  }

  const startMilestone = async (projectAddress, milestoneAddress) => {
    return await startupContract.attach(projectAddress).releaseMilestoneFunds(milestoneAddress)
  }

  const endMilestone = async (projectAddress, milestoneAddress, returnAmount) => {
    return await startupContract.attach(projectAddress).endMilestone(milestoneAddress, {value: ethers.utils.parseUnits('0' + returnAmount, "ether")})
  }

  const getMilestoneVotes = async (projectAddress, milestoneAddress) => {
    const res = {
      result: await milestoneContract.attach(milestoneAddress).getVotingResult(),
      votes: await milestoneContract.attach(milestoneAddress).cumulativeVotes(),
      maxVotes: await projectContract.attach(projectAddress).amountRaised()
    }

    return res
  }
  
  const addLogMessage = async (userAddress, isStarter, projectAddress, message) => {
    if(isStarter) return await databaseContract.connect(signer).addLogMessage(projectAddress, message)
    else return await backerContract.attach(userAddress).logMessage(projectAddress, message)
  }

  const getLogMessage = async (projectAddress) => {
    let list = [];
    const [message, count] = await databaseContract.getLogMessage(projectAddress, 0)

    for(let i = 0 ; i < count ; i++){
      list.push(( await databaseContract.getLogMessage(projectAddress, i))[0])
    }

    return [list, count]
  }

  return (
    <StateContext.Provider
      value={{ 
        getBalance,
        getLastNTransactions,
        processTransactionError,
        processViewError,
        getPublicAddress,
        getPublicAddressByAddress,
        getUserDetails,
        getUserProjects,
        getProjectList,
        getProjectDetails,
        getProjectMilestone,
        getMilestoneDetails,
        getMilestoneVotes,
        getProjectVote,
        
        checkStarterVerified,
        applyForVerification,
        
        createUser,
        authenticatUser,

        addNewMilestone,
        voteMilestone,
        startMilestone,
        endMilestone,

        createProject,
        fundProject,
        abortProject,
        startProject,
        endProject,

        releaseFunds,
        refundBackerFunds,

        addLogMessage,
        getLogMessage
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);