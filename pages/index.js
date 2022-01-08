import {Typography, Box, Button} from '@mui/material';
import { useEffect } from "react";

import { networks } from '../networks';

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName]
        }
      ]
    });
  } catch (err) {
    console.log(err)
  }
};

export default function Home() {
  const handleNetworkSwitch = async (networkName) => {
    await changeNetwork({ networkName });
  };

  const networkChanged = (chainId) => {
    console.log({ chainId });
  };

  useEffect(() => {
    window.ethereum.on("chainChanged", networkChanged);

    return () => {
      window.ethereum.removeListener("chainChanged", networkChanged);
    };
  },[])

  return (
    <Box sx={{ width: '75%', mx: 'auto', mt: '1rem'}}>
      <Typography variant="h4" component="h1">
        Welcome to NFT-badge-viewer.
      </Typography>
      <Typography variant="h6">
        If you haven't, please Switch to GE network to create job posts, view job posts and NFT rewards.  
      </Typography>
      <Box sx={{ width: '75%', mx: 'auto', mt: '1rem'}}>
        <Button 
        variant="contained" 
        color="success"
        onClick={() => handleNetworkSwitch("GE")}>Switch to GE Network</Button>
      </Box>
    </Box>
  )
}
