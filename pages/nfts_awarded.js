import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import axios from 'axios'
import {Grid, Box} from '@mui/material';
import { makeStyles } from '@mui/styles';
import JobApproved from '../components/JobApproved';

import { jobPostAddress, nftaddress } from '../config';

import Job from '../artifacts/contracts/Job.sol/Job.json';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';

const useStyles = makeStyles({
    grid: {
        width: "95%",
        margin: "0.5rem auto",
        backgroundColor: '#ffe4e1',
        minHeight: "500px",
        padding: "0 0.5rem"
    },
    box: {
        width: "95%",
        margin: "0.4rem auto"
    }
})

export default function JobsApproved() {
    const [jobs, setJobs] = useState([])
    const classes = useStyles()

    useEffect(() => {
        loadJobs()
    }, [])

    async function loadJobs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        let tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const jobContract = new ethers.Contract(jobPostAddress, Job.abi, provider)
        const data = await jobContract.fetchJobsApproved()

        const jobs = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
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
        <Box className={classes.box}>
            <h3>NFTs</h3>
            <h5>---Refresh page after 30 seconds if the NFT doesn't display immediately---</h5>
        </Box>
        {!jobs.length ? (
            <Box className={classes.box}>
                <h3>No NFTs awarded.</h3>
            </Box>
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