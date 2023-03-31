const {run } = require('hardhat')
const path = require('path')
const fs = require('fs')
const deployer = require('../utils/contractDeployer.js')
const { initConstants , initDefinitions} = require('../utils/configInitializer.js')

async function deploy() {
    const enumList = require('../config/enumDefinitions.js')
    const structList = require('../config/structDefinitions.js')
   
    await initDefinitions(enumList, structList)

    const constList = require('../config/constants.js')
    await initConstants(constList)

    const {dbAddress , crowdfundingAddress, charityLamdaAddress, startupLamdaAddress, validatorAddress} = await deployer.deployContracts()

    const filePath = path.resolve(__dirname , '..', 'config' , 'contractAddress.json');
    const content = fs.readFileSync(filePath)
    let json = JSON.parse(content)
  
    json['dbAddress'] = dbAddress
    json['charityLamdaAddress'] = charityLamdaAddress
    json['startupLamdaAddress'] = startupLamdaAddress
    json['validatorAddress'] = validatorAddress
    json['crowdfundingAddress'] = crowdfundingAddress;
  
    let newContent = JSON.stringify(json)
  
    fs.writeFileSync(filePath, newContent);

    console.log('Contracts: \n',json)
};

deploy().catch(err => {
  console.log(err)
  process.exit(1)
})