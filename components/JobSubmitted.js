import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import {create as ipfsHttpClient} from 'ipfs-http-client'
import { useRouter } from "next/router";
import { uniqueNamesGenerator, adjectives, animals  } from "unique-names-generator";
import { Paper, Button, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftaddress, jobPostAddress, metaAddress } from "../config";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Job from '../artifacts/contracts/Job.sol/Job.json';
import Metadata from '../artifacts/contracts/MetaData.sol/MetaData.json';

const useStyles = makeStyles({
    paper: {
        height: "200px",
        padding: "0.2rem 0.4rem"
    },
    button: {
        margin: "0.1rem"
    }
})

export default function JobSubmitted(props) {
    const classes = useStyles();
    const router = useRouter();
    const {job} = props
    const {jobId, submissionId, assignmentTaker, url, reward, tokenId} = props.job

    async function createNft() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let metadata = new ethers.Contract(metaAddress, Metadata.abi, signer)
        let jobContract = new ethers.Contract(jobPostAddress, Job.abi, signer)
        let tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let tokenTransaction = await tokenContract.createToken()
        let tx = await tokenTransaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const blockHash = event.blockHash

        await jobContract.transferRewardsAndNft(jobId,nftaddress,submissionId,tokenId, {value: reward})
        const hex = await metadata.hash(tokenId, url, blockHash)
        const colorHex = `#${hex.slice(2,8)}`

        const attribute = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            length: 2
        })

        const data = JSON.stringify({
            tokenId, attribute, colorHex, job
        })

        try {
            const added = await client.add(data)
            const tokenUrl = `https://ipfs.infura.io/ipfs/${added.path}`
            await tokenContract.setTokenURI(tokenId, tokenUrl)
        } catch (e) {
            console.log('Error uploading file: ', e)
        }

    }


    return (
        <Paper className={classes.paper} elevation={3}>
            <h5>Job Id: {jobId}</h5>
            <h5>Submission Id: {submissionId}</h5>
            <h5>Git Url: {url}</h5>
            <Box sx={{display:"flex"}}>
                <Button
                onClick={createNft}
                className={classes.button} 
                variant="contained" 
                color="success">
                Approve
                </Button>
            </Box>
        </Paper>
    )
}
