
import { useState } from 'react';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import {ethers} from 'ethers';
import {Paper, Button, TextField, Dialog, 
    DialogActions, DialogContent, DialogTitle} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {useRouter} from 'next/router';

import { addresses } from "../config";

import Job from '../artifacts/contracts/Job.sol/Job.json';

const useStyles = makeStyles({
    paper: {
        height: "350px",
        padding: "0.2rem 0.4rem"
    }
})

export default function JobPost(props) {
    const classes = useStyles();
    const {reward, assignmentHolder, title, deadline, description, category, id} = props.job
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState('')
    const router = useRouter()
    let jobAddress;

    async function submitJob(_id, _url) {
        const web3 = new Web3(window.ethereum)
        const networkId = await web3.eth.net.getId() 
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
        const signer = provider.getSigner()

        let contract = new ethers.Contract(jobAddress, Job.abi, signer)
        let jobContract = await contract.createJobSubmitted(_id, _url)
        await jobContract.wait();
        setUrl('')
        setOpen(false)
        router.push('/jobs_pending_approval')
    }

    const handleClick = () => {
       setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
    }


    return (
        <Paper className={classes.paper} elevation={3}>
            <h4>{title}</h4>
            <h4>Job Category: {category}</h4>
            <h5>Description:</h5>
            <p>{description}</p>
            <h5>Expected Salary: {reward} ETH</h5>
            <h5>Job deadline: {deadline}</h5>
            <Button variant="contained" color="success" onClick={handleClick}>Submit Job</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Submit git url:</DialogTitle>
                <DialogContent>
                    <TextField 
                    variant="outlined"
                    placeholder='git-url'
                    required
                    value={url}
                    onChange={(e) =>{setUrl(e.target.value)}}
                    />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} variant="contained" color="secondary">Cancel</Button>
                    <Button 
                    variant='contained' 
                    color="success"
                    onClick={() => submitJob(id, url)}
                    >Submit</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}