const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function dbDeployer() {
  const Database = await ethers.getContractFactory("DatabaseSorter");
  const db = await Database.deploy();

  await db.deployed();

  return db.address;
}

async function milestoneLamdaDeployer() {
  const MilestoneLamda = await ethers.getContractFactory("MilestoneLamda");
  const milestoneLamda = await MilestoneLamda.deploy();

  await milestoneLamda.deployed();

  return milestoneLamda.address
}

async function lamdaDeployer() {
  const StartupLamda = await ethers.getContractFactory("StartupLamda");
  const startupLamda = await StartupLamda.deploy();

  await startupLamda.deployed();

  const CharityLamda = await ethers.getContractFactory("CharityLamda");
  const charityLamda = await CharityLamda.deploy();

  await charityLamda.deployed();

  const BackerLamda = await ethers.getContractFactory("BackerLamda");
  const backerLamda = await BackerLamda.deploy();

  await backerLamda.deployed();

  return {
    startupLamdaAddress : startupLamda.address,
    charityLamdaAddress : charityLamda.address,
    backerLamdaAddress: backerLamda.address
  };
}

async function validatorDeployer(){
  const Validator = await ethers.getContractFactory("Validator");
  const validator = await Validator.deploy();

  await validator.deployed();

  return validator.address;
}

async function crowdfundingDeployer() {
  await hre.run('compile',{
    force: true,
    quiet: true
  })
  
  // Contract Deployment -----------------------------------
  const App = await ethers.getContractFactory("Crowdfunding");
  const app = await App.deploy();

  await app.deployed();

  return app.address;
}

async function deployContracts() {
  await hre.run('compile',{
    force: true,
    quiet: true
  })

  const dbAddress = await dbDeployer();
  const validatorAddress = await validatorDeployer();

  // Saving dbAddress in Solidity file-------------------------------------
  const solPath =  path.resolve(__dirname , '..', 'contracts' , 'utils' ,'address.sol');

  fs.writeFileSync(solPath, `//SPDX-License-Identifier: UNLICENSED \npragma solidity >=0.7.0 <0.9.0; 
\naddress constant dbAddress = ${dbAddress} ; 
address constant validatorAddress = ${validatorAddress} ; 
address constant charityLamdaAddress = ${validatorAddress} ;
address constant startupLamdaAddress = ${validatorAddress} ;
address constant milestoneLamdaAddress = ${validatorAddress} ;
address constant backerLamdaAddress = ${validatorAddress} ;
`);

await hre.run('compile',{
  force: true,
  quiet: true
})

const milestoneLamdaAddress = await milestoneLamdaDeployer();

fs.writeFileSync(solPath, `//SPDX-License-Identifier: UNLICENSED \npragma solidity >=0.7.0 <0.9.0; 
\naddress constant dbAddress = ${dbAddress} ; 
address constant validatorAddress = ${validatorAddress} ; 
address constant charityLamdaAddress = ${validatorAddress} ;
address constant startupLamdaAddress = ${validatorAddress} ;
address constant milestoneLamdaAddress = ${milestoneLamdaAddress} ;
address constant backerLamdaAddress = ${validatorAddress} ;
`);

  await hre.run('compile',{
    force: true,
    quiet: true
  })

  const {startupLamdaAddress, charityLamdaAddress, backerLamdaAddress} =  await lamdaDeployer();

  // Saving dbAddress in Solidity file-------------------------------------

  fs.writeFileSync(solPath, `//SPDX-License-Identifier: UNLICENSED \npragma solidity >=0.7.0 <0.9.0; 
\naddress constant dbAddress = ${dbAddress} ; 
address constant validatorAddress = ${validatorAddress} ; 
address constant charityLamdaAddress = ${charityLamdaAddress} ;
address constant startupLamdaAddress = ${startupLamdaAddress} ;
address constant milestoneLamdaAddress = ${milestoneLamdaAddress} ;
address constant backerLamdaAddress = ${backerLamdaAddress} ;
`);
  
  const crowdfundingAddress = await crowdfundingDeployer();

  return {dbAddress , crowdfundingAddress, charityLamdaAddress, startupLamdaAddress,milestoneLamdaAddress,backerLamdaAddress, validatorAddress }
}

module.exports = { deployContracts }