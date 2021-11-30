const hre = require("hardhat");

async function main() {
  const Job = await hre.ethers.getContractFactory("Job");
  const job = await Job.deploy();
  await job.deployed();

  console.log("Job deployed to:", job.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(job.address);

  await nft.deployed();

  console.log("NFT deployed to:", nft.address);

  const MetaData = await hre.ethers.getContractFactory("MetaData")
  const metadata = await MetaData.deploy()
  await metadata.deployed();

  console.log("MetaData deployed to:", metadata.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
