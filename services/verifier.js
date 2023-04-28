const { ethers } = require("ethers");
const Address = require("../config/contractAddress.json");
const crowdfundingABI = require('../abi/crowdfunding.json');
const { VerificationState } = require("../config/enumDefinitions");

async function main(){

  const provider = new ethers.getDefaultProvider("http://localhost:8545");

  privateKey = '0x0676ec77f4226ae47bc23217a2d4aaf395aa16ea21dc5e329928a32a05fe6f67'
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

}

main()