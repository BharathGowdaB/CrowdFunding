const { ethers  } = require("hardhat");
const { expect } = require("chai");
const deployer = require("../utils/contractDeployer")
const { VerificationState} = require("../config/enumDefinitions")
const { initConstants , initDefinitions} = require('../utils/configInitializer.js')

const constants = {
    maxGetProjectList : 4
}

let app;
let db;

async function deployContract() {
    const enumList = require('../config/enumDefinitions.js')
    const structList = require('../config/structDefinitions.js')
    await initDefinitions(enumList, structList)

    const constList = require('../config/constants.js')
    constList.maxGetProjectList.value = constants.maxGetProjectList
    await initConstants(constList)

    const {dbAddress , crowdfundingAddress, charityLamdaAddress, startupLamdaAddress, validatorAddress} = await deployer.deployContracts()
    app = await (await ethers.getContractFactory('Crowdfunding')).attach(crowdfundingAddress);
    db = await (await ethers.getContractFactory("DatabaseSorter")).attach(dbAddress);
    charityLamda = await (await ethers.getContractFactory("CharityLamda")).attach(charityLamdaAddress);
    startupLamda = await (await ethers.getContractFactory("StartupLamda")).attach(startupLamdaAddress);
    validator = await (await ethers.getContractFactory("Validator")).attach(validatorAddress);

    return {app, db, charityLamda, startupLamda, validator}
}

async function createProjects(starterAddress, n, isCharity = false) {
    const Starter = await ethers.getContractFactory('Starter')
    const project = {
        title : 'Startup',
        description : 'testing',
        amountRequired : 100,
        fundingDuration : 60 * 60 * 1000 + 1,
        isCharity 
      }
    for (i = 0 ; i < n ; i++){
        await Starter.attach(starterAddress).createProject(i + project.title , project.description, project.amountRequired, project.fundingDuration, project.isCharity )
    }
}


module.exports = {
    VerificationState,
    deployContract,
    createProjects,
    constants,
    starterDetails : {
        name: 'Bharath',
        email: 'bharath@gmail.com',
        password: '231020@Bb',
    },
    backerDetails : {
        name: "Girish",
        email: "giri@gmail.com",
        password: "231020@Bb"
    }

}

