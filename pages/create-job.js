import { useState } from "react";
import {ethers} from 'ethers';
import {useRouter} from 'next/router';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import {TextField, Box, Button} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    form: {
        width: "30%"
    },
    button: {
        marginTop: "1rem",
        width: "90%"
    }
})

const categories = ["Security", "Testing", "DevOps", "Blockchain", "FrontEnd"]

import { addresses } from "../config";

import Job from '../artifacts/contracts/Job.sol/Job.json';

export default function CreateJob() {
    const classes = useStyles();
    const [formInput, updateFormInput] = useState({ reward: '', title: '', deadline: '', description: '', category: ''})
    const router = useRouter()
    let jobAddress;
    let nftAddr;

    // useEffect(() => {
    //     if(window.ethereum) {}
    // },[])

    async function createJobItem() {
        const web3 = new Web3(window.ethereum)
        const networkId = await web3.eth.net.getId() 
        const {ge, rinkeby} = addresses
        if(networkId === 8996) {
            jobAddress = ge.jobPostAddress
            nftAddr = ge.nftaddress
        }

        if(networkId === 4) {
            jobAddress = rinkeby.jobPostAddress
            nftAddr = rinkeby.nftaddress 
        }
        const {reward, title, deadline, description, category} = formInput
        const rewardInEth = ethers.utils.parseUnits(reward, 'ether')
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(jobAddress, Job.abi, signer)
        let jobContract = await contract.createJobItem(nftAddr, title, rewardInEth , deadline, description, category)
        await jobContract.wait()
        router.push('/job_posts')
    }


    return (
        <Box sx={{display: 'flex', justifyContent: 'space-around', width: '95%', mx: 'auto'}}>
            <div className={classes.form}>
                <TextField 
                label="Title" 
                required
                fullWidth 
                variant="standard" 
                onChange={e => updateFormInput({...formInput, title: e.target.value})}  />
                <TextField 
                label="Description" 
                multiline rows={5} 
                fullWidth 
                variant="outlined" 
                onChange={e => updateFormInput({...formInput, description: e.target.value})}  />
                <TextField 
                label="Deadline" 
                fullWidth 
                variant="standard" 
                onChange={e => updateFormInput({...formInput, deadline: e.target.value})} />
                <TextField 
                label="Reward"
                required 
                fullWidth 
                variant="standard" 
                onChange={e => updateFormInput({...formInput, reward: e.target.value})} />
                <TextField label="Category" select  fullWidth variant="standard"
                SelectProps={{
                    native: true,
                }}
                onChange={e => updateFormInput({...formInput, category: e.target.value})} 
                >
                    {categories.map((item, i) =>(
                        <option key={i} value={item}>{item}</option>
                    ))}
                </TextField>
                <Button 
                onClick={createJobItem}
                className={classes.button} 
                variant="contained" 
                color="success">
                    Create Job
                </Button>
            </div>
        </Box>
    )
}