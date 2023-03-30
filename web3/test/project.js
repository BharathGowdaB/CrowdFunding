const {
  ethers
} = require("hardhat");
const {
  expect
} = require("chai");
const {
  loadFixture
} = require('@nomicfoundation/hardhat-network-helpers');

describe("Project", function () {
  
  async function runEveryTime() {
  const [owner, backer] = await ethers.getSigners();
  const amount = ethers.utils.parseEther('1');
    const ContractFactory = await hre.ethers.getContractFactory("project");
    const contract = await ContractFactory.deploy('Test Project',
      'This is a test project',
      ethers.utils.parseEther('10'),
      86400,
      false,
      
    );
    const projectName = "Test Project";
    const projectDescription = "This is a test project";
    const amountRequired = ethers.utils.parseEther('10');
    const amountRaised = 0;
    const isCharity = false;
    
    return {
      ContractFactory,
      contract,
      projectName,
      projectDescription,
      amountRequired,
      amountRaised,
      isCharity,
      owner,
      backer,
      amount
    };
  }
  it('should initialize the project with the correct values', async function () {
    const {contract,projectName,projectDescription,amountRequired,amountRaised,isCharity} = await loadFixture(runEveryTime);
    expect(await contract.creator()).to.equal(await ethers.provider.getSigner().getAddress());
    expect(await contract.title()).to.equal(projectName);
    expect(await contract.description()).to.equal(projectDescription);
    expect(await contract.amountRequired()).to.equal(amountRequired);
    expect(await contract.amountRaised()).to.equal(amountRaised);
    
  });
  
  it("should not allow project to end before starting", async function () {
    const {ContractFactory} = await loadFixture(runEveryTime);
    const invalidDuration = 30 * 60;
    await expect(ContractFactory.deploy("My Title", "My Description", 1000, invalidDuration, false))
      .to.be.revertedWith("Cannot End Project Before Starting");
  });

  it('should add the backer and increase the amount raised', async function () {
    const {contract,owner,backer,amount} = await loadFixture(runEveryTime);
    await contract.ProjectState == "inFunding";
    await contract.addBacker(backer.address, { value: amount });
    expect(await contract.backers(backer.address)).to.equal(amount);
    expect(await contract.amountRaised()).to.equal(amount);
  });

  it("should reject backers after funding deadline", async function () {
    const {contract,backer} = await loadFixture(runEveryTime);
    const fundingDuration = 60 * 60 * 24 * 7; // 1 week
    await ethers.provider.send("evm_setNextBlockTimestamp", [Math.floor(Date.now() / 1000) + fundingDuration]);
    await ethers.provider.send("evm_mine");
    const contribution = ethers.utils.parseEther("1");
    await expect(
      contract.connect(backer).addBacker(backer.address, { value: contribution })
    ).to.be.revertedWith("The deadline for supporting this project has passed.");
  });

  it("should not allow zero contribution", async function () {
    const {contract,backer} = await loadFixture(runEveryTime);
    await expect(contract.connect(backer).addBacker(backer.address,{ value: 0 })).to.be.revertedWith("Amount sent is zero");
  });

  it("should reject backers when amountRaised >= amountRequired", async function () {
    const {contract,backer} = await loadFixture(runEveryTime);
    const amountRequired = await contract.amountRequired();
    await contract.connect(backer).addBacker(backer.address, { value: amountRequired });
    const contribution = ethers.utils.parseEther("1");
    await expect(
      contract.connect(backer).addBacker(backer.address, { value: contribution })
    ).to.be.revertedWith("Funding target reached");
  });

  it("should increase project balance and backer contribution", async function () {
    const {contract,backer} = await loadFixture(runEveryTime);
    const contribution = ethers.utils.parseEther("1");
    await contract.connect(backer).addBacker(backer.address,{ value: contribution });
    const backerContribution = await contract.backers(backer.address);
    const balance = await ethers.provider.getBalance(contract.address);
    expect(backerContribution).to.equal(contribution);
    expect(balance).to.equal(contribution);
  });

});
