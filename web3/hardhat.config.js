require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: 'hardhat',
    networks: {
      hardhat: {
      },
      goerli: {
        url: 'https://rpc.ankr.com/polygon_mumbai',
        accounts: [`0x0676ec77f4226ae47bc23217a2d4aaf395aa16ea21dc5e329928a32a05fe6f67`]
      }
    },
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },

};
