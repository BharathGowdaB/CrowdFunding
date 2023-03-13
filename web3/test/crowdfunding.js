const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Crowdfunding", async function () {
  const [owner, otherAccount] = await ethers.getSigners();

  const App = await ethers.getContractFactory("crowdfunding");
  const app = await App.deploy();

  app.on("VerifyUser", (address) => {
    console.log('emit caught', address)
  });

  const user1 = {
    name: 'Bharath',
    email: 'bharath23@gmail.com',
    password: '231020'
  }
  

  describe("Starter" , async () => {
    it("Should Create New Starter", async () => {
      const user = await app.newStarter(user1.name, user1.email, user1.password);
      expect(user).not.undefined;
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
