const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const NFTToken = await ethers.getContractFactory("TokenCreator");

  const NFTMarket = await ethers.getContractFactory("Editor");
  console.log("Start Deployment...");
  console.log("Deploying Tradable...");

  const tradableContract = await NFTToken.deploy("TTT", "T", "");
  await tradableContract.deployed();
  
  console.log("Tradable Deployment Successful!", tradableContract.address);
  console.log("Creating JSON file for tradable");
  
  const tradableData = {
    address: tradableContract.address,
    abi: JSON.parse(tradableContract.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./App/src/abi/tradable.json', JSON.stringify(tradableData))
  console.log("Done!");
  console.log("Deploying Marketplace...");

  const marketContract = await NFTMarket.deploy(tradableContract.address, "0x8Fa461074FC99D7B874569869b2559Addd00d9AD");
  await marketContract.deployed();

  
  const data = {
    address: marketContract.address,
    abi: JSON.parse(marketContract.interface.format('json'))
  }

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./App/src/abi/Marketplace.json', JSON.stringify(data))

  console.log("Contract deployed. Marketplace account:", marketContract.address); 

  console.log("Transferring Token Tradable Contract ownership to market contract...");
  await tradableContract.transferOwnership(marketContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
