import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import {Grid} from '@mui/material';
import { makeStyles } from '@mui/styles';
import JobPost from '../components/JobPost';

const useStyles = makeStyles({
    grid: {
        width: "80%",
        margin: "0 auto"
    }
})

import { addresses } from '../config';

import Job from '../artifacts/contracts/Job.sol/Job.json';

export default function JobPosts() {
    const classes = useStyles();
    const [jobs, setJobs] = useState([]);
    let jobAddress;
    let networkId;

    useEffect( async () => {
        const web3 = new Web3(window.ethereum)
        networkId = await web3.eth.net.getId()
        if(networkId === 8996 || networkId === 4) {
            loadJobs()
        } 
    },[])

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
        const data = await jobContract.fetchJobItems()

        const items = await Promise.all(data.map(async i => {

            let reward = ethers.utils.formatUnits(i.reward.toString(), 'ether')
            let item = {
                reward,
                assignmentHolder: i.assignmentHolder,
                title: i.title,
                deadline: i.deadline,
                description: i.description,
                category: i.category,
                id: i.jobId.toNumber()
            }
            return item
        }))
        setJobs(items)
    }

    
    return(
        <>
        {
            !jobs.length ? (
                <h3>No job openings!</h3>
            ) : (
               <>
               <Grid container spacing={2} className={classes.grid}>
                {jobs && jobs.map((job, idx) => (
                    <Grid item key={idx} xs={6}>
                        <JobPost job={job} />
                    </Grid>
                ))}
               </Grid>
               </>
            )
        }
        </>
    )
}