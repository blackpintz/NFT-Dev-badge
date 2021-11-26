import React from 'react';
import Link from 'next/link';
import { makeStyles } from '@mui/styles';
import { Box, Divider } from '@mui/material';

const useStyles = makeStyles({
    box: {
        '& h4': {
            cursor: "pointer",
            marginBottom: "3px"
        }
    }
})

export default function MenuBar() {
    const classes = useStyles();
    return (
        <>
        <Box className={classes.box} sx={{display: 'flex', justifyContent: 'space-around', width: '95%', mx: 'auto'}}>
            <Link href="/">
                <h4>Home</h4>
            </Link>
            <Link href="/create-job">
                <h4>Add Job Post</h4>
            </Link>
            <Link href="/job_posts">
                <h4>Job Posts</h4>
            </Link>
            <Link href="/jobs_pending_approval">
                <h4>Jobs Pending Approval</h4>
            </Link>
            <Link href="/jobs_approved">
                <h4>Jobs Approved</h4>
            </Link>
        </Box>
        <Divider variant="middle" />
        </>
    )
}