import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import JobPost from '../components/JobPost';

import { nftaddress, jobPostAddress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Job from '../artifacts/contracts/Job.sol/Job.json';

export default function JobPosts() {
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        loadJobs()
    },[])

    async function loadJobs() {
        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const jobContract = new ethers.Contract(jobPostAddress, Job.abi, provider)
        const data = await jobContract.fetchJobItems()

        const items = await Promise.all(data.map(async i => {

            let reward = ethers.utils.formatUnits(i.reward.toString(), 'ether')
            let item = {
                reward,
                assignmentHolder: i.assignmentHolder,
                title: i.title,
                deadline: i.deadline,
                description: i.description,
                category: i.category
            }
            return item
        }))
        console.log(items)
        setJobs(items)
    }

    
    return(
        <>
        {
            !jobs.length ? (
                <h3>No job openings!</h3>
            ) : (
                <JobPost name="Hello" />
            )
        }
        </>
    )
}