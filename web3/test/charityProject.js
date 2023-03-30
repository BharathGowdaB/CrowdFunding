const { ethers  } = require("hardhat");
const { expect } = require("chai");
const {VerificationState, deployContract, starterDetails, createProjects} = require('./util.js');
const { ProjectState } = require("../config/enumDefinitions.js");

let app ;
let db ;
let charityAddress;
let Charity;

before(async () => {
  constracts = await deployContract();
  app = constracts.app;
  db = constracts.db;

  Charity = await ethers.getContractFactory("Charity")
  await app.createStarter(starterDetails.name, 'CharityTestcase@gmail.com' , starterDetails.password)
  const user = await app.authenticateStarter('CharityTestcase@gmail.com' , starterDetails.password)

  await app.verifyStarter(user, VerificationState.verified)
  
  await createProjects(user, 1 , true)

  Starter = await ethers.getContractFactory("Starter")

  const [list, count] = await Starter.attach(user).getProjectList({skip: 0});
  charityAddress = list[0]
})


describe("Charity Contract", function () {
  it("Should Project be Charity Project", async () => {
    expect(await Charity.attach(charityAddress).isCharity()).equals(true);
  })
})
  
//   it("should deploy the contract with the correct values", async function () {
//     expect(await charity.title()).to.equal("Test Project");
//     expect(await charity.description()).to.equal("This is a test project.");
//     expect(await charity.amountRequired()).to.equal(ethers.utils.parseEther("100"));
//     expect(await charity.startTime()).to.be.closeTo(Math.floor(Date.now() / 1000), 20);
//     expect(await charity.endTime()).to.be.closeTo(Math.floor(Date.now() / 1000) + 86400, 20);
//     expect(await charity.isCharity()).to.be.true;
//     expect(await charity.state()).to.equal(0);
//   });

//   it("should release funds when called by the owner", async function () {
//     await charity.releaseFunds();
//     expect(await charity.state()).to.equal(1);
//   });

//   it("should abort the project when called by the creator within the time limit", async function () {
//     await charity.abortProject();
//     expect(await charity.state()).to.equal(5);
//   });
// });
