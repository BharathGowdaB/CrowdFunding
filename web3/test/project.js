const { ethers ,waffle } = require("hardhat");
const { expect } = require("chai");
const {VerificationState, deployContract, starterDetails, backerDetails, createProjects, constants} = require('./util.js');
const { ProjectState, MilestoneState } = require("../config/enumDefinitions.js");

let app ;
let db ;
let charityAddress;
let startupAddress;
let Charity;
let Startup;
let Project;
let Backer;
let Milestone;
let starterAddress;

const projectDetails = {
  title: 'Charity',
  description: 'Description',
  amountRequired: constants.fundingDenomination.realValue * 100,
  fundingDuration: 60 * 60 * 24,
  amountRaised: 0
}

before(async () => {
  constracts = await deployContract();
  app = constracts.app;
  db = constracts.db;

  Project = await ethers.getContractFactory("Project")
  Backer = await ethers.getContractFactory("Backer")
  Charity = await ethers.getContractFactory("CharityMock")
  Startup = await ethers.getContractFactory("StartupMock")
  Milestone = await ethers.getContractFactory("Milestone")

  const [owner, other1, other2] = await ethers.getSigners()

  await app.createStarter(starterDetails.name, 'CharityTestcase@gmail.com' , starterDetails.password)
  starterAddress  = await app.authenticateStarter('CharityTestcase@gmail.com' , starterDetails.password)

  Starter = await ethers.getContractFactory("Starter")

  const project = await Charity.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
  await project.deployed()
  
  charityAddress = project.address

  await app.connect(other1).createBacker(backerDetails.name, 'beforeEachMilestoneBacker1@gmail.com', backerDetails.password)
  await app.connect(other2).createBacker(backerDetails.name, 'beforeEachMilestoneBacker2@gmail.com', backerDetails.password)
    
})



// describe("Project Contract:", async() => {
//   it("Should Return Project Details", async() => {
//     expect((await Charity.attach(charityAddress).getProjectDetails()).title).equals(projectDetails.title)
//     expect((await Charity.attach(charityAddress).getProjectDetails()).amountRequired).equals(projectDetails.amountRequired)
//     expect(await Charity.attach(charityAddress).amountRaised()).equals(projectDetails.amountRaised)
//     expect((await Charity.attach(charityAddress).getProjectDetails()).backersCount).equals(0)
//     expect(await Charity.attach(charityAddress).isCharity()).equals(true)
//   })

//   it("Should Backer Able to Refund(return) their funds", async() => {
//       await app.createBacker(backerDetails.name, 'testProjectRefund@gmail.com', backerDetails.password)
//       const backer = await app.authenticateBacker('testProjectRefund@gmail.com', backerDetails.password);

//       const fundValue = constants.fundingDenomination.realValue * 2
//       const beforeAmountRaised = await Project.attach(charityAddress).amountRaised()

//       await Backer.attach(backer).fundProject(charityAddress, {value: fundValue})

//       expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised) + fundValue)

//       // 2nd Backer----
//       await app.createBacker(backerDetails.name, 'testProjectRefund2@gmail.com', backerDetails.password)
//       const backer2 = await app.authenticateBacker('testProjectRefund2@gmail.com', backerDetails.password);

//       const fundValue2 = constants.fundingDenomination.realValue * 4
//       await Backer.attach(backer2).fundProject(charityAddress, {value: fundValue2})

//       expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised) + fundValue + fundValue2)

//       const [owner, others] = await ethers.getSigners()

//       const backerBalance =  await ethers.provider.getBalance(owner.address)
//       const backerFunds = await  Project.attach(charityAddress).backers(backer)

//       expect(await  Project.attach(charityAddress).backers(backer)).equals(fundValue)
//       await Backer.attach(backer).returnProjectFunds(charityAddress)
//       expect(await  Project.attach(charityAddress).backers(backer)).equals(0)

//       expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised)  + fundValue2)

//   })

//   it("Should Not Backer Able to Refund funds after funding period is over", async() => {
//     await app.createBacker(backerDetails.name, 'testProjectRefundAfter@gmail.com', backerDetails.password)
//     const backer = await app.authenticateBacker('testProjectRefundAfter@gmail.com', backerDetails.password);

//     const fundValue = constants.fundingDenomination.realValue * 2
//     const beforeAmountRaised = await Project.attach(charityAddress).amountRaised()

//     await Backer.attach(backer).fundProject(charityAddress, {value: fundValue})

//     expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised) + fundValue)

//     await Charity.attach(charityAddress).setProjectState(ProjectState.ended, 0);

//     await expect(Backer.attach(backer).returnProjectFunds(charityAddress)).to.be.reverted
  
//   })
// })

// describe("Charity Contract:", function () {
//   beforeEach(async() => {
//     const project = await Charity.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
//     await project.deployed()
    
//     charityAddress = project.address
//   })

//   it("Should Project be Charity Project", async () => {
//     expect(await Charity.attach(charityAddress).isCharity()).equals(true);
//   })

//   it("Should Release Funds to Starter before Project Ends", async() => {
//     await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);

//     expect((await Charity.attach(charityAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
//     await  Charity.attach(charityAddress).releaseFunds()
//     expect(await ethers.provider.getBalance(charityAddress)).equals(0)

//   }) 

//   it("Should Not Release Funds to Starter By Other users", async() => {
//     await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);
//     expect((await Charity.attach(charityAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
    
//     const [owner, others] = await ethers.getSigners()
//     await  expect(Charity.connect(others).attach(charityAddress).releaseFunds()).to.be.reverted
//   })
    
//   it("Should Not Release Funds to Starter After Project Ends", async() => {
//       await Charity.attach(charityAddress).setProjectState(ProjectState.ended, 0);
  
//       expect((await Charity.attach(charityAddress).getProjectDetails()).state).equals(ProjectState.ended)
//       await  expect(Charity.attach(charityAddress).releaseFunds()).to.be.reverted
//   })

//   it("Should Starter Be Able to Abort Project while in Funding State", async() => {
    
//     const [owner, other] = await ethers.getSigners()
    
//     await app.connect(other).createBacker(backerDetails.name, 'testAbortProject@gmail.com', backerDetails.password)
//     const backer = await app.connect(other).authenticateBacker('testAbortProject@gmail.com', backerDetails.password);

//     const fundValue = constants.fundingDenomination.realValue * 20

//     await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
//     await Backer.connect(other).attach(backer).fundProject(charityAddress, {value: fundValue})
    
//     expect((await Charity.attach(charityAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
    
//     const backerBalance = await ethers.provider.getBalance(other.address)
//     await Charity.attach(charityAddress).abortProject();
    
//     expect((await Charity.attach(charityAddress).getProjectDetails()).state).equals(ProjectState.aborted)
//     expect(await ethers.provider.getBalance(other.address) ).equals(BigInt(backerBalance) + BigInt(fundValue))
//   })
  
//   it("Should Not Starter Be Able to Abort Project After in Funding State", async() => {
//     await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);

//     expect((await Charity.attach(charityAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
//     expect(await Charity.attach(charityAddress).abortProject()).to.be.reverted;
//   })

//   it("Should Not Others Be Able to Abort Project After in Funding State", async() => {
//     await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);
//     expect((await Charity.attach(charityAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
    
//     const [owner, others] = await ethers.getSigners()
//     await expect( Charity.connect(others).attach(charityAddress).abortProject()).to.be.reverted;
//   })
  
// })
  

// describe("Startup Contract:", function () {
//   beforeEach(async() => {
//     const project = await Startup.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
//     await project.deployed()
    
//     startupAddress = project.address
//   })

//   it("Should Project to Started On successfully raising funds", async() => {
//     const [owner, other] = await ethers.getSigners()
    
//     await app.connect(other).createBacker(backerDetails.name, 'testStartStartupProject@gmail.com', backerDetails.password)
//     const backer = await app.connect(other).authenticateBacker('testStartStartupProject@gmail.com', backerDetails.password);

//     const fundValue = projectDetails.amountRequired

//     expect((await Charity.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
//     await Backer.connect(other).attach(backer).fundProject(startupAddress, {value: fundValue})
    
//     await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, 0);

//     await Startup.attach(startupAddress).startProject();

//     expect((await Startup.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.inExecution)
//   })

//   it("Should Reject Project on  un-successful raising funds", async() => {
//     const [owner, other] = await ethers.getSigners()
    
//     await app.connect(other).createBacker(backerDetails.name, 'testRejectStartupProject@gmail.com', backerDetails.password)
//     const backer = await app.connect(other).authenticateBacker('testRejectStartupProject@gmail.com', backerDetails.password);

//     const fundValue = projectDetails.amountRequired - constants.fundingDenomination.realValue

//     expect((await Charity.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
//     await Backer.connect(other).attach(backer).fundProject(startupAddress, {value: fundValue})
    
//     await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, 0);

//     const backerBalance = await ethers.provider.getBalance(other.address)
//     await Startup.attach(startupAddress).startProject();
    
//     expect((await Startup.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.rejected)
//     expect(await ethers.provider.getBalance(other.address) ).equals(BigInt(backerBalance) + BigInt(fundValue)) 
//   })

//   it("Should Not Start or Reject Project By Others", async() => {
//     const [owner, other] = await ethers.getSigners()
    
//     await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, 0);

//     await expect(Startup.connect(other).attach(startupAddress).startProject()).to.be.reverted;
//   })

//   it("Should Starter Be Able to Abort Project while in Funding State", async() => {
    
//     const [owner, other] = await ethers.getSigners()
    
//     await app.connect(other).createBacker(backerDetails.name, 'testAbortStartupProject@gmail.com', backerDetails.password)
//     const backer = await app.connect(other).authenticateBacker('testAbortStartupProject@gmail.com', backerDetails.password);

//     const fundValue = constants.fundingDenomination.realValue * 20

//     await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
//     await Backer.connect(other).attach(backer).fundProject(startupAddress, {value: fundValue})
    
//     expect((await Startup.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
    
//     const backerBalance = await ethers.provider.getBalance(other.address)
//     await Startup.attach(startupAddress).abortProject();
    
//     expect((await Startup.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.aborted)
//     expect(await ethers.provider.getBalance(other.address) ).equals(BigInt(backerBalance) + BigInt(fundValue))
//   })
  
//   it("Should Not Starter Be Able to Abort Project After in Funding State", async() => {
//     await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 10000000);

//     expect((await Startup.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
//     expect(await Startup.attach(startupAddress).abortProject()).to.be.reverted;
//   })

//   it("Should Not Others Be Able to Abort Project After in Funding State", async() => {
//     await Charity.attach(startupAddress).setProjectState(ProjectState.inFunding,  Date.now() + 10000000);
//     expect((await Charity.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
    
//     const [owner, others] = await ethers.getSigners()
//     await expect( Charity.connect(others).attach(startupAddress).abortProject()).to.be.reverted;
//   })

//   it("Should End Project By Sending Rewards", async() => {
//     const [owner, other1, other2] = await ethers.getSigners()
    
//     await app.connect(other1).createBacker(backerDetails.name, 'testEndStartupProject@gmail.com', backerDetails.password)
//     const backer1 = await app.connect(other1).authenticateBacker('testEndStartupProject@gmail.com', backerDetails.password);

//     const fundValue1 = constants.fundingDenomination.realValue * 20


//     await app.connect(other2).createBacker(backerDetails.name, 'testEndStartupProject2@gmail.com', backerDetails.password)
//     const backer2 = await app.connect(other2).authenticateBacker('testEndStartupProject2@gmail.com', backerDetails.password);

//     const fundValue2 = constants.fundingDenomination.realValue * 40

//     await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
//     await Backer.connect(other1).attach(backer1).fundProject(startupAddress, {value: fundValue1})
//     await Backer.connect(other2).attach(backer2).fundProject(startupAddress, {value: fundValue2})
    
//     expect(await Startup.attach(startupAddress).amountRaised()).equals(fundValue1 + fundValue2)
//     expect((await Startup.attach(startupAddress).getProjectDetails()).state).equals(ProjectState.inFunding)
    
//     await Startup.attach(startupAddress).setProjectState(ProjectState.inExecution, 0);

//     await Backer.connect(other1).attach(backer1).endProject(startupAddress, true);
//     const backerBalance1 = await ethers.provider.getBalance(other1.address)
    
//     await Startup.attach(startupAddress).setProjectState(ProjectState.inExecution, 0 , {value : (fundValue1 + fundValue2) * 3})
//     expect(await ethers.provider.getBalance(startupAddress)).equals((fundValue1 + fundValue2) * 4)

//     await Backer.connect(other2).attach(backer2).endProject(startupAddress, true);

//     expect(await ethers.provider.getBalance(startupAddress)).equals(0)
//     expect(await ethers.provider.getBalance(other1.address)).equals(BigInt(backerBalance1) + BigInt(fundValue1 * 4)) 
//   })
// })

describe("Milestone Contract:", async() => {
  beforeEach(async() => {
    const project = await Startup.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
    await project.deployed()
    
    startupAddress = project.address

    const [owner, other1, other2] = await ethers.getSigners()
    
    const backer1 = await app.connect(other1).authenticateBacker('beforeEachMilestoneBacker1@gmail.com', backerDetails.password);

    const fundValue1 = constants.fundingDenomination.realValue * 20


    const backer2 = await app.connect(other2).authenticateBacker('beforeEachMilestoneBacker2@gmail.com', backerDetails.password);

    const fundValue2 = constants.fundingDenomination.realValue * 40

    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
    await Backer.connect(other1).attach(backer1).fundProject(startupAddress, {value: fundValue1})
    await Backer.connect(other2).attach(backer2).fundProject(startupAddress, {value: fundValue2})
    
    await Startup.attach(startupAddress).setProjectState(ProjectState.inExecution, 0);
  })

  it("Should Starter be able to add New MileStone", async() => {
    const milestone = {
      title: 'M21',
      description: 'M21Desc',
      fundsRequired: constants.fundingDenomination.realValue * 30,
      returnAmount:  constants.fundingDenomination.realValue * 40
    }

    const [list, count] =  await Startup.attach(startupAddress).getMilestone(0)

    await Startup.attach(startupAddress).addMilestone(milestone.title, milestone.description, milestone.fundsRequired, milestone.returnAmount)

    const [list2, count2] =  await Startup.attach(startupAddress).getMilestone(0)

    expect(count2).equals(count + 1)
    expect((await Milestone.attach(list2).getMilestoneDetails()).title).equals(milestone.title)
  })

  it("Should Not Others be able to add New MileStone", async() => {
    const milestone = {
      title: 'M21',
      description: 'M21Desc',
      fundsRequired: constants.fundingDenomination.realValue * 30,
      returnAmount:  constants.fundingDenomination.realValue * 40
    }

    const [list, count] =  await Startup.attach(startupAddress).getMilestone(0)

    const [owner, other1, other2] = await ethers.getSigners()
    await expect(Startup.connect(other1).attach(startupAddress).addMilestone(milestone.title, milestone.description, milestone.fundsRequired, milestone.returnAmount)).to.be.reverted

    const [lastMilestone, count2] =  await Startup.attach(startupAddress).getMilestone(0)
    expect(count2).equals(count)
  })

  it("Should Return Milestone Address: ", async() => {
    const milestone = {
      title: 'M22',
      description: 'M22Desc',
      fundsRequired: constants.fundingDenomination.realValue * 30,
      returnAmount:  constants.fundingDenomination.realValue * 40
    }

    const [list, count] =  await Startup.attach(startupAddress).getMilestone(0)

    const [owner, other1, other2] = await ethers.getSigners()
    await Startup.attach(startupAddress).addMilestone(milestone.title, milestone.description, milestone.fundsRequired, milestone.returnAmount)

    const [ milestoneAddress, count2] = await Startup.attach(startupAddress).getMilestone(0)
    
    const lastMilestone = await Milestone.attach(milestoneAddress).getMilestoneDetails()
    expect(lastMilestone.title).equals(milestone.title)
    expect(lastMilestone.fundsRequired).equals(milestone.fundsRequired)
    expect(lastMilestone.returnAmount).equals(milestone.returnAmount)
  })

  it("Should Not others be able to change Milestone state: ", async() => {
    const milestone = {
      title: 'M23',
      description: 'M23Desc',
      fundsRequired: constants.fundingDenomination.realValue * 30,
      returnAmount:  constants.fundingDenomination.realValue * 40
    }

    let [list, count] =  await Startup.attach(startupAddress).getMilestone(0)

    if(count ==  0){
      await Startup.attach(startupAddress).addMilestone(milestone.title, milestone.description, milestone.fundsRequired, milestone.returnAmount)
      let [newMilestone, count2] =  await Startup.attach(startupAddress).getMilestone(count > 0? count - 1: 0)
    
      list = newMilestone
    }

    await expect( Milestone.attach(list).changeState(MilestoneState.rejected)).to.be.reverted
  })

  it("Should Milestone have 100% accepted when started (all backers vote are initialize to yes)", async () => {
    const milestone = {
      title: 'M23',
      description: 'M23Desc',
      fundsRequired: constants.fundingDenomination.realValue * 30,
      returnAmount:  constants.fundingDenomination.realValue * 40
    }

    let [list, count] =  await Startup.attach(startupAddress).getMilestone(0)

    await Startup.attach(startupAddress).addMilestone(milestone.title, milestone.description, milestone.fundsRequired, milestone.returnAmount)
    let [newMilestone, count2] =  await Startup.attach(startupAddress).getMilestone(count > 0? count - 1: 0)
  
    expect(await Milestone.attach(newMilestone).getVotingResult()).equals(true)
  })

  it("Should Backer be able to vote a Milestone: ", async() =>{
    const milestone = {
      title: 'M2',
      description: 'M24Desc',
      fundsRequired: constants.fundingDenomination.realValue * 30,
      returnAmount:  constants.fundingDenomination.realValue * 40
    }

    let [list, count] =  await Startup.attach(startupAddress).getMilestone(0)

    await Startup.attach(startupAddress).addMilestone(milestone.title, milestone.description, milestone.fundsRequired, milestone.returnAmount)
    const [lastMilestone, count2] = await Startup.attach(startupAddress).getMilestone(count > 0 ?count - 1 : 0)

    const currentVotes = await Milestone.attach(lastMilestone).cumulativeRejectVotes()

    const [owner, other1, other2] = await ethers.getSigners()
    const backer1 = await app.connect(other1).authenticateBacker('beforeEachMilestoneBacker1@gmail.com', backerDetails.password);

    const fundValue1 = constants.fundingDenomination.realValue * 20
    const backer2 = await app.connect(other2).authenticateBacker('beforeEachMilestoneBacker2@gmail.com', backerDetails.password);
    const fundValue2 = constants.fundingDenomination.realValue * 40
    expect(currentVotes).equals(0)

    await expect(Backer.attach(backer1).voteMilestone(lastMilestone, true)).to.be.reverted

    await Backer.connect(other1).attach(backer1).voteMilestone(lastMilestone, false)
    const newVotes = await Milestone.attach(lastMilestone).cumulativeRejectVotes()

    if(fundValue1 > fundValue2){
      expect(await Milestone.attach(lastMilestone).getVotingResult()).equals(false)
    }else {
      expect(await Milestone.attach(lastMilestone).getVotingResult()).equals(true)
  
    }

    expect(newVotes).equals(fundValue1)
  })

})