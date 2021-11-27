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

    const Metadata = await ethers.getContractFactory("MetaData")
    const metadata = await Metadata.deploy()
    await metadata.deployed()

    const nftContractAddress = nft.address

    const rewardPrice = ethers.utils.parseUnits('100', 'ether')
    const title1 = "first job"
    const deadline1 = "Dec 1st"
    const description1 = "Description of first job"
    const category1 = "security"



   await nft.createToken("https://www.mytokenlocation.com")
   await nft.createToken("https://www.mytokenlocation2.com ")

  

    const [_, geAddress, workerAddress] = await ethers.getSigners()
    await deployedJob.createJobItem(nftContractAddress, title1, rewardPrice, deadline1, description1, category1)
    await deployedJob.createJobItem(nftContractAddress, title1, rewardPrice, deadline1, description1, category1)
    await deployedJob.connect(workerAddress).createJobSubmitted(2, "github.com")
    await deployedJob.connect(workerAddress).createJobSubmitted(1, "github.com")
    await deployedJob.transferRewardsAndNft(1,nftContractAddress,2, 1, {value: rewardPrice})

    const jobsPosted = await deployedJob.fetchJobItems()
    const jobsSubmitted = await deployedJob.fetchJobsSubmitted()
    const jobsApproved = await deployedJob.fetchJobsApproved()

    const hashValue = await metadata.hash(2, "github.com", '0x8462eb2fbcef5aa4861266f59ad5f47b9aa6525d767d713920fdbdfb6b0c0b78')


    // console.log('jobs posted', jobsPosted)
    // console.log('jobs submitted', jobsSubmitted)
    console.log('hashvalue', hashValue)
    

  });
});
