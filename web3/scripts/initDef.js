const { initConstants, initDefinitions} = require('../utils/configInitializer.js');

const enumList = require('../../config/enumDefinitions.js')
const structList = require('../../config/structDefinitions.js')
initDefinitions(enumList, structList)

const constList = require('../../config/constants.js')
initConstants(constList)