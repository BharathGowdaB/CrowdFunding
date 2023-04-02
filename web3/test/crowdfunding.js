// const { ethers  } = require("hardhat");
// const { expect } = require("chai");
// const {VerificationState, deployContract, starterDetails, backerDetails} = require('./util.js')
// const constants = require('../config/constants');

// let app ;
// let db ;
// let Starter;
// let Backer;
// let Project;

// before(async () => {
//   constracts = await deployContract();
//   app = constracts.app;
//   db = constracts.db;

//   Starter = await ethers.getContractFactory("Starter")
//   Backer = await ethers.getContractFactory("Backer")
//   Project = await ethers.getContractFactory("Project")
// })

// describe("Crowdfunding Contract", async () => {

//   describe("Starter:" , async function () {

//     it("Should Create New Starter", async () => {
//       await app.createStarter(starterDetails.name, starterDetails.email, starterDetails.password);
  
//       const user = await app.authenticateStarter(starterDetails.email, starterDetails.password);
  
//       expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
//       expect((await db.getStarterList({skip: 0}))[0][0]).to.equals(user)
//     });

//     it("Should Not Create Starter if Email Registered", async() => {
//       const user =  app.createStarter('Yashu', starterDetails.email, starterDetails.password)
//       await expect(user).to.be.reverted
//     })

//     it("Should Not Create Starter if Pattern Mismatch: Email => /.+@.+\..+/", async() => {
//       const user =  app.createStarter('Yashu', 'invalidEmail@com', starterDetails.password)
//       await expect(user).to.be.reverted

//       const user2 =  app.createStarter('Yashu', '@gmail.com', starterDetails.password)
//       await expect(user2).to.be.reverted

//       const user3 =  app.createStarter('Yashu', 'before@.com', starterDetails.password)
//       await expect(user3).to.be.reverted

//       const user4 =  app.createStarter('Yashu', 'before@gmail.', starterDetails.password)
//       await expect(user3).to.be.reverted
//     })

//     it("Should Not Create Starter if Pattern Mismatch: Password => /(?=[A-Z])(?=[a-z])(?=[0-9])(?=[@#$]){8,}", async() => {
//       const user =  app.createStarter('Yashu', 'testPasswordPattern@gmail.com', '45@')
//       await expect(user).to.be.reverted

//       const user2 =  app.createStarter('Yashu', 'testPasswordPattern@gmail.com', 'abasAshj$')
//       await expect(user2).to.be.reverted
//     })

//     it("Should Authenticate Valid Starter Credientials", async() => {
//       const user = await app.authenticateStarter(starterDetails.email, starterDetails.password);
//       expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
//     })

//     it("Should Not Authenticate Invalid Credientials: Email", async() => {
//       const user = app.authenticateStarter('testInvalidEmail@gmail.com', starterDetails.password);
//       await expect(user).to.be.reverted
//     })

//     it("Should Not Authenticate Invalid Credientials: Password", async() => {
//       const user = app.authenticateStarter(starterDetails.email, starterDetails.password + '1@hhhhgfffBg');
//       await expect(user).to.be.reverted
//     })

//     it('Should Create New Charity Project if Starter Verified', async() => {
//       await app.createStarter(starterDetails.name, 'testStarterCreateCharity@gmail.com', starterDetails.password);
  
//       const user = await app.authenticateStarter('testStarterCreateCharity@gmail.com',  starterDetails.password);
//       await app.verifyStarter(user, VerificationState.verified)

//       const charity = {
//         title : 'charity',
//         description : 'testing',
//         amountRequired : constants.fundingDenomination.realValue * 10,
//         fundingDuration : constants.minFundingPeriod.realValue + 10,
//         isCharity : true
//       }
//       const [projects, count] = await db.getProjectList({skip: 0})
//       const currentProjectsCount = parseInt(count)
  
//       const tx = await Starter.attach(user).createProject(charity.title , charity.description, charity.amountRequired, charity.fundingDuration, true)
      
//       expect(parseInt((await db.getProjectList({skip: 0}))[1])).to.equals(currentProjectsCount + 1)
      
//     })
  
//     it('Should Create New Startup Project if Starter Verified', async() => {
//       await app.createStarter(starterDetails.name, 'testStarterCreateStartup@gmail.com', starterDetails.password);
  
//       const user = await app.authenticateStarter('testStarterCreateStartup@gmail.com',  starterDetails.password);
//       await app.verifyStarter(user, VerificationState.verified)

//       const startup = {
//         title : 'Startup',
//         description : 'testing',
//         amountRequired : 100,
//         fundingDuration : 60 * 60 * 1000 + 1
//       }
//       const [projects, count] = await db.getProjectList({skip: 0})
//       const currentProjectsCount = parseInt(count)
  
//       const tx = await (await Starter.attach(user)).createProject(startup.title , startup.description, startup.amountRequired, startup.fundingDuration, true)
      
//       expect(parseInt((await db.getProjectList({skip: 0}))[1])).to.equals(currentProjectsCount + 1)
      
//     })

//     it('Should Not be able to create new Project if Starter not Verified', async() => {
//       await app.createStarter(starterDetails.name, 'testStarterNotVerifiedProject@gmail.com', starterDetails.password);
  
//       const user = await app.authenticateStarter('testStarterNotVerifiedProject@gmail.com',  starterDetails.password);

//       const startup = {
//         title : 'Startup',
//         description : 'testing',
//         amountRequired : 100,
//         fundingDuration : 60 * 60 * 1000 + 1
//       }
//       const [projects, count] = await db.getProjectList({skip: 0})
//       const currentProjectsCount = parseInt(count)
  
//       const tx =   Starter.attach(user).createProject(startup.title , startup.description, startup.amountRequired, startup.fundingDuration, true)
      
//       await expect(tx).to.be.reverted
      
//     })
//   })

//   describe("Verification:", async() => {
//     it("Should Not Starter be verified on Signup:", async() => {
//       const user = await app.authenticateStarter(starterDetails.email, starterDetails.password);
//       const verifiedState = await app.checkStarterVerified(user)
//       expect(verifiedState).equals(VerificationState.initial)
//     })

//     it("Should trigger Verify Event on request to Document Verification", async() => {
//       const kycData = {
//         name: 'Bharath', panNumber: 'bqwphghg'
//       };

//       const tx = await app.documentVerification(starterDetails.email, starterDetails.password, kycData)
//       await tx.wait()

//       const events = await app.queryFilter("VerifyUser");

//       expect(events.length).to.equal(1);
//       expect(events[0].args.length).to.equal(1);

//       const verifiedState = await app.checkStarterVerified(events[0].args[0])

//       expect(verifiedState).equals(VerificationState.inProgress)
//     })

//     it("Should Starter be Verified on successful Verification", async () => {
//       const user = app.authenticateStarter(starterDetails.email, starterDetails.password);
      
//       await app.verifyStarter(user, VerificationState.verified)
      
//       const verifiedState = await app.checkStarterVerified(user)
//       expect(verifiedState).equals(VerificationState.verified)
//     })

//     it("Should Not Starter be Verified on unsuccessful Verification", async () => {
//       const user = app.authenticateStarter(starterDetails.email, starterDetails.password);
      
//       await app.verifyStarter(user, VerificationState.failed)
      
//       const verifiedState = await app.checkStarterVerified(user)
//       expect(verifiedState).equals(VerificationState.failed)
//     })

//     it("Should Not be able to verfiy starter by other users", async() => {
//       const user = await  app.authenticateStarter(starterDetails.email, starterDetails.password);

//       const [owner , otherAccount] = await ethers.getSigners()
//       const tx = app.connect(otherAccount).verifyStarter(user, VerificationState.failed)
//       await expect(tx).to.be.reverted
//     })
//   })

//   describe("Backer:" , async function () {
//     it("Should Create New Backer", async () => {
//       await app.createBacker(backerDetails.name, backerDetails.email, backerDetails.password);
  
//       const user = await app.authenticateBacker(backerDetails.email, backerDetails.password);
  
//       expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
//     });

//     it("Should Not Create Backer if Email Registered", async() => {
//       const user =  app.createBacker('Yashu', backerDetails.email, '231020')
//       await expect(user).to.be.reverted
//     })

//     it("Should Not Create Backer if Pattern Mismatch: Email => /.+@.+\..+/", async() => {
//       const user =  app.createBacker('Yashu', 'invalidEmail@com', starterDetails.password)
//       await expect(user).to.be.reverted

//       const user2 =  app.createBacker('Yashu', '@gmail.com', starterDetails.password)
//       await expect(user2).to.be.reverted

//       const user3 =  app.createBacker('Yashu', 'before@.com', starterDetails.password)
//       await expect(user3).to.be.reverted

//       const user4 =  app.createBacker('Yashu', 'before@gmail.', starterDetails.password)
//       await expect(user3).to.be.reverted
//     })

//     it("Should Not Create Backer if Pattern Mismatch: Password => /(?=[A-Z])(?=[a-z])(?=[0-9])(?=[@#$]){8,}", async() => {
//       const user =  app.createBacker('Yashu', 'testPasswordPattern@gmail.com', '45@')
//       await expect(user).to.be.reverted

//       const user2 =  app.createBacker('Yashu', 'testPasswordPattern@gmail.com', 'abasAshj$')
//       await expect(user2).to.be.reverted
//     })


//     it("Should Authenticate Valid Backer Credientials", async() => {
//       const user = await app.authenticateBacker(backerDetails.email, backerDetails.password);
//       expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
//     })

//     it("Should Not Authenticate Invalid Credientials: Email", async() => {
//       const user = app.authenticateBacker('Yashu@gmail.com', backerDetails.password);
//       await expect(user).to.be.reverted
//     })

//     it("Should Not Authenticate Invalid Credientials: Password", async() => {
//       const user = app.authenticateBacker(backerDetails.email, '00');
//       await expect(user).to.be.reverted
//     })

//     it("Should Be able to Fund Project", async() => {
//       await app.createBacker(backerDetails.name, 'testBackerFundProjectBacker@gmail.com', backerDetails.password);
//       const user = app.authenticateBacker('testBackerFundProjectBacker@gmail.com', backerDetails.password);

//       await app.createStarter(starterDetails.name, 'testBackerFundProject@gmail.com', starterDetails.password);
//       const starter = await app.authenticateStarter('testBackerFundProject@gmail.com',  starterDetails.password);

//       await app.verifyStarter(starter, VerificationState.verified)

//       const charity = {
//         title : 'Charity101',
//         description : 'testing',
//         amountRequired : 100,
//         fundingDuration : 60 * 60 * 1000 + 1
//       }
  
//       const tx = await Starter.attach(starter).createProject(charity.title , charity.description, charity.amountRequired, charity.fundingDuration, true)
      
//       const [projectAddress, count ] = await Starter.attach(starter).getProjectList(0)

//       expect(await Project.attach(projectAddress).amountRaised()).equals(0)
    
//       const fundingAmount = 100;
//       const tx2 = await Backer.attach(user).fundProject(projectAddress, { value: fundingAmount})

//       expect(await Project.attach(projectAddress).amountRaised()).equals(fundingAmount)

//       const [fundedAddress, projectCounts] = await Backer.attach(user).getProjectList(0)

//       expect(fundedAddress).equals(projectAddress)
//       expect(projectCounts).equals(1)
    
//     })

//     it("Should Not Be able to Fund Non Existing Project", async() => {
//       await app.createBacker(backerDetails.name, 'testBackerFundNullProject@gmail.com', backerDetails.password);
//       const user = app.authenticateBacker('testBackerFundNullProject@gmail.com', backerDetails.password);

//       const projectAddress = '0x1111111111111111111111111111111111111111'
//       const fundingAmount =  ethers.utils.parseEther('0.000100');

//       await expect( Backer.attach(user).fundProject(projectAddress, { value: fundingAmount})).to.be.reverted 
//     })
    
      
//   })
      
// });
