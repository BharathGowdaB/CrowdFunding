import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';
import ContractAddress from "../../../config/contractAddress.json";
import starterABI from "../../../abi/starter.json";
import databaseABI from "../../../abi/database.json";
import crowdfundingABI from '../../../abi/crowdfunding.json';
import projectABI from "../../../abi/project.json";
import userABI from "../../../abi/user.json";
import errorCode from "../../../config/erroCode.json";

export const Address = {
  ...ContractAddress
}

export const ABI = {
  starterABI,
  databaseABI,
  crowdfundingABI,
  projectABI,
  userABI
}

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/home',
  },
  {
    name: 'project',
    imgUrl: createCampaign,
    link: '/create-project',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '/home',
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/home',
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

