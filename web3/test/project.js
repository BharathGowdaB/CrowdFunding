const { ethers ,waffle } = require("hardhat");
const { expect } = require("chai");
const {VerificationState, deployContract, starterDetails, backerDetails, createProjects, constants} = require('./util.js');
const { ProjectState } = require("../config/enumDefinitions.js");

let app ;
let db ;
let charityAddress;
let startupAddress;
let Charity;
let Startup;
let Project;
let Backer;
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

  const [owner, others] = await ethers.getSigners()

  await app.createStarter(starterDetails.name, 'CharityTestcase@gmail.com' , starterDetails.password)
  starterAddress  = await app.authenticateStarter('CharityTestcase@gmail.com' , starterDetails.password)

  Starter = await ethers.getContractFactory("Starter")

  const project = await Charity.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
  await project.deployed()
  
  charityAddress = project.address
})



describe("Project Contract:", async() => {
  it("Should Return Project Details", async() => {
    expect((await Charity.attach(charityAddress).getProjectDetails())[1]).equals(projectDetails.title)
    expect((await Charity.attach(charityAddress).getProjectDetails())[3]).equals(projectDetails.amountRequired)
    expect((await Charity.attach(charityAddress).getProjectDetails())[4]).equals(projectDetails.amountRaised)
    expect((await Charity.attach(charityAddress).getProjectDetails())[7]).equals(0)
    expect(await Charity.attach(charityAddress).isCharity()).equals(true)
  })

  it("Should Backer Able to Refund(return) their funds", async() => {
      await app.createBacker(backerDetails.name, 'testProjectRefund@gmail.com', backerDetails.password)
      const backer = await app.authenticateBacker('testProjectRefund@gmail.com', backerDetails.password);

      const fundValue = constants.fundingDenomination.realValue * 2
      const beforeAmountRaised = await Project.attach(charityAddress).amountRaised()

      await Backer.attach(backer).fundProject(charityAddress, {value: fundValue})

      expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised) + fundValue)

      // 2nd Backer----
      await app.createBacker(backerDetails.name, 'testProjectRefund2@gmail.com', backerDetails.password)
      const backer2 = await app.authenticateBacker('testProjectRefund2@gmail.com', backerDetails.password);

      const fundValue2 = constants.fundingDenomination.realValue * 4
      await Backer.attach(backer2).fundProject(charityAddress, {value: fundValue2})

      expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised) + fundValue + fundValue2)

      const [owner, others] = await ethers.getSigners()

      const backerBalance =  await ethers.provider.getBalance(owner.address)
      const backerFunds = await  Project.attach(charityAddress).backers(backer)

      expect(await  Project.attach(charityAddress).backers(backer)).equals(fundValue)
      await Backer.attach(backer).returnProjectFunds(charityAddress)
      expect(await  Project.attach(charityAddress).backers(backer)).equals(0)

      expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised)  + fundValue2)

  })

  it("Should Not Backer Able to Refund funds after funding period is over", async() => {
    await app.createBacker(backerDetails.name, 'testProjectRefundAfter@gmail.com', backerDetails.password)
    const backer = await app.authenticateBacker('testProjectRefundAfter@gmail.com', backerDetails.password);

    const fundValue = constants.fundingDenomination.realValue * 2
    const beforeAmountRaised = await Project.attach(charityAddress).amountRaised()

    await Backer.attach(backer).fundProject(charityAddress, {value: fundValue})

    expect(await Project.attach(charityAddress).amountRaised()).equals( parseInt(beforeAmountRaised) + fundValue)

    await Charity.attach(charityAddress).setProjectState(ProjectState.ended, 0);

    await expect(Backer.attach(backer).returnProjectFunds(charityAddress)).to.be.reverted
  
  })
})

describe("Charity Contract:", function () {
  beforeEach(async() => {
    const project = await Charity.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
    await project.deployed()
    
    charityAddress = project.address
  })

  it("Should Project be Charity Project", async () => {
    expect(await Charity.attach(charityAddress).isCharity()).equals(true);
  })

  it("Should Release Funds to Starter before Project Ends", async() => {
    await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);

    expect((await Charity.attach(charityAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    await  Charity.attach(charityAddress).releaseFunds()
    expect(await ethers.provider.getBalance(charityAddress)).equals(0)

  }) 

  it("Should Not Release Funds to Starter By Other users", async() => {
    await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);
    expect((await Charity.attach(charityAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    
    const [owner, others] = await ethers.getSigners()
    await  expect(Charity.connect(others).attach(charityAddress).releaseFunds()).to.be.reverted
  })
    
  it("Should Not Release Funds to Starter After Project Ends", async() => {
      await Charity.attach(charityAddress).setProjectState(ProjectState.ended, 0);
  
      expect((await Charity.attach(charityAddress).getProjectDetails())[5]).equals(ProjectState.ended)
      await  expect(Charity.attach(charityAddress).releaseFunds()).to.be.reverted
  })

  it("Should Starter Be Able to Abort Project while in Funding State", async() => {
    
    const [owner, other] = await ethers.getSigners()
    
    await app.connect(other).createBacker(backerDetails.name, 'testAbortProject@gmail.com', backerDetails.password)
    const backer = await app.connect(other).authenticateBacker('testAbortProject@gmail.com', backerDetails.password);

    const fundValue = constants.fundingDenomination.realValue * 20

    await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
    await Backer.connect(other).attach(backer).fundProject(charityAddress, {value: fundValue})
    
    expect((await Charity.attach(charityAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    
    const backerBalance = await ethers.provider.getBalance(other.address)
    await Charity.attach(charityAddress).abortProject();
    
    expect((await Charity.attach(charityAddress).getProjectDetails())[5]).equals(ProjectState.aborted)
    expect(await ethers.provider.getBalance(other.address) ).equals(BigInt(backerBalance) + BigInt(fundValue))
  })
  
  it("Should Not Starter Be Able to Abort Project After in Funding State", async() => {
    await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);

    expect((await Charity.attach(charityAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    expect(await Charity.attach(charityAddress).abortProject()).to.be.reverted;
  })

  it("Should Not Others Be Able to Abort Project After in Funding State", async() => {
    await Charity.attach(charityAddress).setProjectState(ProjectState.inFunding, 0);
    expect((await Charity.attach(charityAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    
    const [owner, others] = await ethers.getSigners()
    await expect( Charity.connect(others).attach(charityAddress).abortProject()).to.be.reverted;
  })
  
})
  

describe("Startup Contract:", function () {
  beforeEach(async() => {
    const project = await Startup.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
    await project.deployed()
    
    startupAddress = project.address
  })

  it("Should Project to Started On successfully raising funds", async() => {
    const [owner, other] = await ethers.getSigners()
    
    await app.connect(other).createBacker(backerDetails.name, 'testStartStartupProject@gmail.com', backerDetails.password)
    const backer = await app.connect(other).authenticateBacker('testStartStartupProject@gmail.com', backerDetails.password);

    const fundValue = projectDetails.amountRequired

    expect((await Charity.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    await Backer.connect(other).attach(backer).fundProject(startupAddress, {value: fundValue})
    
    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, 0);

    await Startup.attach(startupAddress).startProject();

    expect((await Startup.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.inExecution)
  })

  it("Should Reject Project on  un-successful raising funds", async() => {
    const [owner, other] = await ethers.getSigners()
    
    await app.connect(other).createBacker(backerDetails.name, 'testRejectStartupProject@gmail.com', backerDetails.password)
    const backer = await app.connect(other).authenticateBacker('testRejectStartupProject@gmail.com', backerDetails.password);

    const fundValue = projectDetails.amountRequired - constants.fundingDenomination.realValue

    expect((await Charity.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    await Backer.connect(other).attach(backer).fundProject(startupAddress, {value: fundValue})
    
    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, 0);

    const backerBalance = await ethers.provider.getBalance(other.address)
    await Startup.attach(startupAddress).startProject();
    
    expect((await Startup.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.rejected)
    expect(await ethers.provider.getBalance(other.address) ).equals(BigInt(backerBalance) + BigInt(fundValue)) 
  })

  it("Should Not Start or Reject Project By Others", async() => {
    const [owner, other] = await ethers.getSigners()
    
    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, 0);

    await expect(Startup.connect(other).attach(startupAddress).startProject()).to.be.reverted;
  })

  it("Should Starter Be Able to Abort Project while in Funding State", async() => {
    
    const [owner, other] = await ethers.getSigners()
    
    await app.connect(other).createBacker(backerDetails.name, 'testAbortStartupProject@gmail.com', backerDetails.password)
    const backer = await app.connect(other).authenticateBacker('testAbortStartupProject@gmail.com', backerDetails.password);

    const fundValue = constants.fundingDenomination.realValue * 20

    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
    await Backer.connect(other).attach(backer).fundProject(startupAddress, {value: fundValue})
    
    expect((await Startup.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    
    const backerBalance = await ethers.provider.getBalance(other.address)
    await Startup.attach(startupAddress).abortProject();
    
    expect((await Startup.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.aborted)
    expect(await ethers.provider.getBalance(other.address) ).equals(BigInt(backerBalance) + BigInt(fundValue))
  })
  
  it("Should Not Starter Be Able to Abort Project After in Funding State", async() => {
    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 10000000);

    expect((await Startup.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    expect(await Startup.attach(startupAddress).abortProject()).to.be.reverted;
  })

  it("Should Not Others Be Able to Abort Project After in Funding State", async() => {
    await Charity.attach(startupAddress).setProjectState(ProjectState.inFunding,  Date.now() + 10000000);
    expect((await Charity.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    
    const [owner, others] = await ethers.getSigners()
    await expect( Charity.connect(others).attach(startupAddress).abortProject()).to.be.reverted;
  })

  it("Should End Project By Sending Rewards", async() => {
    const [owner, other1, other2] = await ethers.getSigners()
    
    await app.connect(other1).createBacker(backerDetails.name, 'testEndStartupProject@gmail.com', backerDetails.password)
    const backer1 = await app.connect(other1).authenticateBacker('testEndStartupProject@gmail.com', backerDetails.password);

    const fundValue1 = constants.fundingDenomination.realValue * 20


    await app.connect(other2).createBacker(backerDetails.name, 'testEndStartupProject2@gmail.com', backerDetails.password)
    const backer2 = await app.connect(other2).authenticateBacker('testEndStartupProject2@gmail.com', backerDetails.password);

    const fundValue2 = constants.fundingDenomination.realValue * 40

    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
    await Backer.connect(other1).attach(backer1).fundProject(startupAddress, {value: fundValue1})
    await Backer.connect(other2).attach(backer2).fundProject(startupAddress, {value: fundValue2})
    
    expect(await Startup.attach(startupAddress).amountRaised()).equals(fundValue1 + fundValue2)
    expect((await Startup.attach(startupAddress).getProjectDetails())[5]).equals(ProjectState.inFunding)
    
    await Startup.attach(startupAddress).setProjectState(ProjectState.inExecution, 0);

    await Backer.connect(other1).attach(backer1).endProject(startupAddress, true);
    const backerBalance1 = await ethers.provider.getBalance(other1.address)
    
    await Startup.attach(startupAddress).setProjectState(ProjectState.inExecution, 0 , {value : (fundValue1 + fundValue2) * 3})
    expect(await ethers.provider.getBalance(startupAddress)).equals((fundValue1 + fundValue2) * 4)

    await Backer.connect(other2).attach(backer2).endProject(startupAddress, true);

    expect(await ethers.provider.getBalance(startupAddress)).equals(0)
    expect(await ethers.provider.getBalance(other1.address)).equals(BigInt(backerBalance1) + BigInt(fundValue1 * 4)) 
  })
})

describe("Milestone Contract:", async() => {
  beforeEach(async() => {
    const project = await Startup.deploy(starterAddress, projectDetails.title, projectDetails.description, projectDetails.amountRequired, projectDetails.fundingDuration, projectDetails.amountRaised )
    await project.deployed()
    
    startupAddress = project.address

    const [owner, other1, other2] = await ethers.getSigners()
    
    await app.connect(other1).createBacker(backerDetails.name, 'beforeEachBacker1@gmail.com', backerDetails.password)
    const backer1 = await app.connect(other1).authenticateBacker('beforeEachBacker1@gmail.com', backerDetails.password);

    const fundValue1 = constants.fundingDenomination.realValue * 20


    await app.connect(other2).createBacker(backerDetails.name, 'beforeEachBacker2@gmail.com', backerDetails.password)
    const backer2 = await app.connect(other2).authenticateBacker('beforeEachBacker2@gmail.com', backerDetails.password);

    const fundValue2 = constants.fundingDenomination.realValue * 40

    await Startup.attach(startupAddress).setProjectState(ProjectState.inFunding, Date.now() + 1000000);
    await Backer.connect(other1).attach(backer1).fundProject(startupAddress, {value: fundValue1})
    await Backer.connect(other2).attach(backer2).fundProject(startupAddress, {value: fundValue2})
    
    await Startup.attach(startupAddress).setProjectState(ProjectState.inExecution, 0);
  })




})