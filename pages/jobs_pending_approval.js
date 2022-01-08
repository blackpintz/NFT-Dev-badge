import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import {Grid} from '@mui/material';
import { makeStyles } from '@mui/styles';
import JobSubmitted from '../components/JobSubmitted'

import { addresses } from '../config';

import Job from '../artifacts/contracts/Job.sol/Job.json';

const useStyles = makeStyles({
    grid: {
        width: "90%",
        margin: "0 auto"
    }
})

export default function JobsPendingApproval() {
    const [jobs, setJobs] = useState([])
    const classes = useStyles()
    let jobAddress;
    let networkId;

    useEffect( async () => {
        const web3 = new Web3(window.ethereum)
        networkId = await web3.eth.net.getId()
        if(networkId === 8996 || networkId === 4) loadJobs()
    }, [])

    async function loadJobs() {
        const {ge, rinkeby} = addresses
        if(networkId === 8996) {
            jobAddress = ge.jobPostAddress
        }

        if(networkId === 4) {
            jobAddress = rinkeby.jobPostAddress
        }
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const jobContract = new ethers.Contract(jobAddress, Job.abi, provider)
        const data = await jobContract.fetchJobsSubmitted()
        
        let items = await Promise.all(data.map(async i => {
            let item = {
                jobId: i.jobId.toNumber(),
                submissionId: i.submissionId.toNumber(),
                assignmentTaker: i.assignmentTaker,
                url: i.gitUrl,
                reward: i.reward
            }
            return item
        }))
        setJobs(items)
    }

    return(
        <>
            {!jobs.length ? (
                <h3>No jobs submitted!</h3>
            ) : (
                <>
                <Grid container spacing={2} className={classes.grid}>
                    {jobs && jobs.map((job, idx) => (
                        <Grid item key={idx} xs={4}>
                            <JobSubmitted job={job} />
                        </Grid>
                    ))}
                </Grid>
                </>
            )}
        </>
    )
}