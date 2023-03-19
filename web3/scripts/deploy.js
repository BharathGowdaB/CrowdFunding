const {run } = require('hardhat')
const path = require('path')
const fs = require('fs')
const deployer = require('../utils/deployer')

async function deploy() {

    const {dbAddress, crowdfundingAddress} = await deployer.deployContracts()

    const filePath = path.resolve(__dirname , '..', 'config' , 'contractAddress.json');
    const content = fs.readFileSync(filePath)
    let json = JSON.parse(content)
  
    json['dbAddress'] = dbAddress
    json['crowdfundingAddress'] = crowdfundingAddress;
  
    let newContent = JSON.stringify(json)
  
    fs.writeFileSync(filePath, newContent);

    //console.log("MyContract deployed to:", '\nDatabase : ', dbAddress , '\nCrowdfunding : ', crowdfundingAddress);
};

deploy().catch(err => {
  console.log(err)
  process.exit(1)
})