const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const axios = require('axios')
require('chai')
    .use(require('chai-as-promised'))
    .should()

describe("Test All contracts", function() {
  let deployedJob;
  let nft;
  let metadata;
  let token;
  let tokenId

  beforeEach(async function () {
    const Job = await ethers.getContractFactory("Job")
    deployedJob = await Job.deploy();
    await deployedJob.deployed()
    const jobPostAddress = deployedJob.address

    const NFT = await ethers.getContractFactory("NFT")
    nft = await NFT.deploy(jobPostAddress)
    await nft.deployed()

    const Metadata = await ethers.getContractFactory("MetaData")
    metadata = await Metadata.deploy()
    await metadata.deployed()

    token =  await nft.createToken()
    let tx = await token.wait()
    const event = tx.events[0]
    tokenId = event.args[2].toNumber()
  })

  describe("NFT contract functions", function () {
    it("should create a token", async function () {
      let tx = await token.wait()
      const event = tx.events[0]
      assert.equal(tokenId, 1, 'id is correct')
      assert.equal(event.args[0], '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.args[1], '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'to is correct')
    })

    it('should set token uri', async function () {
      await nft.setTokenURI(tokenId, "www.mytokenlocation.com")
      const uri = await nft.tokenURI(tokenId)
      assert.notEqual(uri, "www.mytokenlocation1.com")
    })
  })

  describe('Job contract functions', function () {
    let nftContractAddress;
    let title;
    let rewardPrice;
    let deadline;
    let description;
    let category;

    beforeEach(() => {
      nftContractAddress = nft.address
      rewardPrice = ethers.utils.parseUnits('100', 'ether')
      title = "first job"
      deadline = "Dec 1st"
      description = "Description of first job"
      category = "security"
    })
    it('should create job item', async function () {
      await deployedJob.createJobItem(nftContractAddress, title, rewardPrice, deadline, description, category)
      const jobsPosted = await deployedJob.fetchJobItems()
      assert.equal(jobsPosted.length, 1)
    })

    it('should submit job item', async function () {
      const [_, geAddress, workerAddress] = await ethers.getSigners()
      await deployedJob.createJobItem(nftContractAddress, title, rewardPrice, deadline, description, category)
      await deployedJob.connect(workerAddress).createJobSubmitted(1, "github.com")
      const jobsSubmitted = await deployedJob.fetchJobsSubmitted()
      assert.equal(jobsSubmitted.length, 1)
    })

    it('should approve job item', async function () {
      const [_, geAddress, workerAddress] = await ethers.getSigners()
      await deployedJob.createJobItem(nftContractAddress, title, rewardPrice, deadline, description, category)
      await deployedJob.connect(workerAddress).createJobSubmitted(1, "github.com")
      await deployedJob.transferRewardsAndNft(1,nftContractAddress,1, 1, {value: rewardPrice})
      const jobsApproved = await deployedJob.fetchJobsApproved()
      assert.equal(jobsApproved.length, 1)
    })
  })

  describe('MetaData contract functions', function () {
    it('should return a hash value', async function () {
      const hashValue = await metadata.hash(2, "github.com", '0x8462eb2fbcef5aa4861266f59ad5f47b9aa6525d767d713920fdbdfb6b0c0b78')
      assert.equal(hashValue, '0x6adcb8d4faf4653834d8f55f779f32c3771db3832b7b3f620b087e6bad3bbe15')
    })
  })
})
