const { time, loadFixture, } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require('hardhat')
const { expect } = require("chai");

// describe("Project", async function () {
   
//   async function deployNewProject() {
//     const title = 'Crowdfunding'
//     const description = 'Crowdfunding is the easiest way to raise funds'
//     const amountRequired = 100000
//     const endDate = Date.now() + 1000

//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();

//     const Project = await ethers.getContractFactory("Project");
//     const project = await Project.deploy(title, description , amountRequired, endDate);

//     return {owner:owner.address, project , title, description, amountRequired, endDate};
//   }

//   describe("Deployment", async function () {
//     it("Should successfully deployed to network", async function () {
//         const {owner, project,  title, description, amountRequired, endDate} = await loadFixture(deployNewProject);

//         expect(project).not.undefined;

//         const projectDetails = await project.getProjectDetails()

//         expect(projectDetails).to.deep.equals([ owner, title, description,  ethers.BigNumber.from(amountRequired) , ethers.BigNumber.from(0)])
//     });



//   });
// });
