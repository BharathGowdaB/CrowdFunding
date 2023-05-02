const {run } = require('hardhat')
const path = require('path')
const fs = require('fs')
const deployer = require('../utils/contractDeployer.js')
const { initConstants , initDefinitions} = require('../utils/configInitializer.js')

async function deploy() {
    const enumList = require('../../config/enumDefinitions.js')
    const structList = require('../../config/structDefinitions.js')
   
    initDefinitions(enumList, structList)

    const constList = require('../../config/constants.js')
    initConstants(constList)

    const {dbAddress , crowdfundingAddress, charityLamdaAddress, startupLamdaAddress, validatorAddress} = await deployer.deployContracts()

    const filePath = path.resolve(__dirname , '..', '..', 'config' , 'contractAddress.json');
    const content = fs.readFileSync(filePath)
    let json = JSON.parse(content)
  
    json['dbAddress'] = dbAddress
    json['charityLamdaAddress'] = charityLamdaAddress
    json['startupLamdaAddress'] = startupLamdaAddress
    json['validatorAddress'] = validatorAddress
    json['crowdfundingAddress'] = crowdfundingAddress;
  
    let newContent = JSON.stringify(json)
  
    fs.writeFileSync(filePath, newContent);

    console.log('Contracts: \n',json);

    const abiSourcePath = path.resolve(__dirname , '..', 'artifacts' , 'contracts');
    const abiDestinationPath = path.resolve(__dirname , '..', '..' , 'abi');

    const crowdfundingABI = fs.readFileSync(path.resolve(abiSourcePath, "app", "crowdfunding.sol", "Crowdfunding.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "crowdfunding.json"), JSON.stringify(JSON.parse(crowdfundingABI).abi))

    const databaseABI = fs.readFileSync(path.resolve(abiSourcePath, "app", "db.sol", "DatabaseSorter.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "database.json"), JSON.stringify(JSON.parse(databaseABI).abi))

    const starterABI = fs.readFileSync(path.resolve(abiSourcePath, "user", "starter.sol", "Starter.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "starter.json"), JSON.stringify(JSON.parse(starterABI).abi))

    const backerABI = fs.readFileSync(path.resolve(abiSourcePath, "user", "backer.sol", "Backer.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "backer.json"), JSON.stringify(JSON.parse(backerABI).abi))

    const userABI = fs.readFileSync(path.resolve(abiSourcePath, "user", "user.sol", "User.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "user.json"), JSON.stringify(JSON.parse(userABI).abi))

    const projectABI = fs.readFileSync(path.resolve(abiSourcePath, "project", "project.sol", "Project.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "project.json"), JSON.stringify(JSON.parse(projectABI).abi))

    const startupABI = fs.readFileSync(path.resolve(abiSourcePath, "project", "startup.sol", "Startup.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "startup.json"), JSON.stringify(JSON.parse(startupABI).abi))

    const charityABI = fs.readFileSync(path.resolve(abiSourcePath, "project", "charity.sol", "Charity.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "charity.json"), JSON.stringify(JSON.parse(charityABI).abi))

    const milestoneABI = fs.readFileSync(path.resolve(abiSourcePath, "project", "milestone.sol", "Milestone.json"))
    fs.writeFileSync(path.resolve(abiDestinationPath, "milestone.json"), JSON.stringify(JSON.parse(milestoneABI).abi))
};

deploy().catch(err => {
  console.log(err)
  process.exit(1)
})