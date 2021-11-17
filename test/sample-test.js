const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Job", function () {
  it("Should create a job and transfer NFT", async function () {
    const Job = await ethers.getContractFactory("Job")
    const deployedJob = await Job.deploy()
    await deployedJob.deployed()
    const jobPostAddress = deployedJob.address

    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(jobPostAddress)
    await nft.deployed()

    const nftContractAddress = nft.address

    const rewardPrice = ethers.utils.parseUnits('100', 'ether')

   await nft.createToken("https://www.mytokenlocation.com")
   await nft.createToken("https://www.mytokenlocation2.com ")

    const [_, geAddress, workerAddress] = await ethers.getSigners()
    await deployedJob.createJobItem(1, nftContractAddress, rewardPrice)
    // await deployedJob.createJobItem(2, nftContractAddress, rewardPrice)
     await deployedJob.connect(workerAddress).createJobSubmitted(1, "github.com")
    // await deployedJob.markJobItemComplete(2)
    await deployedJob.transferRewardsAndNft(1,nftContractAddress,1, {value: rewardPrice})

   
    // await deployedJob.connect(geAddress).transferRewardsAndNft(1, nftContractAddress)

    const jobsPosted = await deployedJob.fetchJobItems()
    const jobsSubmitted = await deployedJob.fetchJobsSubmitted()
    const jobsApproved = await deployedJob.fetchJobsApproved()

    console.log('jobs', jobsApproved[0])
    

  });
});
