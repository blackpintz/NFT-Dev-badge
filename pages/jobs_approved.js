import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios'
import {Grid} from '@mui/material';
import { makeStyles } from '@mui/styles';
import JobApproved from '../components/JobApproved';

import { jobPostAddress, nftaddress } from '../config';

import Job from '../artifacts/contracts/Job.sol/Job.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

const useStyles = makeStyles({
    grid: {
        width: "90%",
        margin: "0 auto",
        backgroundColor: '#ffe4e1',
        minHeight: "500px",
        padding: "0 0.5rem"
    }
})

export default function JobsApproved() {
    const [jobs, setJobs] = useState([])
    const classes = useStyles()

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
                hex: meta.data.colorHex,
                owner: meta.data.job.assignmentTaker,
                url: meta.data.job.url
            }
            return job
        }))
        setJobs(jobs)
    }

    return(
        <>
        {!jobs.length ? (
            <h3>No Jobs Approved!</h3>
        ) : (
            <>
            <Grid className={classes.grid} container spacing={2}>
                {jobs && jobs.map((job, idx) => (
                    <Grid item key={idx} xs={4}>
                        <JobApproved job={job} />
                    </Grid>
                ))}
            </Grid>
            </>
        )}
        </>
    )
}