const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Editor", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("Editor");
    const market = await Market.deploy();
    await market.deployed();

    const marketAddress = market.address;

    // const NFT = await ethers.getContractFactory("NFT");
    // const nft = await NFT.deploy(marketAddress);
    // await nft.deployed();

    // const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('1', 'ether');

    // await nft.createToken('https://www.mytokenlocation.com');
    // await nft.createToken('https://www.mytokenlocation2.com');

    // await market.createToken(nftContractAddress, 1, auctionPrice, { value: listingPrice });
    await market.createToken("https://www.mytokenlocation2.com");

    const [_, buyerAddress] = await ethers.getSigners();

    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    let items = await market.fetchMarketItems();

    items = await Promise.all(items.map(async ({tokenId,price,seller,owner}) => {
      const tokenUri = await nft.tokenURI(tokenId);
      let item = {
        price: price.toString(),
        tokenId: tokenId.toString(),
        seller,
        owner,
        tokenUri
      }

      return item
    }))

    console.log('items', items);

  });
});