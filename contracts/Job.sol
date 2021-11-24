//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Job is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _jobIds;
    Counters.Counter private _jobsCompleted;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct JobItem {
        uint jobId;
        address nftContract;
        address assignmentHolder;
        string title;
        string deadline;
        string description;
        string category;
        uint reward;
        bool complete;
        bool approve;
    }

    struct JobSubmitted {
        uint submissionId;
        uint jobId;
        address assignmentTaker;
        string gitUrl;
    }

    mapping(uint => JobItem) private idToJobItem;
    mapping(uint => JobSubmitted) private idToJobSubmitted;

    event JobItemCreated (
        uint indexed jobId,
        address indexed nftContract,
        address indexed assignmentHolder,
        string title,
        string deadline,
        string description,
        string category,
        uint reward,
        bool complete,
        bool approve
    );

    event JobItemSubmitted (
        uint indexed submissionId,
        uint indexed jobId,
        address indexed assignmentTaker,
        string gitUrl
    );

    function createJobItem(address nftContract, string memory title, uint reward, string memory deadline, string memory description, string memory category  ) public payable nonReentrant {
        require(reward > 0, 'Reward of this job must be atleast 1 wei');
        _jobIds.increment();
        uint jobId = _jobIds.current();
        idToJobItem[jobId] = JobItem(
            jobId,
            nftContract,
            payable(msg.sender),
            title,
            deadline,
            description,
            category,
            reward,
            false,
            false
        );

        //  IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit JobItemCreated(
            jobId,
            nftContract,
            msg.sender,
            title,
            deadline,
            description,
            category,
            reward,
            false,
            false
        );
    }

    function createJobSubmitted(uint itemId,string memory url) public payable nonReentrant  {
        idToJobItem[itemId].complete = true;
        _jobsCompleted.increment();
        uint submissionId = _jobsCompleted.current();
        idToJobSubmitted[submissionId] = JobSubmitted(
            submissionId,
            itemId,
            payable(msg.sender),
            url
        );

        emit JobItemSubmitted(
            submissionId,
            itemId,
            msg.sender,
            url
        );
    }

    function transferRewardsAndNft(uint itemId, address nftContract, uint submissionId, uint tokenId) public payable nonReentrant {
        require(idToJobItem[itemId].complete == true, "The job is marked as incomplete");
        require(msg.value == idToJobItem[itemId].reward, "You do not have enough money to make this transaction.");
        require(idToJobSubmitted[submissionId].jobId == itemId, "JobId does not match.");

        payable(idToJobSubmitted[submissionId].assignmentTaker).transfer(msg.value);
        IERC721(nftContract).transferFrom(idToJobItem[itemId].assignmentHolder, idToJobSubmitted[submissionId].assignmentTaker, tokenId);
        idToJobItem[itemId].approve = true;
    }


    function fetchJobItems() public view returns (JobItem[] memory) {
         uint jobCount = _jobIds.current();
         uint incompleteJobCount = _jobIds.current() - _jobsCompleted.current();
         uint currentIndex = 0;
         JobItem[] memory jobs = new JobItem[](incompleteJobCount);

         for(uint i=0; i<jobCount; i++) {
             if(idToJobItem[i + 1].complete == false) {
                 uint currentId = idToJobItem[i+1].jobId;
                 JobItem storage currentItem = idToJobItem[currentId];
                 jobs[currentIndex] = currentItem;
                 currentIndex += 1;
             }
         }

         return jobs;
    }

    // fetchJobItemById
    // fetchJobSubmittedById

    function fetchJobsSubmitted() public view returns(JobSubmitted[] memory) {
        uint totalJobCount = _jobsCompleted.current();
        uint currentIndex = 0;

        JobSubmitted[] memory jobs = new JobSubmitted[](totalJobCount);

        for (uint i = 0; i < totalJobCount; i++) {
                uint currentId = idToJobSubmitted[i+1].submissionId;
                JobSubmitted storage currentItem = idToJobSubmitted[currentId];
                jobs[currentIndex] = currentItem;
                currentIndex += 1;
        }
        return jobs;
    }

    function fetchJobsApproved() public view returns (JobItem[] memory) {
        uint totalJobCount = _jobIds.current();
        uint jobCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalJobCount; i++) {
            // have to change the approve type
            if(idToJobItem[i+1].approve == true) {
                jobCount += 1;
            }
        }

        JobItem[] memory jobs = new JobItem[](jobCount);

        for(uint i = 0; i < totalJobCount; i++) {
            if(idToJobItem[i+1].approve == true) {
                uint currentId = idToJobItem[i+1].jobId;
                JobItem storage currentItem = idToJobItem[currentId];
                jobs[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return jobs;
    }
}