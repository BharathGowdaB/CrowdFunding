const { ethers } = require("ethers");
const Address = require("../config/contractAddress.json");
const crowdfundingABI = require('../abi/crowdfunding.json');
const { VerificationState } = require("../config/enumDefinitions");

async function main(){

  const provider = new ethers.getDefaultProvider("http://localhost:8545");

  privateKey = '0xbfa56c2e23e078aab4dcf73478214004c951db5dc2bfa4c164e641e5c13a1e67'
  const signer = new ethers.Wallet(privateKey, provider);


  const app = new ethers.Contract(Address.crowdfundingAddress, crowdfundingABI, signer); 

  app.on('VerifyUser', async (value) => {
    const starterAddress = value;

    const data = await app.getVerificationData(starterAddress);
    console.log(data)

    if(data.panNumber.startsWith('100')) await app.verifyStarter(starterAddress , VerificationState.verified)
    else await app.verifyStarter(starterAddress , VerificationState.failed)
  });

  console.log('Verifier Running...')

  //verify single user
  //await app.verifyStarter('0xDc2cF906a571bcF751857806922d5AD4c5c3D014' , VerificationState.verified)
}

main()