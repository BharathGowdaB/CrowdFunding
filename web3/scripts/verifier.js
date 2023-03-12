
const { ethers } = require("hardhat");


async function main(){
  //const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  

  const contractAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const contractAbi = require("../artifacts/contracts/crowdfunding.sol/crowdfunding.json").abi;

  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  const signer = new ethers.Wallet(privateKey, provider);


  const app = new ethers.Contract(contractAddress, contractAbi, signer); 

  

  //const App = await ethers.getContractFactory("crowdfunding");
  //const app = await App.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3')
  

  //const user = await app.createFundraiser('b', 'b', 'b');

  //console.log(await user.wait())
  
  app.on('VerifyUser', (value) => {
    console.log('emitting' , value)
  });

}

main()