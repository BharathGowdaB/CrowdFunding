const { expect } = require("chai");

describe("Charity", function () {
  let Charity, charity, owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    Charity = await ethers.getContractFactory("charity");
    charity = await Charity.deploy(
      "Test Project",
      "This is a test project.",
      ethers.utils.parseEther("100"),
      86400
    );
    await charity.deployed();
  });

  it("should deploy the contract with the correct values", async function () {
    expect(await charity.title()).to.equal("Test Project");
    expect(await charity.description()).to.equal("This is a test project.");
    expect(await charity.amountRequired()).to.equal(ethers.utils.parseEther("100"));
    expect(await charity.startTime()).to.be.closeTo(Math.floor(Date.now() / 1000), 20);
    expect(await charity.endTime()).to.be.closeTo(Math.floor(Date.now() / 1000) + 86400, 20);
    expect(await charity.isCharity()).to.be.true;
    expect(await charity.state()).to.equal(0);
  });

  it("should release funds when called by the owner", async function () {
    await charity.releaseFunds();
    expect(await charity.state()).to.equal(1);
  });

  it("should abort the project when called by the creator within the time limit", async function () {
    await charity.abortProject();
    expect(await charity.state()).to.equal(5);
  });
});
