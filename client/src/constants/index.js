import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';
import ContractAddress from "../../../config/contractAddress.json";
import starterABI from "../../../abi/starter.json";
import databaseABI from "../../../abi/database.json";
import crowdfundingABI from '../../../abi/crowdfunding.json';
import projectABI from "../../../abi/project.json";
import startupABI from "../../../abi/startup.json";
import charityABI from "../../../abi/charity.json";
import userABI from "../../../abi/user.json";
import backerABI from "../../../abi/backer.json";
import milestoneABI from "../../../abi/milestone.json";
import errorCode from "../../../config/erroCode.json";

export const Address = {
  ...ContractAddress
}



export const ABI = {
  starterABI,
  databaseABI,
  crowdfundingABI,
  projectABI,
  startupABI,
  charityABI,
  userABI,
  backerABI,
  milestoneABI
}
  


export const starterNavlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/home',
  },
  {
    name: 'create-project',
    imgUrl: createCampaign,
    link: '/create-project',
  },
  {
    name: 'project',
    imgUrl: payment,
    link: '/project/',
  },
  {
    name: 'milestone',
    imgUrl: withdraw,
    link: '/milestone/',
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/login',
  },
];

export const backerNavlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/home',
  },
  {
    name: 'project',
    imgUrl: payment,
    link: '/project/',
  },
  {
    name: 'milestone',
    imgUrl: withdraw,
    link: '/milestone/',
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/login',
  },
];


export const ErrorCode = {
  ...errorCode
}

