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

describe("Crowdfunding Contract", async () => {

  const starterDetails = {
    name: 'Bharath',
    email: 'bharath@gmail.com',
    password: '231020',
  } 

  const backerDetails = {
    name: "Girish",
    email: "giri@gmail.com",
    password: "250000"
  }

  describe("Starter:" , async function () {

    it("Should Create New Starter", async () => {
      await app.createStarter(starterDetails.name, starterDetails.email, starterDetails.password);
  
      const user = await app.authenticateStarter(starterDetails.email, starterDetails.password);
  
      expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
      expect((await db.getStarterList(0))[0][0]).to.equals(user)
    });

    it("Should Not Create Starter if Email Registered", async() => {
      const user =  app.createStarter('Yashu', starterDetails.email, '231020')
      await expect(user).to.be.reverted
    })

    it("Should Authenticate Valid Starter Credientials", async() => {
      const user = await app.authenticateStarter(starterDetails.email, starterDetails.password);
      expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
    })

    it("Should Not Authenticate Invalid Credientials: Email", async() => {
      const user = app.authenticateStarter('Yashu@gmail.com', starterDetails.password);
      await expect(user).to.be.reverted
    })

    it("Should Not Authenticate Invalid Credientials: Password", async() => {
      const user = app.authenticateStarter(starterDetails.email, '00');
      await expect(user).to.be.reverted
    })

  })

  describe("Verification:", async() => {
    it("Should Not Starter be verified on Signup:", async() => {
      const user = await app.authenticateStarter(starterDetails.email, starterDetails.password);
      const verifiedState = await app.checkStarterVerified(user)
      expect(verifiedState).equals(VerificationState.initial)
    })

    it("Should trigger Verify Event on request to Document Verification", async() => {
      const kycData = {
        name: 'Bharath', panNumber: 'bqwphghg'
      };

      const tx = await app.documentVerification(starterDetails.email, starterDetails.password, kycData)
      await tx.wait()

      const events = await app.queryFilter("VerifyUser");

      expect(events.length).to.equal(1);
      expect(events[0].args.length).to.equal(1);

      const verifiedState = await app.checkStarterVerified(events[0].args[0])

      expect(verifiedState).equals(VerificationState.inProgress)
    })

    it("Should Starter be Verified on successful Verification", async () => {
      const user = app.authenticateStarter(starterDetails.email, starterDetails.password);
      await app.verifyStarter(user, VerificationState.verified)
      
      const verifiedState = await app.checkStarterVerified(user)
      expect(verifiedState).equals(VerificationState.verified)
    })

    it("Should Not Starter be Verified on unsuccessful Verification", async () => {
      const user = app.authenticateStarter(starterDetails.email, starterDetails.password);
      await app.verifyStarter(user, VerificationState.failed)
      
      const verifiedState = await app.checkStarterVerified(user)
      expect(verifiedState).equals(VerificationState.failed)
    })

    it("Should Not be able to verfiy starter by other users", async() => {
      const user = await  app.authenticateStarter(starterDetails.email, starterDetails.password);

      const [owner , otherAccount] = await ethers.getSigners()
      const tx = app.connect(otherAccount).verifyStarter(user, VerificationState.failed)
      await expect(tx).to.be.reverted
    })
  })

  describe("Backer:" , async function () {
    it("Should Create New Backer", async () => {
      await app.createStarter(backerDetails.name, backerDetails.email, backerDetails.password);
  
      const user = await app.authenticateStarter(backerDetails.email, backerDetails.password);
  
      expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should Not Create Backer if Email Registered", async() => {
      const user =  app.createStarter('Yashu', backerDetails.email, '231020')
      await expect(user).to.be.reverted
    })

    it("Should Authenticate Valid Backer Credientials", async() => {
      const user = await app.authenticateStarter(backerDetails.email, backerDetails.password);
      expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
    })

    it("Should Not Authenticate Invalid Credientials: Email", async() => {
      const user = app.authenticateStarter('Yashu@gmail.com', backerDetails.password);
      await expect(user).to.be.reverted
    })

    it("Should Not Authenticate Invalid Credientials: Password", async() => {
      const user = app.authenticateStarter(backerDetails.email, '00');
      await expect(user).to.be.reverted
    })
      
  })
      
});
