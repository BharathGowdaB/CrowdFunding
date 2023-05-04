const { ethers  } = require("hardhat");
const { expect } = require("chai");
const deployer = require("../utils/contractDeployer")
const { VerificationState, BackerOption} = require("../../config/enumDefinitions")
const { initConstants , initDefinitions} = require('../utils/configInitializer.js')

const constants = require('../../config/constants');
constants.maxGetProjectList.value = '4'
constants.maxGetProjectList.realValue = 4

let app;
let db;

async function deployContract() {
    const enumList = require('../../config/enumDefinitions.js')
    const structList = require('../../config/structDefinitions.js')
    await initDefinitions(enumList, structList)


    await initConstants(constants)

    const {dbAddress , crowdfundingAddress, charityLamdaAddress, startupLamdaAddress,milestoneLamdaAddress, backerLamdaAddress, validatorAddress} = await deployer.deployContracts()
    app = await (await ethers.getContractFactory('Crowdfunding')).attach(crowdfundingAddress);
    db = await (await ethers.getContractFactory("DatabaseSorter")).attach(dbAddress);
    charityLamda = await (await ethers.getContractFactory("CharityLamda")).attach(charityLamdaAddress);
    startupLamda = await (await ethers.getContractFactory("StartupLamda")).attach(startupLamdaAddress);
    validator = await (await ethers.getContractFactory("Validator")).attach(validatorAddress);
    milestoneLamda = await (await ethers.getContractFactory("StartupLamda")).attach(milestoneLamdaAddress);
    backerLamda = await (await ethers.getContractFactory("BackerLamda")).attach(backerLamdaAddress);

    return {app, db, charityLamda, startupLamda,milestoneLamda,backerLamda, validator}
}

async function createProjects(starterAddress, n, isCharity = false) {
    const Starter = await ethers.getContractFactory('Starter')

    const project = {
        title : 'Startup',
        description : 'testing',
        amountRequired : constants.fundingDenomination.realValue * 10,
        fundingDuration : constants.minFundingPeriod.realValue + 10,
        isCharity 
      }
    for (i = 0 ; i < n ; i++){
        await Starter.attach(starterAddress).createProject(i + project.title , project.description, project.amountRequired, project.fundingDuration, project.isCharity, "test" )
    }
}


module.exports = {
    VerificationState,
    BackerOption,
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

