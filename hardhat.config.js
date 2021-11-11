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
      url: `https://kovan.infura.io/v3/${process.env.PROJECT_ID}`
    }
  },
  solidity: "0.8.4",
};
