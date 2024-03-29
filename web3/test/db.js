const { ethers  } = require("hardhat");
const { expect } = require("chai");
const {deployContract, VerificationState, createProjects , constants, starterDetails, backerDetails} = require('./util.js');
const { ProjectState } = require("../../config/enumDefinitions.js");

let app ;
let db ;
let Project;
let Backer;
let Starter;
let starterAddress;

before(async () => {
  constracts = await deployContract();
  app = constracts.app;
  db = constracts.db;

  Project = await ethers.getContractFactory("Project")
  Backer = await ethers.getContractFactory("Backer")
  Starter = await ethers.getContractFactory("Starter")

  await app.createStarter(starterDetails.name, starterDetails.email , starterDetails.password)
  starterAddress = await app.authenticateStarter(starterDetails.email , starterDetails.password)

  await app.verifyStarter(starterAddress, VerificationState.verified)

  await createProjects(starterAddress, 10)
})


describe('Database Contract:', async() => {

  it('Should Database Admin to be Crowdfunding Contract', async() => {
    expect(await db.admin()).equals(app.address)
  })

  it('Should Not Update Admin address', async() => {
    const tx = db.init('0x1111111111111111111111111111111111111111', '0x1111111111111111111111111111111111111111' );
    await expect(tx).to.be.reverted
  })

  it('Should Not be able to Add Starter By others users', async() => {
    const starter = app.address; // mocking
    const tx = db.addStarter(starter)
    await expect(tx).to.be.reverted
  })

  it('Should Only Retrieve maxLimit no. of Project addresses' , async () => {
    const [list, count] = await db.getProjectList({skip: 0})
    expect(count).equals(10)
    expect(list.length).equals(constants.maxGetProjectList.realValue)
  })

  it('Should skip first 3 Project addresses while retrival' , async () => {
    const [list, count] = await db.getProjectList({skip: 0})
    const [list2, count2] = await db.getProjectList({skip: 3})

    expect(list2[0]).equals(list[3])
  })

  it('Should return only the last 2 Project Address' , async () => {
    const [list, count] = await db.getProjectList({skip: 0})
    const [list2, count2] = await db.getProjectList({skip: count - 2})

    expect(list2.length).equals(2)
  })

  it('Should Return Project List Sorted By Recent First', async() => {
    const [list, count] = await db.getProjectList({skip: 0, recent: true})

    const [last] = await db.getProjectList({skip: count - 1})
    expect(list[0]).equals(last[0])
  })

  it('Should Return Only Charity Projects', async() => {
    const [owner, other1, other2, other3] = await ethers.getSigners()
    await app.connect(other1).createStarter(starterDetails.name, 'testGetOnlyCharityProject@gmail.com' , starterDetails.password)
    const user = await app.connect(other1).authenticateStarter('testGetOnlyCharityProject@gmail.com' , starterDetails.password)

    await app.verifyStarter(user, VerificationState.verified)

    await createProjects(user, 3 , true, other1)
    
    const [list, count] = await db.getProjectList({skip: 0, onlyCharity: true})

    list.forEach(async (address) => {
      expect(await Project.attach(address).isCharity()).equals(true)
    })
    
  })

  it('Should Return Only StartUp Projects', async() => {
   
    const [list, count] = await db.getProjectList({skip: 0, onlyStartup: true})

    list.forEach(async (address) => {
      expect(await Project.attach(address).isCharity()).equals(false)
    })
    
  })

  it('Should Return Popular Projects', async() => {
    const [owner, other1, other2, other3] = await ethers.getSigners()

    await app.connect(other2).createStarter(starterDetails.name, 'testPopularProjectsList@gmail.com' , starterDetails.password)
    const user = await app.connect(other2).authenticateStarter('testPopularProjectsList@gmail.com' , starterDetails.password)

    const DatabaseMock = await ethers.getContractFactory("DatabaseMock");
    const databaseMock  = await DatabaseMock.deploy();

    const project = {
      title : 'Startup',
      description : 'testing',
      amountRequired : 10000,
      fundingDuration : 60 * 60 * 10000 + 1,
      isCharity : false
    }

    const ProjectMock = await ethers.getContractFactory("ProjectMock");

    for(i = 0 ; i < 3 ; i++){
      
      projectMock  = await ProjectMock.deploy(user, i + project.title , project.description, project.amountRequired, project.fundingDuration, project.isCharity, 100 * i + 10);
      await projectMock.deployed();
      await databaseMock.addProjectMock(projectMock.address)
    }
    
    var [list, count] = await databaseMock.getProjectList({skip: 0})

    const [popularList, popularCount] = await databaseMock.getProjectList({skip: 0, popular: true})

    expect(list[2]).equals(popularList[0])
 
  })

  it("Should Log Messages sent By: Project Creater", async() => {
    const Starter = await ethers.getContractFactory("Starter")
    const [projaddress, count] = await Starter.attach(starterAddress).getProjectList(0)

    const [owner, otheraccounts] = await ethers.getSigners()

    const [log, logCount] = await db.getLogMessage(projaddress, 0)

    await db.addLogMessage(projaddress, 'Logging Message')

    const [log2, logCount2] = await db.getLogMessage(projaddress, logCount)

    expect(log2.body).equals('Logging Message')
    expect(log2.id).equals(owner.address)

  })

  it("Should Log Messages sent By: Project Backer", async() => {
    const [projaddress, count] = await Starter.attach(starterAddress).getProjectList(0)

    const [owner, otheraccounts] = await ethers.getSigners()

    await app.connect(otheraccounts).createBacker(backerDetails.name, 'testLogMessageBacker@gmail.com', backerDetails.password)
    const backer = await app.connect(otheraccounts).authenticateBacker('testLogMessageBacker@gmail.com', backerDetails.password);

    await Backer.attach(backer).connect(otheraccounts).fundProject(projaddress, {value: constants.fundingDenomination.realValue * 2})

    const [log, logCount] = await db.getLogMessage(projaddress, 0)

    await Backer.attach(backer).connect(otheraccounts).logMessage(projaddress, 'Logging Message 2')

    const [log2, logCount2] = await db.getLogMessage(projaddress, logCount)

    expect(log2.body).equals('Logging Message 2')
    expect(log2.id).equals(backer)

  })


  it("Should Not Be Able to Log Messages By: Other users", async() => {
    const [projaddress, count] = await Starter.attach(starterAddress).getProjectList(0)

    const [owner, other1, other2, other3] = await ethers.getSigners()

    await app.connect(other3).createBacker(backerDetails.name, 'testLogMessageOthers@gmail.com', backerDetails.password)
    const backer = await app.connect(other3).authenticateBacker('testLogMessageOthers@gmail.com', backerDetails.password);

    const [log, logCount] = await db.getLogMessage(projaddress, 0)

    await expect( db.connect(other3).addLogMessage(projaddress, 'logging 3')).to.be.reverted

  })
})