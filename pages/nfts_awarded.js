import {ethers} from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import axios from 'axios'
import {Grid, Box} from '@mui/material';
import { makeStyles } from '@mui/styles';
import JobApproved from '../components/JobApproved';

import { addresses } from '../config';

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
    let jobAddress;
    let nftAddr;
    let networkId;

    useEffect( async () => {
        const web3 = new Web3(window.ethereum)
        networkId = await web3.eth.net.getId()
        if(networkId === 8996 || networkId === 4) loadJobs()
    }, [])

    async function loadJobs() {
        const {ge, rinkeby} = addresses
        if(networkId === 8996) {
            jobAddress = ge.jobPostAddress;
            nftAddr = ge.nftaddress;
        }

        if(networkId === 4) {
            jobAddress = rinkeby.jobPostAddress;
            nftAddr = rinkeby.nftaddress;
        }
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        let tokenContract = new ethers.Contract(nftAddr, NFT.abi, provider)
        const jobContract = new ethers.Contract(jobAddress, Job.abi, provider)
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