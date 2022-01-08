import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import {create as ipfsHttpClient} from 'ipfs-http-client'
import { useRouter } from "next/router";
import { uniqueNamesGenerator, adjectives, animals  } from "unique-names-generator";
import { Paper, Button, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { addresses } from "../config";

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Job from '../artifacts/contracts/Job.sol/Job.json';
import Metadata from '../artifacts/contracts/MetaData.sol/MetaData.json';

const useStyles = makeStyles({
    paper: {
        height: "270px",
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
    let jobAddress;
    let nftAddr;
    let metaAddr;

    async function createNft() {
        const web3 = new Web3(window.ethereum)
        const networkId = await web3.eth.net.getId()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const {ge, rinkeby} = addresses
        if(networkId === 8996) {
            jobAddress = ge.jobPostAddress;
            nftAddr = ge.nftaddress;
            metaAddr = ge.metaAddress
        }

        if(networkId === 4) {
            jobAddress = rinkeby.jobPostAddress
            nftAddr = rinkeby.nftaddress
            metaAddr = rinkeby.metaAddress
        }
        let metadata = new ethers.Contract(metaAddr, Metadata.abi, signer)
        let jobContract = new ethers.Contract(jobAddress, Job.abi, signer)
        let tokenContract = new ethers.Contract(nftAddr, NFT.abi, signer)
        let tokenTransaction = await tokenContract.createToken()
        let tx = await tokenTransaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const blockHash = event.blockHash

        await jobContract.transferRewardsAndNft(jobId,nftAddr,submissionId,tokenId, {value: reward})
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
            router.push('/nfts_awarded')
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
            <h5>--- Please give the transactions sometime to process after you press approve button ---</h5>
        </Paper>
    )
}
