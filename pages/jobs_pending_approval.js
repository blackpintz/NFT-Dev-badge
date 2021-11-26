import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import {Grid} from '@mui/material';
import { makeStyles } from '@mui/styles';
import JobSubmitted from '../components/JobSubmitted';

import { jobPostAddress } from '../config';

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

    useEffect(() => {
        loadJobs()
    }, [])

    async function loadJobs() {
        const provider = new ethers.providers.JsonRpcProvider()
        const jobContract = new ethers.Contract(jobPostAddress, Job.abi, provider)
        const data = await jobContract.fetchJobsSubmitted()
        
        let items = await Promise.all(data.map(async i => {
            let item = {
                jobId: i.jobId.toNumber(),
                submissionId: i.submissionId.toNumber(),
                assignmentTaker: i.assignmentTaker,
                url: i.gitUrl
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