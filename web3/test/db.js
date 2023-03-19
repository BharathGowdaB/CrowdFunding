const { ethers  } = require("hardhat");
const { expect } = require("chai");
const deployer = require("../utils/deployer")
const {verificationState, VerificationState} = require("../config/enumDefinitions")

let app ;
let db ;

before(async () => {
  const { dbAddress, crowdfundingAddress} = await deployer.deployContracts()
  app = await (await ethers.getContractFactory('Crowdfunding')).attach(crowdfundingAddress);
  db = await (await ethers.getContractFactory("DatabaseSorter")).attach(dbAddress);
})
