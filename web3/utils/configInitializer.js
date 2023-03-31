const fs = require('fs');
const path = require('path');

function initDefinitions(enumList = {}, structList = {} ){
  const solPath =  path.resolve(__dirname , '..', 'contracts' , 'utils' ,'definitions.sol');

  let content = `//SPDX-License-Identifier: UNLICENSED \npragma solidity >=0.7.0 <0.9.0; \n\n`

  Object.keys(enumList).forEach((key) => {
    content += `enum ${key} {\n\t`
    Object.keys(enumList[key]).forEach((k) => {
        content += `${k}, `
    })

    content = content.substring(0, content.length - 2) + '\n}\n\n'
  })

  Object.keys(structList).forEach((key) => {
    content += `struct ${key} {\n`
    Object.keys(structList[key]).forEach((k) => {
        content += `\t${structList[key][k]} ${k}; \n`
    })

    content += '}\n\n'
  })

  fs.writeFileSync(solPath, content);
}

function initConstants(constList){
  const solPath =  path.resolve(__dirname , '..', 'contracts' , 'utils' ,'constants.sol');

  let content = `//SPDX-License-Identifier: UNLICENSED \npragma solidity >=0.7.0 <0.9.0; \n\n`

  Object.keys(constList).forEach((key) => {
    content += `${constList[key].type} constant ${key} = ${constList[key].value}; \n`
  })

  fs.writeFileSync(solPath, content);
}

module.exports = {initDefinitions, initConstants}