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


})
