const { task } = require("hardhat/config");

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polyscan: {
      url: 'https://rpc.ankr.com/polygon_mumbai',
      accounts: [`0x26eac854ee6636f2ec0bcf8b790ba1db05d698872c9a979109a248cd767de401`]
    },

    goeth: {
      chainId: 1337,
      url: 'http://127.0.0.1:8545',
      blockGasLimit: 8000000,
      accounts: [`0xbfa56c2e23e078aab4dcf73478214004c951db5dc2bfa4c164e641e5c13a1e67`]
    }
  },
  settings: {
    optimizer: {
      enabled: false,
      runs: 200,
    },
    
  },
  paths: {
    sources: "./test",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },


};

task("deploy", "Deploy Contracts" ,async () => {
  await run('scripts/deploy.js')
})