require("@nomiclabs/hardhat-waffle");
require('dotenv').config()


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    ge: {
      url: 'https://rpc.grassecon.net',
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  solidity: {
    version:  "0.8.4",
    settings: {
      evmVersion: 'byzantium'
    }
  }
};
