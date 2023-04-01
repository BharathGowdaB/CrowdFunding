const { ethers  } = require("hardhat");
const { expect } = require("chai");
const {deployContract, VerificationState, createProjects , constants, starterDetails} = require('./util.js');
const { ProjectState } = require("../config/enumDefinitions.js");

let app ;
let db ;
let Project;
let Backer;
let starter;

before(async () => {
  constracts = await deployContract();
  app = constracts.app;
  db = constracts.db;

  Project = await ethers.getContractFactory("Project")
  Backer = await ethers.getContractFactory("Backer")

  await app.createStarter(starterDetails.name, 'testGetMaxLimitProject@gmail.com' , starterDetails.password)
  starter = await app.authenticateStarter('testGetMaxLimitProject@gmail.com' , starterDetails.password)

  await app.verifyStarter(starter, VerificationState.verified)

  await createProjects(starter, 10)
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
    await app.createStarter(starterDetails.name, 'testGetOnlyCharityProject@gmail.com' , starterDetails.password)
    const user = await app.authenticateStarter('testGetOnlyCharityProject@gmail.com' , starterDetails.password)

    await app.verifyStarter(user, VerificationState.verified)

    await createProjects(user, 3 , true)
    
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

    await app.createStarter(starterDetails.name, 'testPopularProjectsList@gmail.com' , starterDetails.password)
    const user = await app.authenticateStarter('testPopularProjectsList@gmail.com' , starterDetails.password)

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
    const [list, count] = await Starter.attach(starter).getProjectList({skip: 0})

    const [owner, otheraccounts] = await ethers.getSigners()

    const [log, logCount] = await db.getLogMessage(list[0], 0)

    await db.addLogMessage(list[0], 'Logging Message')

    const [log2, logCount2] = await db.getLogMessage(list[logCount], 0)

    expect(log2.body).equals('Logging Message')
    expect(log2.id).equals(owner.address)

  })
})