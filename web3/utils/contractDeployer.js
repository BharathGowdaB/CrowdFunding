const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function dbDeployer() {
  await hre.run('compile',{
    force: true,
    quiet: true
  })

  // Contract Deployment --------------------------------------
  const [owner, otherAccount] = await ethers.getSigners();

  const Database = await ethers.getContractFactory("DatabaseSorter");
  const db = await Database.deploy();

  await db.deployed();

  dbAddress = db.address;
  
  // Saving dbAddress in Solidity file-------------------------------------
  const solPath =  path.resolve(__dirname , '..', 'contracts' , 'utils' ,'db.address.sol');

  fs.writeFileSync(solPath, `//SPDX-License-Identifier: UNLICENSED \npragma solidity >=0.7.0 <0.9.0; \n\naddress constant dbAddress = ${dbAddress} ;`);

  return dbAddress;
}

async function crowdfundingDeployer() {
  await hre.run('compile',{
    force: true,
    quiet: true
  })
  
  // Contract Deployment -----------------------------------
  const [owner, otherAccount] = await ethers.getSigners();

  const App = await ethers.getContractFactory("Crowdfunding");
  const app = await App.deploy();

  await app.deployed();
  crowdfundingAddress = app.address;

  return crowdfundingAddress
}

async function deployContracts() {
  const dbAddress = await dbDeployer();
  const crowdfundingAddress = await crowdfundingDeployer();

  const size = (await ethers.provider.getCode(dbAddress)).length / 2;
  console.log("DatababseSorter :", '\n\taddress: ', dbAddress , "\n\tsize: ", size) 
  

  const size2 = (await ethers.provider.getCode(crowdfundingAddress)).length / 2;
  console.log("Crowdfunding :", '\n\taddress: ', crowdfundingAddress , "\n\tsize: ", size2,'\n')

  return {dbAddress , crowdfundingAddress}
}

module.exports = { deployContracts }