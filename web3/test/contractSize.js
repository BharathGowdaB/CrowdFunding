const { ethers  } = require("hardhat");
const { expect } = require("chai");
const {VerificationState, deployContract, starterDetails, backerDetails} = require('./util.js')


before(async () => {
    const {db , app, charityLamda, startupLamda, milestoneLamda,backerLamda, validator} = await deployContract();

    console.log("DatababseSorter :", '\n\taddress: ', db.address , "\n\tsize: ", (await ethers.provider.getCode(db.address)).length / 2) 
    console.log("StartupLamda :", '\n\taddress: ', startupLamda.address , "\n\tsize: ", (await ethers.provider.getCode(startupLamda.address)).length / 2) 
    console.log("CharityLamda :", '\n\taddress: ', charityLamda.address , "\n\tsize: ", (await ethers.provider.getCode(charityLamda.address)).length / 2) 
    console.log("MilestoneLamda :", '\n\taddress: ', milestoneLamda.address , "\n\tsize: ", (await ethers.provider.getCode(milestoneLamda.address)).length / 2) 
    console.log("BackerLamda :", '\n\taddress: ', backerLamda.address , "\n\tsize: ", (await ethers.provider.getCode(backerLamda.address)).length / 2) 
    console.log("Validator :", '\n\taddress: ', validator.address , "\n\tsize: ", (await ethers.provider.getCode(validator.address)).length / 2) 
    console.log("Crowdfunding :", '\n\taddress: ', app.address , "\n\tsize: ", (await ethers.provider.getCode(app.address)).length / 2) 

})

it("Should Return Contract Sizes", async() => {

})
