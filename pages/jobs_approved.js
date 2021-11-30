import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios'
import {Grid} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { jobPostAddress, nftaddress } from '../config';

import Job from '../artifacts/contracts/Job.sol/Job.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

export default function JobsApproved() {
    const [jobs, setJobs] = useState([])

    useEffect(() => {
        loadJobs()
    }, [])

    async function loadJobs() {
        const provider = new ethers.providers.JsonRpcProvider()
        let tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const jobContract = new ethers.Contract(jobPostAddress, Job.abi, provider)
        const data = await jobContract.fetchJobsApproved()

        const jobs = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            console.log(meta)
            let job = {
                attribute: meta.data.attribute,
                title: i.title,
                hex: meta.data.colorHex
            }
            return job
        }))
        setJobs(jobs)
        console.log(jobs)
    }

    return(
        <>
        <h1>All jobs approved go here!</h1>
        </>
    )
}