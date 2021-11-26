import { Paper, Button, Box } from "@mui/material";
import { makeStyles } from '@mui/styles';

import { jobPostAddress } from '../config'

import Job from '../artifacts/contracts/Job.sol/Job.json';

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
    const {jobId, submissionId, assignmentTaker, url} = props.job
    return (
        <Paper className={classes.paper} elevation={3}>
            <h5>Job Id: {jobId}</h5>
            <h5>Submission Id: {submissionId}</h5>
            <h5>Git Url: {url}</h5>
            <Box sx={{display:"flex"}}>
                <Button className={classes.button} variant="contained" color="primary">Decline</Button>
                <Button className={classes.button} variant="contained" color="success">Approve</Button>
            </Box>
        </Paper>
    )
}
