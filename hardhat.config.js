require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-etherscan");
// npx hardhat verify DEPLOYED_CONTRACT_ADDRESS --network goerli/mainnet/fuji/AVAXMainnet
// npx hardhat run scripts/deploy.js --network goerli/mainnet/fuji/AVAXMainnet

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  hardhat: {
    chainId: 43114,
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/TxSK_1Kkd0U6oyEpmxuLfUjsWBo3U7QW`,
      accounts: ["3e1e2dd041fac8a2b78ec3b6a4464795620ed850b1273f85dff363e2111594e8"],
      chainId: 5
    }
  },
  etherscan: {
    apiKey: "AKHR7SY233C68UVPHHVGXC7WXFNFD7FSBZ"
  }

  
};
