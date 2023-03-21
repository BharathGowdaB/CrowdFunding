const { ethers  } = require("hardhat");
const { expect } = require("chai");
const deployer = require("../utils/deployer")
const {verificationState, VerificationState} = require("../config/enumDefinitions")

let app ;
let db ;

before(async () => {
  const { dbAddress, crowdfundingAddress} = await deployer.deployContracts()
  app = await (await ethers.getContractFactory('Crowdfunding')).attach(crowdfundingAddress);
  db = await (await ethers.getContractFactory("DatabaseSorter")).attach(dbAddress);
})

describe('Database', async() => {
  it('Should Database Admin to be Crowdfunding Contract', async() => {
    expect(await db.admin()).equals(app.address)
  })

  it('Should Not Update Admin address', async() => {
    const tx = db.updateAdmin();
    await expect(tx).to.be.reverted
  })

  it('Should Not be able to Add Starter By others users', async() => {
    const starter = app.address; // mocking
    const tx = db.addStarter(starter)
    await expect(tx).to.be.reverted
  })

  it('Should Create New Charity Project', async() => {
    const charity = {
      title : 'Charity101',
      description : 'testing',
      amountRequired : 100,
      fundingDuration : 60 * 60 * 1000 + 1
    }
    const [projects, count] = await db.getProjectList(0)
    const currentProjectsCount = parseInt(count)

    const tx = await db.addProject(charity.title , charity.description, charity.amountRequired, charity.fundingDuration, true)
    
    expect(parseInt((await db.getProjectList(0))[1])).to.equals(currentProjectsCount + 1)
    
  })

  it('Should Create New Startup Project', async() => {
    const startup = {
      title : 'Startup',
      description : 'testing',
      amountRequired : 100,
      fundingDuration : 60 * 60 * 1000 + 1
    }
    const [projects, count] = await db.getProjectList(0)
    const currentProjectsCount = parseInt(count)

    const tx = await db.addProject(startup.title , startup.description, startup.amountRequired, startup.fundingDuration, true)
    
    expect(parseInt((await db.getProjectList(0))[1])).to.equals(currentProjectsCount + 1)
    
  })

})