const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");
const deployer = require("../utils/deployer")

describe("Crowdfunding", async function () {

  const user1 = {
    name: 'Bharath',
    email: 'bharath23@gmail.com',
    password: '231020'
  }
  
  const { dbAddress, crowdfundinAddress} = await deployer.deployContracts()

  const app = await (await ethers.getContractFactory('Crowdfunding')).attach(crowdfundinAddress);
  const db = await (await ethers.getContractFactory("DatabaseSorter")).attach(dbAddress);

  describe("Starter" , async () => {
    it("Should Create New Starter", async () => {
      const user = await app.newStarter(user1.name, user1.email, user1.password);
      expect(user).not.undefined;

      console.log(await db.getStarterList(0))
    });

    it("Should Not Create Starter if Email Registered", async() => {
      const user =  app.newStarter('Yashu', user1.email, '231020')
      await expect(user).to.be.reverted
    })

    it("Should Authenticate Valid User", async() => {
      const user = await app.authenticateStarter(user1.email, user1.password);
      expect(user).to.match(/^0x[a-fA-F0-9]{40}$/);
    })

    it("Should Not Authenticate Invalid User: Email", async() => {
      const user = app.authenticateStarter('Yashu', user1.password);
      await expect(user).to.be.reverted
    })

    it("Should Not Authenticate Invalid User: Password", async() => {
      const user = app.authenticateStarter(user1.email, '00');
      await expect(user).to.be.reverted
    })

    it("Should trigger Verify Event on request to KYC Verification", async() => {
      const kycData = {
        name: 'Bharath', panNumber: 'bqwphghg'
      };

      const tx = await app.kycVerification(user1.email, user1.password, kycData)
      await tx.wait()

      app.on("VerifyUser", (address) => {
        console.log('emit caught', address)
      });

      const events = await app.queryFilter("VerifyUser");

      expect(events.length).to.equal(1);
      expect(events[0].args.length).to.equal(1);

      await app.verifyStarter(events[0].args[0], 2)

      const isVerified = await app.isStarterVerified(events[0].args[0])

      expect(isVerified).equals(2)
    })

  })
      

});
