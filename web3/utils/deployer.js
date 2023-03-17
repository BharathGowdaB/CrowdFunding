const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function dbDeployer() {

  // Contract Deployment --------------------------------------
  const [owner, otherAccount] = await ethers.getSigners();

  const Database = await ethers.getContractFactory("DatabaseSorter");
  const tx = await Database.deploy({overwrite: true });

  console.log(tx)
  const db = await tx.deployTransaction.wait();
  dbAddress = db.contractAddress;

  // Saving dbAddress in Solidity file-------------------------------------
  const solPath =  path.resolve(__dirname , '..', 'contracts' , 'utils' ,'db.address.sol');

  fs.writeFileSync(solPath, `address constant dbAddress = ${dbAddress} ;`);

  run('compile')

  return dbAddress;
}


async function crowdfundingDeployer() {
  
  // Contract Deployment -----------------------------------
  const [owner, otherAccount] = await ethers.getSigners();

  const App = await ethers.getContractFactory("Crowdfunding");
  const tx = await App.deploy();

  const app = await tx.deployTransaction.wait();

  crowdfundingAddress =  app.contractAddress;

  return crowdfundingAddress
}

async function deployContracts() {
  const dbAddress = await dbDeployer();
  const crowdfundingAddress = await crowdfundingDeployer();

  return {dbAddress , crowdfundingAddress}
}

module.exports = { deployContracts }